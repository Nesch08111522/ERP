package com.policalum.erp.application.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/** Pedido que el cliente confirma desde el carrito al abrir WhatsApp. */
public record PedidoWhatsappRequestDTO(
        @NotEmpty @Size(max = 40) List<@Valid Linea> lineas,
        @Size(max = 200) String website
) {
    public record Linea(
            @NotNull UUID productoId,
            UUID fraccionId,
            @NotNull @DecimalMin("0.0001") @Digits(integer = 8, fraction = 4) BigDecimal cantidad
    ) {}
}
