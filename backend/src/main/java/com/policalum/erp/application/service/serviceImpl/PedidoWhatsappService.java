package com.policalum.erp.application.service.serviceImpl;

import com.policalum.erp.application.dto.request.PedidoWhatsappRequestDTO;
import com.policalum.erp.application.service.PrecioComercial;
import com.policalum.erp.domain.enums.EstadoMensajeWeb;
import com.policalum.erp.domain.model.CatalogoFraccion;
import com.policalum.erp.domain.model.MensajeContacto;
import com.policalum.erp.domain.model.Producto;
import com.policalum.erp.infrastructure.repository.CatalogoFraccionRepository;
import com.policalum.erp.infrastructure.repository.MensajeContactoRepository;
import com.policalum.erp.infrastructure.repository.ProductoRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Deja en el ERP el pedido que el cliente acaba de mandar por WhatsApp. */
@Service
@RequiredArgsConstructor
public class PedidoWhatsappService {

    private final ProductoRepository productos;
    private final CatalogoFraccionRepository fracciones;
    private final MensajeContactoRepository mensajes;
    private final CanalWebNotificador notificador;

    @Transactional
    public void recibir(PedidoWhatsappRequestDTO request) {
        if (request.website() != null && !request.website().isBlank()) {
            throw new IllegalArgumentException("Solicitud no válida");
        }
        StringBuilder cuerpo = new StringBuilder("Un cliente envió esta compra por WhatsApp. Todavía no dejó RUC ni correo.\n");
        List<String> resumen = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        for (PedidoWhatsappRequestDTO.Linea linea : request.lineas()) {
            Producto producto = productos.findById(linea.productoId())
                    .orElseThrow(() -> new IllegalArgumentException("Hay un producto que ya no está en el catálogo"));
            if (!Boolean.TRUE.equals(producto.getActivo())) {
                throw new IllegalArgumentException(producto.getNombre() + " no está disponible");
            }
            String corte = "";
            BigDecimal precio;
            if (linea.fraccionId() != null) {
                CatalogoFraccion fraccion = fracciones.findWithProductoById(linea.fraccionId())
                        .orElseThrow(() -> new IllegalArgumentException("El corte ya no está disponible"));
                if (!fraccion.getProducto().getId().equals(producto.getId()) || !Boolean.TRUE.equals(fraccion.getActivo())) {
                    throw new IllegalArgumentException("El corte no corresponde al producto");
                }
                precio = PrecioComercial.fraccion(producto, fraccion);
                corte = " · " + fraccion.getNombreFraccion();
            } else if (Boolean.TRUE.equals(producto.getEsFraccionable())) {
                throw new IllegalArgumentException("Elige un corte de " + producto.getNombre());
            } else {
                precio = PrecioComercial.venta(producto);
            }
            if (precio == null) {
                throw new IllegalArgumentException(producto.getNombre() + " no tiene precio de venta");
            }
            BigDecimal subtotal = precio.multiply(linea.cantidad()).setScale(2, RoundingMode.HALF_UP);
            total = total.add(subtotal);
            String cantidad = linea.cantidad().stripTrailingZeros().toPlainString();
            cuerpo.append("• ")
                    .append(producto.getNombre())
                    .append(corte)
                    .append(" (").append(producto.getCodigoSku()).append(") x ")
                    .append(cantidad).append(' ').append(producto.getUnidad() == null ? "" : producto.getUnidad())
                    .append(" = S/ ").append(subtotal.toPlainString())
                    .append('\n');
            resumen.add(producto.getNombre() + " x " + cantidad);
        }
        total = total.setScale(2, RoundingMode.HALF_UP);
        cuerpo.append("Total aproximado: S/ ").append(total.toPlainString());
        String texto = cuerpo.toString();
        if (texto.length() > 2000) texto = texto.substring(0, 1997) + "...";

        MensajeContacto guardado = mensajes.save(MensajeContacto.builder()
                .nombre("Cliente por WhatsApp")
                .correo("sin-correo@pedido.whatsapp")
                .asunto("Compra por WhatsApp")
                .tipoMensaje("COMPRA")
                .mensaje(texto)
                .estado(EstadoMensajeWeb.NUEVO)
                .leido(false)
                .archivado(false)
                .build());

        String detalle = String.join(" · ", resumen) + " · S/ " + total.toPlainString();
        if (detalle.length() > 400) detalle = detalle.substring(0, 397) + "...";
        notificador.compraWhatsapp(guardado.getId(), detalle);
    }
}
