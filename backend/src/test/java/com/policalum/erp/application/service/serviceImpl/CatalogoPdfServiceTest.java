package com.policalum.erp.application.service.serviceImpl;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.policalum.erp.application.dto.response.EmpresaPublicaDTO;
import com.policalum.erp.application.dto.response.PaginaPublicaDTO;
import com.policalum.erp.application.dto.response.ProductoPublicoDTO;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Pageable;

class CatalogoPdfServiceTest {

    @Test
    void generaPdfConTodoElCatalogoPublico() {
        PortalPublicoService portal = org.mockito.Mockito.mock(PortalPublicoService.class);
        ProductoImagenService imagenes = org.mockito.Mockito.mock(ProductoImagenService.class);
        ProductoPublicoDTO producto = new ProductoPublicoDTO(
                UUID.randomUUID(), "Plancha de policarbonato", "Descripción de prueba", "SKU-01", "unidad",
                new BigDecimal("125.50"), true, false, false, null, null, null, List.of(), false,
                BigDecimal.ONE, new BigDecimal("125.50"));
        ProductoPublicoDTO segundo = new ProductoPublicoDTO(
                UUID.randomUUID(), "Accesorio", "Otra descripción", "SKU-02", "unidad",
                new BigDecimal("25.00"), true, false, false, null, null, null, List.of(), false,
                BigDecimal.ONE, new BigDecimal("25.00"));
        when(portal.catalogo(any(), any(), anyBoolean(), any(Pageable.class)))
                .thenReturn(
                        new PaginaPublicaDTO<>(List.of(producto), 0, 48, 2, 2),
                        new PaginaPublicaDTO<>(List.of(segundo), 1, 48, 2, 2));
        when(portal.empresa()).thenReturn(new EmpresaPublicaDTO("POLICALUM", null, null, null, null, null, null, null));

        byte[] pdf = new CatalogoPdfService(portal, imagenes).generar();

        assertArrayEquals("%PDF-".getBytes(StandardCharsets.US_ASCII), Arrays.copyOf(pdf, 5));
        assertTrue(pdf.length > 500);
        verify(portal).empresa();
        verify(portal, org.mockito.Mockito.times(2)).catalogo(any(), any(), anyBoolean(), any(Pageable.class));
    }
}
