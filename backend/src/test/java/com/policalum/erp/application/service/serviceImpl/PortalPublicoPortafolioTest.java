package com.policalum.erp.application.service.serviceImpl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.policalum.erp.application.dto.response.ProyectoPortafolioPublicoDTO;
import com.policalum.erp.domain.model.ProyectoPortafolio;
import com.policalum.erp.infrastructure.repository.CategoriaRepository;
import com.policalum.erp.infrastructure.repository.CmsAjusteRepository;
import com.policalum.erp.infrastructure.repository.ConfiguracionEmpresaRepository;
import com.policalum.erp.infrastructure.repository.ProductoRepository;
import com.policalum.erp.infrastructure.repository.ProyectoPortafolioRepository;
import com.policalum.erp.infrastructure.repository.SedeRepository;
import com.policalum.erp.infrastructure.repository.ServicioRepository;
import com.policalum.erp.infrastructure.repository.StockRepository;
import java.util.List;
import java.util.UUID;
import java.util.Arrays;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.mock;

class PortalPublicoPortafolioTest {

    private final ProductoRepository productos = mock(ProductoRepository.class);
    private final CategoriaRepository categorias = mock(CategoriaRepository.class);
    private final StockRepository stock = mock(StockRepository.class);
    private final ConfiguracionEmpresaRepository empresa = mock(ConfiguracionEmpresaRepository.class);
    private final ProyectoPortafolioRepository portafolio = mock(ProyectoPortafolioRepository.class);
    private final SedeRepository sedes = mock(SedeRepository.class);
    private final ServicioRepository servicios = mock(ServicioRepository.class);
    private final CmsAjusteRepository cms = mock(CmsAjusteRepository.class);
    private final PortalPublicoService service = new PortalPublicoService(
            productos, categorias, stock, empresa, portafolio, sedes, servicios, cms);

    @Test
    void listaSoloPublicadosYExponeElDtoPublicoSinCamposAdministrativos() {
        UUID id = UUID.randomUUID();
        ProyectoPortafolio proyecto = ProyectoPortafolio.builder()
                .id(id).titulo("Obra").descripcion("Descripción")
                .imagenUrl("https://example.com/obra.jpg").orden(2)
                .publicado(true).cliente("Cliente").build();
        when(portafolio.findByPublicadoTrueOrderByOrdenAscTituloAsc()).thenReturn(List.of(proyecto));

        List<ProyectoPortafolioPublicoDTO> resultado = service.portafolio();

        assertEquals(1, resultado.size());
        assertEquals(id, resultado.get(0).id());
        assertEquals("Obra", resultado.get(0).titulo());
        assertEquals(List.of("id", "titulo", "descripcion", "imagenUrl", "orden", "cliente",
                "lugar", "anio", "servicio", "referencia", "etiquetas", "imagenes"),
                Arrays.stream(ProyectoPortafolioPublicoDTO.class.getRecordComponents())
                        .map(component -> component.getName())
                        .toList());
        verify(portafolio).findByPublicadoTrueOrderByOrdenAscTituloAsc();
    }
}
