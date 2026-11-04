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

    public boolean permite(Authentication authentication, String modulo, String accion) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            return false;
        }
        User user = userRepository.findPerfilByEmail(authentication.getName()).orElse(null);
        Rol role = user == null ? null : user.getRol();
        if (role == null || role.getNombre() == null) return false;

        Map<String, Object> permisos = role.getPermisosJson();
        if (permisos == null || !permisos.containsKey(modulo)) {
            return role.getNombre() == RolNombre.ROLE_ADMIN;
        }

        Object configuracion = permisos.get(modulo);
        if (Boolean.TRUE.equals(configuracion)) return true;
        if (configuracion instanceof Map<?, ?> acciones) {
            return Boolean.TRUE.equals(acciones.get(accion));
        }
        if (configuracion instanceof Collection<?> acciones) {
            return acciones.contains(accion);
        }
        return false;
    }

    public boolean permiteExportacion(Authentication authentication, String modulo) {
        return switch (modulo == null ? "" : modulo) {
            case "clientes" -> permite(authentication, "clientes", "leer");
            case "productos" -> permite(authentication, "productos", "leer");
            case "stock", "kardex" -> permite(authentication, "inventario", "leer");
            case "ventas" -> permite(authentication, "ventas", "leer");
            case "compras" -> permite(authentication, "compras", "leer");
            case "proveedores" -> permite(authentication, "proveedores", "leer");
            case "gastos" -> permite(authentication, "finanzas", "ver_reportes");
            case "rrhh" -> permite(authentication, "rrhh", "ver_nominas");
            case "reporte_ventas", "reporte_rentabilidad", "reporte_estrella",
                    "reporte_clientes", "reporte_proveedores", "reporte_arqueos" ->
                    permite(authentication, "finanzas", "ver_reportes");
            default -> false;
        };
    }
}
