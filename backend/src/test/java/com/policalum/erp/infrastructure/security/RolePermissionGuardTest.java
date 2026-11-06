package com.policalum.erp.infrastructure.security;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.model.Rol;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.infrastructure.repository.UserRepository;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

class RolePermissionGuardTest {

    private final UserRepository users = mock(UserRepository.class);
    private final RolePermissionGuard guard = new RolePermissionGuard(users);

    @Test
    void permiteSoloAccionesExpresamenteActivadas() {
        Authentication authentication = authentication("operador@policalum.com");
        when(users.findPerfilByEmail("operador@policalum.com")).thenReturn(Optional.of(user(
                RolNombre.ROLE_MULTIFUNCIONAL, Map.of("asistencia", Map.of("marcar", true, "ver_mis_marcaciones", false)))));

        assertTrue(guard.permite(authentication, "asistencia", "marcar"));
        assertFalse(guard.permite(authentication, "asistencia", "ver_mis_marcaciones"));
        assertFalse(guard.permite(authentication, "finanzas", "aprobar_pagos"));
    }

    @Test
    void administradorSinGrupoDePermisosMantieneAccesoPreexistente() {
        Authentication authentication = authentication("admin@policalum.com");
        when(users.findPerfilByEmail("admin@policalum.com")).thenReturn(Optional.of(user(
                RolNombre.ROLE_ADMIN, Map.of("finanzas", Map.of("ver_reportes", false)))));

        assertTrue(guard.permite(authentication, "asistencia", "marcar"));
        assertFalse(guard.permite(authentication, "finanzas", "ver_reportes"));
    }

    @Test
    void autenticacionSinUsuarioNoAutoriza() {
        Authentication authentication = authentication("inexistente@policalum.com");
        when(users.findPerfilByEmail("inexistente@policalum.com")).thenReturn(Optional.empty());

        assertFalse(guard.permite(authentication, "asistencia", "marcar"));
    }

    @Test
    void exportacionExigePermisoDeLecturaDelModuloCorrespondiente() {
        Authentication authentication = authentication("operador@policalum.com");
        when(users.findPerfilByEmail("operador@policalum.com")).thenReturn(Optional.of(user(
                RolNombre.ROLE_MULTIFUNCIONAL,
                Map.of(
                        "ventas", Map.of("leer", true),
                        "inventario", Map.of("leer", false),
                        "rrhh", Map.of("ver_nominas", false),
                        "finanzas", Map.of("ver_reportes", true)))));

        assertTrue(guard.permiteExportacion(authentication, "ventas"));
        assertTrue(guard.permiteExportacion(authentication, "reporte_rentabilidad"));
        assertTrue(guard.permiteExportacion(authentication, "reporte_arqueos"));
        assertFalse(guard.permiteExportacion(authentication, "kardex"));
        assertFalse(guard.permiteExportacion(authentication, "rrhh"));
        assertFalse(guard.permiteExportacion(authentication, "modulo-desconocido"));
    }

    private Authentication authentication(String email) {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn(email);
        return authentication;
    }

    private User user(RolNombre nombre, Map<String, Object> permissions) {
        return User.builder().rol(Rol.builder().nombre(nombre).permisosJson(permissions).build()).build();
    }

    @Test
void administradorSiempreTieneAccesoCompleto() {
    Authentication authentication = authentication("admin@policalum.com");
    // Aunque el rol tenga permisosJson vacíos o con false, ADMIN siempre pasa.
    when(users.findPerfilByEmail("admin@policalum.com")).thenReturn(Optional.of(user(
            RolNombre.ROLE_ADMIN, Map.of())));

    assertTrue(guard.permite(authentication, "asistencia", "marcar"));
    assertTrue(guard.permite(authentication, "finanzas", "ver_reportes"));
    assertTrue(guard.permite(authentication, "modulo-que-no-existe", "accion-cualquiera"));
}
}
