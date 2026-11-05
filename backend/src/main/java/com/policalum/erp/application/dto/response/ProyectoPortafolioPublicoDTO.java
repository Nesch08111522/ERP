package com.policalum.erp.application.dto.response;

import java.util.UUID;

public record ProyectoPortafolioPublicoDTO(
        UUID id,
        String titulo,
        String descripcion,
        String imagenUrl,
        Integer orden,
        String cliente
) {}
