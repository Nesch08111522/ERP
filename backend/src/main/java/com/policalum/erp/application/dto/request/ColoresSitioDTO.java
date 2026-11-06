package com.policalum.erp.application.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/** Paleta de día y de noche. Los vacíos no se aceptan: cada tono es un hex de 6 dígitos. */
public record ColoresSitioDTO(
        @NotNull @Valid PaletaColorDTO dia,
        @NotNull @Valid PaletaColorDTO noche
) {
    public record PaletaColorDTO(
            @NotBlank @Pattern(regexp = "#[0-9A-Fa-f]{6}", message = "Usa un color hexadecimal de 6 dígitos") String acento,
            @NotBlank @Pattern(regexp = "#[0-9A-Fa-f]{6}", message = "Usa un color hexadecimal de 6 dígitos") String fondo,
            @NotBlank @Pattern(regexp = "#[0-9A-Fa-f]{6}", message = "Usa un color hexadecimal de 6 dígitos") String tarjeta,
            @NotBlank @Pattern(regexp = "#[0-9A-Fa-f]{6}", message = "Usa un color hexadecimal de 6 dígitos") String texto,
            @NotBlank @Pattern(regexp = "#[0-9A-Fa-f]{6}", message = "Usa un color hexadecimal de 6 dígitos") String textoSuave,
            @NotBlank @Pattern(regexp = "#[0-9A-Fa-f]{6}", message = "Usa un color hexadecimal de 6 dígitos") String oferta,
            @NotBlank @Pattern(regexp = "#[0-9A-Fa-f]{6}", message = "Usa un color hexadecimal de 6 dígitos") String franja
    ) {}
}
