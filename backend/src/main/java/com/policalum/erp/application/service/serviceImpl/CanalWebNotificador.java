package com.policalum.erp.application.service.serviceImpl;

import com.policalum.erp.application.dto.response.CotizacionResponseDTO;
import com.policalum.erp.domain.model.MensajeContacto;
import com.policalum.erp.domain.model.Notificacion;
import java.util.UUID;
import com.policalum.erp.infrastructure.config.SoltarConexion;
import com.policalum.erp.infrastructure.repository.NotificacionRepository;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

/** Aviso persistente en la campana del ERP y empujón SSE a las sesiones abiertas. */
@Service
@RequiredArgsConstructor
@Slf4j
public class CanalWebNotificador {

    private static final long TIMEOUT_MS = 15 * 60 * 1000L;
    private final NotificacionRepository notificacionRepository;
    private final EnvioPushService push;
    private final SoltarConexion soltarConexion;
    private final CopyOnWriteArrayList<SseEmitter> emisores = new CopyOnWriteArrayList<>();

    public SseEmitter suscribir() {
        SseEmitter emisor = new SseEmitter(TIMEOUT_MS);
        emisores.add(emisor);
        emisor.onCompletion(() -> emisores.remove(emisor));
        emisor.onTimeout(() -> emisores.remove(emisor));
        emisor.onError(error -> emisores.remove(emisor));
        try {
            emisor.send(SseEmitter.event().name("listo").data("ok"));
        } catch (IOException ex) {
            emisores.remove(emisor);
        }
        soltarConexion.ahora();
        return emisor;
    }

    public void cotizacion(CotizacionResponseDTO cotizacion) {
        String cliente = cotizacion.clienteNombre() == null ? "un cliente web" : cotizacion.clienteNombre();
        String distrito = cotizacion.cargos() == null || cotizacion.cargos().distrito() == null ? "" : " hacia " + cotizacion.cargos().distrito();
        avisar("WEB-COT-" + cotizacion.id(), "COTIZACION_WEB", "Tienes una nueva cotización para visualizar",
                cliente + " envió una cotización por " + cotizacion.total() + distrito, "/modules/cotizaciones");
    }

    public void compraWhatsapp(UUID id, String detalle) {
        avisar("WEB-WSP-" + id, "COMPRA_WHATSAPP", "Un cliente envió una compra por WhatsApp",
                detalle, "/modules/mensajes-web");
    }

    public void mensaje(MensajeContacto mensaje) {
        String tipo = mensaje.getTipoMensaje() == null ? "CONSULTA" : mensaje.getTipoMensaje();
        String etiqueta = switch (tipo) {
            case "RECLAMO" -> "Reclamo";
            case "QUEJA" -> "Queja";
            default -> "Consulta";
        };
        String aviso = "CONSULTA".equals(tipo) ? "MENSAJE_WEB" : "RECLAMO_WEB";
        String detalle = mensaje.getNombre();
        if (mensaje.getTelefono() != null && !mensaje.getTelefono().isBlank()) detalle += " · " + mensaje.getTelefono();
        if (mensaje.getCorreo() != null && !mensaje.getCorreo().isBlank()) detalle += " · " + mensaje.getCorreo();
        if (mensaje.getPedido() != null && !mensaje.getPedido().isBlank()) detalle += ". Pedido: " + mensaje.getPedido();
        avisar("WEB-LEAD-" + mensaje.getId(), aviso, etiqueta + " de " + mensaje.getNombre(), detalle, "/modules/mensajes-web");
    }

    public void mensajeChat(UUID lineaId, String nombre, String texto) {
        avisar("WEB-CHAT-" + lineaId, "MENSAJE_WEB", "Mensaje nuevo del portal",
                nombre + ": " + texto, "/modules/mensajes-web");
    }

    private void avisar(String clave, String tipo, String titulo, String detalle, String ruta) {
        try {
            if (notificacionRepository.findByClave(clave).isEmpty()) {
                String texto = detalle == null ? "" : detalle;
                if (texto.length() > 400) texto = texto.substring(0, 400);
                notificacionRepository.save(Notificacion.builder()
                        .clave(clave)
                        .tipo(tipo)
                        .titulo(titulo)
                        .detalle(texto)
                        .ruta(ruta)
                        .leida(false)
                        .eliminada(false)
                        .build());
            }
        } catch (Exception ex) {
            log.warn("No se pudo guardar el aviso {}: {}", clave, ex.getMessage());
        }
        empujar(titulo, detalle, ruta);
    }

    /** Al abrir el mensaje, la campana deja de contarlo. */
    public void leerAvisoDe(UUID mensajeId) {
        boolean cambio = false;
        for (String clave : java.util.List.of("WEB-LEAD-" + mensajeId, "WEB-WSP-" + mensajeId)) {
            var aviso = notificacionRepository.findByClave(clave).orElse(null);
            if (aviso == null || aviso.isLeida()) continue;
            aviso.setLeida(true);
            aviso.setLeidaAt(java.time.LocalDateTime.now());
            notificacionRepository.save(aviso);
            cambio = true;
        }
        if (cambio) refrescar();
    }

    /** Al borrar el mensaje, el aviso deja de existir. */
    public void retirarAvisoDe(UUID mensajeId) {
        for (String clave : java.util.List.of("WEB-LEAD-" + mensajeId, "WEB-WSP-" + mensajeId)) {
            notificacionRepository.findByClave(clave).ifPresent(notificacionRepository::delete);
        }
        refrescar();
    }

    /** Pide a las sesiones abiertas que vuelvan a leer la campana, sin un aviso nuevo. */
    public void refrescar() {
        String carga = "{\"tipo\":\"REFRESCO\"}";
        for (SseEmitter emisor : List.copyOf(emisores)) {
            try {
                emisor.send(SseEmitter.event().name("aviso").data(carga));
            } catch (Exception ex) {
                emisores.remove(emisor);
            }
        }
    }

    /** Aviso ya guardado (stock u otro). Llega a la campana abierta y a los dispositivos suscritos. */
    public void empujar(String titulo, String detalle, String ruta) {
        push.enviar(titulo, detalle, ruta);
        String destino = ruta == null ? "/modules/notificaciones" : ruta;
        String carga = "{\"tipo\":\"AVISO\",\"ruta\":\"" + destino.replace("\"", "") + "\"}";
        for (SseEmitter emisor : List.copyOf(emisores)) {
            try {
                emisor.send(SseEmitter.event().name("aviso").data(carga));
            } catch (Exception ex) {
                emisores.remove(emisor);
            }
        }
    }
}
