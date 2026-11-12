package com.policalum.erp.infrastructure.controller;

import static org.mockito.Mockito.clearInvocations;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.policalum.erp.application.service.UserService;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.model.Rol;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.infrastructure.repository.UserRepository;
import com.policalum.erp.infrastructure.security.JwtAuthenticationEntryPoint;
import com.policalum.erp.infrastructure.security.RateLimitService;
import com.policalum.erp.infrastructure.security.JwtAuthenticationFilter;
import com.policalum.erp.infrastructure.security.RolePermissionGuard;
import com.policalum.erp.infrastructure.security.SecurityConfig;
import java.util.HashMap;
import java.util.List;
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
import org.springframework.http.MediaType;
import java.util.UUID;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({SecurityConfig.class, RolePermissionGuard.class})
class UserPermissionControllerTest {

    @Autowired
    MockMvc mvc;
    @MockitoBean
    RateLimitService rateLimitService;

    @MockitoBean
    UserService userService;

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    /**
     * Usuarios es un módulo cerrado por ROL a nivel de clase (`hasRole('ADMIN')`): un
     * MULTIFUNCIONAL no puede ni listar. Esa es la frontera que importa aquí, y es lo que
     * comprueba el segundo caso.
     *
     * El primer caso deja constancia de la decisión del 2026-11-06: un `false` explícito en el
     * mapa de permisos NO recorta al ADMIN (RolePermissionGuard paso 4; DataLoader define ADMIN
     * como "dios: todo true"). Por eso con `leer=false` el administrador sigue obteniendo 200.
     * La UI de Roles ya no permite editar los permisos de ROLE_ADMIN para no ofrecer un control
     * que no tiene efecto.
     */
    @Test
    @WithMockUser(username = "admin@policalum.com", roles = "ADMIN")
    void administradorNoSeRecortaPorUnFalseExplicitoEnElMapa() throws Exception {
        Map<String, Object> permisos = new HashMap<>();
        Map<String, Boolean> permisosUsuarios = new HashMap<>();
        permisosUsuarios.put("leer", true);
        permisos.put("usuarios", permisosUsuarios);
        User admin = User.builder().rol(Rol.builder().nombre(RolNombre.ROLE_ADMIN).permisosJson(permisos).build()).build();
        when(userRepository.findPerfilByEmail("admin@policalum.com")).thenReturn(Optional.of(admin));
        when(userService.getUsers()).thenReturn(List.of());

        mvc.perform(get("/api/v1/users")).andExpect(status().isOk());

        // Con el permiso apagado, el ADMIN conserva el acceso: el rol decide antes que el mapa.
        permisosUsuarios.put("leer", false);
        mvc.perform(get("/api/v1/users")).andExpect(status().isOk());
    }

    @Test
    @WithMockUser(username = "operador@policalum.com", roles = "MULTIFUNCIONAL")
    void multifuncionalNoPuedeNiListarUsuarios() throws Exception {
        clearInvocations(userService);

        mvc.perform(get("/api/v1/users")).andExpect(status().isForbidden());

        verifyNoInteractions(userService);
    }

    @Test
    @WithMockUser(username = "operador@policalum.com", roles = "MULTIFUNCIONAL")
    void actualizarUsuarioNoUsaElPermisoCrearComoSustitutoDeEditar() throws Exception {
        Map<String, Object> permisos = new HashMap<>();
        permisos.put("usuarios", Map.of("crear", true, "editar", false));
        User operador = User.builder().rol(Rol.builder().nombre(RolNombre.ROLE_MULTIFUNCIONAL).permisosJson(permisos).build()).build();
        when(userRepository.findPerfilByEmail("operador@policalum.com")).thenReturn(Optional.of(operador));

        mvc.perform(put("/api/v1/users/" + UUID.randomUUID())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "rol": {},
                                  "sede": {},
                                  "nombreUsuario": "usuario_prueba",
                                  "nombre": "Ana",
                                  "apellido": "Ruiz",
                                  "email": "ana.prueba@policalum.com",
                                  "passwordHash": "ClaveSegura1!",
                                  "celular": "987654321",
                                  "activo": true
                                }
                                """))
                .andExpect(status().isForbidden());
    }
}
