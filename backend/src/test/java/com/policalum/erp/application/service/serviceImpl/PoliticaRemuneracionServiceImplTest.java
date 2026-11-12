package com.policalum.erp.application.service.serviceImpl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.policalum.erp.application.dto.response.PoliticaRemuneracionDTO;
import com.policalum.erp.application.service.PoliticaRemuneracionService.LiquidacionSueldo;
import com.policalum.erp.domain.enums.AmbitoPoliticaRemuneracion;
import com.policalum.erp.domain.enums.PoliticaDivisionSueldo;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.enums.TratamientoAusencias;
import com.policalum.erp.domain.model.ConfiguracionRrhh;
import com.policalum.erp.domain.model.Rol;
import com.policalum.erp.domain.model.RrhhLegajoDigital;
import com.policalum.erp.domain.model.Sede;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.infrastructure.repository.ConfiguracionRrhhRepository;
import com.policalum.erp.infrastructure.repository.RrhhLegajoDigitalRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

/**
 * La política de remuneración (§8.1): aritmética del prorrateo y cadena de herencia.
 *
 * <p>Los importes esperados están calculados a mano sobre calendarios reales de 2026, no
 * generados por el propio código:
 * <ul>
 *   <li>octubre 2026: 31 días, 22 de lunes a viernes, 27 de lunes a sábado (1/10 = jueves)</li>
 *   <li>febrero 2026: 28 días, 20 laborables L-V</li>
 *   <li>septiembre 2026: 30 días</li>
 * </ul>
 */
@ExtendWith(MockitoExtension.class)
class PoliticaRemuneracionServiceImplTest {

    @Mock ConfiguracionRrhhRepository configuracionRepository;
    @Mock RrhhLegajoDigitalRepository legajoRepository;
    @Mock UserRepository userRepository;
    @InjectMocks PoliticaRemuneracionServiceImpl service;

    private static final YearMonth OCTUBRE_2026 = YearMonth.of(2026, 10);
    private static final YearMonth SEPTIEMBRE_2026 = YearMonth.of(2026, 9);
    private static final YearMonth FEBRERO_2026 = YearMonth.of(2026, 2);
    private static final List<String> L_V = List.of("LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES");

    UUID legajoId = UUID.randomUUID();
    Sede sede;
    User empleado;

    @BeforeEach
    void setUp() {
        sede = Sede.builder().id(UUID.randomUUID()).nombre("Trujillo Centro").activa(true).build();
        empleado = User.builder().id(UUID.randomUUID()).nombre("Ana").apellido("Prueba")
                .email("ana@policalum.com").activo(true).sede(sede)
                .rol(Rol.builder().nombre(RolNombre.ROLE_MULTIFUNCIONAL).build()).build();
    }

    // ===================== ARITMÉTICA: DIAS_30 (no regresión) =====================

    @Test
    void dias30_reproduceExactamenteLaFormulaHistorica() {
        empresa(PoliticaDivisionSueldo.DIAS_30, L_V);

        // Los cinco casos que probaba NominaServiceImpl.diasComputados antes del cambio.
        assertEquals(30, service.liquidar(legajo(PoliticaDivisionSueldo.DIAS_30, LocalDate.of(2025, 5, 1)), SEPTIEMBRE_2026).diasComputados());
        assertEquals(30, service.liquidar(legajo(PoliticaDivisionSueldo.DIAS_30, LocalDate.of(2026, 9, 1)), SEPTIEMBRE_2026).diasComputados());
        assertEquals(1, service.liquidar(legajo(PoliticaDivisionSueldo.DIAS_30, LocalDate.of(2026, 9, 30)), SEPTIEMBRE_2026).diasComputados());
        assertEquals(0, service.liquidar(legajo(PoliticaDivisionSueldo.DIAS_30, LocalDate.of(2026, 10, 1)), SEPTIEMBRE_2026).diasComputados());
        assertEquals(1, service.liquidar(legajo(PoliticaDivisionSueldo.DIAS_30, LocalDate.of(2026, 10, 31)), OCTUBRE_2026).diasComputados());
    }

    @Test
    void dias30_ingresoAMitadDeMes_daLosMismosOchocientosDeSiempre() {
        empresa(PoliticaDivisionSueldo.DIAS_30, L_V);

        // 1500 × 16 / 30 = 800.00, con 16 = 30 - (15 - 1)
        LiquidacionSueldo l = service.liquidar(legajo(null, LocalDate.of(2026, 10, 15)), OCTUBRE_2026);
        assertEquals(16, l.diasComputados());
        assertEquals(30, l.divisor());
        assertEquals(new BigDecimal("800.00"), l.sueldo());
        assertEquals(PoliticaDivisionSueldo.DIAS_30, l.politica());
    }

    // ===================== ARITMÉTICA: las otras dos políticas =====================

    @Test
    void diasCalendario_usaLos31DiasRealesDeOctubre() {
        empresa(PoliticaDivisionSueldo.DIAS_CALENDARIO, L_V);

        // Del 15 al 31 inclusive son 17 días reales, no 16. 1500 × 17 / 31 = 822.5806 → 822.58
        LiquidacionSueldo l = service.liquidar(legajo(null, LocalDate.of(2026, 10, 15)), OCTUBRE_2026);
        assertEquals(17, l.diasComputados());
        assertEquals(31, l.divisor());
        assertEquals(new BigDecimal("822.58"), l.sueldo());
    }

    @Test
    void diasLaborables_cuentaLosDiasDeLaMascaraTantoArribaComoAbajo() {
        empresa(PoliticaDivisionSueldo.DIAS_LABORABLES, L_V);

        // Octubre 2026 tiene 22 días L-V; del 15 al 31 hay 12. 1500 × 12 / 22 = 818.1818 → 818.18
        LiquidacionSueldo l = service.liquidar(legajo(null, LocalDate.of(2026, 10, 15)), OCTUBRE_2026);
        assertEquals(12, l.diasComputados());
        assertEquals(22, l.divisor());
        assertEquals(new BigDecimal("818.18"), l.sueldo());
    }

    /** El corazón de §8.1: "no asumir que todos los casos se dividen entre 30". */
    @Test
    void enFebrero_todasLasPoliticasDanResultadosDistintos() {
        RrhhLegajoDigital ingresoMediado = legajo(null, LocalDate.of(2026, 2, 15));

        empresa(PoliticaDivisionSueldo.DIAS_30, L_V);
        LiquidacionSueldo treinta = service.liquidar(ingresoMediado, FEBRERO_2026);
        assertEquals(16, treinta.diasComputados());
        assertEquals(30, treinta.divisor());
        assertEquals(new BigDecimal("800.00"), treinta.sueldo());

        empresa(PoliticaDivisionSueldo.DIAS_CALENDARIO, L_V);
        LiquidacionSueldo calendario = service.liquidar(ingresoMediado, FEBRERO_2026);
        assertEquals(14, calendario.diasComputados());   // del 15 al 28
        assertEquals(28, calendario.divisor());
        assertEquals(new BigDecimal("750.00"), calendario.sueldo());

        empresa(PoliticaDivisionSueldo.DIAS_LABORABLES, L_V);
        LiquidacionSueldo laborable = service.liquidar(ingresoMediado, FEBRERO_2026);
        assertEquals(10, laborable.diasComputados());
        assertEquals(20, laborable.divisor());
        assertEquals(new BigDecimal("750.00"), laborable.sueldo());
    }

    /** Quien trabajó todo el mes cobra el sueldo pactado, sin perder céntimos por redondeo. */
    @Test
    void mesCompleto_ningunaPoliticaRecortaElSueldo() {
        RrhhLegajoDigital antiguo = legajo(null, LocalDate.of(2024, 1, 10));

        empresa(PoliticaDivisionSueldo.DIAS_30, L_V);
        assertEquals(new BigDecimal("1500.00"), service.liquidar(antiguo, OCTUBRE_2026).sueldo());

        empresa(PoliticaDivisionSueldo.DIAS_CALENDARIO, L_V);
        assertEquals(new BigDecimal("1500.00"), service.liquidar(antiguo, OCTUBRE_2026).sueldo());

        empresa(PoliticaDivisionSueldo.DIAS_LABORABLES, L_V);
        LiquidacionSueldo l = service.liquidar(antiguo, OCTUBRE_2026);
        assertEquals(new BigDecimal("1500.00"), l.sueldo());
        assertTrue(l.mesCompleto());
    }

    @Test
    void ingresoPosteriorAlPeriodo_noComputaDiasNiSueldo() {
        empresa(PoliticaDivisionSueldo.DIAS_LABORABLES, L_V);

        LiquidacionSueldo l = service.liquidar(legajo(null, LocalDate.of(2026, 11, 3)), OCTUBRE_2026);
        assertEquals(0, l.diasComputados());
        assertEquals(22, l.divisor());
        assertEquals(new BigDecimal("0.00"), l.sueldo());
    }

    @Test
    void sinFechaDeIngreso_noInventaMedioMes() {
        empresa(PoliticaDivisionSueldo.DIAS_CALENDARIO, L_V);

        LiquidacionSueldo l = service.liquidar(legajo(null, null), OCTUBRE_2026);
        assertEquals(31, l.diasComputados());
        assertEquals(new BigDecimal("1500.00"), l.sueldo());
    }

    // ===================== HERENCIA: legajo -> sede -> empresa =====================

    @Test
    void cuandoNadieDefine_mandaLaEmpresa() {
        empresa(PoliticaDivisionSueldo.DIAS_CALENDARIO, L_V);

        PoliticaRemuneracionDTO p = service.resolver(legajo(null, LocalDate.of(2026, 10, 15)));
        assertEquals(PoliticaDivisionSueldo.DIAS_CALENDARIO, p.division());
        assertEquals(AmbitoPoliticaRemuneracion.EMPRESA, p.origenDivision());
        assertEquals(diasCalendario(YearMonth.now()), p.divisorMesEnCurso());
    }

    @Test
    void laSedeLeGanaALaEmpresa() {
        empresa(PoliticaDivisionSueldo.DIAS_30, L_V);
        sede.setPoliticaDivision(PoliticaDivisionSueldo.DIAS_CALENDARIO);

        PoliticaRemuneracionDTO p = service.resolver(legajo(null, LocalDate.of(2026, 10, 15)));
        assertEquals(PoliticaDivisionSueldo.DIAS_CALENDARIO, p.division());
        assertEquals(AmbitoPoliticaRemuneracion.SEDE, p.origenDivision());
    }

    @Test
    void elLegajoLeGanaALaSedeYALaEmpresa() {
        empresa(PoliticaDivisionSueldo.DIAS_30, L_V);
        sede.setPoliticaDivision(PoliticaDivisionSueldo.DIAS_CALENDARIO);

        PoliticaRemuneracionDTO p = service.resolver(legajo(PoliticaDivisionSueldo.DIAS_LABORABLES,
                LocalDate.of(2026, 10, 15)));
        assertEquals(PoliticaDivisionSueldo.DIAS_LABORABLES, p.division());
        assertEquals(AmbitoPoliticaRemuneracion.EMPLEADO, p.origenDivision());
    }

    /** Se hereda campo por campo: cambiar solo la división no descarta la máscara de arriba. */
    @Test
    void laHerenciaEsPorCampoNoPorBloque() {
        empresa(PoliticaDivisionSueldo.DIAS_30, List.of("LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"));

        RrhhLegajoDigital l = legajo(PoliticaDivisionSueldo.DIAS_LABORABLES, LocalDate.of(2026, 10, 15));
        PoliticaRemuneracionDTO p = service.resolver(l);

        assertEquals(PoliticaDivisionSueldo.DIAS_LABORABLES, p.division());
        assertEquals(AmbitoPoliticaRemuneracion.EMPLEADO, p.origenDivision());
        assertEquals(AmbitoPoliticaRemuneracion.EMPRESA, p.origenDiasLaborables());
        assertEquals(List.of("LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"), p.diasLaborables());
        assertEquals(diasConMascara(List.of("LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"),
                YearMonth.now()), p.divisorMesEnCurso());
    }

    /** Una lista vacía no es una decisión: es "no definido", y por tanto hereda. */
    @Test
    void mascaraVacia_enUnNivelInferiorHeredaLaDeArriba() {
        empresa(PoliticaDivisionSueldo.DIAS_LABORABLES, L_V);

        RrhhLegajoDigital l = legajo(PoliticaDivisionSueldo.DIAS_LABORABLES, LocalDate.of(2026, 10, 15));
        l.setDiasLaborables(List.of());
        PoliticaRemuneracionDTO p = service.resolver(l);

        assertEquals(AmbitoPoliticaRemuneracion.EMPRESA, p.origenDiasLaborables());
        assertEquals(diasConMascara(L_V, YearMonth.now()), p.divisorMesEnCurso());
    }

    @Test
    void empleadoSinSede_saltaDirectamenteALaEmpresa() {
        empresa(PoliticaDivisionSueldo.DIAS_30, L_V);
        User sinSede = User.builder().id(empleado.getId()).nombre("Ana").apellido("Prueba")
                .email("ana@policalum.com").activo(true).rol(empleado.getRol()).build();
        RrhhLegajoDigital l = legajo(null, LocalDate.of(2026, 10, 15));
        l.setUser(sinSede);

        PoliticaRemuneracionDTO p = service.resolver(l);
        assertEquals(AmbitoPoliticaRemuneracion.EMPRESA, p.origenDivision());
    }

    @Test
    void losTildesYMayusculasDeLaMascaraNoAlteringanLaHerencia() {
        empresa(PoliticaDivisionSueldo.DIAS_LABORABLES, L_V);

        RrhhLegajoDigital l = legajo(PoliticaDivisionSueldo.DIAS_LABORABLES, LocalDate.of(2026, 10, 15));
        l.setDiasLaborables(List.of("viernes", "LUNES", "lunes"));
        PoliticaRemuneracionDTO p = service.resolver(l);

        assertEquals(List.of("LUNES", "VIERNES"), p.diasLaborables());
        assertEquals(AmbitoPoliticaRemuneracion.EMPLEADO, p.origenDiasLaborables());
    }

    // ===================== DEFENSAS =====================

    @Test
    void laborablesSinMascaraEnNingunNivel_rechazaLiquidarEnVezDeAsumir30() {
        empresa(PoliticaDivisionSueldo.DIAS_LABORABLES, null);

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> service.liquidar(legajo(null, LocalDate.of(2026, 10, 15)), OCTUBRE_2026));
        assertTrue(ex.getMessage().contains("días laborables"));
    }

    @Test
    void politicaDeAusenciasNoImplementada_rechazaLiquidar() {
        ConfiguracionRrhh c = empresa(PoliticaDivisionSueldo.DIAS_30, L_V);
        c.setTratamientoAusencias(TratamientoAusencias.DESCUENTO_DIAS_SIN_MARCACION);
        when(configuracionRepository.findById(1L)).thenReturn(Optional.of(c));

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> service.liquidar(legajo(null, LocalDate.of(2026, 10, 15)), OCTUBRE_2026));
        assertTrue(ex.getMessage().contains("NO_AFECTA"));
    }

    @Test
    void sinFilaDeConfiguracion_usaLosValoresDeFabricaSinExplotar() {
        when(configuracionRepository.findById(1L)).thenReturn(Optional.empty());

        LiquidacionSueldo l = service.liquidar(legajo(null, LocalDate.of(2026, 10, 15)), OCTUBRE_2026);
        assertEquals(30, l.divisor());
        assertEquals(new BigDecimal("800.00"), l.sueldo());
    }

    // ===================== VALIDACIÓN DE ESCRITURA =====================

    @Test
    void nivelEmpresa_exigeMascaraSiElegeLaborables() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                PoliticaRemuneracionServiceImpl.validarPoliticaEmpresa(
                        PoliticaDivisionSueldo.DIAS_LABORABLES, List.of(), TratamientoAusencias.NO_AFECTA));
        assertTrue(ex.getMessage().contains("al menos un día"));
    }

    /** Sede y legajo pueden elegir DIAS_LABORABLES sin máscara: la heredan de la empresa. */
    @Test
    void nivelInferior_permiteDejarLaMascaraEnBlanco() {
        assertDoesNotThrow(() -> PoliticaRemuneracionServiceImpl.validarPolitica(
                PoliticaDivisionSueldo.DIAS_LABORABLES, null, TratamientoAusencias.NO_AFECTA));
    }

    @Test
    void rechazaElTratamientoDeAusenciasQueNoEstaImplementado() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                PoliticaRemuneracionServiceImpl.validarPoliticaEmpresa(PoliticaDivisionSueldo.DIAS_30, L_V,
                        TratamientoAusencias.DESCUENTO_DIAS_SIN_MARCACION));
        assertTrue(ex.getMessage().contains("inasistencias"));
    }

    @Test
    void rechazaNombresDeDiaInvalidosAntesDeGuardarlos() {
        assertThrows(IllegalArgumentException.class, () -> PoliticaRemuneracionServiceImpl.validarPolitica(
                PoliticaDivisionSueldo.DIAS_LABORABLES, List.of("FERIADO"), TratamientoAusencias.NO_AFECTA));
    }

    // ===================== HELPERS =====================

    /**
     * Oráculos del divisor para el mes corriente, calculados aquí con java.time en vez de reusar
     * el código probado. {@code resolver()} devuelve el divisor del mes en curso, así que una
     * expectativa fija ("22") se rompería al cambiar de mes: estos conteos valen siempre.
     */
    private static int diasCalendario(YearMonth mes) {
        return mes.lengthOfMonth();
    }

    private static int diasConMascara(List<String> mascara, YearMonth mes) {
        int n = 0;
        for (LocalDate d = mes.atDay(1); !d.isAfter(mes.atEndOfMonth()); d = d.plusDays(1)) {
            if (mascara.contains(diaEnEspanol(d.getDayOfWeek()))) n++;
        }
        return n;
    }

    /** Traducción propia, para no apoyarse en HorarioUtil dentro de la prueba. */
    private static String diaEnEspanol(java.time.DayOfWeek d) {
        return switch (d) {
            case MONDAY -> "LUNES"; case TUESDAY -> "MARTES"; case WEDNESDAY -> "MIERCOLES";
            case THURSDAY -> "JUEVES"; case FRIDAY -> "VIERNES"; case SATURDAY -> "SABADO";
            case SUNDAY -> "DOMINGO";
        };
    }

    private ConfiguracionRrhh empresa(PoliticaDivisionSueldo division, List<String> dias) {
        ConfiguracionRrhh c = ConfiguracionRrhh.builder().id(1L).politicaDivision(division)
                .diasLaborables(dias).tratamientoAusencias(TratamientoAusencias.NO_AFECTA).build();
        when(configuracionRepository.findById(1L)).thenReturn(Optional.of(c));
        return c;
    }

    /** Sueldo base 1500.00; `division` null = el legajo no sobreescribe. */
    private RrhhLegajoDigital legajo(PoliticaDivisionSueldo division, LocalDate ingreso) {
        return RrhhLegajoDigital.builder().id(legajoId).user(empleado).tipoContrato("PLANILLA")
                .fechaIngreso(ingreso).sueldoBase(new BigDecimal("1500.00"))
                .porcentajeComision(BigDecimal.ZERO).politicaDivision(division).activo(true).build();
    }
}
