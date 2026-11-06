package com.policalum.erp.application.service.serviceImpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.policalum.erp.application.dto.request.ProyectoPortafolioRequestDTO;
import com.policalum.erp.application.dto.response.ProyectoPortafolioResponseDTO;
import com.policalum.erp.domain.model.ProyectoPortafolio;
import com.policalum.erp.exception.ResourceNotFoundException;
import com.policalum.erp.infrastructure.repository.ProyectoPortafolioRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PortafolioServiceTest {

    @Mock ProyectoPortafolioRepository repository;
    @Mock CmsPublicador publicador;
    @InjectMocks PortafolioService service;

    @Test
    void crear_normalizaCampos_yProgramaLaPublicacionTrasPersistir() {
        UUID id = UUID.randomUUID();
        when(repository.save(any(ProyectoPortafolio.class))).thenAnswer(invocation -> {
            ProyectoPortafolio proyecto = invocation.getArgument(0);
            proyecto.setId(id);
            return proyecto;
        });

        ProyectoPortafolioResponseDTO response = service.crear(request("  Proyecto  ", " https://example.com/obra.jpg ", false));

        ArgumentCaptor<ProyectoPortafolio> captor = ArgumentCaptor.forClass(ProyectoPortafolio.class);
        verify(repository).save(captor.capture());
        assertEquals(id, response.id());
        assertEquals("Proyecto", response.titulo());
        assertEquals("https://example.com/obra.jpg", response.imagenUrl());
        assertFalse(response.publicado());
        verify(publicador).publicar("portafolio");
    }

    @Test
    void actualizarConservaFechaDeCreacion() {
        UUID id = UUID.randomUUID();
        LocalDateTime createdAt = LocalDateTime.parse("2025-01-02T03:04:05");
        ProyectoPortafolio proyecto = ProyectoPortafolio.builder()
                .id(id).titulo("Anterior").descripcion("Descripción anterior").orden(1)
                .publicado(true).createdAt(createdAt).build();
        when(repository.findById(id)).thenReturn(Optional.of(proyecto));

        ProyectoPortafolioResponseDTO response = service.actualizar(id, request("Nuevo", "Texto nuevo", false));

        assertEquals("Nuevo", response.titulo());
        assertEquals(createdAt, response.createdAt());
        assertFalse(response.publicado());
        verify(publicador).publicar("portafolio");
    }

    @Test
    void imagenInvalidaEsRechazada() {
        assertThrows(IllegalArgumentException.class, () -> service.crear(request("Proyecto", "Descripción", true, "javascript:alert(1)")));
    }

    @Test
    void proyectoInexistenteNoSeActualiza() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.actualizar(id, request("Nuevo", "Descripción", true)));
    }

    private static ProyectoPortafolioRequestDTO request(String titulo, String descripcion, boolean publicado) {
        return request(titulo, descripcion, publicado, "https://example.com/obra.jpg");
    }

    private static ProyectoPortafolioRequestDTO request(String titulo, String descripcion, boolean publicado, String imagenUrl) {
        return new ProyectoPortafolioRequestDTO(titulo, descripcion, imagenUrl, 1, publicado, " Cliente ",
                null, null, null, null, null, null);
    }

    @Test
    void descripcionConMasDe40PalabrasEsRechazada() {
        String larga = "palabra ".repeat(41).trim();
        assertThrows(IllegalArgumentException.class, () -> service.crear(request("Proyecto", larga, true)));
    }
}
