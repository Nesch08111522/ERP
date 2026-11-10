package com.policalum.erp.application.dto.response;

import java.util.UUID;

/**
 * QR dinámico personal del usuario autenticado.
 *
 * @param payload            {@code POLICALUM|EMPLEADO|{userId}|{window}|{code}}; es lo que se pinta en el QR
 * @param ventana            ventana TOTP usada, para depurar rechazos por reloj desincronizado
 */
public record QrPersonalDTO(
        UUID empleadoId,
        String empleadoNombre,
        String payload,
        long segundosRestantes,
        long expiraEnEpoch,
        long ventana
) { }
