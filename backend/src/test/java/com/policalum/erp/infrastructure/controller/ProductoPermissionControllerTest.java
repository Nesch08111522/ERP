package com.policalum.erp.infrastructure.controller;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.clearInvocations;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.policalum.erp.application.service.ProductoImportacionService;
import com.policalum.erp.application.service.ProductoService;
import com.policalum.erp.application.service.StockService;
import com.policalum.erp.application.service.serviceImpl.ProductoImagenService;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.model.Rol;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.infrastructure.repository.UserRepository;
import com.policalum.erp.infrastructure.security.JwtAuthenticationEntryPoint;
import com.policalum.erp.infrastructure.security.RateLimitService;
import com.policalum.erp.infrastructure.security.JwtAuthenticationFilter;
import com.policalum.erp.infrastructure.security.RolePermissionGuard;
import com.policalum.erp.infrastructure.security.SecurityConfig;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ProductoController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({SecurityConfig.class, RolePermissionGuard.class})
class ProductoPermissionControllerTest {

    @Autowired
    MockMvc mvc;
    @MockitoBean
    RateLimitService rateLimitService;

    @MockitoBean
    ProductoService productoService;

    @MockitoBean
    ProductoImportacionService productoImportacionService;

    @MockitoBean
    ProductoImagenService productoImagenService;

    /** ProductoController recibe StockService como parametro 3; sin este bean el contexto no arranca. */
    @MockitoBean
    StockService stockService;

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    @WithMockUser(username = "operador@policalum.com", roles = "MULTIFUNCIONAL")
    void separaPermisosDeLecturaYCreacionDeProductos() throws Exception {
        User operador = User.builder()
                .rol(Rol.builder()
                        .nombre(RolNombre.ROLE_MULTIFUNCIONAL)
                        .permisosJson(Map.of("productos", Map.of("leer", true, "crear", false)))
                        .build())
                .build();
        org.mockito.Mockito.when(userRepository.findPerfilByEmail("operador@policalum.com"))
                .thenReturn(Optional.of(operador));

        mvc.perform(get("/api/v1/productos"))
                .andExpect(status().isOk());

        clearInvocations(productoService);
        mvc.perform(post("/api/v1/productos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nombre": "Producto de prueba",
                                  "tipo": "FISICO",
                                  "precioCompra": 1,
                                  "precioVentaBase": 2,
                                  "esFraccionable": false,
                                  "activo": true
                                }
                                """))
                .andExpect(status().isForbidden());

        verifyNoInteractions(productoService, productoImportacionService, productoImagenService);
    }
}
