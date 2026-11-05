package com.policalum.erp.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ProyectoPortafolioRequestDTO(
        @NotBlank @Size(max = 160) String titulo,
        @NotBlank @Size(max = 800) String descripcion,
        @Size(max = 500) @Pattern(
                regexp = "(?i)^(?:\\s*|\\s*https?://[^\\s]+\\s*)$",
                message = "La imagen debe ser una URL HTTP o HTTPS válida"
        ) String imagenUrl,
        @NotNull Integer orden,
        @NotNull Boolean publicado,
        @Size(max = 160) String cliente
) {}
