package com.policalum.erp.infrastructure.controller;

import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.policalum.erp.application.service.TurnoCajaService;
import com.policalum.erp.application.service.serviceImpl.CajaChicaServiceImpl;
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
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(TurnoCajaController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({SecurityConfig.class, RolePermissionGuard.class})
class TurnoCajaPermissionControllerTest {

    @Autowired
    MockMvc mvc;
    @MockitoBean
    RateLimitService rateLimitService;

    @MockitoBean
    TurnoCajaService turnoService;

    @MockitoBean
    CajaChicaServiceImpl cajaChicaService;

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    @WithMockUser(username = "operador@policalum.com", roles = "MULTIFUNCIONAL")
    void consultarEstadoDeCajaNoConcedePermisoParaAbrirTurno() throws Exception {
        User operador = User.builder()
                .rol(Rol.builder()
                        .nombre(RolNombre.ROLE_MULTIFUNCIONAL)
                        .permisosJson(Map.of("caja", Map.of("leer", true, "abrir", false)))
                        .build())
                .build();
        when(userRepository.findPerfilByEmail("operador@policalum.com")).thenReturn(Optional.of(operador));

        mvc.perform(get("/api/v1/turnos-caja/abierto"))
                .andExpect(status().isOk());

        clearInvocations(turnoService, cajaChicaService);
        mvc.perform(post("/api/v1/turnos-caja")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "sedeId": "%s",
                                  "montoInicial": 0,
                                  "observaciones": "Apertura de prueba"
                                }
                                """.formatted(UUID.randomUUID())))
                .andExpect(status().isForbidden());

        verifyNoInteractions(turnoService, cajaChicaService);
    }
}
