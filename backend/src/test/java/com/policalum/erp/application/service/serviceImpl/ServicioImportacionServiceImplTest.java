package com.policalum.erp.application.service.serviceImpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.policalum.erp.domain.model.Servicio;
import com.policalum.erp.infrastructure.repository.ServicioRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

@ExtendWith(MockitoExtension.class)
class ServicioImportacionServiceImplTest {

    @Mock
    ServicioRepository repository;

    @InjectMocks
    ServicioImportacionServiceImpl service;

    @Test
    void importarCsvConDescripcionEntreComillasConservaLaComa() {
        when(repository.findByNombreIgnoreCase("Instalación")).thenReturn(Optional.empty());

        service.importar(new MockMultipartFile("archivo", "servicios.csv", "text/csv",
                "nombre,descripcion,precio,activo\n\"Instalación\",\"Corte, doblez y acabado\",80.00,true"
                        .getBytes(java.nio.charset.StandardCharsets.UTF_8)));

        ArgumentCaptor<Servicio> captor = ArgumentCaptor.forClass(Servicio.class);
        verify(repository).save(captor.capture());
        assertEquals("Corte, doblez y acabado", captor.getValue().getDescripcion());
        assertEquals(new BigDecimal("80.00"), captor.getValue().getPrecio());
        assertEquals(true, captor.getValue().getActivo());
    }

    @Test
    void importarCsvConActivoInvalidoFallaConFilaYNoGuarda() {
        IllegalArgumentException error = assertThrows(IllegalArgumentException.class,
                () -> service.importar(new MockMultipartFile("archivo", "servicios.csv", "text/csv",
                        "nombre,descripcion,precio,activo\nInstalación,Servicio,80,si"
                                .getBytes(java.nio.charset.StandardCharsets.UTF_8))));

        assertEquals("Fila 2: activo debe ser true o false", error.getMessage());
        verify(repository, never()).save(any());
    }
}
