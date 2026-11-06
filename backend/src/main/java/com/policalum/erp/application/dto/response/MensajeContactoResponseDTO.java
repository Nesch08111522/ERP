package com.policalum.erp.application.dto.response;

import com.policalum.erp.domain.enums.EstadoMensajeWeb;
import java.time.LocalDateTime;
import java.util.UUID;

public record MensajeContactoResponseDTO(
        UUID id,
        String nombre,
        String correo,
        String telefono,
        String empresa,
        String asunto,
        String tipoMensaje,
        String documentoTipo,
        String documentoNumero,
        String direccion,
        String bien,
        String monto,
        String pedido,
        String mensaje,
        EstadoMensajeWeb estado,
        String notaGestion,
        LocalDateTime createdAt,
        LocalDateTime gestionadoAt,
        Boolean leido,
        Boolean archivado
) {}
