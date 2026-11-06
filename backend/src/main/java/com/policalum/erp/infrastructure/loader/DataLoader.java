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
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = true)
@Order(0)
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RolRepository rolRepository;
    private final SedeRepository sedeRepository;
    private final PasswordEncoder passwordEncoder;
    private final TotpService totpService;

    private static final UUID SEDE_ID = UUID.fromString("2c0d98ec-1680-4662-a9af-e66d23e44345");

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("🔄 Iniciando carga de datos iniciales...");
        crearRoles();
        Sede sede = obtenerOCrearSede();
        crearUsuarios(sede);
        log.info("✅ Carga de datos iniciales completada.");
    }

    private void crearRoles() {
        crearRolSiNoExiste(RolNombre.ROLE_ADMIN, crearPermisosAdmin());
        crearRolSiNoExiste(RolNombre.ROLE_MULTIFUNCIONAL, crearPermisosMultifuncional());
    }

    /**
     * Si el rol no existe, lo crea. Si existe, hace merge DEEP:
     * - Agrega módulos nuevos que falten.
     * - Agrega acciones nuevas dentro de módulos existentes.
     * - NO sobreescribe valores existentes (para no pisar decisiones del ADMIN).
     *
     * IMPORTANTE: los permisos en false que ya estén en BD se respetan.
     * Para forzar la corrección completa, usar el script SQL de migración.
     */
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
            return;
        }

        Map<String, Object> actuales = existente.getPermisosJson() == null
                ? new HashMap<>()
                : deepCopy(existente.getPermisosJson());

        boolean actualizado = false;

        for (Map.Entry<String, Object> permiso : permisosJson.entrySet()) {
            String modulo = permiso.getKey();
            Object valorPorDefecto = permiso.getValue();

            if (!actuales.containsKey(modulo)) {
                actuales.put(modulo, deepCopyObject(valorPorDefecto));
                actualizado = true;
                continue;
            }

            Object actualModulo = actuales.get(modulo);
            if (actualModulo instanceof Map<?, ?> accionesActuales
                    && valorPorDefecto instanceof Map<?, ?> accionesPorDefecto) {
                Map<String, Object> accionesCompletas = new HashMap<>();
                for (Map.Entry<?, ?> accion : accionesActuales.entrySet()) {
                    if (accion.getKey() instanceof String nombreAccion) {
                        accionesCompletas.put(nombreAccion, accion.getValue());
                    }
                }
                for (Map.Entry<?, ?> accion : accionesPorDefecto.entrySet()) {
                    if (accion.getKey() instanceof String nombreAccion
                            && !accionesCompletas.containsKey(nombreAccion)) {
                        accionesCompletas.put(nombreAccion, accion.getValue());
                        actualizado = true;
                    }
                }
                actuales.put(modulo, accionesCompletas);
            }
        }

        if (actualizado) {
            existente.setPermisosJson(actuales);
            rolRepository.save(existente);
            log.info("✅ Permisos por defecto completados para: {}", nombre);
        } else {
            log.debug("ℹ️ Rol ya existe sin cambios: {}", nombre);
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> deepCopy(Map<String, Object> origen) {
        Map<String, Object> copia = new HashMap<>();
        for (Map.Entry<String, Object> entry : origen.entrySet()) {
            copia.put(entry.getKey(), deepCopyObject(entry.getValue()));
        }
        return copia;
    }

    @SuppressWarnings("unchecked")
    private Object deepCopyObject(Object valor) {
        if (valor instanceof Map<?, ?> mapa) {
            Map<String, Object> copia = new HashMap<>();
            for (Map.Entry<?, ?> entry : mapa.entrySet()) {
                if (entry.getKey() instanceof String clave) {
                    copia.put(clave, deepCopyObject(entry.getValue()));
                }
            }
            return copia;
        }
        return valor;
    }

    // ================================================================
    // PERMISOS ADMIN (dios: todo true en todos los módulos)
    // ================================================================
    private Map<String, Object> crearPermisosAdmin() {
        Map<String, Object> permisos = new HashMap<>();

        // Módulos administrativos
        permisos.put("sedes", permisosCrud());
        permisos.put("usuarios", permisosCrud());
        permisos.put("roles", permisosCrud());
        permisos.put("configuracion", permisosCrud());
        permisos.put("auditoria", permisosCrud());
        permisos.put("finanzas", permisosFinanzasAdmin());
        permisos.put("reportes", permisosReportesAdmin());

        // Módulos operativos
        permisos.put("productos", permisosCrud());
        permisos.put("servicios", permisosCrud());
        permisos.put("categorias", permisosCrud());
        permisos.put("fracciones", permisosCrud());
        permisos.put("almacenes", permisosCrud());
        permisos.put("inventario", permisosInventarioAdmin());
        permisos.put("clientes", permisosCrud());
        permisos.put("proveedores", permisosCrud());
        permisos.put("compras", permisosComprasAdmin());
        permisos.put("ventas", permisosVentasAdmin());
        permisos.put("cotizaciones", permisosCotizaciones());
        permisos.put("preformas", permisosPreformas());
        permisos.put("devoluciones", permisosDevolucionesAdmin());
        permisos.put("despachos", permisosDespachos());
        permisos.put("movilidades", permisosMovilidadesAdmin());
        permisos.put("caja", permisosCaja());

        // Módulos RRHH
        permisos.put("rrhh", permisosRrhhAdmin());
        permisos.put("asistencia", permisosAsistencia());

        // Módulos web
        permisos.put("mensajes_web", permisosMensajesWeb());
        permisos.put("notificaciones", permisosNotificaciones());
        permisos.put("sitio_web", permisosSitioWebAdmin());

        return permisos;
    }

    // ================================================================
    // PERMISOS MULTIFUNCIONAL
    // Solo vender, asistencia, ver catálogo, integrar OC, ver stock.
    // NO toca stock, NO finanzas, NO RRHH, NO configuración, NO usuarios.
    // ================================================================
    private Map<String, Object> crearPermisosMultifuncional() {
        Map<String, Object> permisos = new HashMap<>();

        // ---- Solo lectura del catálogo ----
        permisos.put("productos", permisosSoloLectura());
        permisos.put("servicios", permisosSoloLectura());
        permisos.put("categorias", permisosSoloLectura());
        permisos.put("fracciones", permisosSoloLectura());
        permisos.put("almacenes", permisosSoloLectura());

        // ---- Inventario: solo ver, NO tocar stock ----
        Map<String, Boolean> inventario = new HashMap<>();
        inventario.put("leer", true);
        inventario.put("ajustar", false);
        inventario.put("transferir", false);
        permisos.put("inventario", inventario);

        // ---- Ventas (sí vende, NO anula) ----
        Map<String, Boolean> ventas = new HashMap<>();
        ventas.put("leer", true);
        ventas.put("crear", true);
        ventas.put("anular", false);
        permisos.put("ventas", ventas);

        // ---- Clientes y proveedores (CRUD sin eliminar) ----
        permisos.put("clientes", permisosCrudSinEliminar());
        permisos.put("proveedores", permisosCrudSinEliminar());

        // ---- Compras: integra OC pero NO recibe ni anula ----
        Map<String, Boolean> compras = new HashMap<>();
        compras.put("leer", true);
        compras.put("crear", true);
        compras.put("editar", true);
        compras.put("eliminar", false);
        compras.put("recibir", false);
        compras.put("anular", false);
        permisos.put("compras", compras);

        // ---- Cotizaciones y preformas (sin eliminar) ----
        Map<String, Boolean> cotizaciones = new HashMap<>();
        cotizaciones.put("leer", true);
        cotizaciones.put("crear", true);
        cotizaciones.put("editar", true);
        cotizaciones.put("eliminar", false);
        cotizaciones.put("convertir", true);
        permisos.put("cotizaciones", cotizaciones);

        Map<String, Boolean> preformas = new HashMap<>();
        preformas.put("leer", true);
        preformas.put("crear", true);
        preformas.put("editar", true);
        preformas.put("eliminar", false);
        preformas.put("confirmar", true);
        preformas.put("cancelar", true);
        permisos.put("preformas", preformas);

        // ---- Devoluciones: crea pero NO aprueba ni reembolsa ----
        Map<String, Boolean> devoluciones = new HashMap<>();
        devoluciones.put("leer", true);
        devoluciones.put("crear", true);
        devoluciones.put("aprobar", false);
        devoluciones.put("rechazar", false);
        devoluciones.put("procesar_reembolso", false);
        permisos.put("devoluciones", devoluciones);

        // ---- Despachos: su trabajo diario ----
        permisos.put("despachos", permisosDespachos());

        // ---- Movilidades: solo ver ----
        Map<String, Boolean> movilidades = new HashMap<>();
        movilidades.put("leer", true);
        movilidades.put("crear", false);
        movilidades.put("editar", false);
        movilidades.put("eliminar", false);
        movilidades.put("asignar_conductor", false);
        permisos.put("movilidades", movilidades);

        // ---- Caja: su turno ----
        permisos.put("caja", permisosCaja());

        // ---- RRHH: solo SU información ----
        Map<String, Boolean> rrhh = new HashMap<>();
        rrhh.put("ver_legajos", false);
        rrhh.put("gestionar_legajos", false);
        rrhh.put("ver_nominas", false);
        rrhh.put("gestionar_nominas", false);
        rrhh.put("ver_turnos", false);
        rrhh.put("gestionar_turnos", false);
        rrhh.put("ver_mi_rrhh", true);
        permisos.put("rrhh", rrhh);

        // ---- Asistencia: solo SU marcación ----
        Map<String, Boolean> asistencia = new HashMap<>();
        asistencia.put("marcar", true);
        asistencia.put("ver_mis_marcaciones", true);
        permisos.put("asistencia", asistencia);

        // ---- Mensajes web: responde ----
        permisos.put("mensajes_web", permisosMensajesWeb());
        permisos.put("notificaciones", permisosNotificaciones());

        // ---- Sitio web: solo ver ----
        Map<String, Boolean> sitioWeb = new HashMap<>();
        sitioWeb.put("leer", true);
        sitioWeb.put("configurar", false);
        sitioWeb.put("gestionar_catalogo", false);
        sitioWeb.put("gestionar_portafolio", false);
        permisos.put("sitio_web", sitioWeb);

        // ---- Módulos que NO puede tocar (todo false explícito) ----
        Map<String, Boolean> todoFalse = permisosTodoFalse();
        permisos.put("finanzas", permisosFinanzasMultifuncional());
        permisos.put("auditoria", permisosSoloLecturaFalse());
        permisos.put("usuarios", todoFalse);
        permisos.put("roles", todoFalse);

        // ---- Configuración: solo ver ----
        Map<String, Boolean> configuracion = new HashMap<>();
        configuracion.put("leer", true);
        configuracion.put("crear", false);
        configuracion.put("editar", false);
        configuracion.put("eliminar", false);
        permisos.put("configuracion", configuracion);

        // ---- Reportes: ver sin exportar ----
        Map<String, Boolean> reportes = new HashMap<>();
        reportes.put("leer", true);
        reportes.put("exportar", false);
        permisos.put("reportes", reportes);

        // ---- Sedes: solo ver ----
        Map<String, Boolean> sedes = new HashMap<>();
        sedes.put("leer", true);
        sedes.put("crear", false);
        sedes.put("editar", false);
        sedes.put("eliminar", false);
        permisos.put("sedes", sedes);

        return permisos;
    }

    // ================================================================
    // HELPERS
    // ================================================================

    private Map<String, Boolean> permisosCrud() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("crear", true);
        p.put("editar", true);
        p.put("eliminar", true);
        return p;
    }

    private Map<String, Boolean> permisosSoloLectura() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("crear", false);
        p.put("editar", false);
        p.put("eliminar", false);
        return p;
    }

    private Map<String, Boolean> permisosSoloLecturaFalse() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", false);
        p.put("crear", false);
        p.put("editar", false);
        p.put("eliminar", false);
        return p;
    }

    private Map<String, Boolean> permisosCrudSinEliminar() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("crear", true);
        p.put("editar", true);
        p.put("eliminar", false);
        return p;
    }

    private Map<String, Boolean> permisosTodoFalse() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", false);
        p.put("crear", false);
        p.put("editar", false);
        p.put("eliminar", false);
        return p;
    }

    private Map<String, Boolean> permisosInventarioAdmin() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("ajustar", true);
        p.put("transferir", true);
        return p;
    }

    private Map<String, Boolean> permisosFinanzasAdmin() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("ver_reportes", true);
        p.put("aprobar_pagos", true);
        p.put("crear", true);
        p.put("editar", true);
        p.put("eliminar", true);
        return p;
    }

    private Map<String, Boolean> permisosFinanzasMultifuncional() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", false);
        p.put("ver_reportes", false);
        p.put("aprobar_pagos", false);
        p.put("crear", false);
        p.put("editar", false);
        p.put("eliminar", false);
        return p;
    }

    private Map<String, Boolean> permisosReportesAdmin() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("exportar", true);
        return p;
    }

    private Map<String, Boolean> permisosComprasAdmin() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("crear", true);
        p.put("editar", true);
        p.put("eliminar", true);
        p.put("recibir", true);
        p.put("anular", true);
        return p;
    }

    private Map<String, Boolean> permisosVentasAdmin() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("crear", true);
        p.put("anular", true);
        return p;
    }

    private Map<String, Boolean> permisosCotizaciones() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("crear", true);
        p.put("editar", true);
        p.put("eliminar", true);
        p.put("convertir", true);
        return p;
    }

    private Map<String, Boolean> permisosPreformas() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("crear", true);
        p.put("editar", true);
        p.put("eliminar", true);
        p.put("confirmar", true);
        p.put("cancelar", true);
        return p;
    }

    private Map<String, Boolean> permisosDevolucionesAdmin() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("crear", true);
        p.put("aprobar", true);
        p.put("rechazar", true);
        p.put("procesar_reembolso", true);
        return p;
    }

    private Map<String, Boolean> permisosDespachos() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("crear", true);
        p.put("asignar", true);
        p.put("cambiar_estado", true);
        p.put("registrar_entrega", true);
        return p;
    }

    private Map<String, Boolean> permisosMovilidadesAdmin() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("crear", true);
        p.put("editar", true);
        p.put("eliminar", true);
        p.put("asignar_conductor", true);
        return p;
    }

    private Map<String, Boolean> permisosCaja() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("abrir", true);
        p.put("cerrar", true);
        p.put("registrar_movimiento", true);
        return p;
    }

    private Map<String, Boolean> permisosRrhhAdmin() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("ver_legajos", true);
        p.put("gestionar_legajos", true);
        p.put("ver_nominas", true);
        p.put("gestionar_nominas", true);
        p.put("ver_turnos", true);
        p.put("gestionar_turnos", true);
        p.put("ver_mi_rrhh", true);
        return p;
    }

    private Map<String, Boolean> permisosAsistencia() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("marcar", true);
        p.put("ver_mis_marcaciones", true);
        return p;
    }

    private Map<String, Boolean> permisosMensajesWeb() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("responder", true);
        p.put("gestionar", true);
        return p;
    }

    private Map<String, Boolean> permisosNotificaciones() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("gestionar", true);
        return p;
    }

    private Map<String, Boolean> permisosSitioWebAdmin() {
        Map<String, Boolean> p = new HashMap<>();
        p.put("leer", true);
        p.put("configurar", true);
        p.put("gestionar_catalogo", true);
        p.put("gestionar_portafolio", true);
        return p;
    }

    // ================================================================
    // SEDE Y USUARIOS (sin cambios)
    // ================================================================

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
        Rol adminRol = rolRepository.findAll().stream()
                .filter(r -> r.getNombre() == RolNombre.ROLE_ADMIN)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Rol ADMIN no encontrado"));

        Rol multifuncionalRol = rolRepository.findAll().stream()
                .filter(r -> r.getNombre() == RolNombre.ROLE_MULTIFUNCIONAL)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Rol MULTIFUNCIONAL no encontrado"));

        crearUsuarioSiNoExiste("admin@policalum.com", "Admin", "Sistema", "admin",
                "admin123", "+51 987654321", adminRol, sede, true);

        crearUsuarioSiNoExiste("empleado@policalum.com", "Empleado", "Demo", "empleado",
                "empleado123", "+51 987654322", multifuncionalRol, sede, true);
    }

    private void crearUsuarioSiNoExiste(
            String email, String nombre, String apellido, String nombreUsuario,
            String passwordRaw, String celular, Rol rol, Sede sede, boolean activo) {

        if (userRepository.findByEmail(email).isPresent()) {
            log.debug("ℹ️ Usuario ya existe: {}", email);
            return;
        }

        boolean existeNombreUsuario = userRepository.findAll().stream()
                .anyMatch(u -> nombreUsuario.equals(u.getNombreUsuario()));

        if (existeNombreUsuario) {
            log.debug("ℹ️ Usuario ya existe: {}", nombreUsuario);
            return;
        }

        String totpSecret = totpService.generateSecret();
        log.info("Secreto TOTP generado para {}", email);

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
                .totpEnabled(true)
                .totpSecret(totpSecret)
                .build();

        userRepository.save(user);
        log.info("✅ Usuario creado: {} - {} (Rol: {}) - TOTP configurado: ✅",
                email, nombreUsuario, rol.getNombre());
    }
}