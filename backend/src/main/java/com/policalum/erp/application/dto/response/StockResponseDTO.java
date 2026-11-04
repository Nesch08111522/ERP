package com.policalum.erp.application.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record StockResponseDTO(
        ProductoResumen producto,
        AlmacenResumen almacen,
        BigDecimal cantidad,
        BigDecimal stockMinimo,
        LocalDateTime updatedAt
) {
    public record ProductoResumen(UUID id, String codigoSku, String nombre, String unidad) {
    }

    public record AlmacenResumen(UUID id, String nombre, SedeResumen sede) {
    }

    public record SedeResumen(UUID id, String nombre) {
    }
}
