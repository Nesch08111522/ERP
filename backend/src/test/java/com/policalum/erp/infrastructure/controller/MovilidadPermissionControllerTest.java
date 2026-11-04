package com.policalum.erp.infrastructure.controller;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.policalum.erp.application.service.MovilidadService;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.model.Rol;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.infrastructure.repository.UserRepository;
import com.policalum.erp.infrastructure.security.JwtAuthenticationEntryPoint;
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

@WebMvcTest(MovilidadController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({SecurityConfig.class, RolePermissionGuard.class})
class MovilidadPermissionControllerTest {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    MovilidadService movilidadService;

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    @WithMockUser(username = "admin@policalum.com", roles = "ADMIN")
    void permisoDeLecturaNoConcedeCrearVehiculos() throws Exception {
        User admin = User.builder()
                .rol(Rol.builder()
                        .nombre(RolNombre.ROLE_ADMIN)
                        .permisosJson(Map.of("movilidades", Map.of(
                                "leer", true,
                                "crear", false)))
                        .build())
                .build();
        when(userRepository.findPerfilByEmail("admin@policalum.com")).thenReturn(Optional.of(admin));

        mvc.perform(post("/api/v1/movilidades")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "sedeId": "00000000-0000-0000-0000-000000000001",
                                  "placa": "ABC-123",
                                  "tipo": "MOTO"
                                }
                                """))
                .andExpect(status().isForbidden());

        verifyNoInteractions(movilidadService);
    }
}
