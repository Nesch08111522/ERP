package com.policalum.erp.application.dto.response;

import java.util.List;
import java.util.UUID;

public record ProyectoPortafolioPublicoDTO(
        UUID id,
        String titulo,
        String descripcion,
        String imagenUrl,
        Integer orden,
        String cliente,
        String lugar,
        String anio,
        String servicio,
        String referencia,
        List<String> etiquetas,
        List<String> imagenes,
        String videoUrl,
        String hlsUrl,
        String dashUrl
) {}
