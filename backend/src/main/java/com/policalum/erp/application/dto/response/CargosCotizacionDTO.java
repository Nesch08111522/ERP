package com.policalum.erp.application.dto.response;

import java.math.BigDecimal;

/** Desglose congelado en la cotización. La configuración posterior no lo reescribe. */
public record CargosCotizacionDTO(
        String distrito,
        BigDecimal cantidadPiezas,
        BigDecimal subtotalMateriales,
        BigDecimal utilidadPorcentaje,
        BigDecimal utilidadMonto,
        BigDecimal movilidadMonto,
        BigDecimal otrosMonto,
        String otrosDetalle,
        boolean modificada,
        String notaCambio
) {
    /**
     * Copia sin el margen de la empresa. El total ya incorpora la utilidad dentro de
     * subtotalMateriales, así que ocultarla no cambia el total que ve el cliente.
     * Se usa SOLO en las respuestas del portal público (§4: sin exponer información privada).
     */
    public CargosCotizacionDTO sinMargen() {
        return new CargosCotizacionDTO(distrito, cantidadPiezas, subtotalMateriales,
                null, null, movilidadMonto, otrosMonto, otrosDetalle, modificada, notaCambio);
    }
}
