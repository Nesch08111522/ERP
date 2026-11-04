package com.policalum.erp.application.dto.response;

import com.policalum.erp.domain.enums.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record VentaDetalleResponseDTO(UUID id, UUID sedeId, UUID usuarioId, String usuarioNombre,
        UUID clienteId, String clienteNombre, String clienteDocumento, String sedeNombre, UUID turnoCajaId, TipoComprobante tipoComprobante,
        String serieCorrelativo, String ticketRegistro, EstadoVenta estado, CanalVenta canalVenta, EstadoSunat estadoSunat,
        BigDecimal subtotalNeto, BigDecimal totalIgv, BigDecimal total, LocalDateTime createdAt,
        List<LineaVentaResponseDTO> lineas, List<PagoVentaDetalleResponseDTO> pagos) { }
