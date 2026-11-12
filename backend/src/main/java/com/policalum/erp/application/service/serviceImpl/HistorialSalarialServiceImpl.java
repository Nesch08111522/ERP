package com.policalum.erp.application.service.serviceImpl;

import com.policalum.erp.application.dto.response.HistorialSalarialResponseDTO;
import com.policalum.erp.application.service.HistorialSalarialService;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.model.RrhhHistorialSalarial;
import com.policalum.erp.domain.model.RrhhLegajoDigital;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.exception.ResourceNotFoundException;
import com.policalum.erp.infrastructure.repository.RrhhHistorialSalarialRepository;
import com.policalum.erp.infrastructure.repository.RrhhLegajoDigitalRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Escritura y lectura del historial salarial. Ver {@link HistorialSalarialService} para las
 * reglas de negocio; aquí está solo su traducción, más el cálculo de periodos.
 *
 * <p>No audita por su cuenta: cada cambio ya quedó registrado en {@code audit_log} por
 * {@code LegajoServiceImpl} con su instantánea antes/después. Duplicar el evento en dos
 * tablas crearía dos versiones de la misma verdad con fechas potencialmente distintas.
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class HistorialSalarialServiceImpl implements HistorialSalarialService {

    /** Motivo con el que se siembra la primera fila al crear un legajo. */
    static final String MOTIVO_INICIAL = "Sueldo inicial registrado en el legajo";

    private static final int MOTIVO_MAX = 255;

    private final RrhhHistorialSalarialRepository historialRepository;
    private final RrhhLegajoDigitalRepository legajoRepository;
    private final UserRepository userRepository;

    // ============ ESCRITURA ============

    @Override
    public void registrarCambios(Retrato antes, RrhhLegajoDigital despues, LocalDate vigencia,
                                 String motivo, User registradoPor) {
        boolean esAlta = antes == null;
        if (!esAlta && !hayCambioRemunerativo(antes, despues)) {
            log.debug("Legajo {} guardado sin mover remuneración: no se escribe historial.", despues.getId());
            return;
        }

        LocalDate desde = resolverVigencia(vigencia, despues);
        RrhhHistorialSalarial fila = RrhhHistorialSalarial.builder()
                .legajo(despues)
                .vigenciaDesde(desde)
                .tipoContratoAnterior(esAlta ? null : texto(antes.tipoContrato()))
                .tipoContratoNuevo(texto(despues.getTipoContrato()))
                .sueldoAnterior(esAlta ? null : dinero(antes.sueldoBase()))
                .sueldoNuevo(dinero(despues.getSueldoBase()))
                .comisionAnterior(esAlta ? null : porcentaje(antes.porcentajeComision()))
                .comisionNuevo(porcentaje(despues.getPorcentajeComision()))
                .diaCobroAnterior(esAlta ? null : antes.diaCobro())
                .diaCobroNuevo(despues.getDiaCobro())
                .motivo(recortar(texto(motivo)))
                .registradoPor(registradoPor)
                .build();

        historialRepository.save(fila);
        log.info("Historial salarial de {}: sueldo {} -> {} vigente desde {} (alta={})",
                despues.getId(), fila.getSueldoAnterior(), fila.getSueldoNuevo(), desde, esAlta);
    }

    /**
     * Compara con {@code compareTo}, no con {@code equals}: {@code 1500} y {@code 1500.00} son
     * el mismo sueldo y no deben generar una fila fantasma en cada guardado.
     */
    static boolean hayCambioRemunerativo(Retrato antes, RrhhLegajoDigital despues) {
        return !Objects.equals(texto(antes.tipoContrato()), texto(despues.getTipoContrato()))
                || dinero(antes.sueldoBase()).compareTo(dinero(despues.getSueldoBase())) != 0
                || porcentaje(antes.porcentajeComision()).compareTo(porcentaje(despues.getPorcentajeComision())) != 0
                || !Objects.equals(antes.diaCobro(), despues.getDiaCobro());
    }

    /**
     * La vigencia es la fecha en que el nuevo sueldo empieza a regir, no la fecha en que se
     * guardó. Se valida contra tres fronteras: hoy (no futura), la fecha de ingreso y la
     * última vigencia ya registrada.
     */
    private LocalDate resolverVigencia(LocalDate pedida, RrhhLegajoDigital legajo) {
        LocalDate hoy = LocalDate.now();
        LocalDate desde = pedida != null ? pedida : hoy;

        if (desde.isAfter(hoy)) {
            throw new IllegalArgumentException("La fecha de vigencia no puede ser futura (hoy es " + hoy + ")");
        }
        if (legajo.getFechaIngreso() != null && desde.isBefore(legajo.getFechaIngreso())) {
            throw new IllegalArgumentException("La vigencia no puede ser anterior a la fecha de ingreso ("
                    + legajo.getFechaIngreso() + ")");
        }
        historialRepository.findFirstByLegajo_IdOrderByVigenciaDesdeDescCreatedAtDesc(legajo.getId())
                .ifPresent(ultima -> {
                    if (desde.isBefore(ultima.getVigenciaDesde())) {
                        throw new IllegalArgumentException("La vigencia no puede ser anterior a la última registrada ("
                                + ultima.getVigenciaDesde() + "). El historial no se reescribe: registre el "
                                + "ajuste con una vigencia posterior y deje constancia en el motivo.");
                    }
                });
        return desde;
    }

    // ============ LECTURA ============

    @Override
    @Transactional(readOnly = true)
    public List<HistorialSalarialResponseDTO> listarPorEmpleado(UUID empleadoId) {
        User actual = usuarioActual();
        if (!esAdmin(actual)) {
            throw new AccessDeniedException("Solo un administrador puede consultar el historial de otro empleado");
        }
        return lineaDeTiempo(legajoDe(empleadoId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<HistorialSalarialResponseDTO> listarMio() {
        User actual = usuarioActual();
        return lineaDeTiempo(legajoRepository.findDetalleByUserId(actual.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Usted no tiene legajo registrado")));
    }

    /**
     * Periodos: la fila i rige hasta la vigencia de la fila i+1. La última queda abierta
     * ({@code vigenteHasta = null}) y es la que la UI marca como vigente. Se calcula sobre la
     * lista ASC y se devuelve en DESC porque eso es lo que se lee en pantalla.
     */
    private List<HistorialSalarialResponseDTO> lineaDeTiempo(RrhhLegajoDigital legajo) {
        List<RrhhHistorialSalarial> filas = historialRepository.findTimelineByLegajo(legajo.getId());
        List<HistorialSalarialResponseDTO> salida = new ArrayList<>(filas.size());
        for (int i = 0; i < filas.size(); i++) {
            RrhhHistorialSalarial h = filas.get(i);
            LocalDate hasta = i + 1 < filas.size() ? filas.get(i + 1).getVigenciaDesde() : null;
            salida.add(responder(h, legajo.getId(), hasta));
        }
        Collections.reverse(salida);
        return salida;
    }

    private HistorialSalarialResponseDTO responder(RrhhHistorialSalarial h, UUID legajoId, LocalDate hasta) {
        BigDecimal anterior = h.getSueldoAnterior();
        BigDecimal nuevo = dinero(h.getSueldoNuevo());
        // Null, no cero: en el sueldo inicial no hubo subida, no existió un antes.
        BigDecimal delta = anterior == null ? null : dinero(nuevo.subtract(anterior));
        User quien = h.getRegistradoPor();
        String nombre = quien == null ? null
                : ((quien.getNombre() == null ? "" : quien.getNombre()) + " "
                        + (quien.getApellido() == null ? "" : quien.getApellido())).trim();
        return new HistorialSalarialResponseDTO(
                h.getId(), legajoId, h.getVigenciaDesde(), hasta, hasta == null,
                h.getTipoContratoAnterior(), h.getTipoContratoNuevo(),
                anterior, nuevo, delta,
                h.getComisionAnterior(), h.getComisionNuevo(),
                h.getDiaCobroAnterior(), h.getDiaCobroNuevo(),
                h.getMotivo(), nombre, h.getCreatedAt());
    }

    // ============ HELPERS ============

    private RrhhLegajoDigital legajoDe(UUID empleadoId) {
        return legajoRepository.findDetalleByUserId(empleadoId)
                .orElseThrow(() -> new ResourceNotFoundException("El empleado " + empleadoId + " no tiene legajo"));
    }

    private static String texto(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }

    private static String recortar(String valor) {
        if (valor == null) return null;
        return valor.length() > MOTIVO_MAX ? valor.substring(0, MOTIVO_MAX) : valor;
    }

    private static BigDecimal dinero(BigDecimal valor) {
        return (valor == null ? BigDecimal.ZERO : valor).setScale(2, RoundingMode.HALF_UP);
    }

    private static BigDecimal porcentaje(BigDecimal valor) {
        return (valor == null ? BigDecimal.ZERO : valor).setScale(2, RoundingMode.HALF_UP);
    }

    private boolean esAdmin(User user) {
        return user.getRol() != null && user.getRol().getNombre() == RolNombre.ROLE_ADMIN;
    }

    private User usuarioActual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new IllegalStateException("Usuario autenticado no válido"));
    }
}
