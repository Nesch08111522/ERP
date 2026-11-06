package com.policalum.erp.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ContactoWebRequestDTO(
        @NotBlank @Pattern(regexp = "CONSULTA|RECLAMO|QUEJA", message = "Elige consulta, reclamo o queja") String tipo,
        @NotBlank @Size(max = 120) String nombre,
        @Size(max = 20) String documentoTipo,
        @Size(max = 20) String documentoNumero,
        @NotBlank @Email @Size(max = 150) String correo,
        @NotBlank @Pattern(regexp = "[0-9+()\\- ]{6,20}", message = "Teléfono inválido") String telefono,
        @Size(max = 150) String empresa,
        @Size(max = 200) String direccion,
        @Size(max = 160) String bien,
        @Size(max = 40) String monto,
        @NotBlank @Size(max = 1000) String pedido,
        @NotBlank @Size(max = 2000) String mensaje,
        @Size(max = 200) String website
) {}
