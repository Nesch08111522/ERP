package com.policalum.erp.application.service.serviceImpl;

import com.policalum.erp.application.dto.response.TurnoDelDiaDTO;
import com.policalum.erp.application.service.TurnoTrabajoService;
import com.policalum.erp.application.dto.request.AsistenciaQrDTO;
import com.policalum.erp.application.dto.request.MarcarLoteRequestDTO;
import com.policalum.erp.application.dto.request.RrhhAsistenciaRequestDTO;
import com.policalum.erp.application.dto.response.AsistenciaEstadoDTO;
import com.policalum.erp.application.dto.response.AsistenciaRosterDTO;
import com.policalum.erp.application.dto.response.DashboardAsistenciaDTO;
import com.policalum.erp.application.dto.response.MarcarLoteResponseDTO;
import com.policalum.erp.application.dto.response.QrPersonalDTO;
import com.policalum.erp.application.dto.response.RrhhAsistenciaResponseDTO;
import com.policalum.erp.application.mapper.RrhhAsistenciaMapper;
import com.policalum.erp.application.service.RrhhAsistenciaService;
import com.policalum.erp.application.service.TotpService;
import com.policalum.erp.domain.enums.EstadoAsistencia;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.enums.TipoMarcacion;
import com.policalum.erp.domain.model.RrhhAsistencia;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.exception.ResourceNotFoundException;
import com.policalum.erp.infrastructure.repository.RrhhAsistenciaRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;
import com.policalum.erp.infrastructure.security.MarcacionQrUnica;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RrhhAsistenciaImpl implements RrhhAsistenciaService {

    private final RrhhAsistenciaRepository asistenciaRepository;
    private final UserRepository userRepository;
    private final TotpService totpService;
    private final RrhhAsistenciaMapper asistenciaMapper;
    private final TurnoTrabajoService turnoTrabajoService; // Módulo 8: tardanza según turno
    private final MarcacionQrUnica marcacionQrUnica;

    // ✅ SECRETO PÚBLICO PARA QR
    @Value("${totp.secret-key-publico}")
    private String secretKeyPublico;

    private static final int TOLERANCIA_MINUTOS = 10;
    private static final int HORA_ENTRADA = 8;
    private static final int HORA_SALIDA = 17;

    // ============================================
    // ✅ MARCACIÓN POR QR
    // ============================================

    @Override
    @Transactional
    public RrhhAsistenciaResponseDTO procesarMarcacionQr(AsistenciaQrDTO qrRequest) {

        String payload = qrRequest.payload();

        // ✅ Verificar si es QR público
        if (payload != null && payload.startsWith("POLICALUM|PUBLICO|")) {
            String[] parts = payload.split("\\|");
            if (parts.length != 4) {
                throw new IllegalArgumentException("QR inválido");
            }

            UUID empleadoId = qrRequest.empleadoId();
            if (empleadoId == null) {
                throw new IllegalArgumentException("ID de empleado no proporcionado");
            }

            long window = Long.parseLong(parts[2]);
            String codigo = parts[3];

            // ✅ VALIDAR CON EL SECRETO PÚBLICO
            boolean isValid = totpService.verify(secretKeyPublico, window, codigo);
            if (!isValid) {
                throw new IllegalArgumentException("Código QR inválido o expirado");
            }

            // ✅ BUSCAR AL EMPLEADO
            User usuario = userRepository.findById(empleadoId)
                    .orElseThrow(() -> new ResourceNotFoundException("El usuario no está registrado en el sistema."));

            if (!usuario.getActivo()) {
                throw new IllegalStateException("El usuario se encuentra inactivo.");
            }

            // ✅ LÓGICA DE NEGOCIO
            LocalDateTime ahora = LocalDateTime.now();
            TipoMarcacion tipo = determinarTipoMarcacion(empleadoId);
            validarMarcacion(empleadoId, tipo, ahora);

            // ✅ CREAR ASISTENCIA
            RrhhAsistencia asistencia = crearAsistencia(usuario, tipo, ahora, "Escaneo QR Móvil");
            RrhhAsistencia guardada = asistenciaRepository.save(asistencia);

            log.info("✅ Asistencia QR registrada: {} - {}", usuario.getEmail(), tipo);
            return asistenciaMapper.toResponseDto(guardada);
        }

        // ✅ Si es token Base64 (formato antiguo)
        UUID userIdDecodificado = totpService.validarTokenYObtenerEmpleadoId(payload);
        if (userIdDecodificado == null) {
            throw new IllegalArgumentException("El código QR es inválido o ha expirado.");
        }

        if (!userIdDecodificado.equals(qrRequest.empleadoId())) {
            throw new SecurityException("Fraude detectado: El código QR no corresponde al usuario especificado.");
        }

        User usuario = userRepository.findById(userIdDecodificado)
                .orElseThrow(() -> new ResourceNotFoundException("El usuario no está registrado en el sistema."));

        if (!usuario.getActivo()) {
            throw new IllegalStateException("El usuario se encuentra inactivo.");
        }

        LocalDateTime ahora = LocalDateTime.now();
        TipoMarcacion tipo = determinarTipoMarcacion(userIdDecodificado);
        validarMarcacion(userIdDecodificado, tipo, ahora);

        RrhhAsistencia asistencia = crearAsistencia(usuario, tipo, ahora, "Escaneo QR Móvil");
        RrhhAsistencia guardada = asistenciaRepository.save(asistencia);

        return asistenciaMapper.toResponseDto(guardada);
    }

    // ============================================
    // ✅ MARCACIÓN MANUAL (ADMIN)
    // ============================================

    @Override
    @Transactional
    public RrhhAsistenciaResponseDTO procesarMarcacionManual(RrhhAsistenciaRequestDTO manualRequest) {
        User usuario = userRepository.findById(manualRequest.empleadoId())
                .orElseThrow(() -> new ResourceNotFoundException("El usuario no está registrado."));

        if (!usuario.getActivo()) {
            throw new IllegalStateException("El usuario se encuentra inactivo.");
        }

        LocalDateTime fechaHora = manualRequest.fechaHora();
        TipoMarcacion tipo = manualRequest.tipoMarcacion();

        if (fechaHora.isAfter(LocalDateTime.now())) {
            throw new IllegalArgumentException("No se puede registrar una asistencia en el futuro.");
        }

        validarMarcacion(usuario.getId(), tipo, fechaHora);

        RrhhAsistencia asistencia = crearAsistencia(usuario, tipo, fechaHora,
                manualRequest.dispositivoInfo() != null ? manualRequest.dispositivoInfo() : "Registro Manual por Admin");

        RrhhAsistencia guardada = asistenciaRepository.save(asistencia);
        log.info("✅ Asistencia manual registrada: {} - {}", usuario.getEmail(), tipo);

        return asistenciaMapper.toResponseDto(guardada);
    }

    // ============================================
    // ✅ MÉTODOS PRIVADOS
    // ============================================

    private TipoMarcacion determinarTipoMarcacion(UUID empleadoId) {
        LocalDateTime inicioDia = LocalDate.now().atStartOfDay();
        LocalDateTime finDia = inicioDia.plusDays(1);

        boolean yaEntrada = asistenciaRepository.yaMarcoEntradaHoy(empleadoId, inicioDia, finDia);
        boolean yaSalida = asistenciaRepository.yaMarcoSalidaHoy(empleadoId, inicioDia, finDia);

        if (!yaEntrada) {
            return TipoMarcacion.ENTRADA;
        } else if (!yaSalida) {
            return TipoMarcacion.SALIDA;
        } else {
            log.info("⚠️ Empleado {} ya marcó entrada y salida hoy. Nueva entrada.", empleadoId);
            return TipoMarcacion.ENTRADA;
        }
    }

    private void validarMarcacion(UUID empleadoId, TipoMarcacion tipo, LocalDateTime fechaHora) {
        LocalDateTime inicioDia = fechaHora.toLocalDate().atStartOfDay();
        LocalDateTime finDia = inicioDia.plusDays(1);

        if (tipo == TipoMarcacion.ENTRADA) {
            boolean yaEntrada = asistenciaRepository.yaMarcoEntradaHoy(empleadoId, inicioDia, finDia);
            if (yaEntrada) {
                throw new IllegalStateException("❌ El empleado ya marcó ENTRADA hoy.");
            }
        } else if (tipo == TipoMarcacion.SALIDA) {
            boolean yaSalida = asistenciaRepository.yaMarcoSalidaHoy(empleadoId, inicioDia, finDia);
            if (yaSalida) {
                throw new IllegalStateException("❌ El empleado ya marcó SALIDA hoy.");
            }
            boolean yaEntrada = asistenciaRepository.yaMarcoEntradaHoy(empleadoId, inicioDia, finDia);
            if (!yaEntrada) {
                throw new IllegalStateException("❌ No se puede marcar SALIDA sin haber marcado ENTRADA primero.");
            }
        }
    }

    /**
     * Módulo 8: si el empleado tiene turno ese día, la tardanza se mide contra su hora de
     * inicio + tolerancia del turno. Si no tiene turno, se mantiene la regla anterior (08:00 + 10 min).
     */
    private EstadoAsistencia calcularEstado(TipoMarcacion tipo, LocalDateTime fechaHora, TurnoDelDiaDTO turno) {
        if (tipo == TipoMarcacion.ENTRADA && turno != null) {
            return turno.esTardanza(fechaHora.toLocalTime()) ? EstadoAsistencia.TARDANZA : EstadoAsistencia.PRESENTE;
        }
        if (tipo == TipoMarcacion.ENTRADA) {
            LocalDateTime horaEntradaEsperada = fechaHora.withHour(HORA_ENTRADA).withMinute(0).withSecond(0).withNano(0);
            if (fechaHora.isAfter(horaEntradaEsperada.plusMinutes(TOLERANCIA_MINUTOS))) {
                return EstadoAsistencia.TARDANZA;
            }
            return EstadoAsistencia.PRESENTE;
        }
        return EstadoAsistencia.PRESENTE;
    }

    private RrhhAsistencia crearAsistencia(User usuario, TipoMarcacion tipo, LocalDateTime fechaHora, String dispositivo) {
        RrhhAsistencia asistencia = new RrhhAsistencia();
        asistencia.setEmpleado(usuario);
        asistencia.setFechaHora(fechaHora);
        asistencia.setTipoMarcacion(tipo);
        TurnoDelDiaDTO turno = tipo == TipoMarcacion.ENTRADA
                ? turnoTrabajoService.turnoDelDia(usuario.getId(), fechaHora).orElse(null) : null;
        if (turno != null) asistencia.setTurnoTrabajoId(turno.turnoId());
        asistencia.setEstado(calcularEstado(tipo, fechaHora, turno));
        asistencia.setDispositivoInfo(dispositivo);
        asistencia.setFecha(fechaHora.toLocalDate());

        if (tipo == TipoMarcacion.ENTRADA) {
            asistencia.setHoraEntrada(fechaHora.toLocalTime());
            asistencia.setHoraSalida(null);
            asistencia.setHorasTrabajadas(null);
        } else if (tipo == TipoMarcacion.SALIDA) {
            asistencia.setHoraSalida(fechaHora.toLocalTime());

            LocalDateTime inicioDia = fechaHora.toLocalDate().atStartOfDay();
            LocalDateTime finDia = inicioDia.plusDays(1);

            RrhhAsistencia entrada = asistenciaRepository.findUltimaEntradaDelDia(
                    usuario.getId(), inicioDia, finDia);

            if (entrada != null && entrada.getHoraEntrada() != null) {
                asistencia.setHoraEntrada(entrada.getHoraEntrada());
                long minutos = ChronoUnit.MINUTES.between(entrada.getHoraEntrada(), fechaHora.toLocalTime());
                BigDecimal horas = BigDecimal.valueOf(minutos / 60.0).setScale(2, java.math.RoundingMode.HALF_UP);
                asistencia.setHorasTrabajadas(horas);
            }
        }

        return asistencia;
    }

    // ============================================
    // ✅ CRUD Y LISTADOS
    // ============================================

    @Override
    public Page<RrhhAsistenciaResponseDTO> listarTodas(Pageable pageable) {
        return asistenciaRepository.findAll(pageable)
                .map(asistenciaMapper::toResponseDto);
    }

    @Override
    public Page<RrhhAsistenciaResponseDTO> buscarPorEmpleado(UUID empleadoId, Pageable pageable) {
        return asistenciaRepository.findByEmpleadoId(empleadoId, pageable)
                .map(asistenciaMapper::toResponseDto);
    }

    @Override
    public RrhhAsistenciaResponseDTO buscarPorId(UUID id) {
        RrhhAsistencia asistencia = asistenciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro no encontrado con ID: " + id));
        return asistenciaMapper.toResponseDto(asistencia);
    }

    @Override
    @Transactional
    public RrhhAsistenciaResponseDTO actualizarMarcacionManual(UUID id, RrhhAsistenciaRequestDTO updateRequest) {
        RrhhAsistencia asistenciaExistente = asistenciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro no encontrado con ID: " + id));

        asistenciaMapper.updateEntityFromDto(updateRequest, asistenciaExistente);
        asistenciaExistente.setDispositivoInfo("Modificado por Admin (Manual)");

        RrhhAsistencia actualizada = asistenciaRepository.save(asistenciaExistente);
        return asistenciaMapper.toResponseDto(actualizada);
    }

    @Override
    @Transactional
    public void eliminarMarcacion(UUID id) {
        if (!asistenciaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Registro no encontrado con ID: " + id);
        }
        asistenciaRepository.deleteById(id);
    }

    @Override
    public Page<RrhhAsistenciaResponseDTO> listarAsistencias(
            UUID empleadoId,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin,
            Pageable pageable) {

        Page<RrhhAsistencia> page;

        if (empleadoId != null && fechaInicio != null && fechaFin != null) {
            page = asistenciaRepository.findByEmpleadoIdAndFechaHoraBetween(
                    empleadoId, fechaInicio, fechaFin, pageable);
        } else if (empleadoId != null) {
            page = asistenciaRepository.findByEmpleadoId(empleadoId, pageable);
        } else if (fechaInicio != null && fechaFin != null) {
            page = asistenciaRepository.findByFechaHoraBetween(fechaInicio, fechaFin, pageable);
        } else {
            page = asistenciaRepository.findAllConEmpleados(pageable);
        }

        return page.map(asistenciaMapper::toResponseDto);
    }

    @Override
    public Page<RrhhAsistenciaResponseDTO> misAsistencias(
            UUID empleadoId,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin,
            Pageable pageable) {

        if (empleadoId == null) {
            throw new IllegalArgumentException("El ID del empleado es requerido");
        }

        userRepository.findById(empleadoId)
                .orElseThrow(() -> new ResourceNotFoundException("Empleado no encontrado"));

        Page<RrhhAsistencia> page;

        if (fechaInicio != null && fechaFin != null) {
            page = asistenciaRepository.findByEmpleadoIdAndFechaHoraBetween(
                    empleadoId, fechaInicio, fechaFin, pageable);
        } else {
            page = asistenciaRepository.findByEmpleadoId(empleadoId, pageable);
        }

        return page.map(asistenciaMapper::toResponseDto);
    }

    @Override
    public DashboardAsistenciaDTO obtenerDashboard(UUID empleadoId) {
        LocalDateTime inicioDia = LocalDate.now().atStartOfDay();
        LocalDateTime finDia = inicioDia.plusDays(1);

        long totalEmpleados = asistenciaRepository.countEmpleadosActivos();
        long presentesHoy = asistenciaRepository.countPresentesHoy(inicioDia, finDia);
        long tardanzasHoy = asistenciaRepository.countTardanzasHoy(inicioDia, finDia);
        long ausentesHoy = totalEmpleados - presentesHoy;

        List<RrhhAsistencia> recientes;
        if (empleadoId != null) {
            Pageable top5 = Pageable.ofSize(5);
            Page<RrhhAsistencia> page = asistenciaRepository.findByEmpleadoId(empleadoId, top5);
            recientes = page.getContent();
        } else {
            recientes = asistenciaRepository.findUltimasAsistencias();
        }

        List<RrhhAsistenciaResponseDTO> recientesDTO = recientes.stream()
                .map(asistenciaMapper::toResponseDto)
                .toList();

        return new DashboardAsistenciaDTO(
                totalEmpleados,
                presentesHoy,
                ausentesHoy,
                tardanzasHoy,
                recientesDTO
        );
    }

    @Override
    public RrhhAsistenciaResponseDTO obtenerUltimaMarcacion(UUID empleadoId) {
        RrhhAsistencia ultima = asistenciaRepository.findUltimaMarcacion(empleadoId);
        if (ultima == null) {
            return null;
        }
        return asistenciaMapper.toResponseDto(ultima);
    }

    @Override
    public AsistenciaEstadoDTO obtenerEstadoDelDia(UUID empleadoId) {
        LocalDateTime inicioDia = LocalDate.now().atStartOfDay();
        LocalDateTime finDia = inicioDia.plusDays(1);

        boolean yaEntrada = asistenciaRepository.yaMarcoEntradaHoy(empleadoId, inicioDia, finDia);
        boolean yaSalida = asistenciaRepository.yaMarcoSalidaHoy(empleadoId, inicioDia, finDia);

        return new AsistenciaEstadoDTO(
                yaEntrada,
                yaSalida,
                yaEntrada ? "✅ ENTRADA registrada hoy" : "❌ No ha marcado ENTRADA hoy",
                yaSalida ? "✅ SALIDA registrada hoy" : "❌ No ha marcado SALIDA hoy"
        );
    }

    // ============================================
    // MÓDULO 10: QR PERSONAL, ESCANEO DEL ADMIN Y ROSTER
    // ============================================

    private static final String PREFIJO_EMPLEADO = "POLICALUM|EMPLEADO|";

    @Override
    public QrPersonalDTO qrPersonal() {
        User empleado = usuarioActual();
        String secret = secretoPersonalDe(empleado);

        long window = totpService.currentWindow();
        String codigo = totpService.code(secret, window);

        return new QrPersonalDTO(
                empleado.getId(),
                empleado.getNombre() + " " + empleado.getApellido(),
                PREFIJO_EMPLEADO + empleado.getId() + "|" + window + "|" + codigo,
                totpService.secondsRemaining(),
                totpService.expiresAtEpoch(),
                window);
    }

    /**
     * El admin escanea el QR personal del empleado. La firma se verifica contra el secreto
     * del usuario que viene EN el payload, así que un QR robado ayer ya no sirve y un QR
     * ajeno no se puede presentar como propio.
     */
    @Override
    @Transactional
    public RrhhAsistenciaResponseDTO marcarPorQrEscaneado(String payload) {
        User admin = usuarioActual();
        if (admin.getRol() == null || admin.getRol().getNombre() != RolNombre.ROLE_ADMIN) {
            throw new SecurityException("Solo el administrador puede marcar con el QR de otro empleado");
        }
        if (payload == null || !payload.startsWith(PREFIJO_EMPLEADO)) {
            throw new IllegalArgumentException("El QR escaneado no es un QR de asistencia POLICALUM");
        }

        String[] partes = payload.split("\\|");
        if (partes.length != 5) {
            throw new IllegalArgumentException("QR inválido o incompleto");
        }

        UUID empleadoId;
        long window;
        try {
            empleadoId = UUID.fromString(partes[2]);
            window = Long.parseLong(partes[3]);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("QR inválido: no corresponde a un empleado");
        }
        String codigo = partes[4];

        User empleado = userRepository.findById(empleadoId)
                .orElseThrow(() -> new ResourceNotFoundException("El empleado del QR no está registrado"));
        if (!Boolean.TRUE.equals(empleado.getActivo())) {
            throw new IllegalStateException("El usuario " + nombre(empleado) + " está inactivo");
        }

        if (!totpService.verify(secretoPersonalDe(empleado), window, codigo)) {
            throw new IllegalArgumentException("El QR del empleado expiró. Pídale que lo refresque.");
        }

        // QR de un solo uso: la tolerancia de TOTP acepta la ventana anterior, así que sin
        // este control el mismo código presentado dos veces genera ENTRADA y SALIDA seguidas.
        if (!marcacionQrUnica.registrar(empleadoId, window)) {
            throw new IllegalStateException("Ese QR ya se usó. Pídale al empleado que refresque su código.");
        }

        LocalDateTime ahora = LocalDateTime.now();
        TipoMarcacion tipo = determinarTipoMarcacion(empleadoId);
        try {
            validarMarcacion(empleadoId, tipo, ahora);
        } catch (RuntimeException e) {
            // El rechazo es regla de negocio, no un consumo del QR: lo liberamos para que el
            // mismo código siga sirviendo si el admin corrige algo y reintenta enseguida.
            marcacionQrUnica.liberar(empleadoId, window);
            throw e;
        }

        RrhhAsistencia guardada = asistenciaRepository.save(
                crearAsistencia(empleado, tipo, ahora, "QR escaneado por Admin"));
        log.info("✅ Admin {} marcó {} para {} vía QR personal", admin.getEmail(), tipo, empleado.getEmail());
        return asistenciaMapper.toResponseDto(guardada);
    }

    @Override
    @Transactional
    public List<AsistenciaRosterDTO> roster(LocalDate fecha, UUID sedeId) {
        LocalDate dia = fecha != null ? fecha : LocalDate.now();
        if (dia.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("No se puede consultar el roster de una fecha futura: " + dia);
        }
        LocalDateTime inicioDia = dia.atStartOfDay();
        LocalDateTime finDia = inicioDia.plusDays(1);

        // Una pasada por BD: agrupamos las marcaciones del día por empleado.
        Map<UUID, List<RrhhAsistencia>> porEmpleado = new LinkedHashMap<>();
        for (RrhhAsistencia a : asistenciaRepository.findDelDia(inicioDia, finDia)) {
            porEmpleado.computeIfAbsent(a.getEmpleado().getId(), k -> new ArrayList<>()).add(a);
        }

        List<AsistenciaRosterDTO> filas = new ArrayList<>();
        for (User u : userRepository.findAllWithRelations()) {
            if (!Boolean.TRUE.equals(u.getActivo())) continue;
            if (sedeId != null && (u.getSede() == null || !sedeId.equals(u.getSede().getId()))) continue;

            List<RrhhAsistencia> marcas = porEmpleado.getOrDefault(u.getId(), List.of());
            RrhhAsistencia entrada = ultimaDeTipo(marcas, TipoMarcacion.ENTRADA);
            RrhhAsistencia salida = ultimaDeTipo(marcas, TipoMarcacion.SALIDA);

            filas.add(new AsistenciaRosterDTO(
                    u.getId(),
                    nombre(u),
                    u.getSede() != null ? u.getSede().getNombre() : null,
                    dia,
                    entrada != null,
                    salida != null,
                    entrada != null ? entrada.getFechaHora() : null,
                    salida != null ? salida.getFechaHora() : null,
                    entrada != null ? entrada.getEstado() : null,
                    salida != null ? salida.getHorasTrabajadas() : calcularHorasEnCurso(entrada, salida),
                    turnoDe(u.getId(), inicioDia),
                    origen(marcas),
                    entrada == null,
                    entrada != null && salida == null));
        }
        return filas;
    }

    @Override
    @Transactional
    public MarcarLoteResponseDTO marcarLote(MarcarLoteRequestDTO request) {
        exigirAdmin(usuarioActual());
        LocalDate dia = request.fecha() != null ? request.fecha() : LocalDate.now();
        if (dia.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("No se puede marcar en una fecha futura: " + dia);
        }
        TipoMarcacion tipo = request.tipoMarcacion();
        LocalDateTime inicioDia = dia.atStartOfDay();
        LocalDateTime finDia = inicioDia.plusDays(1);

        int registrados = 0, omitidos = 0, rechazados = 0;
        List<String> detalle = new ArrayList<>();

        for (UUID empleadoId : request.empleadoIds().stream().filter(Objects::nonNull).distinct().toList()) {
            User empleado = userRepository.findById(empleadoId).orElse(null);
            if (empleado == null) {
                rechazados++;
                detalle.add("Empleado inexistente: " + empleadoId);
                continue;
            }
            if (!Boolean.TRUE.equals(empleado.getActivo())) {
                rechazados++;
                detalle.add(nombre(empleado) + ": inactivo");
                continue;
            }

            boolean yaMarcado = tipo == TipoMarcacion.ENTRADA
                    ? asistenciaRepository.yaMarcoEntradaHoy(empleadoId, inicioDia, finDia)
                    : asistenciaRepository.yaMarcoSalidaHoy(empleadoId, inicioDia, finDia);
            if (yaMarcado) {
                omitidos++;
                detalle.add(nombre(empleado) + ": ya tenía " + tipo);
                continue;
            }
            if (tipo == TipoMarcacion.SALIDA
                    && !asistenciaRepository.yaMarcoEntradaHoy(empleadoId, inicioDia, finDia)) {
                rechazados++;
                detalle.add(nombre(empleado) + ": no puede salir sin haber entrado");
                continue;
            }

            // El lote se usa para cerrar el día de quien no marcó: se toma el inicio del
            // día como hora neutra cuando es un día pasado, y la hora real si es hoy.
            LocalDateTime fechaHora = dia.isEqual(LocalDate.now())
                    ? LocalDateTime.now()
                    : inicioDia.plusHours(8);

            try {
                validarMarcacion(empleadoId, tipo, fechaHora);
                asistenciaRepository.save(crearAsistencia(empleado, tipo, fechaHora, "Lote roster Admin"));
                registrados++;
                detalle.add(nombre(empleado) + ": " + tipo + " registrada");
            } catch (IllegalStateException e) {
                rechazados++;
                detalle.add(nombre(empleado) + ": " + e.getMessage().replace("❌ ", ""));
            }
        }

        int solicitados = registrados + omitidos + rechazados;
        log.info("✅ Marcación en lote {} ({}): {} registradas, {} omitidas, {} rechazadas",
                tipo, dia, registrados, omitidos, rechazados);
        return new MarcarLoteResponseDTO(solicitados, registrados, omitidos, rechazados, detalle);
    }

    // ============================================
    // HELPERS DEL MÓDULO 10
    // ============================================

    /** Lee o crea el secreto TOTP personal del usuario. Se persiste una sola vez. */
    private String secretoPersonalDe(User usuario) {
        if (usuario.getTotpSecret() != null && !usuario.getTotpSecret().isBlank()) {
            return usuario.getTotpSecret();
        }
        String secret = totpService.generateSecret();
        usuario.setTotpSecret(secret);
        usuario.setTotpEnabled(true);
        userRepository.save(usuario);
        log.info("Secreto TOTP personal provisionado para {}", usuario.getEmail());
        return secret;
    }

    private RrhhAsistencia ultimaDeTipo(List<RrhhAsistencia> marcas, TipoMarcacion tipo) {
        RrhhAsistencia mejor = null;
        for (RrhhAsistencia m : marcas) {
            if (m.getTipoMarcacion() == tipo
                    && (mejor == null || m.getFechaHora().isAfter(mejor.getFechaHora()))) {
                mejor = m;
            }
        }
        return mejor;
    }

    /** Horas de quien entró pero aún no sale, contado hasta ahora. */
    private BigDecimal calcularHorasEnCurso(RrhhAsistencia entrada, RrhhAsistencia salida) {
        if (entrada == null || salida != null) return null;
        long minutos = ChronoUnit.MINUTES.between(entrada.getFechaHora(), LocalDateTime.now());
        if (minutos < 0) return BigDecimal.ZERO.setScale(2);
        return BigDecimal.valueOf(minutos / 60.0).setScale(2, RoundingMode.HALF_UP);
    }

    /** Dispositivo de la primera marcación: dice si el día se cerró por QR, kiosco o lote. */
    private String origen(List<RrhhAsistencia> marcas) {
        if (marcas.isEmpty()) return null;
        RrhhAsistencia primera = marcas.get(0);
        for (RrhhAsistencia m : marcas) {
            if (m.getFechaHora().isBefore(primera.getFechaHora())) primera = m;
        }
        return primera.getDispositivoInfo();
    }

    private String turnoDe(UUID empleadoId, LocalDateTime inicioDia) {
        return turnoTrabajoService.turnoDelDia(empleadoId, inicioDia)
                .map(t -> t.nombreTurno()).orElse(null);
    }

    private String nombre(User user) {
        return user.getNombre() + " " + user.getApellido();
    }

    private void exigirAdmin(User user) {
        if (user.getRol() == null || user.getRol().getNombre() != RolNombre.ROLE_ADMIN) {
            throw new SecurityException("Solo el administrador puede registrar asistencias por lote");
        }
    }

    private User usuarioActual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}