-- Historial de cambios salariales del legajo (entidad RrhhHistorialSalarial).
--
-- POR QUÉ EXISTE ESTE SCRIPT: §2.4 de la especificación exige que el legajo tenga
-- "historial de cambios salariales". Hasta hoy eso solo existía como instantáneas
-- antes/después dentro de `audit_log` (LegajoServiceImpl.snapshot()), que son un registro
-- forense, no un historial laboral consultable. La especificación impone
-- `spring.jpa.hibernate.ddl-auto=validate`, así que Hibernate NO crea esta tabla: si falta,
-- la aplicación no arranca. Este archivo es la única forma autorizada de levantarla sobre la
-- base continua `ERPpoli`.
--
-- Es estrictamente aditivo: no altera ni elimina columnas ni filas de tablas existentes.
-- Idempotente: puede ejecutarse más de una vez sin efecto secundario (CREATE TABLE IF NOT
-- EXISTS + backfill protegido por NOT EXISTS).
--
-- Cómo aplicarlo (sobre la base de prueba continua, con la misma metodología de la Fase 1:
-- primero dentro de una transacción con ROLLBACK para validar sintaxis y conteos, y recién
-- después en su propia transacción con COMMIT):
--   psql -h localhost -p 5432 -U postgres -d ERPpoli -f backend/sql/20261107_rrhh_historial_salarial.sql

CREATE TABLE IF NOT EXISTS rrhh_historial_salarial (
    id                     uuid           NOT NULL,
    legajo_id              uuid           NOT NULL,
    vigencia_desde         date           NOT NULL,
    tipo_contrato_anterior varchar(50),
    tipo_contrato_nuevo    varchar(50),
    sueldo_anterior        numeric(12, 2),
    sueldo_nuevo           numeric(12, 2) NOT NULL,
    comision_anterior      numeric(5, 2),
    comision_nuevo         numeric(5, 2)  NOT NULL,
    dia_cobro_anterior     integer,
    dia_cobro_nuevo        integer,
    motivo                 varchar(255),
    registrado_por         uuid,
    created_at             timestamp      NOT NULL,
    CONSTRAINT rrhh_historial_salarial_pkey PRIMARY KEY (id),
    CONSTRAINT fk_historial_salarial_legajo FOREIGN KEY (legajo_id) REFERENCES rrhh_legajo_digital (id),
    CONSTRAINT fk_historial_salarial_usuario FOREIGN KEY (registrado_por) REFERENCES users (id)
);

-- El acceso es siempre "el historial de UN legajo, ordenado por vigencia". Sin este índice
-- cada consulta sería un seq scan sobre todo el historial.
CREATE INDEX IF NOT EXISTS idx_historial_salarial_legajo_vigencia
    ON rrhh_historial_salarial (legajo_id, vigencia_desde);

-- ── DECISIONES DE ESTRUCTURA QUE HAY QUE CONOCER ──────────────────────────────────────────
--
-- 1. No hay UNIQUE (legajo_id, vigencia_desde): dos ajustes el mismo día son legítimos
--    (por ejemplo corregir el día de paga y el sueldo en dos guardados consecutivos). El
--    orden estable se resuelve con (vigencia_desde, created_at), no con una restricción.
--
-- 2. `registrado_por` es NULLABLE a propósito. Las filas que inserta la aplicación siempre
--    traen el usuario que guardó el cambio; NULL significa "fila creada por esta migración",
--    porque atribuirle el registro inicial a un usuario que nunca lo ingresó sería inventar
--    responsabilidad.
--
-- 3. Se guardan los valores ANTERIORES y los NUEVOS (redundancia deliberada). Un historial
--    que solo guarda el monto nuevo obliga a reconstruir "de cuánto a cuánto" cruzando filas
--    vecinas, y se rompe si algún día falta una. El historial es inmutable: no se expone
--    PUT ni DELETE.
--
-- 4. No hay CHECK de "vigencia no futura" en la base: CHECK con CURRENT_DATE no es
--    inmutable (una fila válida hoy sería inválida mañana) y PostgreSQL lo desaconseja.
--    Esa regla vive en HistorialSalarialServiceImpl, que la valida contra la fecha de
--    ingreso y contra la última vigencia registrada.

-- ── BACKFILL: el sueldo inicial de cada legajo existente ────────────────────────────────────
-- Sin esto, un empleado con años en la planilla mostraría historial vacío hasta la primera
-- edición de su legajo, y la pantalla de "historial salarial" mentiría por omisión.
-- Se toma la fecha de ingreso como inicio de la vigencia: es la fecha en que ese sueldo
-- empezó a regir según el único dato del que el sistema tiene certeza.
--
-- El NOT EXISTS hace que el bloque sea idempotente: si ya existe cualquier fila para el
-- legajo (por esta migración o por cambios reales posteriores), no se toca nada.
INSERT INTO rrhh_historial_salarial
    (id, legajo_id, vigencia_desde, tipo_contrato_anterior, tipo_contrato_nuevo,
     sueldo_anterior, sueldo_nuevo, comision_anterior, comision_nuevo,
     dia_cobro_anterior, dia_cobro_nuevo, motivo, registrado_por, created_at)
SELECT gen_random_uuid(),
       l.id,
       l.fecha_ingreso,
       NULL,
       l.tipo_contrato,
       NULL,
       COALESCE(l.sueldo_base, 0),
       NULL,
       COALESCE(l.porcentaje_comision, 0),
       NULL,
       l.dia_cobro,
       'Registro inicial del legajo (migración 2026-11-07)',
       NULL,
       now()
FROM rrhh_legajo_digital l
WHERE NOT EXISTS (SELECT 1 FROM rrhh_historial_salarial h WHERE h.legajo_id = l.id);

-- Verificación después de aplicar (deben coincidir):
--   SELECT COUNT(*) FROM rrhh_legajo_digital;
--   SELECT COUNT(*) FROM rrhh_historial_salarial WHERE registrado_por IS NULL;
