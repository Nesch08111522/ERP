package com.policalum.erp.infrastructure.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

/**
 * Verifica el token-bucket del filtro: deja pasar hasta la capacidad y responde 429 con
 * Retry-After al excederla, sin continuar la cadena. Capacidad 2 por ventana para el login.
 */
class RateLimitFilterTest {

    private final FilterChain chain = mock(FilterChain.class);

    private MockHttpServletRequest login(String ip) {
        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setRequestURI("/api/v1/auth/login");
        req.setRemoteAddr(ip);
        req.setMethod("POST");
        return req;
    }

    @Test
    void hastaCapacidad_dejaPasar_yAlExceder_responde429() throws Exception {
        RateLimitFilter filter = new RateLimitFilter(2, 60, 30, 60);

        MockHttpServletResponse r1 = new MockHttpServletResponse();
        MockHttpServletResponse r2 = new MockHttpServletResponse();
        MockHttpServletResponse r3 = new MockHttpServletResponse();

        filter.doFilter(login("10.0.0.1"), r1, chain);
        filter.doFilter(login("10.0.0.1"), r2, chain);
        filter.doFilter(login("10.0.0.1"), r3, chain);

        assertEquals(200, r1.getStatus());
        assertEquals(200, r2.getStatus());
        assertEquals(429, r3.getStatus());
        assertTrue(r3.getContentAsString().contains("demasiadas_peticiones"),
                "el cuerpo debe indicar demasiadas peticiones");
        assertTrue(r3.getHeader("Retry-After") != null, "debe exponer Retry-After");
        // Solo las dos primeras avanzaron por la cadena.
        verify(chain, times(2)).doFilter(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any());
    }

    @Test
    void otraIp_tieneSuPropioBucket() throws Exception {
        RateLimitFilter filter = new RateLimitFilter(1, 60, 30, 60);

        MockHttpServletResponse a1 = new MockHttpServletResponse();
        MockHttpServletResponse a2 = new MockHttpServletResponse();
        MockHttpServletResponse b1 = new MockHttpServletResponse();

        filter.doFilter(login("10.0.0.1"), a1, chain);
        filter.doFilter(login("10.0.0.1"), a2, chain);
        filter.doFilter(login("10.0.0.2"), b1, chain);

        assertEquals(200, a1.getStatus());
        assertEquals(429, a2.getStatus());
        assertEquals(200, b1.getStatus());
    }

    @Test
    void retryAfter_redondeaHaciaArriba_sinExponerDatosInternos() throws Exception {
        MockHttpServletResponse response = new MockHttpServletResponse();
        RateLimitFilter.escribirDemasiadasPeticiones(response,
                io.github.bucket4j.ConsumptionProbe.rejected(0, 1_500_000_000L, 0));

        assertEquals(429, response.getStatus());
        assertEquals("2", response.getHeader("Retry-After"));
        assertEquals("{\"error\":\"demasiadas_peticiones\",\"retryAfterSeconds\":2}",
                response.getContentAsString());
    }

    @Test
    void retryAfter_ventanaExacta_yMinimoUnSegundo() throws Exception {
        for (long waitNanos : new long[] {0, 1, 1_000_000_000L}) {
            MockHttpServletResponse response = new MockHttpServletResponse();
            RateLimitFilter.escribirDemasiadasPeticiones(response,
                    io.github.bucket4j.ConsumptionProbe.rejected(0, waitNanos, 0));
            assertEquals("1", response.getHeader("Retry-After"));
        }
    }

    @Test
    void rutaNoProtegida_noFiltra() throws Exception {
        RateLimitFilter filter = new RateLimitFilter(1, 60, 30, 60);
        MockHttpServletRequest req = new MockHttpServletRequest();
        req.setRequestURI("/api/v1/productos");
        req.setMethod("GET");
        req.setRemoteAddr("10.0.0.9");
        MockHttpServletResponse res = new MockHttpServletResponse();

        // Capacidad 1 pero ruta no protegida: no debe consumir ni bloquear.
        filter.doFilter(req, res, chain);
        filter.doFilter(req, res, chain);

        assertEquals(200, res.getStatus());
    }
}
