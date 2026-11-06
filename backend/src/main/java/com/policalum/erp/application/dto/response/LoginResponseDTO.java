package com.policalum.erp.application.dto.response;

public record LoginResponseDTO(
        String token,
        String usuarioId,
        String nombre,
        String email,
        String rol,
        Boolean totpConfigurado,
        String sedeId,
        String sedeNombre,
        String refreshToken
) {
}