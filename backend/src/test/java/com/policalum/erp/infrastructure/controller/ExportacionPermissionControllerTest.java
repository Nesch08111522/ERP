package com.policalum.erp.infrastructure.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.policalum.erp.application.service.serviceImpl.ExportacionServiceImpl;
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

@WebMvcTest(ExportacionController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({SecurityConfig.class, RolePermissionGuard.class})
class ExportacionPermissionControllerTest {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    ExportacionServiceImpl exportacion;

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    @WithMockUser(username = "operador@policalum.com", roles = "MULTIFUNCIONAL")
    void noPuedeExportarNominasConPermisoDeVentas() throws Exception {
        when(userRepository.findPerfilByEmail("operador@policalum.com")).thenReturn(Optional.of(user(
                Map.of(
                        "ventas", Map.of("leer", true),
                        "rrhh", Map.of("ver_nominas", false)))));

        mvc.perform(get("/api/v1/exportacion").param("modulo", "rrhh"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(exportacion);
    }

    @Test
    @WithMockUser(username = "operador@policalum.com", roles = "MULTIFUNCIONAL")
    void permiteExportarVentasConPermisoDeLectura() throws Exception {
        when(userRepository.findPerfilByEmail("operador@policalum.com")).thenReturn(Optional.of(user(
                Map.of("ventas", Map.of("leer", true)))));
        when(exportacion.generar("ventas", "xlsx", null)).thenReturn(new byte[]{1, 2, 3});

        mvc.perform(get("/api/v1/exportacion").param("modulo", "ventas"))
                .andExpect(status().isOk());

        verify(exportacion).generar("ventas", "xlsx", null);
    }

    private User user(Map<String, Object> permisos) {
        return User.builder()
                .rol(Rol.builder()
                        .nombre(RolNombre.ROLE_MULTIFUNCIONAL)
                        .permisosJson(permisos)
                        .build())
                .build();
    }
}
