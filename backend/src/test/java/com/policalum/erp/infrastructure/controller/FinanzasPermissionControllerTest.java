package com.policalum.erp.infrastructure.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.policalum.erp.application.service.CuentaFinancieraService;
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

@WebMvcTest(CuentaFinancieraController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({SecurityConfig.class, RolePermissionGuard.class})
class FinanzasPermissionControllerTest {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    CuentaFinancieraService cuentaService;

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    /**
     * Finanzas está cerrado por ROL a nivel de clase (`hasRole('ADMIN')`), así que la frontera
     * real que hay que proteger es que un no-admin no entre ni a leer. Eso es lo que comprueba
     * el segundo caso.
     *
     * El primer caso documenta la decisión de política tomada el 2026-11-06: un `false` explícito
     * NO recorta al ADMIN. RolePermissionGuard sale antes, en la rama de rol (paso 4), y DataLoader
     * define los permisos de ADMIN como "dios: todo true". Por eso aquí se espera 200 y no 403:
     * la cuenta se crea aunque el mapa diga aprobar_pagos=false.
     */
    @Test
    @WithMockUser(username = "admin@policalum.com", roles = "ADMIN")
    void administradorNoSeRecortaPorUnFalseExplicitoEnElMapa() throws Exception {
        User admin = User.builder()
                .rol(Rol.builder()
                        .nombre(RolNombre.ROLE_ADMIN)
                        .permisosJson(Map.of("finanzas", Map.of("ver_reportes", true, "aprobar_pagos", false)))
                        .build())
                .build();
        when(userRepository.findPerfilByEmail("admin@policalum.com")).thenReturn(Optional.of(admin));

        mvc.perform(get("/api/v1/finanzas/cuentas"))
                .andExpect(status().isOk());

        // El controller construye el Location con creada.id(); sin stub el mock devuelve null
        // y el request terminaría en 500 en lugar de demostrar que el ADMIN sí pasa.
        java.util.UUID cuentaId = java.util.UUID.randomUUID();
        when(cuentaService.crear(any())).thenReturn(new com.policalum.erp.application.dto.response.CuentaFinancieraResponseDTO(
                cuentaId, "Cuenta de prueba", null, null, null, null, null, null, true, null, null, null));

        mvc.perform(post("/api/v1/finanzas/cuentas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nombre": "Cuenta de prueba",
                                  "tipo": "BANCO"
                                }
                                """))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(username = "operador@policalum.com", roles = "MULTIFUNCIONAL")
    void multifuncionalNoPuedeNiLeerFinanzas() throws Exception {
        mvc.perform(get("/api/v1/finanzas/cuentas"))
                .andExpect(status().isForbidden());

        clearInvocations(cuentaService);
        mvc.perform(post("/api/v1/finanzas/cuentas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nombre": "Cuenta de prueba",
                                  "tipo": "BANCO"
                                }
                                """))
                .andExpect(status().isForbidden());

        verifyNoInteractions(cuentaService);
    }
}
