package com.policalum.erp.application.service.serviceImpl;

import com.policalum.erp.application.dto.request.ProyectoPortafolioRequestDTO;
import com.policalum.erp.application.dto.response.ProyectoPortafolioResponseDTO;
import com.policalum.erp.domain.model.ProyectoPortafolio;
import com.policalum.erp.exception.ResourceNotFoundException;
import com.policalum.erp.infrastructure.repository.ProyectoPortafolioRepository;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PortafolioService {

    static final int MAX_PALABRAS_DESCRIPCION = 40;
    static final int MAX_PALABRAS_REFERENCIA = 16;
    static final int MAX_ETIQUETAS = 6;
    static final int MAX_IMAGENES = 6;

    private final ProyectoPortafolioRepository repository;
    private final CmsPublicador publicador;

    @Transactional(readOnly = true)
    public List<ProyectoPortafolioResponseDTO> listar() {
        return repository.findAllByOrderByOrdenAscTituloAsc().stream().map(this::dto).toList();
    }

    @Transactional
    public ProyectoPortafolioResponseDTO crear(ProyectoPortafolioRequestDTO request) {
        ProyectoPortafolio proyecto = ProyectoPortafolio.builder().build();
        aplicar(proyecto, request);
        ProyectoPortafolioResponseDTO respuesta = dto(repository.save(proyecto));
        publicador.publicar("portafolio");
        return respuesta;
    }

    @Transactional
    public ProyectoPortafolioResponseDTO actualizar(UUID id, ProyectoPortafolioRequestDTO request) {
        ProyectoPortafolio proyecto = buscar(id);
        aplicar(proyecto, request);
        publicador.publicar("portafolio");
        return dto(proyecto);
    }

    @Transactional
    public void eliminar(UUID id) {
        repository.delete(buscar(id));
        publicador.publicar("portafolio");
    }

    private void aplicar(ProyectoPortafolio proyecto, ProyectoPortafolioRequestDTO request) {
        String descripcion = request.descripcion().trim();
        exigirPalabras(descripcion, MAX_PALABRAS_DESCRIPCION, "La descripción admite como máximo 40 palabras");
        String referencia = limpio(request.referencia());
        exigirPalabras(referencia, MAX_PALABRAS_REFERENCIA, "La referencia admite como máximo 16 palabras");
        List<String> etiquetas = etiquetas(request.etiquetas());
        List<String> imagenes = imagenes(request);
        proyecto.setTitulo(request.titulo().trim());
        proyecto.setDescripcion(descripcion);
        proyecto.setImagenUrl(imagenes.isEmpty() ? null : imagenes.get(0));
        proyecto.setVideoUrl(url(request.videoUrl()));
        proyecto.setHlsUrl(url(request.hlsUrl()));
        proyecto.setDashUrl(url(request.dashUrl()));
        proyecto.setOrden(request.orden());
        proyecto.setPublicado(request.publicado());
        proyecto.setCliente(limpio(request.cliente()));
        proyecto.setLugar(limpio(request.lugar()));
        proyecto.setAnio(limpio(request.anio()));
        proyecto.setServicio(limpio(request.servicio()));
        proyecto.setReferencia(referencia);
        proyecto.setEtiquetasJson(ListasJson.escribir(etiquetas));
        proyecto.setImagenesJson(ListasJson.escribir(imagenes));
    }

    private ProyectoPortafolio buscar(UUID id) {
        return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Proyecto no encontrado"));
    }

    private ProyectoPortafolioResponseDTO dto(ProyectoPortafolio proyecto) {
        return new ProyectoPortafolioResponseDTO(proyecto.getId(), proyecto.getTitulo(), proyecto.getDescripcion(),
                proyecto.getImagenUrl(), proyecto.getOrden(), proyecto.getPublicado(), proyecto.getCreatedAt(),
                proyecto.getCliente(), proyecto.getLugar(), proyecto.getAnio(), proyecto.getServicio(),
                proyecto.getReferencia(), ListasJson.leer(proyecto.getEtiquetasJson()), ListasJson.imagenes(proyecto),
                proyecto.getVideoUrl(), proyecto.getHlsUrl(), proyecto.getDashUrl());
    }

    private static void exigirPalabras(String texto, int tope, String mensaje) {
        if (texto != null && palabras(texto) > tope) throw new IllegalArgumentException(mensaje);
    }

    private static int palabras(String texto) {
        if (texto == null || texto.isBlank()) return 0;
        return texto.trim().split("\\s+").length;
    }

    private static List<String> etiquetas(List<String> crudas) {
        if (crudas == null || crudas.isEmpty()) return List.of();
        List<String> limpias = new ArrayList<>();
        for (String cruda : crudas) {
            if (cruda == null || cruda.isBlank()) continue;
            String etiqueta = cruda.trim();
            if (etiqueta.length() > 24) {
                throw new IllegalArgumentException("Cada etiqueta admite hasta 24 caracteres");
            }
            limpias.add(etiqueta);
        }
        if (limpias.size() > MAX_ETIQUETAS) {
            throw new IllegalArgumentException("Puedes publicar hasta 6 etiquetas");
        }
        return List.copyOf(limpias);
    }

    private static List<String> imagenes(ProyectoPortafolioRequestDTO request) {
        List<String> origen = request.imagenes();
        if (origen == null || origen.stream().allMatch(item -> item == null || item.isBlank())) {
            String portada = url(request.imagenUrl());
            return portada == null ? List.of() : List.of(portada);
        }
        List<String> limpias = new ArrayList<>();
        for (String cruda : origen) {
            if (cruda == null || cruda.isBlank()) continue;
            limpias.add(url(cruda));
        }
        if (limpias.size() > MAX_IMAGENES) {
            throw new IllegalArgumentException("Puedes publicar hasta 6 imágenes");
        }
        return List.copyOf(limpias);
    }

    private static String url(String valor) {
        if (valor == null || valor.isBlank()) return null;
        String limpio = valor.trim();
        if (limpio.startsWith("/") && !limpio.startsWith("//") && !limpio.contains("..")) return limpio;
        try {
            URI uri = new URI(limpio);
            String esquema = uri.getScheme();
            if (esquema == null
                    || (!esquema.equalsIgnoreCase("https") && !esquema.equalsIgnoreCase("http"))
                    || uri.getHost() == null
                    || uri.getUserInfo() != null) {
                throw new IllegalArgumentException("La imagen del proyecto debe ser una URL HTTP o HTTPS, o una ruta del sitio");
            }
        } catch (URISyntaxException ex) {
            throw new IllegalArgumentException("La imagen del proyecto debe ser una URL HTTP o HTTPS, o una ruta del sitio", ex);
        }
        return limpio;
    }

    private static String limpio(String valor) {
        if (valor == null || valor.isBlank()) return null;
        return valor.trim();
    }
}
