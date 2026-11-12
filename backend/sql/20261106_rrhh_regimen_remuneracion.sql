-- Régimen de ganancia personal del administrador (entidad RrhhRegimenRemuneracion).
--
-- POR QUÉ EXISTE ESTE SCRIPT: la especificación del 2026-11-06 exige
-- `spring.jpa.hibernate.ddl-auto=validate` en la ejecución normal. Con `validate` Hibernate
-- NO crea nada: si la tabla falta, la aplicación no arranca. Este archivo es la única forma
-- autorizada de levantar esa estructura sobre la base continua `ERPpoli`.
--
-- Es estrictamente aditivo: no altera ni elimina columnas ni filas existentes.
-- Idempotente: puede ejecutarse más de una vez sin efecto secundario.
--
-- Cómo aplicarlo (una sola vez, sobre la base de prueba continua):
--   psql -h localhost -p 5432 -U postgres -d ERPpoli -f backend/sql/20261106_rrhh_regimen_remuneracion.sql

CREATE TABLE IF NOT EXISTS rrhh_regimen_remuneracion (
    id                    uuid           NOT NULL,
    user_id               uuid           NOT NULL,
    sueldo_habilitado     boolean        NOT NULL DEFAULT true,
    comision_habilitada   boolean        NOT NULL DEFAULT true,
    reparto_habilitado    boolean        NOT NULL DEFAULT false,
    porcentaje_reparto    numeric(5, 2)  NOT NULL DEFAULT 0,
    base_reparto          varchar(20)    NOT NULL DEFAULT 'UTILIDAD_NETA',
    tope_reparto_mensual  numeric(12, 2),
    created_at            timestamp,
    updated_at            timestamp,
    CONSTRAINT rrhh_regimen_remuneracion_pkey PRIMARY KEY (id),
    CONSTRAINT uk_regimen_user UNIQUE (user_id),
    CONSTRAINT fk_regimen_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT rrhh_regimen_remuneracion_base_reparto_check
        CHECK (base_reparto IN ('UTILIDAD_NETA', 'VENTAS_NETAS', 'MARGEN_BRUTO'))
);

-- Un índice por usuario no es necesario: uk_regimen_user ya lo cubre y la entidad es
-- OneToOne. No se agregan índices redundantes.

-- Las claves ajenas de asistencia usan ON DELETE RESTRICT por defecto en Hibernate; aquí se
-- deja el comportamiento por defecto (NO ACTION) para coincidir con rrhh_legajo_digital,
-- que tampoco especifica borrado en cascada.

-- Datos iniciales: NO se insertan filas. El servicio RegimenRemuneracionServiceImpl devuelve
-- un régimen por defecto en memoria cuando el administrador aún no configuró el suyo, y
-- recién persiste al guardar. Insertar aquí crearía regímenes que el usuario nunca aprobó.
