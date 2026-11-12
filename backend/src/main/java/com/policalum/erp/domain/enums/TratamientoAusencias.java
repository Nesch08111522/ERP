package com.policalum.erp.domain.enums;

/**
 * Tratamiento de las ausencias en la liquidación de un sueldo mensual (§8.1, tercer componente).
 *
 * <p>IMPORTANTE: hoy el ERP <b>no registra ausencias</b>. El valor {@code AUSENTE} existe en
 * {@link EstadoAsistencia} pero ningún flujo lo escribe, y la marcación en lote hace lo
 * contrario: registra presencia de quien no marcó
 * ({@code RrhhAsistenciaImpl.marcarLote}). Por eso {@code DESCUENTO_DIAS_SIN_MARCACION} está
 * declarado pero bloqueado en la escritura: habilitarlo descontaría como falta un día de
 * descanso médico o de vacación que nadie registró.
 *
 * <p>Cuando exista el registro de inasistencias y permisos, quitar el bloqueo de
 * {@link #estaImplementada()} y conectar el conteo en el cálculo.
 */
public enum TratamientoAusencias {

    /** Sueldo fijo: la asistencia no modifica el importe. Es el comportamiento actual y el default. */
    NO_AFECTA,

    /** Cada día laborable sin marcación descuenta (sueldo / base de la política). Pendiente. */
    DESCUENTO_DIAS_SIN_MARCACION;

    /** false = se puede guardar la intención pero el servicio la rechaza, con mensaje explícito. */
    public boolean estaImplementada() {
        return this == NO_AFECTA;
    }
}
