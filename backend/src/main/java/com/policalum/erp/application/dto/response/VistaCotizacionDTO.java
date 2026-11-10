package com.policalum.erp.application.dto.response;

import java.math.BigDecimal;
import java.util.List;

/** Resultado oficial, calculado en el servidor, antes de guardar la cotización. */
public record VistaCotizacionDTO(
        BigDecimal total,
        CargosCotizacionDTO cargos,
        List<DetalleCotizacionResponseDTO> lineas
) {
    /** Vista sin el margen de la empresa, para el portal público. El total se conserva. */
    public VistaCotizacionDTO sinMargen() {
        return new VistaCotizacionDTO(total, cargos == null ? null : cargos.sinMargen(), lineas);
    }
}
