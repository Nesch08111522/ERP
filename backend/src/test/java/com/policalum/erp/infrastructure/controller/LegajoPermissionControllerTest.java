package com.policalum.erp.infrastructure.controller;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.policalum.erp.application.service.LegajoService;
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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(LegajoController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({SecurityConfig.class, RolePermissionGuard.class})
class LegajoPermissionControllerTest {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    LegajoService legajoService;

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    @WithMockUser(username = "admin@policalum.com", roles = "ADMIN")
    void gestionarLegajosNoConcedePermisoParaConsultarDatosLaborales() throws Exception {
        User admin = User.builder()
                .rol(Rol.builder()
                        .nombre(RolNombre.ROLE_ADMIN)
                        .permisosJson(Map.of("rrhh", Map.of("ver_legajos", false, "gestionar_legajos", true)))
                        .build())
                .build();
        when(userRepository.findPerfilByEmail("admin@policalum.com")).thenReturn(Optional.of(admin));

        mvc.perform(get("/api/v1/rrhh/legajos/00000000-0000-0000-0000-000000000001"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(legajoService);
    }

    @Test
    @WithMockUser(roles = "MULTIFUNCIONAL")
    void empleadoPuedeConservarLaConsultaDeSuPropioLegajo() throws Exception {
        mvc.perform(get("/api/v1/rrhh/legajos/me"))
                .andExpect(status().isOk());
    }
}
