package com.policalum.erp.application.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * El administrador escanea el QR personal de un empleado y registra su marcación.
 *
 * @param payload contenido leído de la cámara: {@code POLICALUM|EMPLEADO|{userId}|{window}|{code}}
 */
public record MarcarQrAdminRequestDTO(
        @NotBlank(message = "El contenido del QR es obligatorio")
        String payload
) { }
