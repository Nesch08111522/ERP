package com.policalum.erp.infrastructure.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import com.policalum.erp.application.dto.request.AsistenciaQrDTO;
import com.policalum.erp.application.dto.request.MarcarLoteRequestDTO;
import com.policalum.erp.application.dto.request.MarcarQrAdminRequestDTO;
import com.policalum.erp.application.dto.request.RrhhAsistenciaRequestDTO;
import com.policalum.erp.application.dto.response.*;
import com.policalum.erp.application.service.RrhhAsistenciaService;
import com.policalum.erp.application.service.TotpService;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.exception.ResourceNotFoundException;
import com.policalum.erp.infrastructure.repository.RrhhAsistenciaRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Tag(name = "RRHH")
@RestController
@RequestMapping("/api/v1/rrhh/asistencias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RrhhAsistenciaController {

    private final RrhhAsistenciaService asistenciaService;
    private final TotpService totpService;
    private final UserRepository userRepository;
    private final RrhhAsistenciaRepository asistenciaRepository;

    // ============================================
    // QR PÚBLICO (ADMIN)
    // ============================================
    @Value("${totp.secret-key-publico}")
    private String secretKeyPublico;
    @GetMapping("/qr-publico")
    public ResponseEntity<QrPublicoDTO> generarQrPublico() {



        long window = totpService.currentWindow();
        String codigo = totpService.code(secretKeyPublico, window);
        String payload = "POLICALUM|PUBLICO|" + window + "|" + codigo;


            long segundosRestantes = totpService.secondsRemaining();
            long expiraEn = Instant.now().getEpochSecond() + segundosRestantes;

            QrPublicoDTO response = new QrPublicoDTO(
                    payload,
                    "Sistema POLICALUM",
                    segundosRestantes,
                    expiraEn
            );



        return ResponseEntity.ok(response);
    }
    // ============================================
    // CONFIGURACIÓN TOTP
    // ============================================
    @GetMapping("/qr-config/{empleadoId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<QrPublicoDTO> generarQrConfiguracion(@PathVariable UUID empleadoId) {
        User empleado = userRepository.findById(empleadoId)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));

        String secret = empleado.getTotpSecret();
        if (secret == null) {
            secret = totpService.generateSecret();
            empleado.setTotpSecret(secret);
            empleado.setTotpEnabled(true);
            userRepository.save(empleado);
        }

        long window = totpService.currentWindow();
        String codigo = totpService.code(secret, window);
        String payload = "POLICALUM|CONFIG|" + window + "|" + codigo;

        long segundosRestantes = totpService.secondsRemaining();
        long expiraEn = Instant.now().getEpochSecond() + segundosRestantes;

        QrPublicoDTO response = new QrPublicoDTO(
                payload,
                empleado.getNombre() + " " + empleado.getApellido(),
                segundosRestantes,
                expiraEn
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/configurar-totp/{empleadoId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TotpConfigDTO> configurarTOTP(@PathVariable UUID empleadoId) {
        User empleado = userRepository.findById(empleadoId)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));

        String secret = totpService.generateSecret();
        empleado.setTotpSecret(secret);
        empleado.setTotpEnabled(true);
        userRepository.save(empleado);

        String otpAuthUrl = String.format(
                "otpauth://totp/POLICALUM:%s?secret=%s&issuer=POLICALUM&period=60",
                empleado.getEmail(), secret
        );

        return ResponseEntity.ok(new TotpConfigDTO(
                empleadoId,
                secret,
                otpAuthUrl,
                "Escanea este QR con Google Authenticator"
        ));
    }

    // ============================================
    // MARCACIÓN POR QR — SOLO ADMIN
    // ============================================
    // Regla del Módulo 10 (§2.3 de la especificación): el MULTIFUNCIONAL no escanea ni se
    // auto-registra por QR; solo muestra su QR y el administrador lo lee. Por esto estos dos
    // endpoints pasaron de hasAnyRole('ADMIN','MULTIFUNCIONAL') a hasRole('ADMIN').
    @PostMapping("/marcar-qr")
    @PreAuthorize("hasRole('ADMIN') and @rolePermissionGuard.permite(authentication, 'asistencia', 'marcar')")
    public ResponseEntity<RrhhAsistenciaResponseDTO> marcarPorQr(@Valid @RequestBody AsistenciaQrDTO qrRequest) {
        RrhhAsistenciaResponseDTO response = asistenciaService.procesarMarcacionQr(qrRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ============================================
    // MÓDULO 10: QR PERSONAL + ESCANEO POR EL ADMIN + ROSTER
    // ============================================

    /**
     * QR dinámico del usuario autenticado (ADMIN o MULTIFUNCIONAL). Se muestra en pantalla
     * para que el administrador lo escanee y le registre la marcación.
     */
    @GetMapping("/mi-qr")
    @PreAuthorize("hasAnyRole('ADMIN','MULTIFUNCIONAL') and @rolePermissionGuard.permite(authentication, 'asistencia', 'marcar')")
    public ResponseEntity<QrPersonalDTO> miQr() {
        return ResponseEntity.ok(asistenciaService.qrPersonal());
    }

    /** El administrador escanea el QR personal de un empleado y le marca entrada/salida. */
    @PostMapping("/escanear-qr")
    @PreAuthorize("hasRole('ADMIN') and @rolePermissionGuard.permite(authentication, 'asistencia', 'marcar')")
    public ResponseEntity<RrhhAsistenciaResponseDTO> escanearQr(@Valid @RequestBody MarcarQrAdminRequestDTO request) {
        RrhhAsistenciaResponseDTO response = asistenciaService.marcarPorQrEscaneado(request.payload());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** "Quiénes asistieron hoy": una fila por empleado activo, marque o no. */
    @GetMapping("/roster")
    @PreAuthorize("hasRole('ADMIN') and @rolePermissionGuard.permite(authentication, 'asistencia', 'ver_mis_marcaciones')")
    public ResponseEntity<List<AsistenciaRosterDTO>> roster(
            @RequestParam(required = false) LocalDate fecha,
            @RequestParam(required = false) UUID sedeId) {
        return ResponseEntity.ok(asistenciaService.roster(fecha, sedeId));
    }

    /** Marca entrada o salida en lote desde el roster. Rechaza fechas futuras. */
    @PostMapping("/marcar-lote")
    @PreAuthorize("hasRole('ADMIN') and @rolePermissionGuard.permite(authentication, 'asistencia', 'marcar')")
    public ResponseEntity<MarcarLoteResponseDTO> marcarLote(@Valid @RequestBody MarcarLoteRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(asistenciaService.marcarLote(request));
    }

    // ============================================
    // MARCACIÓN MANUAL (SOLO ADMIN)
    // ============================================
    @PostMapping("/manual")
    @PreAuthorize("hasRole('ADMIN') and @rolePermissionGuard.permite(authentication, 'asistencia', 'marcar')")
    public ResponseEntity<RrhhAsistenciaResponseDTO> registrarManual(
            @Valid @RequestBody RrhhAsistenciaRequestDTO manualRequest) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!user.getRol().getNombre().name().equals("ROLE_ADMIN")) {
            throw new SecurityException("Solo el administrador puede registrar asistencias manualmente");
        }

        RrhhAsistenciaResponseDTO response = asistenciaService.procesarMarcacionManual(manualRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ============================================
    // LISTAR CON FILTROS (ADMIN/MULTI)
    // ============================================
    @GetMapping("/listar")
    @PreAuthorize("hasAnyRole('ADMIN','MULTIFUNCIONAL') and @rolePermissionGuard.permite(authentication, 'asistencia', 'ver_mis_marcaciones')")
    public ResponseEntity<Page<RrhhAsistenciaResponseDTO>> listarAsistencias(
            @RequestParam(required = false) UUID empleadoId,
            @RequestParam(required = false) LocalDate fechaInicio,
            @RequestParam(required = false) LocalDate fechaFin,
            @PageableDefault(size = 20, sort = "fechaHora", direction = Sort.Direction.DESC) Pageable pageable) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // Si es MULTIFUNCIONAL, forzar su propio ID
        if (user.getRol().getNombre().name().equals("ROLE_MULTIFUNCIONAL")) {
            empleadoId = user.getId();
        }

        LocalDateTime inicio = fechaInicio != null ? fechaInicio.atStartOfDay() : null;
        LocalDateTime fin = fechaFin != null ? fechaFin.atTime(23, 59, 59) : null;

        Page<RrhhAsistenciaResponseDTO> response = asistenciaService.listarAsistencias(
                empleadoId, inicio, fin, pageable);

        return ResponseEntity.ok(response);
    }

    // ============================================
    // MIS ASISTENCIAS (MULTIFUNCIONAL)
    // ============================================
    @GetMapping("/mis-asistencias")
    @PreAuthorize("hasAnyRole('ADMIN','MULTIFUNCIONAL') and @rolePermissionGuard.permite(authentication, 'asistencia', 'ver_mis_marcaciones')")
    public ResponseEntity<Page<RrhhAsistenciaResponseDTO>> misAsistencias(
            @RequestParam(required = false) LocalDate fechaInicio,
            @RequestParam(required = false) LocalDate fechaFin,
            @PageableDefault(size = 20, sort = "fechaHora", direction = Sort.Direction.DESC) Pageable pageable) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        LocalDateTime inicio = fechaInicio != null ? fechaInicio.atStartOfDay() : null;
        LocalDateTime fin = fechaFin != null ? fechaFin.atTime(23, 59, 59) : null;

        Page<RrhhAsistenciaResponseDTO> response = asistenciaService.misAsistencias(
                user.getId(), inicio, fin, pageable);

        return ResponseEntity.ok(response);
    }

    // ============================================
    // BUSCAR POR ID
    // ============================================
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MULTIFUNCIONAL') and @rolePermissionGuard.permite(authentication, 'asistencia', 'ver_mis_marcaciones')")
    public ResponseEntity<RrhhAsistenciaResponseDTO> buscarPorId(@PathVariable UUID id) {
        RrhhAsistenciaResponseDTO asistencia = asistenciaService.buscarPorId(id);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        if (user.getRol().getNombre() == RolNombre.ROLE_MULTIFUNCIONAL
                && !user.getId().equals(asistencia.empleadoId())) {
            throw new AccessDeniedException("Solo puede consultar sus propias asistencias");
        }
        return ResponseEntity.ok(asistencia);
    }

    // ============================================
    // ACTUALIZAR (SOLO ADMIN)
    // ============================================
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and @rolePermissionGuard.permite(authentication, 'asistencia', 'editar')")
    public ResponseEntity<RrhhAsistenciaResponseDTO> actualizarManual(
            @PathVariable UUID id,
            @Valid @RequestBody RrhhAsistenciaRequestDTO updateRequest) {
        RrhhAsistenciaResponseDTO response = asistenciaService.actualizarMarcacionManual(id, updateRequest);
        return ResponseEntity.ok(response);
    }

    // ============================================
    //  ELIMINAR (SOLO ADMIN)
    // ============================================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') and @rolePermissionGuard.permite(authentication, 'asistencia', 'eliminar')")
    public ResponseEntity<Void> eliminarMarcacion(@PathVariable UUID id) {
        asistenciaService.eliminarMarcacion(id);
        return ResponseEntity.noContent().build();
    }

    // ============================================
    // DASHBOARD
    // ============================================
    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN','MULTIFUNCIONAL') and @rolePermissionGuard.permite(authentication, 'asistencia', 'ver_mis_marcaciones')")
    public ResponseEntity<DashboardAsistenciaDTO> obtenerDashboard() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        UUID empleadoId = null;
        if (user.getRol().getNombre().name().equals("ROLE_MULTIFUNCIONAL")) {
            empleadoId = user.getId();
        }

        DashboardAsistenciaDTO dashboard = asistenciaService.obtenerDashboard(empleadoId);
        return ResponseEntity.ok(dashboard);
    }

    // ============================================
    // ÚLTIMA MARCACIÓN
    // ============================================
    @GetMapping("/ultima-marcacion")
    @PreAuthorize("hasAnyRole('ADMIN','MULTIFUNCIONAL') and @rolePermissionGuard.permite(authentication, 'asistencia', 'ver_mis_marcaciones')")
    public ResponseEntity<RrhhAsistenciaResponseDTO> obtenerUltimaMarcacion() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        RrhhAsistenciaResponseDTO response = asistenciaService.obtenerUltimaMarcacion(user.getId());
        return ResponseEntity.ok(response);
    }

    // ============================================
    //  ESTADO DEL DÍA
    // ============================================
    @GetMapping("/estado-dia")
    @PreAuthorize("hasAnyRole('ADMIN','MULTIFUNCIONAL') and @rolePermissionGuard.permite(authentication, 'asistencia', 'ver_mis_marcaciones')")
    public ResponseEntity<AsistenciaEstadoDTO> obtenerEstadoDelDia() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        AsistenciaEstadoDTO response = asistenciaService.obtenerEstadoDelDia(user.getId());
        return ResponseEntity.ok(response);
    }

    // ============================================
    // MARCACIÓN POR QR DEL KIOSCO — SOLO ADMIN
    // ============================================
    // El kiosco público sigue existiendo para el puesto de trabajo del administrador.
    // Un MULTIFUNCIONAL que llame aquí recibe 403: registrar asistencia por QR es potestad
    // del administrador (§2.3). Su camino es GET /mi-qr y que el admin lo escanee.
    @PostMapping("/marcar-qr-real")
    @PreAuthorize("hasRole('ADMIN') and @rolePermissionGuard.permite(authentication, 'asistencia', 'marcar')")
    public ResponseEntity<RrhhAsistenciaResponseDTO> marcarPorQrReal(
            @Valid @RequestBody AsistenciaQrDTO qrRequest) {

        // 1. Obtener el empleado autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User empleado = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));

        // 2. Verificar que el ID del empleado coincida con el autenticado
        if (!empleado.getId().equals(qrRequest.empleadoId())) {
            throw new SecurityException("ID de empleado no coincide con el usuario autenticado");
        }

        // 3. Procesar la marcación (usa el mismo servicio que /marcar-qr)
        RrhhAsistenciaResponseDTO response = asistenciaService.procesarMarcacionQr(qrRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/empleados")
    @PreAuthorize("hasRole('ADMIN') and @rolePermissionGuard.permite(authentication, 'usuarios', 'leer')")
    public ResponseEntity<List<UserInfoDTO>> obtenerEmpleados() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!admin.getRol().getNombre().name().equals("ROLE_ADMIN")) {
            throw new SecurityException("Solo el administrador puede ver la lista de empleados");
        }

        List<User> usuarios = userRepository.findAll();

        List<UserInfoDTO> response = usuarios.stream()
                .filter(User::getActivo)
                .map(user -> new UserInfoDTO(
                        user.getId(),
                        user.getNombre(),
                        user.getApellido(),
                        user.getEmail(),
                        user.getNombre() + " " + user.getApellido()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
