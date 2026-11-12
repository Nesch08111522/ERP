package com.policalum.erp.infrastructure.controller;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.clearInvocations;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.policalum.erp.application.service.ReporteService;
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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ReporteController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({SecurityConfig.class, RolePermissionGuard.class})
class ReportePermissionControllerTest {

    @Autowired
    MockMvc mvc;
    @MockitoBean
    RateLimitService rateLimitService;

    @MockitoBean
    ReporteService reporteService;

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    @WithMockUser(username = "operador@policalum.com", roles = "MULTIFUNCIONAL")
    void consultarYExportarReportesRespetanElPermisoConfigurado() throws Exception {
        User operador = User.builder()
                .rol(Rol.builder()
                        .nombre(RolNombre.ROLE_MULTIFUNCIONAL)
                        .permisosJson(Map.of("finanzas", Map.of("ver_reportes", true)))
                        .build())
                .build();
        org.mockito.Mockito.when(userRepository.findPerfilByEmail("operador@policalum.com"))
                .thenReturn(Optional.of(operador));

        mvc.perform(get("/api/v1/reportes/productos/estrella"))
                .andExpect(status().isOk());

        clearInvocations(reporteService);
        operador.getRol().setPermisosJson(Map.of("finanzas", Map.of("ver_reportes", false)));

        mvc.perform(get("/api/v1/reportes/productos/estrella"))
                .andExpect(status().isForbidden());
        mvc.perform(get("/api/v1/reportes/ventas/exportar"))
                .andExpect(status().isForbidden());
        verifyNoInteractions(reporteService);
    }
}
