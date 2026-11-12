package com.policalum.erp.domain.enums;

/**
 * Base sobre la que se calcula el reparto de utilidad del administrador.
 *
 * UTILIDAD_NETA  = utilidadNetaReal del periodo (ventas netas reales - compras - nóminas - gastos).
 * VENTAS_NETAS   = ventasNetasReales del periodo (más simple, pero no descuenta costos).
 * MARGEN_BRUTO   = utilidadBruta del periodo (ventas netas reales - compras netas).
 */
public enum BaseRepartoUtilidad {
    UTILIDAD_NETA,
    VENTAS_NETAS,
    MARGEN_BRUTO
}
