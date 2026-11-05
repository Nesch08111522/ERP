package com.policalum.erp.application.service.serviceImpl;

import com.policalum.erp.application.dto.request.ProyectoPortafolioRequestDTO;
import com.policalum.erp.application.dto.response.ProyectoPortafolioResponseDTO;
import com.policalum.erp.domain.model.ProyectoPortafolio;
import com.policalum.erp.exception.ResourceNotFoundException;
import com.policalum.erp.infrastructure.repository.ProyectoPortafolioRepository;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PortafolioService {

    private final ProyectoPortafolioRepository repository;
    private final CmsPublicador publicador;

    @Transactional(readOnly = true)
    public List<ProyectoPortafolioResponseDTO> listar() {
        return repository.findAllByOrderByOrdenAscTituloAsc().stream().map(this::dto).toList();
    }

    @Transactional
    public ProyectoPortafolioResponseDTO crear(ProyectoPortafolioRequestDTO request) {
        ProyectoPortafolio proyecto = ProyectoPortafolio.builder()
                .titulo(request.titulo().trim())
                .descripcion(request.descripcion().trim())
                .imagenUrl(url(request.imagenUrl()))
                .orden(request.orden())
                .publicado(request.publicado())
                .cliente(limpio(request.cliente()))
                .build();
        ProyectoPortafolioResponseDTO respuesta = dto(repository.save(proyecto));
        publicador.publicar("portafolio");
        return respuesta;
    }

    @Transactional
    public ProyectoPortafolioResponseDTO actualizar(UUID id, ProyectoPortafolioRequestDTO request) {
        ProyectoPortafolio proyecto = buscar(id);
        proyecto.setTitulo(request.titulo().trim());
        proyecto.setDescripcion(request.descripcion().trim());
        proyecto.setImagenUrl(url(request.imagenUrl()));
        proyecto.setOrden(request.orden());
        proyecto.setPublicado(request.publicado());
        proyecto.setCliente(limpio(request.cliente()));
        publicador.publicar("portafolio");
        return dto(proyecto);
    }

    @Transactional
    public void eliminar(UUID id) {
        repository.delete(buscar(id));
        publicador.publicar("portafolio");
    }

    private ProyectoPortafolio buscar(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado"));
    }

    private ProyectoPortafolioResponseDTO dto(ProyectoPortafolio proyecto) {
        return new ProyectoPortafolioResponseDTO(proyecto.getId(), proyecto.getTitulo(), proyecto.getDescripcion(),
                proyecto.getImagenUrl(), proyecto.getOrden(), proyecto.getPublicado(), proyecto.getCreatedAt(), proyecto.getCliente());
    }

    private static String url(String valor) {
        if (valor == null || valor.isBlank()) return null;
        String limpio = valor.trim();
        try {
            URI uri = new URI(limpio);
            String esquema = uri.getScheme();
            if (esquema == null
                    || (!esquema.equalsIgnoreCase("https") && !esquema.equalsIgnoreCase("http"))
                    || uri.getHost() == null
                    || uri.getUserInfo() != null) {
                throw new IllegalArgumentException("La imagen del proyecto debe ser una URL HTTP o HTTPS válida");
            }
        } catch (URISyntaxException ex) {
            throw new IllegalArgumentException("La imagen del proyecto debe ser una URL HTTP o HTTPS válida", ex);
        }
        return limpio;
    }

    private static String limpio(String valor) {
        if (valor == null || valor.isBlank()) return null;
        return valor.trim();
    }
}
