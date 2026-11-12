package com.policalum.erp.infrastructure.controller;

import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.policalum.erp.application.service.serviceImpl.CanalWebNotificador;
import com.policalum.erp.application.service.serviceImpl.ChatWebService;
import com.policalum.erp.application.service.serviceImpl.MensajeWebService;
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

@WebMvcTest(CanalWebController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({SecurityConfig.class, RolePermissionGuard.class})
class CanalWebPermissionControllerTest {

    @Autowired
    MockMvc mvc;
    @MockitoBean
    RateLimitService rateLimitService;

    @MockitoBean
    MensajeWebService mensajeService;

    @MockitoBean
    ChatWebService chatService;

    @MockitoBean
    CanalWebNotificador notificador;

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    @WithMockUser(username = "empleado@policalum.com", roles = "MULTIFUNCIONAL")
    void consultarMensajesNoConcedePermisoParaGestionarlos() throws Exception {
        User empleado = User.builder()
                .rol(Rol.builder()
                        .nombre(RolNombre.ROLE_MULTIFUNCIONAL)
                        .permisosJson(Map.of("mensajes_web", Map.of(
                                "leer", true,
                                "gestionar", false)))
                        .build())
                .build();
        when(userRepository.findPerfilByEmail("empleado@policalum.com")).thenReturn(Optional.of(empleado));

        mvc.perform(patch("/api/v1/mensajes-web/" + UUID.randomUUID() + "/gestionar"))
                .andExpect(status().isForbidden());

        verifyNoInteractions(mensajeService, chatService, notificador);
    }
}
