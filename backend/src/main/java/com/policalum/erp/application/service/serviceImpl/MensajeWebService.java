package com.policalum.erp.application.service.serviceImpl;

import com.policalum.erp.application.dto.request.ContactoWebRequestDTO;
import com.policalum.erp.application.dto.request.GestionarMensajeRequestDTO;
import com.policalum.erp.application.dto.response.MensajeContactoResponseDTO;
import com.policalum.erp.domain.enums.EstadoMensajeWeb;
import com.policalum.erp.domain.model.MensajeContacto;
import com.policalum.erp.exception.ResourceNotFoundException;
import com.policalum.erp.infrastructure.repository.MensajeContactoRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MensajeWebService {

    private final MensajeContactoRepository repository;
    private final CanalWebNotificador notificador;

    @Transactional
    public MensajeContactoResponseDTO recibir(ContactoWebRequestDTO request) {
        String tipo = request.tipo().trim().toUpperCase();
        boolean libro = "RECLAMO".equals(tipo) || "QUEJA".equals(tipo);
        if (libro && vacio(request.documentoNumero()) == null) {
            throw new IllegalArgumentException("Indica el número de documento");
        }
        if (libro && vacio(request.direccion()) == null) {
            throw new IllegalArgumentException("Indica la dirección");
        }
        if (libro && vacio(request.bien()) == null) {
            throw new IllegalArgumentException("Indica el producto o servicio");
        }
        String etiqueta = switch (tipo) {
            case "RECLAMO" -> "Reclamo";
            case "QUEJA" -> "Queja";
            default -> "Consulta";
        };
        MensajeContacto mensaje = MensajeContacto.builder()
                .nombre(request.nombre().trim())
                .correo(request.correo().trim().toLowerCase())
                .telefono(request.telefono().trim())
                .empresa(vacio(request.empresa()))
                .asunto(etiqueta)
                .tipoMensaje(tipo)
                .documentoTipo(vacio(request.documentoTipo()))
                .documentoNumero(vacio(request.documentoNumero()))
                .direccion(vacio(request.direccion()))
                .bien(vacio(request.bien()))
                .monto(vacio(request.monto()))
                .pedido(request.pedido().trim())
                .mensaje(request.mensaje().trim())
                .estado(EstadoMensajeWeb.NUEVO)
                .leido(false)
                .archivado(false)
                .build();
        MensajeContacto guardado = repository.save(mensaje);
        notificador.mensaje(guardado);
        return dto(guardado);
    }

    @Transactional(readOnly = true)
    public Page<MensajeContactoResponseDTO> listar(EstadoMensajeWeb estado, Pageable pageable) {
        Page<MensajeContacto> pagina = estado == null
                ? repository.findAllByOrderByCreatedAtDesc(pageable)
                : repository.findByEstadoOrderByCreatedAtDesc(estado, pageable);
        return pagina.map(this::dto);
    }

    @Transactional(readOnly = true)
    public long nuevos() {
        return repository.countByEstado(EstadoMensajeWeb.NUEVO);
    }

    @Transactional(readOnly = true)
    public long sinLeer() {
        return repository.contarSinLeer();
    }

    @Transactional
    public void marcarLeido(UUID id) {
        MensajeContacto mensaje = exigir(id);
        mensaje.setLeido(true);
        repository.save(mensaje);
        notificador.leerAvisoDe(id);
    }

    @Transactional
    public void marcarNoLeido(UUID id) {
        MensajeContacto mensaje = exigir(id);
        mensaje.setLeido(false);
        repository.save(mensaje);
        notificador.refrescar();
    }

    @Transactional
    public void archivar(UUID id, boolean archivado) {
        MensajeContacto mensaje = exigir(id);
        mensaje.setArchivado(archivado);
        repository.save(mensaje);
        notificador.refrescar();
    }

    @Transactional
    public void eliminar(UUID id) {
        exigir(id);
        repository.deleteById(id);
        notificador.retirarAvisoDe(id);
    }

    @Transactional
    public MensajeContactoResponseDTO gestionar(UUID id, GestionarMensajeRequestDTO request) {
        MensajeContacto mensaje = exigir(id);
        mensaje.setEstado(EstadoMensajeWeb.GESTIONADO);
        mensaje.setNotaGestion(request == null || request.nota() == null || request.nota().isBlank() ? null : request.nota().trim());
        mensaje.setGestionadoAt(LocalDateTime.now());
        return dto(mensaje);
    }

    private MensajeContactoResponseDTO dto(MensajeContacto mensaje) {
        return new MensajeContactoResponseDTO(mensaje.getId(), mensaje.getNombre(), mensaje.getCorreo(), mensaje.getTelefono(),
                mensaje.getEmpresa(), mensaje.getAsunto(), mensaje.getTipoMensaje(), mensaje.getDocumentoTipo(),
                mensaje.getDocumentoNumero(), mensaje.getDireccion(), mensaje.getBien(), mensaje.getMonto(),
                mensaje.getPedido(), mensaje.getMensaje(), mensaje.getEstado(), mensaje.getNotaGestion(),
                mensaje.getCreatedAt(), mensaje.getGestionadoAt(), mensaje.getLeido(), mensaje.getArchivado());
    }

    private MensajeContacto exigir(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Mensaje no encontrado"));
    }

    private static String vacio(String valor) {
        if (valor == null || valor.isBlank()) return null;
        return valor.trim();
    }
}
