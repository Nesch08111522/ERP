package com.policalum.erp.application.dto.request;

import java.math.BigDecimal;
import java.util.UUID;

public record ServicioColaboradorRequestDTO(
        UUID userId,
        String participacion,
        String tipoColaborador,
        String nombreExterno,
        BigDecimal costo,
        String estadoLiquidacion
) {
}
