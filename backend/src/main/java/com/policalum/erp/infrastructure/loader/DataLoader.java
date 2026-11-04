package com.policalum.erp.infrastructure.loader;

import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.model.Rol;
import com.policalum.erp.domain.model.Sede;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.infrastructure.repository.RolRepository;
import com.policalum.erp.infrastructure.repository.SedeRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;
import com.policalum.erp.application.service.TotpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@Order(0)
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RolRepository rolRepository;
    private final SedeRepository sedeRepository;
    private final PasswordEncoder passwordEncoder;
    private final TotpService totpService;  // ← INYECTAR TotpService

    // ID de la sede existente
    private static final UUID SEDE_ID = UUID.fromString("2c0d98ec-1680-4662-a9af-e66d23e44345");

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("🔄 Iniciando carga de datos iniciales...");

        // 1. Crear roles si no existen
        crearRoles();

        // 2. Usar la sede histórica o crear una si la base está vacía
        Sede sede = obtenerOCrearSede();

        // 3. Crear usuarios por defecto
        crearUsuarios(sede);

        log.info("✅ Carga de datos iniciales completada.");
    }

    private void crearRoles() {
        crearRolSiNoExiste(RolNombre.ROLE_ADMIN, crearPermisosAdmin());
        crearRolSiNoExiste(RolNombre.ROLE_MULTIFUNCIONAL, crearPermisosMultifuncional());
    }

    private void crearRolSiNoExiste(RolNombre nombre, Map<String, Object> permisosJson) {
        Rol existente = rolRepository.findAll().stream()
                .filter(rol -> rol.getNombre() == nombre)
                .findFirst()
                .orElse(null);

        if (existente == null) {
            Rol rol = Rol.builder()
                    .nombre(nombre)
                    .permisosJson(permisosJson)
                    .build();
            rolRepository.save(rol);
            log.info("✅ Rol creado: {}", nombre);
        } else if (nombre == RolNombre.ROLE_MULTIFUNCIONAL || nombre == RolNombre.ROLE_ADMIN) {
            Map<String, Object> actuales = existente.getPermisosJson() == null
                    ? new HashMap<>()
                    : new HashMap<>(existente.getPermisosJson());
            boolean actualizado = false;
            for (Map.Entry<String, Object> permiso : permisosJson.entrySet()) {
                if (!actuales.containsKey(permiso.getKey())) {
                    actuales.put(permiso.getKey(), permiso.getValue());
                    actualizado = true;
                    continue;
                }

                Object actualModulo = actuales.get(permiso.getKey());
                if (actualModulo instanceof Map<?, ?> accionesActuales
                        && permiso.getValue() instanceof Map<?, ?> accionesPorDefecto) {
                    Map<String, Object> accionesCompletas = new HashMap<>();
                    for (Map.Entry<?, ?> accion : accionesActuales.entrySet()) {
                        if (accion.getKey() instanceof String nombreAccion) {
                            accionesCompletas.put(nombreAccion, accion.getValue());
                        }
                    }
                    for (Map.Entry<?, ?> accion : accionesPorDefecto.entrySet()) {
                        if (accion.getKey() instanceof String nombreAccion && !accionesCompletas.containsKey(nombreAccion)) {
                            accionesCompletas.put(nombreAccion, accion.getValue());
                            actualizado = true;
                        }
                    }
                    actuales.put(permiso.getKey(), accionesCompletas);
                }
            }
            if (actualizado) {
                existente.setPermisosJson(actuales);
                rolRepository.save(existente);
                log.info("✅ Permisos por defecto completados para: {}", nombre);
            } else {
                log.debug("ℹ️ Rol ya existe: {}", nombre);
            }
        } else {
            log.debug("ℹ️ Rol ya existe: {}", nombre);
        }
    }

    private Map<String, Object> crearPermisosAdmin() {
        Map<String, Object> permisos = new HashMap<>();

        Map<String, Boolean> sedesPermisos = new HashMap<>();
        sedesPermisos.put("leer", true);
        sedesPermisos.put("crear", true);
        sedesPermisos.put("editar", true);
        sedesPermisos.put("eliminar", true);
        permisos.put("sedes", sedesPermisos);

        Map<String, Boolean> finanzasPermisos = new HashMap<>();
        finanzasPermisos.put("ver_reportes", true);
        finanzasPermisos.put("aprobar_pagos", true);
        permisos.put("finanzas", finanzasPermisos);

        Map<String, Boolean> usuariosPermisos = new HashMap<>();
        usuariosPermisos.put("leer", true);
        usuariosPermisos.put("crear", true);
        usuariosPermisos.put("eliminar", false);
        permisos.put("usuarios", usuariosPermisos);

        Map<String, Boolean> rrhhPermisos = new HashMap<>();
        rrhhPermisos.put("ver_legajos", true);
        rrhhPermisos.put("gestionar_legajos", true);
        rrhhPermisos.put("ver_nominas", true);
        rrhhPermisos.put("gestionar_nominas", true);
        rrhhPermisos.put("ver_turnos", true);
        rrhhPermisos.put("gestionar_turnos", true);
        rrhhPermisos.put("ver_mi_rrhh", true);
        permisos.put("rrhh", rrhhPermisos);

        Map<String, Boolean> mensajesWebPermisos = new HashMap<>();
        mensajesWebPermisos.put("leer", true);
        mensajesWebPermisos.put("responder", true);
        mensajesWebPermisos.put("gestionar", true);
        permisos.put("mensajes_web", mensajesWebPermisos);

        Map<String, Boolean> notificacionesPermisos = new HashMap<>();
        notificacionesPermisos.put("leer", true);
        notificacionesPermisos.put("gestionar", true);
        permisos.put("notificaciones", notificacionesPermisos);

        Map<String, Boolean> sitioWebPermisos = new HashMap<>();
        sitioWebPermisos.put("leer", true);
        sitioWebPermisos.put("configurar", true);
        sitioWebPermisos.put("gestionar_catalogo", true);
        sitioWebPermisos.put("gestionar_portafolio", true);
        permisos.put("sitio_web", sitioWebPermisos);

        Map<String, Boolean> despachosPermisos = new HashMap<>();
        despachosPermisos.put("leer", true);
        despachosPermisos.put("crear", true);
        despachosPermisos.put("asignar", true);
        despachosPermisos.put("cambiar_estado", true);
        despachosPermisos.put("registrar_entrega", true);
        permisos.put("despachos", despachosPermisos);

        Map<String, Boolean> movilidadesPermisos = new HashMap<>();
        movilidadesPermisos.put("leer", true);
        movilidadesPermisos.put("crear", true);
        movilidadesPermisos.put("editar", true);
        movilidadesPermisos.put("eliminar", true);
        movilidadesPermisos.put("asignar_conductor", true);
        permisos.put("movilidades", movilidadesPermisos);

        Map<String, Boolean> cotizacionesPermisos = new HashMap<>();
        cotizacionesPermisos.put("leer", true);
        cotizacionesPermisos.put("crear", true);
        cotizacionesPermisos.put("editar", true);
        cotizacionesPermisos.put("eliminar", true);
        cotizacionesPermisos.put("convertir", true);
        permisos.put("cotizaciones", cotizacionesPermisos);

        Map<String, Boolean> preformasPermisos = new HashMap<>();
        preformasPermisos.put("leer", true);
        preformasPermisos.put("crear", true);
        preformasPermisos.put("editar", true);
        preformasPermisos.put("eliminar", true);
        preformasPermisos.put("confirmar", true);
        preformasPermisos.put("cancelar", true);
        permisos.put("preformas", preformasPermisos);

        Map<String, Boolean> devolucionesPermisos = new HashMap<>();
        devolucionesPermisos.put("leer", true);
        devolucionesPermisos.put("crear", true);
        devolucionesPermisos.put("aprobar", true);
        devolucionesPermisos.put("rechazar", true);
        devolucionesPermisos.put("procesar_reembolso", true);
        permisos.put("devoluciones", devolucionesPermisos);

        return permisos;
    }

    private Map<String, Object> crearPermisosMultifuncional() {
        Map<String, Object> permisos = new HashMap<>();

        Map<String, Boolean> sedesPermisos = new HashMap<>();
        sedesPermisos.put("leer", true);
        sedesPermisos.put("crear", false);
        sedesPermisos.put("editar", false);
        sedesPermisos.put("eliminar", false);
        permisos.put("sedes", sedesPermisos);

        Map<String, Boolean> rrhhPermisos = new HashMap<>();
        rrhhPermisos.put("ver_legajos", false);
        rrhhPermisos.put("gestionar_legajos", false);
        rrhhPermisos.put("ver_nominas", false);
        rrhhPermisos.put("gestionar_nominas", false);
        rrhhPermisos.put("ver_turnos", false);
        rrhhPermisos.put("gestionar_turnos", false);
        rrhhPermisos.put("ver_mi_rrhh", true);
        permisos.put("rrhh", rrhhPermisos);

        Map<String, Boolean> asistenciaPermisos = new HashMap<>();
        asistenciaPermisos.put("marcar", true);
        asistenciaPermisos.put("ver_mis_marcaciones", true);
        permisos.put("asistencia", asistenciaPermisos);

        permisos.put("productos", permisosCrud());
        permisos.put("servicios", permisosCrud());
        permisos.put("categorias", permisosCrud());
        permisos.put("fracciones", permisosCrud());
        permisos.put("almacenes", permisosCrud());

        Map<String, Boolean> inventarioPermisos = new HashMap<>();
        inventarioPermisos.put("leer", true);
        inventarioPermisos.put("ajustar", true);
        inventarioPermisos.put("transferir", true);
        permisos.put("inventario", inventarioPermisos);
        permisos.put("clientes", permisosCrud());
        permisos.put("proveedores", permisosCrud());

        Map<String, Boolean> comprasPermisos = new HashMap<>();
        comprasPermisos.put("leer", true);
        comprasPermisos.put("crear", true);
        comprasPermisos.put("editar", true);
        comprasPermisos.put("recibir", true);
        comprasPermisos.put("anular", true);
        comprasPermisos.put("eliminar", true);
        permisos.put("compras", comprasPermisos);

        Map<String, Boolean> ventasPermisos = new HashMap<>();
        ventasPermisos.put("leer", true);
        ventasPermisos.put("crear", true);
        ventasPermisos.put("anular", true);
        permisos.put("ventas", ventasPermisos);

        Map<String, Boolean> cotizacionesPermisos = new HashMap<>();
        cotizacionesPermisos.put("leer", true);
        cotizacionesPermisos.put("crear", true);
        cotizacionesPermisos.put("editar", true);
        cotizacionesPermisos.put("eliminar", true);
        cotizacionesPermisos.put("convertir", true);
        permisos.put("cotizaciones", cotizacionesPermisos);

        Map<String, Boolean> preformasPermisos = new HashMap<>();
        preformasPermisos.put("leer", true);
        preformasPermisos.put("crear", true);
        preformasPermisos.put("editar", true);
        preformasPermisos.put("eliminar", true);
        preformasPermisos.put("confirmar", true);
        preformasPermisos.put("cancelar", true);
        permisos.put("preformas", preformasPermisos);

        Map<String, Boolean> devolucionesPermisos = new HashMap<>();
        devolucionesPermisos.put("leer", true);
        devolucionesPermisos.put("crear", true);
        devolucionesPermisos.put("aprobar", false);
        devolucionesPermisos.put("rechazar", false);
        devolucionesPermisos.put("procesar_reembolso", false);
        permisos.put("devoluciones", devolucionesPermisos);

        Map<String, Boolean> mensajesWebPermisos = new HashMap<>();
        mensajesWebPermisos.put("leer", true);
        mensajesWebPermisos.put("responder", true);
        mensajesWebPermisos.put("gestionar", true);
        permisos.put("mensajes_web", mensajesWebPermisos);

        Map<String, Boolean> notificacionesPermisos = new HashMap<>();
        notificacionesPermisos.put("leer", true);
        notificacionesPermisos.put("gestionar", true);
        permisos.put("notificaciones", notificacionesPermisos);

        Map<String, Boolean> sitioWebPermisos = new HashMap<>();
        sitioWebPermisos.put("leer", true);
        sitioWebPermisos.put("configurar", false);
        sitioWebPermisos.put("gestionar_catalogo", false);
        sitioWebPermisos.put("gestionar_portafolio", false);
        permisos.put("sitio_web", sitioWebPermisos);

        Map<String, Boolean> despachosPermisos = new HashMap<>();
        despachosPermisos.put("leer", true);
        despachosPermisos.put("crear", true);
        despachosPermisos.put("asignar", true);
        despachosPermisos.put("cambiar_estado", true);
        despachosPermisos.put("registrar_entrega", true);
        permisos.put("despachos", despachosPermisos);

        Map<String, Boolean> movilidadesPermisos = new HashMap<>();
        movilidadesPermisos.put("leer", true);
        movilidadesPermisos.put("crear", false);
        movilidadesPermisos.put("editar", false);
        movilidadesPermisos.put("eliminar", false);
        movilidadesPermisos.put("asignar_conductor", false);
        permisos.put("movilidades", movilidadesPermisos);

        Map<String, Boolean> cajaPermisos = new HashMap<>();
        cajaPermisos.put("leer", true);
        cajaPermisos.put("abrir", true);
        cajaPermisos.put("registrar_movimiento", true);
        cajaPermisos.put("cerrar", true);
        permisos.put("caja", cajaPermisos);

        return permisos;
    }

    private Map<String, Boolean> permisosCrud() {
        Map<String, Boolean> permisos = new HashMap<>();
        permisos.put("leer", true);
        permisos.put("crear", true);
        permisos.put("editar", true);
        permisos.put("eliminar", true);
        return permisos;
    }

    private Sede obtenerOCrearSede() {
        return sedeRepository.findById(SEDE_ID).orElseGet(() -> {
            if (sedeRepository.count() > 0) {
                Sede existente = sedeRepository.findAll().get(0);
                log.info("Sede de trabajo: {} - {}", existente.getId(), existente.getNombre());
                return existente;
            }
            Sede sede = Sede.builder()
                    .nombre("Sede Principal")
                    .pais("Perú")
                    .ciudad("Lima")
                    .direccion("Av. Principal 100")
                    .celularSede("999000000")
                    .moneda("PEN")
                    .activa(true)
                    .build();
            sede.setId(SEDE_ID);
            Sede guardada = sedeRepository.save(sede);
            log.info("Sede inicial creada: {} - {}", guardada.getId(), guardada.getNombre());
            return guardada;
        });
    }

    private void crearUsuarios(Sede sede) {
        // Obtener roles
        Rol adminRol = rolRepository.findAll().stream()
                .filter(r -> r.getNombre() == RolNombre.ROLE_ADMIN)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Rol ADMIN no encontrado"));

        Rol multifuncionalRol = rolRepository.findAll().stream()
                .filter(r -> r.getNombre() == RolNombre.ROLE_MULTIFUNCIONAL)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Rol MULTIFUNCIONAL no encontrado"));

        // 1. Crear usuario ADMIN
        crearUsuarioSiNoExiste(
                "admin@policalum.com",
                "Admin",
                "Sistema",
                "admin",
                "admin123",
                "+51 987654321",
                adminRol,
                sede,
                true
        );

        // 2. Crear usuario MULTIFUNCIONAL (empleado)
        crearUsuarioSiNoExiste(
                "empleado@policalum.com",
                "Empleado",
                "Demo",
                "empleado",
                "empleado123",
                "+51 987654322",
                multifuncionalRol,
                sede,
                true
        );
    }

    private void crearUsuarioSiNoExiste(
            String email,
            String nombre,
            String apellido,
            String nombreUsuario,
            String passwordRaw,
            String celular,
            Rol rol,
            Sede sede,
            boolean activo) {

        // Verificar si el usuario ya existe por email
        if (userRepository.findByEmail(email).isPresent()) {
            log.debug("ℹ️ Usuario ya existe: {}", email);
            return;
        }

        // Verificar si el usuario ya existe por nombre de usuario
        boolean existeNombreUsuario = userRepository.findAll().stream()
                .anyMatch(u -> nombreUsuario.equals(u.getNombreUsuario()));

        if (existeNombreUsuario) {
            log.debug("ℹ️ Usuario ya existe: {}", nombreUsuario);
            return;
        }

        // ✅ GENERAR SECRETO TOTP
        String totpSecret = totpService.generateSecret();
        log.info("Secreto TOTP generado para {}", email);

        // Crear nuevo usuario con TOTP configurado
        User user = User.builder()
                .email(email)
                .nombre(nombre)
                .apellido(apellido)
                .nombreUsuario(nombreUsuario)
                .passwordHash(passwordEncoder.encode(passwordRaw))
                .celular(celular)
                .rol(rol)
                .sede(sede)
                .activo(activo)
                .totpEnabled(true)          // ✅ HABILITAR TOTP
                .totpSecret(totpSecret)     // ✅ ASIGNAR SECRETO
                .build();

        userRepository.save(user);
        log.info("✅ Usuario creado: {} - {} (Rol: {}) - TOTP configurado: ✅",
                email, nombreUsuario, rol.getNombre());
    }
}