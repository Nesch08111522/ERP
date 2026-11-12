-- Política de remuneración configurable (§8.1) — tabla nueva + columnas de herencia.
--
-- POR QUÉ EXISTE ESTE SCRIPT: §8.1 exige "una política definida de división mensual, días
-- laborables y tratamiento de ausencias. No asumir automáticamente que todos los casos se
-- dividen entre 30". Hasta hoy el divisor estaba hardcodeado (NominaServiceImpl.DIAS_MES = 30).
-- Con `spring.jpa.hibernate.ddl-auto=validate` Hibernate no crea nada: si esta estructura falta,
-- la aplicación no arranca. Este archivo es la única forma autorizada de levantarla sobre la base
-- continua `ERPpoli`.
--
-- Estrictamente aditivo: no altera ni elimina columnas ni filas existentes.
-- Idempotente: todo usa IF NOT EXISTS / WHERE NOT EXISTS, se puede ejecutar más de una vez.
--
-- Cómo aplicarlo (misma metodología que la Fase 1: --single-transaction, que es atómica; si algo
-- falla, no queda media estructura):
--   psql -h localhost -p 5432 -U postgres -d ERPpoli -v ON_ERROR_STOP=1 --single-transaction \
--        -f backend/sql/20261107_politica_remuneracion.sql

-- ── 1. Nivel EMPRESA: la fila única de parámetros de RRHH ────────────────────────────────────
CREATE TABLE IF NOT EXISTS configuracion_rrhh (
    id                    bigint        NOT NULL,
    politica_division     varchar(20)   NOT NULL,
    dias_laborables       jsonb,
    tratamiento_ausencias varchar(30)   NOT NULL,
    actualizado_por       uuid,
    updated_at            timestamp,
    CONSTRAINT configuracion_rrhh_pkey PRIMARY KEY (id),
    CONSTRAINT fk_configuracion_rrhh_usuario FOREIGN KEY (actualizado_por) REFERENCES users (id),
    CONSTRAINT configuracion_rrhh_politica_division_check
        CHECK (politica_division IN ('DIAS_30', 'DIAS_CALENDARIO', 'DIAS_LABORABLES')),
    CONSTRAINT configuracion_rrhh_tratamiento_ausencias_check
        CHECK (tratamiento_ausencias IN ('NO_AFECTA', 'DESCUENTO_DIAS_SIN_MARCACION'))
);

-- Fila de fábrica. DIAS_30 no es un capricho: es el divisor con el que el sistema liquidó siempre,
-- así que activar la política por defecto no cambia ni un céntimo de lo ya pagado.
INSERT INTO configuracion_rrhh (id, politica_division, dias_laborables, tratamiento_ausencias, updated_at)
SELECT 1, 'DIAS_30', '["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES"]'::jsonb, 'NO_AFECTA', now()
WHERE NOT EXISTS (SELECT 1 FROM configuracion_rrhh WHERE id = 1);

-- ── 2. Nivel SEDE: los tres campos son opcionales, null = hereda de la empresa ────────────────
ALTER TABLE sedes ADD COLUMN IF NOT EXISTS politica_division     varchar(20);
ALTER TABLE sedes ADD COLUMN IF NOT EXISTS dias_laborables       jsonb;
ALTER TABLE sedes ADD COLUMN IF NOT EXISTS tratamiento_ausencias varchar(30);

-- ── 3. Nivel EMPLEADO (legajo): null = hereda de la sede ──────────────────────────────────────
ALTER TABLE rrhh_legajo_digital ADD COLUMN IF NOT EXISTS politica_division     varchar(20);
ALTER TABLE rrhh_legajo_digital ADD COLUMN IF NOT EXISTS dias_laborables       jsonb;
ALTER TABLE rrhh_legajo_digital ADD COLUMN IF NOT EXISTS tratamiento_ausencias varchar(30);

-- CHECK solo donde tiene sentido: en los niveles que heredan, null es un valor válido ("sin
-- override"), y una CHECK de dominio sobre una columna nullable ya no aporta nada que no haga
-- el servicio. Se dejan las de configuracion_rrhh, que son NOT NULL.

-- ── 4. Snapshot en la nómina emitida ──────────────────────────────────────────────────────────
-- Una boleta debe mostrar con qué política se pagó, no con la que está vigente hoy. Por eso se
-- guarda el divisor usado y el nombre de la política junto al importe ya redondeado.
ALTER TABLE rrhh_nominas ADD COLUMN IF NOT EXISTS divisor_remuneracion integer;
ALTER TABLE rrhh_nominas ADD COLUMN IF NOT EXISTS politica_division    varchar(20);

-- Las nóminas anteriores a este cambio quedan con divisor_remuneracion NULL. No se rellena con
-- 30 en la migración: eso sería reescribir el pasado con un dato que nadie registró. El código
-- interpreta null como el valor histórico (NominaServiceImpl.DIVISOR_HISTORICO = 30), que es
-- exactamente como se comportó hasta acá.

-- ── Verificación después de aplicar ───────────────────────────────────────────────────────────
--   SELECT count(*) FROM configuracion_rrhh;                                   -- 1
--   SELECT count(*) FROM sedes WHERE politica_division IS NOT NULL;             -- 0 (nadie activó override)
--   SELECT count(*) FROM rrhh_legajo_digital WHERE politica_division IS NOT NULL;-- 0
