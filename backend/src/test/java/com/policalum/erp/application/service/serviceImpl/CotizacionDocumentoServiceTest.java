package com.policalum.erp.application.service.serviceImpl;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import com.policalum.erp.application.dto.response.CotizacionResponseDTO;
import com.policalum.erp.application.dto.response.DetalleCotizacionResponseDTO;
import com.policalum.erp.application.service.CotizacionService;
import com.policalum.erp.domain.enums.CanalCotizacion;
import com.policalum.erp.domain.enums.EstadoCotizacion;
import com.policalum.erp.infrastructure.repository.ConfiguracionEmpresaRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class CotizacionDocumentoServiceTest {

    @Mock
    private CotizacionService cotizacionService;
    @Mock
    private ConfiguracionEmpresaRepository empresaRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CotizacionDocumentoService service;

    @BeforeEach
    void limpiarContexto() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void generaPdfConNombreDeDescargaYContenidoValido() {
        UUID id = UUID.randomUUID();
        when(cotizacionService.findById(id)).thenReturn(cotizacion(id));

        var response = service.descargar(id, "pdf");

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION).contains(".pdf"));
        assertArrayEquals("%PDF".getBytes(), java.util.Arrays.copyOf(response.getBody(), 4));
    }

    @Test
    void generaExcelConNombreDeDescargaYArchivoXlsxValido() {
        UUID id = UUID.randomUUID();
        when(cotizacionService.findById(id)).thenReturn(cotizacion(id));

        var response = service.descargar(id, "xlsx");

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getHeaders().getFirst(HttpHeaders.CONTENT_DISPOSITION).contains(".xlsx"));
        assertArrayEquals(new byte[] { 'P', 'K' }, java.util.Arrays.copyOf(response.getBody(), 2));
    }

    private CotizacionResponseDTO cotizacion(UUID id) {
        var linea = new DetalleCotizacionResponseDTO(
                UUID.randomUUID(), UUID.randomUUID(), "Policarbonato alveolar 6 mm",
                null, null, null, null,
                new BigDecimal("2"), new BigDecimal("120.00"), new BigDecimal("101.69"),
                new BigDecimal("36.61"), new BigDecimal("18"), new BigDecimal("240.00"));
        return new CotizacionResponseDTO(
                id, UUID.randomUUID(), "Sede principal", UUID.randomUUID(), "Vendedor",
                UUID.randomUUID(), "Cliente de prueba", EstadoCotizacion.EMITIDA,
                new BigDecimal("240.00"), LocalDate.now().plusDays(7), "Entrega coordinada",
                null, LocalDateTime.now(), List.of(linea), CanalCotizacion.INTERNO, "INTERNO", null);
    }
}
