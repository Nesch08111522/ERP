package com.policalum.erp.application.service.serviceImpl;

import com.policalum.erp.application.dto.response.PoliticaRemuneracionDTO;
import com.policalum.erp.application.service.PoliticaRemuneracionService;
import com.policalum.erp.domain.enums.AmbitoPoliticaRemuneracion;
import com.policalum.erp.domain.enums.PoliticaDivisionSueldo;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.enums.TratamientoAusencias;
import com.policalum.erp.domain.model.ConfiguracionRrhh;
import com.policalum.erp.domain.model.RrhhLegajoDigital;
import com.policalum.erp.domain.model.Sede;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.exception.ResourceNotFoundException;
import com.policalum.erp.infrastructure.repository.ConfiguracionRrhhRepository;
import com.policalum.erp.infrastructure.repository.RrhhLegajoDigitalRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;
import com.policalum.erp.util.HorarioUtil;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Cadena de herencia y aritmética de la política de remuneración.
 *
 * <p>Todo lo que decide "entre cuántos días se divide" vive acá. Las tres pantallas que pueden
 * fijar la política (Parámetros RRHH, Sede y Legajo) validan con {@link #validarPolitica}, así
 * que ninguna puede guardar una combinación que después no se pueda calcular.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PoliticaRemuneracionServiceImpl implements PoliticaRemuneracionService {

    /** Convención legal peruana y valor histórico del sistema: mes de 30 días. */
    static final int DIAS_30 = 30;

    private final ConfiguracionRrhhRepository configuracionRepository;
    private final RrhhLegajoDigitalRepository legajoRepository;
    private final UserRepository userRepository;

    // ============ RESOLUCIÓN ============

    @Override
    public PoliticaRemuneracionDTO resolver(RrhhLegajoDigital legajo) {
        Efectiva p = efectiva(legajo);
        YearMonth actual = YearMonth.now();
        return new PoliticaRemuneracionDTO(p.division(), p.dias(), p.ausencias(),
                p.origenDivision(), p.origenDias(), p.origenAusencias(),
                divisor(p.division(), p.dias(), actual), actual.toString());
    }

    // ============ LIQUIDACIÓN ============

    @Override
    public LiquidacionSueldo liquidar(RrhhLegajoDigital legajo, YearMonth periodo) {
        Efectiva p = efectiva(legajo);

        if (!p.ausencias().estaImplementada()) {
            // No es un fallo de datos: es una política que el ERP todavía no sabe aplicar.
            // Mejor reventar la liquidación que pagar de más o de menos en silencio.
            throw new IllegalStateException("La política de ausencias " + p.ausencias()
                    + " aún no está implementada: no hay registro de inasistencias. Use NO_AFECTA.");
        }

        int divisor = divisor(p.division(), p.dias(), periodo);
        if (divisor <= 0) {
            throw new IllegalStateException("La política " + p.division() + " dio un divisor de "
                    + divisor + " días para " + periodo + ": revise la máscara de días laborables.");
        }
        int computados = diasComputados(p.division(), p.dias(), legajo.getFechaIngreso(), periodo);
        BigDecimal base = legajo.getSueldoBase() == null ? BigDecimal.ZERO : legajo.getSueldoBase();

        // Mismo orden de operaciones que la fórmula anterior: primero se multiplica y al final se
        // divide, para no acumular el error de un factor intermedio.
        BigDecimal sueldo = computados >= divisor ? dinero(base)
                : dinero(base.multiply(BigDecimal.valueOf(computados))
                        .divide(BigDecimal.valueOf(divisor), 4, RoundingMode.HALF_UP));

        return new LiquidacionSueldo(computados, divisor, p.division(), sueldo);
    }

    /**
     * Política efectiva resolviendo la cadena legajo → sede → empresa, campo por campo.
     * Una sola implementación para {@link #resolver} y {@link #liquidar}: dos cadenas paralelas
     * siempre terminarían divergiendo.
     */
    private Efectiva efectiva(RrhhLegajoDigital legajo) {
        ConfiguracionRrhh empresa = configuracionRepository.findById(ConfiguracionRrhh.ID_UNICO)
                .orElseGet(PoliticaRemuneracionServiceImpl::empresaPorDefecto);
        Sede sede = sedeDe(legajo);

        Nivel<PoliticaDivisionSueldo> division = heredar(
                legajo == null ? null : legajo.getPoliticaDivision(),
                sede == null ? null : sede.getPoliticaDivision(),
                empresa.getPoliticaDivision());
        Nivel<List<String>> dias = heredar(
                normalizarDias(legajo == null ? null : legajo.getDiasLaborables()),
                normalizarDias(sede == null ? null : sede.getDiasLaborables()),
                normalizarDias(empresa.getDiasLaborables()));
        Nivel<TratamientoAusencias> ausencias = heredar(
                legajo == null ? null : legajo.getTratamientoAusencias(),
                sede == null ? null : sede.getTratamientoAusencias(),
                empresa.getTratamientoAusencias());

        return new Efectiva(division.valor(), dias.valor(), ausencias.valor(),
                division.origen(), dias.origen(), ausencias.origen());
    }

    /** Los tres campos ya resueltos, con el nivel del que salió cada uno. */
    private record Efectiva(PoliticaDivisionSueldo division, List<String> dias,
                            TratamientoAusencias ausencias,
                            AmbitoPoliticaRemuneracion origenDivision,
                            AmbitoPoliticaRemuneracion origenDias,
                            AmbitoPoliticaRemuneracion origenAusencias) { }

    // ============ LECTURA POR EMPLEADO (para las pantallas) ============

    @Override
    public PoliticaRemuneracionDTO deEmpleado(UUID empleadoId) {
        User actual = usuarioActual();
        if (actual.getRol() == null || actual.getRol().getNombre() != RolNombre.ROLE_ADMIN) {
            throw new AccessDeniedException("Solo un administrador puede consultar la política de otro empleado");
        }
        return resolver(legajoDe(empleadoId));
    }

    @Override
    public PoliticaRemuneracionDTO mia() {
        return resolver(legajoDe(usuarioActual().getId()));
    }

    private RrhhLegajoDigital legajoDe(UUID empleadoId) {
        return legajoRepository.findDetalleByUserId(empleadoId)
                .orElseThrow(() -> new ResourceNotFoundException("El empleado " + empleadoId + " no tiene legajo"));
    }

    private User usuarioActual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new IllegalStateException("Usuario autenticado no válido"));
    }

    // ============ ARITMÉTICA (pura, sin estado) ============

    /** En cuántos días se divide el sueldo del periodo según la política. */
    static int divisor(PoliticaDivisionSueldo politica, List<String> diasLaborables, YearMonth mes) {
        return switch (politica) {
            case DIAS_30 -> DIAS_30;
            case DIAS_CALENDARIO -> mes.lengthOfMonth();
            case DIAS_LABORABLES -> contarEntre(diasLaborables, mes.atDay(1), mes.atEndOfMonth());
        };
    }

    /**
     * Días que se le computan al trabajador en el periodo.
     *
     * <p>Con {@code DIAS_30} se conserva textualmente la fórmula histórica
     * ({@code 30 - (día de ingreso - 1)}, mínimo 1), así que activar la política por defecto no
     * mueve ni un céntimo de las nóminas existentes.
     */
    static int diasComputados(PoliticaDivisionSueldo politica, List<String> diasLaborables,
                              LocalDate fechaIngreso, YearMonth mes) {
        int base = divisor(politica, diasLaborables, mes);
        if (fechaIngreso == null || fechaIngreso.isBefore(mes.atDay(1))) return base;
        if (fechaIngreso.isAfter(mes.atEndOfMonth())) return 0;
        return switch (politica) {
            case DIAS_30 -> Math.max(1, Math.min(DIAS_30, DIAS_30 - fechaIngreso.getDayOfMonth() + 1));
            case DIAS_CALENDARIO -> mes.lengthOfMonth() - fechaIngreso.getDayOfMonth() + 1;
            case DIAS_LABORABLES -> contarEntre(diasLaborables, fechaIngreso, mes.atEndOfMonth());
        };
    }

    /** Cuántos días del rango caen en la máscara. Vacía o inválida: se rechaza, no se asume. */
    static int contarEntre(List<String> diasLaborables, LocalDate desde, LocalDate hasta) {
        Set<DayOfWeek> dias = aDayOfWeek(diasLaborables);
        if (dias.isEmpty()) {
            throw new IllegalStateException("La política por días laborables exige al menos un día; "
                    + "configure la máscara en Parámetros RRHH, en la sede o en el legajo.");
        }
        int n = 0;
        for (LocalDate d = desde; !d.isAfter(hasta); d = d.plusDays(1)) {
            if (dias.contains(d.getDayOfWeek())) n++;
        }
        return n;
    }

    // ============ VALIDACIÓN DE ESCRITURA ============

    /**
     * Regla común a los tres niveles: los nombres de la máscara deben ser válidos y no se puede
     * activar un tratamiento de ausencias que el ERP todavía no sabe aplicar.
     *
     * <p>Aquí NO se exige que DIAS_LABORABLES traiga máscara propia: sede y legajo pueden
     * elegir esa política y heredar los días de la empresa. Ver
     * {@link #validarPoliticaEmpresa}, que sí la exige porque no hay nivel inferior que la cubra.
     */
    public static void validarPolitica(PoliticaDivisionSueldo division, List<String> diasLaborables,
                                       TratamientoAusencias ausencias) {
        if (diasLaborables != null && !diasLaborables.isEmpty()) {
            HorarioUtil.normalizarDias(diasLaborables); // rechaza nombres inválidos, sin guardarlos
        }
        if (ausencias != null && !ausencias.estaImplementada()) {
            throw new IllegalArgumentException("El tratamiento de ausencias " + ausencias
                    + " aún no está disponible: el ERP no registra inasistencias ni permisos."
                    + " Use NO_AFECTA hasta que exista ese registro");
        }
    }

    /** Nivel empresa: última instancia de la herencia, así que una política sin máscara sería irreversible. */
    public static void validarPoliticaEmpresa(PoliticaDivisionSueldo division, List<String> diasLaborables,
                                              TratamientoAusencias ausencias) {
        validarPolitica(division, diasLaborables, ausencias);
        if (division == PoliticaDivisionSueldo.DIAS_LABORABLES
                && (diasLaborables == null || diasLaborables.isEmpty())) {
            throw new IllegalArgumentException("La división por días laborables exige marcar al menos un día de la semana");
        }
    }

    // ============ HELPERS ============

    /** Fila en memoria para instalaciones donde la singleton todavía no existe. */
    private static ConfiguracionRrhh empresaPorDefecto() {
        return ConfiguracionRrhh.builder()
                .id(ConfiguracionRrhh.ID_UNICO)
                .politicaDivision(ConfiguracionRrhh.DIVISION_DEFAULT)
                .tratamientoAusencias(ConfiguracionRrhh.AUSENCIAS_DEFAULT)
                .diasLaborables(ConfiguracionRrhh.DIAS_LABORABLES_DEFAULT)
                .build();
    }

    private static Sede sedeDe(RrhhLegajoDigital legajo) {
        return legajo == null || legajo.getUser() == null ? null : legajo.getUser().getSede();
    }

    /** Lista vacía equivale a "no definido": una máscara vacía no es una decisión, es ruido. */
    private static List<String> normalizarDias(List<String> dias) {
        if (dias == null || dias.isEmpty()) return null;
        return HorarioUtil.normalizarDias(dias);
    }

    private static Set<DayOfWeek> aDayOfWeek(List<String> dias) {
        Set<DayOfWeek> out = EnumSet.noneOf(DayOfWeek.class);
        if (dias == null) return out;
        for (String d : dias) {
            DayOfWeek dia = HorarioUtil.aDayOfWeekONull(d);
            if (dia != null) out.add(dia);
        }
        return out;
    }

    private static BigDecimal dinero(BigDecimal valor) {
        return valor.setScale(2, RoundingMode.HALF_UP);
    }

    /** Valor resuelto + de qué nivel salió, para que la UI pueda explicar la herencia. */
    private record Nivel<T>(T valor, AmbitoPoliticaRemuneracion origen) { }

    private static <T> Nivel<T> heredar(T delEmpleado, T delSede, T deLaEmpresa) {
        if (delEmpleado != null) return new Nivel<>(delEmpleado, AmbitoPoliticaRemuneracion.EMPLEADO);
        if (delSede != null) return new Nivel<>(delSede, AmbitoPoliticaRemuneracion.SEDE);
        return new Nivel<>(deLaEmpresa, AmbitoPoliticaRemuneracion.EMPRESA);
    }

    /** Lista ordenada de LUNES a DOMINGO: se usa en los mensajes de error. */
    static List<String> diasValidos() {
        List<String> out = new ArrayList<>();
        for (DayOfWeek d : EnumSet.allOf(DayOfWeek.class)) out.add(HorarioUtil.nombre(d));
        return out;
    }
}
