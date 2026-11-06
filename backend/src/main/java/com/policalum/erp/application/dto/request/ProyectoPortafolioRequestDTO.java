package com.policalum.erp.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ProyectoPortafolioRequestDTO(
        @NotBlank @Size(max = 160) String titulo,
        @NotBlank @Size(max = 800) String descripcion,
        @Size(max = 500) @Pattern(
                regexp = "(?i)^(?:\\s*|\\s*https?://[^\\s]+\\s*|\\s*/(?!/)[^\\s]*\\s*)$",
                message = "La imagen debe ser una URL HTTP o HTTPS, o una ruta del sitio"
        ) String imagenUrl,
        @NotNull Integer orden,
        @NotNull Boolean publicado,
        @Size(max = 160) String cliente,
        @Size(max = 80) String lugar,
        @Pattern(regexp = "^$|^\\d{4}$", message = "El año debe tener 4 dígitos") String anio,
        @Size(max = 60) String servicio,
        @Size(max = 160) String referencia,
        @Size(max = 6) List<@Size(max = 24) String> etiquetas,
        @Size(max = 6) List<@Size(max = 500) String> imagenes
) {}
