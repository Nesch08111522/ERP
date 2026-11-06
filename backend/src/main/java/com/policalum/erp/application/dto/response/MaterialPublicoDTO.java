package com.policalum.erp.application.dto.response;

public record MaterialPublicoDTO(
        String id,
        String nombre,
        String resumen,
        String imagenUrl,
        String videoUrl,
        boolean activo
) {}
