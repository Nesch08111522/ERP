package com.policalum.erp.application.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Resumen de existencias de un producto en un almacén/sede concreto.
 * Se usa en GET /api/v1/productos/{id}/stock para que el form de edición
 * muestre la ubicación actual sin romper ProductoResponseDTO.
 */
public record ProductoStockResumenDTO(
        UUID stockId,
        UUID almacenId,
        String almacenNombre,
        UUID sedeId,
        String sedeNombre,
        BigDecimal cantidad,
        BigDecimal stockMinimo,
        BigDecimal stockMaximo,
        BigDecimal puntoReposicion
) {
}