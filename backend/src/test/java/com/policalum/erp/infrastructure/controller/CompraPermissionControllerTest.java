package com.policalum.erp.infrastructure.controller;

import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.policalum.erp.application.service.CompraAdjuntoService;
import com.policalum.erp.application.service.CompraService;
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
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CompraController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({SecurityConfig.class, RolePermissionGuard.class})
class CompraPermissionControllerTest {

    @Autowired
    MockMvc mvc;
    @MockitoBean
    RateLimitService rateLimitService;

    @MockitoBean
    CompraService compraService;

    @MockitoBean
    CompraAdjuntoService adjuntoService;

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    @WithMockUser(username = "operador@policalum.com", roles = "MULTIFUNCIONAL")
    void consultarComprasNoConcedePermisoParaRecibirlas() throws Exception {
        // El recorte de permisos se comprueba con MULTIFUNCIONAL: el guard trata a ADMIN como
        // irrestricto a propósito (paso 4, y DataLoader lo define con todo true), así que un
        // false explícito no lo bloquea y este test no estaría probando el permiso.
        User operador = User.builder()
                .rol(Rol.builder()
                        .nombre(RolNombre.ROLE_MULTIFUNCIONAL)
                        .permisosJson(Map.of("compras", Map.of("leer", true, "recibir", false)))
                        .build())
                .build();
        when(userRepository.findPerfilByEmail("operador@policalum.com")).thenReturn(Optional.of(operador));

        mvc.perform(get("/api/v1/compras"))
                .andExpect(status().isOk());

        clearInvocations(compraService, adjuntoService);
        mvc.perform(post("/api/v1/compras/" + UUID.randomUUID() + "/recepcion"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(compraService, adjuntoService);
    }
}
