package com.policalum.erp.infrastructure.controller;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.policalum.erp.application.service.OrdenDespachoService;
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

@WebMvcTest(OrdenDespachoController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({SecurityConfig.class, RolePermissionGuard.class})
class DespachoPermissionControllerTest {

    @Autowired
    MockMvc mvc;
    @MockitoBean
    RateLimitService rateLimitService;

    @MockitoBean
    OrdenDespachoService despachoService;

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    @WithMockUser(username = "operador@policalum.com", roles = "MULTIFUNCIONAL")
    void crearDespachoRequierePermisoDelModulo() throws Exception {
        User operador = User.builder()
                .rol(Rol.builder()
                        .nombre(RolNombre.ROLE_MULTIFUNCIONAL)
                        .permisosJson(Map.of(
                                "despachos", Map.of("leer", true, "crear", false),
                                "ventas", Map.of("leer", true)))
                        .build())
                .build();
        when(userRepository.findPerfilByEmail("operador@policalum.com")).thenReturn(Optional.of(operador));

        mvc.perform(post("/api/v1/despachos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "ventaId": "00000000-0000-0000-0000-000000000001",
                                  "direccionEntrega": "Av. Principal 123"
                                }
                                """))
                .andExpect(status().isForbidden());

        verifyNoInteractions(despachoService);
    }
}
