package com.policalum.erp.application.dto.response;

/** Un dato de la configuración global que todavía no se aplicó al sitio. */
public record PropuestaEmpresaDTO(
        String campo,
        String etiqueta,
        String actual,
        String nuevo
) {}
