-- servicio_colaboradores.tipo_colaborador: columna declarada en la entidad
-- ServicioColaborador (varchar(20) NOT NULL) que nunca llegó a la base continua.
--
-- POR QUÉ SE NECESITA: con `spring.jpa.hibernate.ddl-auto=validate` Hibernate aborta el
-- arranque con "missing column [tipo_colaborador] in table [servicio_colaboradores]".
-- Es un desfase PREVIO a los cambios del 2026-11-06: la columna la introdujo la lógica de
-- servicios con colaboradores externos, y hasta ahora solo existía cuando el perfil dev
-- corría con ddl-auto=update.
--
-- Idempotente y no destructivo: agrega la columna y rellena la fila existente con la MISMA
-- regla de negocio que aplica @PrePersist en la entidad (usuario != null -> REGISTRADO,
-- si no EXTERNO). No se usa un valor por defecto arbitrario.

ALTER TABLE servicio_colaboradores
    ADD COLUMN IF NOT EXISTS tipo_colaborador varchar(20);

-- Backfill conforme a la regla de ServicioColaborador.prePersist().
UPDATE servicio_colaboradores
   SET tipo_colaborador = CASE WHEN user_id IS NOT NULL THEN 'REGISTRADO' ELSE 'EXTERNO' END
 WHERE tipo_colaborador IS NULL;

-- Ahora sí se puede endurecer la restricción.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
         WHERE table_name = 'servicio_colaboradores'
           AND column_name = 'tipo_colaborador'
           AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE servicio_colaboradores ALTER COLUMN tipo_colaborador SET NOT NULL;
    END IF;
END $$;

-- Coherencia de liquidación para las filas rellenas: la entidad fija NO_APLICA cuando el
-- colaborador es REGISTRADO y PENDIENTE cuando es EXTERNO.
UPDATE servicio_colaboradores
   SET estado_liquidacion = CASE WHEN tipo_colaborador = 'REGISTRADO' THEN 'NO_APLICA' ELSE 'PENDIENTE' END
 WHERE (estado_liquidacion IS NULL OR estado_liquidacion = '')
   AND tipo_colaborador IS NOT NULL;

-- El CHECK evita estados inventados por integraciones directas a la base.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'servicio_colaboradores_tipo_check'
    ) THEN
        ALTER TABLE servicio_colaboradores
            ADD CONSTRAINT servicio_colaboradores_tipo_check
            CHECK (tipo_colaborador IN ('REGISTRADO', 'EXTERNO'));
    END IF;
END $$;

-- NOTA de auditoría, no se ejecuta aquí: la tabla rrhh_asistencias (plural) no tiene
-- entidad JPA ni es @CollectionTable de nadie; la activa es rrhh_asistencias -> rrhh_asistencia.
-- Son 0 filas, pero se deja intacta a propósito: borrar estructura durante una auditoría
-- mezcla dos cambios y no permite atribuir una regresión. Ver el informe de hallazgos.
