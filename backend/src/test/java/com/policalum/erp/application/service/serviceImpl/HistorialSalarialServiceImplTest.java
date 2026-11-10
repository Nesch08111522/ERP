package com.policalum.erp.application.service.serviceImpl;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.policalum.erp.application.dto.response.HistorialSalarialResponseDTO;
import com.policalum.erp.application.service.HistorialSalarialService.Retrato;
import com.policalum.erp.domain.model.RrhhHistorialSalarial;
import com.policalum.erp.domain.model.RrhhLegajoDigital;
import com.policalum.erp.domain.model.Rol;
import com.policalum.erp.domain.model.Sede;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.exception.ResourceNotFoundException;
import com.policalum.erp.infrastructure.repository.RrhhHistorialSalarialRepository;
import com.policalum.erp.infrastructure.repository.RrhhLegajoDigitalRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class HistorialSalarialServiceImplTest {

    @Mock RrhhHistorialSalarialRepository historialRepository;
    @Mock RrhhLegajoDigitalRepository legajoRepository;
    @Mock UserRepository userRepository;
    @InjectMocks HistorialSalarialServiceImpl service;

    private static final String EMAIL = "admin@policalum.com";
    UUID legajoId = UUID.randomUUID();
    Sede sede;
    User admin;
    User empleadoUser;
    RrhhLegajoDigital legajo;

    @BeforeEach
    void setUp() {
        sede = Sede.builder().id(UUID.randomUUID()).nombre("Trujillo Centro").build();
        admin = usuario("Miguel", RolNombre.ROLE_ADMIN);
        empleadoUser = usuario("Ana", RolNombre.ROLE_MULTIFUNCIONAL);
        legajo = legajo();

        SecurityContext context = mock(SecurityContext.class);
        Authentication auth = mock(Authentication.class);
        lenient().when(auth.getName()).thenReturn(EMAIL);
        lenient().when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);
        lenient().when(userRepository.findByEmailAndActivoTrue(EMAIL)).thenReturn(Optional.of(admin));
        lenient().when(historialRepository.save(any())).thenAnswer(i -> i.getArgument(0));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    // ===================== ESCRITURA =====================

    @Test
    void alta_registraElSueldoInicialSinAnterior() {
        service.registrarCambios(null, legajo, legajo.getFechaIngreso(),
                HistorialSalarialServiceImpl.MOTIVO_INICIAL, admin);

        ArgumentCaptor<RrhhHistorialSalarial> captor = ArgumentCaptor.forClass(RrhhHistorialSalarial.class);
        verify(historialRepository).save(captor.capture());
        RrhhHistorialSalarial fila = captor.getValue();
        assertSame(legajo, fila.getLegajo());
        assertNull(fila.getSueldoAnterior(), "el sueldo inicial no tiene un antes");
        assertEquals(new BigDecimal("1500.00"), fila.getSueldoNuevo());
        assertEquals(new BigDecimal("3.00"), fila.getComisionNuevo());
        assertEquals(LocalDate.of(2024, 3, 1), fila.getVigenciaDesde());
        assertNull(fila.getTipoContratoAnterior());
        assertEquals("PLANILLA", fila.getTipoContratoNuevo());
        assertSame(admin, fila.getRegistradoPor());
    }

    @Test
    void sinCambioRemunerativo_noEscribeNada() {
        service.registrarCambios(retrato("PLANILLA", "1500.00", "3.00", 15), legajo,
                LocalDate.of(2026, 1, 10), "nada", admin);

        verify(historialRepository, never()).save(any());
    }

    /** 1500 y 1500.00 son el mismo sueldo: equals() de BigDecimal los distingue y crearía filas fantasma. */
    @Test
    void mismoSueldoConOtraEscala_noEscribeNada() {
        service.registrarCambios(retrato("PLANILLA", "1500", "3", 15), legajo,
                LocalDate.of(2026, 1, 10), null, admin);

        verify(historialRepository, never()).save(any());
    }

    @Test
    void subidaDeSueldo_escribeAnteriorYNuevo() {
        service.registrarCambios(retrato("PLANILLA", "1500.00", "3.00", 15), legajo("1800.00"),
                LocalDate.of(2026, 1, 10), "Aumento por desempeño", admin);

        ArgumentCaptor<RrhhHistorialSalarial> captor = ArgumentCaptor.forClass(RrhhHistorialSalarial.class);
        verify(historialRepository).save(captor.capture());
        RrhhHistorialSalarial fila = captor.getValue();
        assertEquals(new BigDecimal("1500.00"), fila.getSueldoAnterior());
        assertEquals(new BigDecimal("1800.00"), fila.getSueldoNuevo());
        assertEquals(new BigDecimal("3.00"), fila.getComisionAnterior());
        assertEquals(new BigDecimal("3.00"), fila.getComisionNuevo());
        assertEquals("Aumento por desempeño", fila.getMotivo());
    }

    @Test
    void soloCambiaComision_escribe() {
        service.registrarCambios(retrato("PLANILLA", "1500.00", "1.00", 15), legajo("1500.00", "5.00", 15),
                LocalDate.of(2026, 1, 10), null, admin);

        ArgumentCaptor<RrhhHistorialSalarial> captor = ArgumentCaptor.forClass(RrhhHistorialSalarial.class);
        verify(historialRepository).save(captor.capture());
        assertEquals(new BigDecimal("1.00"), captor.getValue().getComisionAnterior());
        assertEquals(new BigDecimal("5.00"), captor.getValue().getComisionNuevo());
        assertNull(captor.getValue().getMotivo());
    }

    @Test
    void soloCambiaTipoContrato_escribe() {
        service.registrarCambios(retrato("CAS", "1500.00", "3.00", 15), legajo,
                LocalDate.of(2026, 1, 10), "Paso a planilla", admin);

        ArgumentCaptor<RrhhHistorialSalarial> captor = ArgumentCaptor.forClass(RrhhHistorialSalarial.class);
        verify(historialRepository).save(captor.capture());
        assertEquals("CAS", captor.getValue().getTipoContratoAnterior());
        assertEquals("PLANILLA", captor.getValue().getTipoContratoNuevo());
    }

    /** null != 15: quitar el día de paga también es un cambio remunerativo. */
    @Test
    void soloCambiaDiaCobro_escribe() {
        service.registrarCambios(retrato("PLANILLA", "1500.00", "3.00", null), legajo,
                LocalDate.of(2026, 1, 10), null, admin);

        ArgumentCaptor<RrhhHistorialSalarial> captor = ArgumentCaptor.forClass(RrhhHistorialSalarial.class);
        verify(historialRepository).save(captor.capture());
        assertNull(captor.getValue().getDiaCobroAnterior());
        assertEquals(15, captor.getValue().getDiaCobroNuevo());
    }

    @Test
    void vigenciaNull_usaLaFechaDeHoy() {
        service.registrarCambios(retrato("PLANILLA", "1500.00", "3.00", 15), legajo("1800.00"),
                null, "sin fecha", admin);

        ArgumentCaptor<RrhhHistorialSalarial> captor = ArgumentCaptor.forClass(RrhhHistorialSalarial.class);
        verify(historialRepository).save(captor.capture());
        assertEquals(LocalDate.now(), captor.getValue().getVigenciaDesde());
    }

    @Test
    void vigenciaFutura_rechazaYNoEscribe() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                service.registrarCambios(retrato("PLANILLA", "1500.00", "3.00", 15), legajo("1800.00"),
                        LocalDate.now().plusDays(1), null, admin));

        assertTrue(ex.getMessage().contains("futura"));
        verify(historialRepository, never()).save(any());
    }

    @Test
    void vigenciaAnteriorAlIngreso_rechaza() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                service.registrarCambios(retrato("PLANILLA", "1500.00", "3.00", 15), legajo("1800.00"),
                        LocalDate.of(2023, 1, 1), null, admin));

        assertTrue(ex.getMessage().contains("fecha de ingreso"));
        verify(historialRepository, never()).save(any());
    }

    @Test
    void vigenciaQueRetrocedeElHistorial_rechaza() {
        when(historialRepository.findFirstByLegajo_IdOrderByVigenciaDesdeDescCreatedAtDesc(legajoId))
                .thenReturn(Optional.of(fila(LocalDate.of(2026, 5, 1), "1500.00", "1500.00")));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                service.registrarCambios(retrato("PLANILLA", "1500.00", "3.00", 15), legajo("1800.00"),
                        LocalDate.of(2026, 1, 1), null, admin));

        assertTrue(ex.getMessage().contains("última registrada"));
        verify(historialRepository, never()).save(any());
    }

    /** Dos ajustes el mismo día son legítimos: el historial no se ordena por unicidad de fecha. */
    @Test
    void vigenciaIgualALaUltima_siSePermite() {
        when(historialRepository.findFirstByLegajo_IdOrderByVigenciaDesdeDescCreatedAtDesc(legajoId))
                .thenReturn(Optional.of(fila(LocalDate.of(2026, 5, 1), "1500.00", "1500.00")));

        service.registrarCambios(retrato("PLANILLA", "1500.00", "3.00", 15), legajo("1800.00"),
                LocalDate.of(2026, 5, 1), "Corrección el mismo día", admin);

        verify(historialRepository).save(any());
    }

    @Test
    void motivoLargo_seRecortaA255() {
        service.registrarCambios(retrato("PLANILLA", "1500.00", "3.00", 15), legajo("1800.00"),
                LocalDate.of(2026, 1, 10), "x".repeat(300), admin);

        ArgumentCaptor<RrhhHistorialSalarial> captor = ArgumentCaptor.forClass(RrhhHistorialSalarial.class);
        verify(historialRepository).save(captor.capture());
        assertEquals(255, captor.getValue().getMotivo().length());
    }

    // ===================== LECTURA =====================

    @Test
    void listarPorEmpleado_multifuncional_lanzaAccessDeniedSinConsultar() {
        when(userRepository.findByEmailAndActivoTrue(EMAIL)).thenReturn(Optional.of(empleadoUser));

        assertThrows(AccessDeniedException.class, () -> service.listarPorEmpleado(empleadoUser.getId()));
        verifyNoInteractions(historialRepository);
    }

    @Test
    void listarPorEmpleado_sinLegajo_lanzaNotFound() {
        when(legajoRepository.findDetalleByUserId(empleadoUser.getId())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.listarPorEmpleado(empleadoUser.getId()));
    }

    @Test
    void lineaDeTiempo_calculaHastaYVigenteYDevuelveRecientePrimero() {
        RrhhHistorialSalarial inicial = fila(LocalDate.of(2024, 3, 1), null, "1500.00");
        RrhhHistorialSalarial segundo = fila(LocalDate.of(2025, 1, 15), "1500.00", "1800.00");
        RrhhHistorialSalarial tercero = fila(LocalDate.of(2026, 6, 1), "1800.00", "2000.00");
        when(legajoRepository.findDetalleByUserId(empleadoUser.getId())).thenReturn(Optional.of(legajo));
        when(historialRepository.findTimelineByLegajo(legajoId)).thenReturn(List.of(inicial, segundo, tercero));

        List<HistorialSalarialResponseDTO> historial = service.listarPorEmpleado(empleadoUser.getId());

        assertEquals(3, historial.size());
        HistorialSalarialResponseDTO cabeza = historial.get(0);
        assertEquals(LocalDate.of(2026, 6, 1), cabeza.vigenciaDesde());
        assertNull(cabeza.vigenciaHasta());
        assertTrue(cabeza.vigente());
        assertEquals(new BigDecimal("200.00"), cabeza.sueldoDelta());

        HistorialSalarialResponseDTO delMedio = historial.get(1);
        assertEquals(LocalDate.of(2025, 1, 15), delMedio.vigenciaDesde());
        assertEquals(LocalDate.of(2026, 6, 1), delMedio.vigenciaHasta());
        assertFalse(delMedio.vigente());
        assertEquals(new BigDecimal("300.00"), delMedio.sueldoDelta());

        HistorialSalarialResponseDTO cola = historial.get(2);
        assertEquals(LocalDate.of(2024, 3, 1), cola.vigenciaDesde());
        assertEquals(LocalDate.of(2025, 1, 15), cola.vigenciaHasta());
        assertNull(cola.sueldoDelta(), "sin sueldo anterior no se inventa una subida");
        assertNull(cola.sueldoAnterior());
        assertEquals(legajoId, cola.legajoId());
        assertEquals("Miguel Prueba", cola.registradoPorNombre());
    }

    @Test
    void listarMio_multifuncional_siPuedeVerElSuyo() {
        User ana = usuario("Ana", RolNombre.ROLE_MULTIFUNCIONAL);
        when(userRepository.findByEmailAndActivoTrue(EMAIL)).thenReturn(Optional.of(ana));
        when(legajoRepository.findDetalleByUserId(ana.getId())).thenReturn(Optional.of(legajo));
        when(historialRepository.findTimelineByLegajo(legajoId)).thenReturn(List.of());

        assertTrue(service.listarMio().isEmpty());
    }

    @Test
    void listarMio_sinLegajo_lanzaNotFound() {
        when(legajoRepository.findDetalleByUserId(admin.getId())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.listarMio());
    }

    // ===================== HELPERS =====================

    private RrhhLegajoDigital legajo() {
        return legajo("1500.00", "3.00", 15);
    }

    private RrhhLegajoDigital legajo(String sueldo) {
        return legajo(sueldo, "3.00", 15);
    }

    private RrhhLegajoDigital legajo(String sueldo, String comision, Integer diaCobro) {
        return RrhhLegajoDigital.builder().id(legajoId).user(empleadoUser)
                .tipoContrato("PLANILLA").fechaIngreso(LocalDate.of(2024, 3, 1))
                .sueldoBase(new BigDecimal(sueldo)).porcentajeComision(new BigDecimal(comision))
                .diaCobro(diaCobro).activo(true).build();
    }

    private Retrato retrato(String contrato, String sueldo, String comision, Integer diaCobro) {
        return new Retrato(contrato, new BigDecimal(sueldo), new BigDecimal(comision), diaCobro);
    }

    private RrhhHistorialSalarial fila(LocalDate vigencia, String sueldoAnterior, String sueldoNuevo) {
        return RrhhHistorialSalarial.builder()
                .id(UUID.randomUUID()).legajo(legajo).vigenciaDesde(vigencia)
                .tipoContratoNuevo("PLANILLA")
                .sueldoAnterior(sueldoAnterior == null ? null : new BigDecimal(sueldoAnterior))
                .sueldoNuevo(new BigDecimal(sueldoNuevo))
                .comisionNuevo(new BigDecimal("3.00"))
                .createdAt(LocalDateTime.of(2026, 1, 1, 9, 0))
                .registradoPor(admin)
                .build();
    }

    private User usuario(String nombre, RolNombre rol) {
        return User.builder().id(UUID.randomUUID()).nombre(nombre).apellido("Prueba").email(EMAIL)
                .activo(true).sede(sede).rol(Rol.builder().nombre(rol).build()).build();
    }
}
