
package com.policalum.erp.infrastructure.security;

import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.model.Rol;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.infrastructure.repository.UserRepository;
import java.util.Collection;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("rolePermissionGuard")
@RequiredArgsConstructor
public class RolePermissionGuard {

    private final UserRepository userRepository;

    /**
     * Verifica si el usuario autenticado tiene permiso para ejecutar
     * una acción dentro de un módulo.
     *
     * ADMIN tiene acceso completo.
     * Los demás roles respetan su configuración de permisos.
     */
    public boolean permite(
            Authentication authentication,
            String modulo,
            String accion
    ) {
        // 1. Validar autenticación.
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication.getName() == null
                || authentication.getName().isBlank()) {
            return false;
        }

        // 2. Validar parámetros.
        if (modulo == null || modulo.isBlank()
                || accion == null || accion.isBlank()) {
            return false;
        }

        // 3. Recuperar el usuario y su rol desde la base de datos.
        User user = userRepository
                .findPerfilByEmail(authentication.getName())
                .orElse(null);

        if (user == null) {
            return false;
        }

        Rol role = user.getRol();

        if (role == null || role.getNombre() == null) {
            return false;
        }

        // 4. ADMIN tiene privilegios completos en todos los módulos.
        if (role.getNombre() == RolNombre.ROLE_ADMIN) {
            return true;
        }

        // 5. Obtener los permisos configurados para los demás roles.
        Map<String, Object> permisos = role.getPermisosJson();

        if (permisos == null || !permisos.containsKey(modulo)) {
            return false;
        }

        Object configuracion = permisos.get(modulo);

        // El módulo completo está habilitado.
        if (Boolean.TRUE.equals(configuracion)) {
            return true;
        }

        // Permisos configurados como mapa:
        // { "leer": true, "crear": false }
        if (configuracion instanceof Map<?, ?> acciones) {
            return Boolean.TRUE.equals(acciones.get(accion));
        }

        // Permisos configurados como colección:
        // ["leer", "crear"]
        if (configuracion instanceof Collection<?> acciones) {
            return acciones.contains(accion);
        }

        // Cualquier configuración no reconocida se deniega.
        return false;
    }

    /**
     * Verifica los permisos de exportación según el módulo solicitado.
     */
    public boolean permiteExportacion(
            Authentication authentication,
            String modulo
    ) {
        if (modulo == null || modulo.isBlank()) {
            return false;
        }

        return switch (modulo) {
            case "clientes" ->
                    permite(authentication, "clientes", "leer");

            case "productos" ->
                    permite(authentication, "productos", "leer");

            case "stock", "kardex" ->
                    permite(authentication, "inventario", "leer");

            case "ventas" ->
                    permite(authentication, "ventas", "leer");

            case "compras" ->
                    permite(authentication, "compras", "leer");

            case "proveedores" ->
                    permite(authentication, "proveedores", "leer");

            case "gastos" ->
                    permite(authentication, "finanzas", "ver_reportes");

            case "rrhh" ->
                    permite(authentication, "rrhh", "ver_nominas");

            case "reporte_ventas",
                 "reporte_rentabilidad",
                 "reporte_estrella",
                 "reporte_clientes",
                 "reporte_proveedores",
                 "reporte_arqueos" ->
                    permite(authentication, "finanzas", "ver_reportes");

            default -> false;
        };
    }
}
