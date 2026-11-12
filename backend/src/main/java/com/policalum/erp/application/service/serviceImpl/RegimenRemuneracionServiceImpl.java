package com.policalum.erp.application.service.serviceImpl;

import com.policalum.erp.application.dto.request.RegimenRequestDTO;
import com.policalum.erp.application.dto.response.GananciaPersonalResponseDTO;
import com.policalum.erp.application.dto.response.RegimenResponseDTO;
import com.policalum.erp.application.dto.response.UtilidadNetaResponseDTO;
import com.policalum.erp.application.service.AuditService;
import com.policalum.erp.application.service.PoliticaRemuneracionService;
import com.policalum.erp.application.service.RegimenRemuneracionService;
import com.policalum.erp.application.service.UtilidadNetaService;
import com.policalum.erp.domain.enums.AccionAudit;
import com.policalum.erp.domain.enums.BaseRepartoUtilidad;
import com.policalum.erp.domain.enums.EstadoComision;
import com.policalum.erp.domain.enums.PoliticaDivisionSueldo;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.enums.EstadoNomina;
import com.policalum.erp.domain.model.RrhhComision;
import com.policalum.erp.domain.model.RrhhLegajoDigital;
import com.policalum.erp.domain.model.RrhhNomina;
import com.policalum.erp.domain.model.RrhhRegimenRemuneracion;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.exception.ResourceNotFoundException;
import com.policalum.erp.infrastructure.repository.RrhhComisionRepository;
import com.policalum.erp.infrastructure.repository.RrhhLegajoDigitalRepository;
import com.policalum.erp.infrastructure.repository.RrhhNominaRepository;
import com.policalum.erp.infrastructure.repository.RrhhRegimenRemuneracionRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Régimen de remuneración del administrador y su desglose de ganancias.
 *
 * <p>Reglas duras que sostienen la separación "empresa vs personal":
 * <ol>
 *   <li>Solo ROLE_ADMIN puede leer/escribir su régimen, y siempre el propio. No hay
 *       variante "de otro usuario": si hace falta auditar al resto, se usa RRHH &gt; Legajos.</li>
 *   <li>El reparto de utilidad NO es un gasto: no altera {@code utilidadNetaReal}. Por eso
 *       el desglose lo muestra como distribución y calcula aparte el saldo de la empresa.</li>
 *   <li>El sueldo y el % de comisión viven en el legajo. Aquí solo se encienden/apagan,
 *       para que no existan dos importos que puedan contradecirse.</li>
 * </ol>
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class RegimenRemuneracionServiceImpl implements RegimenRemuneracionService {

    private static final String TABLA = "rrhh_regimen_remuneracion";
    private static final BigDecimal CIEN = new BigDecimal("100");

    private final RrhhRegimenRemuneracionRepository regimenRepository;
    private final RrhhLegajoDigitalRepository legajoRepository;
    private final RrhhNominaRepository nominaRepository;
    private final RrhhComisionRepository comisionRepository;
    private final UserRepository userRepository;
    private final UtilidadNetaService utilidadNetaService;
    private final AuditService auditService;
    private final PoliticaRemuneracionService politicaRemuneracion;

    // ============ RÉGIMEN ============

    @Override
    @Transactional(readOnly = true)
    public RegimenResponseDTO obtenerMio() {
        User admin = exigirAdminAutenticado();
        RrhhRegimenRemuneracion regimen = regimenRepository.findDetalleByUserId(admin.getId())
                .orElseGet(() -> defaults(admin));
        return responder(regimen, legajoDe(admin.getId()));
    }

    @Override
    public RegimenResponseDTO guardar(RegimenRequestDTO request) {
        User admin = exigirAdminAutenticado();
        validar(request);

        RrhhRegimenRemuneracion regimen = regimenRepository.findDetalleByUserId(admin.getId())
                .orElseGet(() -> {
                    RrhhRegimenRemuneracion nuevo = new RrhhRegimenRemuneracion();
                    nuevo.setUser(admin);
                    return nuevo;
                });

        Map<String, Object> antes = snapshot(regimen);

        regimen.setSueldoHabilitado(request.sueldoHabilitado());
        regimen.setComisionHabilitada(request.comisionHabilitada());
        regimen.setRepartoHabilitado(request.repartoHabilitado());
        regimen.setPorcentajeReparto(normalizar(request.porcentajeReparto()));
        regimen.setBaseReparto(request.baseReparto() != null ? request.baseReparto() : BaseRepartoUtilidad.UTILIDAD_NETA);
        regimen.setTopeRepartoMensual(request.topeRepartoMensual() == null
                ? null : dinero(request.topeRepartoMensual()));

        // Si apaga el reparto, el porcentaje no debe seguir apareciendo como vigente.
        if (!Boolean.TRUE.equals(regimen.getRepartoHabilitado())) {
            regimen.setPorcentajeReparto(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
        }

        RrhhRegimenRemuneracion guardado = regimenRepository.save(regimen);

        Map<String, Object> datos = new LinkedHashMap<>();
        datos.put("antes", antes);
        datos.put("despues", snapshot(guardado));
        auditService.registrar(TABLA, guardado.getId(), AccionAudit.UPDATE, datos);
        log.info("Régimen del admin {} actualizado: sueldo={} comision={} reparto={}% sobre {}",
                admin.getEmail(), guardado.getSueldoHabilitado(), guardado.getComisionHabilitada(),
                guardado.getPorcentajeReparto(), guardado.getBaseReparto());

        return responder(guardado, legajoDe(admin.getId()));
    }

    // ============ DESGLOSE ============

    @Override
    @Transactional(readOnly = true)
    public GananciaPersonalResponseDTO resumen(UUID sedeId, YearMonth periodo) {
        User admin = exigirAdminAutenticado();
        YearMonth mes = periodo != null ? periodo : YearMonth.now();
        String periodoStr = mes.toString();

        RrhhRegimenRemuneracion regimen = regimenRepository.findDetalleByUserId(admin.getId())
                .orElseGet(() -> defaults(admin));
        RrhhLegajoDigital legajo = legajoDe(admin.getId());
        List<String> avisos = new ArrayList<>();

        if (legajo == null) {
            avisos.add("No tiene legajo: el sueldo base y el % de comisión están en cero. "
                    + "Crélo en RRHH > Legajos.");
        }

        // ── BOLSO 1: la empresa ──
        UtilidadNetaResponseDTO empresa = utilidadNetaService.calcularPorPeriodo(sedeId, periodoStr);
        BigDecimal utilidadNeta = dinero(empresa.utilidadNetaReal());
        BigDecimal baseReparto = baseRepartoDe(empresa, regimen.getBaseReparto());

        // ── BOLSO 2: el admin como trabajador ──
        boolean cobraSueldo = Boolean.TRUE.equals(regimen.getSueldoHabilitado());
        boolean cobraComision = Boolean.TRUE.equals(regimen.getComisionHabilitada());
        boolean cobraReparto = Boolean.TRUE.equals(regimen.getRepartoHabilitado());

        Optional<RrhhNomina> nomina = nominaRepository.findDetalleByUserAndPeriodo(admin.getId(), periodoStr);
        Optional<RrhhComision> comision = comisionRepository.findByUser_IdAndPeriodo(admin.getId(), periodoStr);

        BigDecimal sueldoBaseLegajo = legajo != null ? dinero(legajo.getSueldoBase()) : BigDecimal.ZERO.setScale(2);
        BigDecimal sueldo;
        Integer diasComputados;
        Integer divisorPolitica;
        PoliticaDivisionSueldo politicaUsada;
        if (nomina.isPresent()) {
            sueldo = dinero(nomina.get().getSueldoBaseCalculado());
            diasComputados = nomina.get().getDiasComputados();
            // Se leen del snapshot de la nómina, no de la política de hoy.
            divisorPolitica = nomina.get().getDivisorRemuneracion() != null
                    ? nomina.get().getDivisorRemuneracion() : NominaServiceImpl.DIVISOR_HISTORICO;
            politicaUsada = nomina.get().getPoliticaDivision();
        } else if (legajo == null) {
            sueldo = BigDecimal.ZERO.setScale(2);
            diasComputados = 0;
            divisorPolitica = null;
            politicaUsada = null;
        } else {
            PoliticaRemuneracionService.LiquidacionSueldo liq = politicaRemuneracion.liquidar(legajo, mes);
            sueldo = liq.sueldo();
            diasComputados = liq.diasComputados();
            divisorPolitica = liq.divisor();
            politicaUsada = liq.politica();
            if (diasComputados > 0) {
                avisos.add("Nómina de " + periodoStr + " aún no generada; el sueldo se estimó prorrateando el"
                        + " legajo (" + diasComputados + " de " + divisorPolitica + " días, política "
                        + politicaUsada + ").");
            }
        }
        BigDecimal personalSueldo = cobraSueldo ? sueldo : BigDecimal.ZERO.setScale(2);

        BigDecimal pctComision = legajo != null ? escalar2(legajo.getPorcentajeComision()) : BigDecimal.ZERO.setScale(2);
        BigDecimal comisionMonto = comision.map(c -> dinero(c.getMontoComision())).orElse(BigDecimal.ZERO.setScale(2));
        BigDecimal comisionBase = comision.map(c -> dinero(c.getTotalVentasNetas())).orElse(BigDecimal.ZERO.setScale(2));
        if (!cobraComision && comisionMonto.signum() > 0) {
            avisos.add("Tiene comisión calculada por " + comisionMonto + ", pero su régimen la desactivó: no la cobra.");
        }
        BigDecimal personalComision = cobraComision ? comisionMonto : BigDecimal.ZERO.setScale(2);

        BigDecimal pctReparto = escalar2(regimen.getPorcentajeReparto());
        BigDecimal repartoBruto = cobraReparto
                ? dinero(baseReparto.multiply(pctReparto).divide(CIEN, 4, RoundingMode.HALF_UP))
                : BigDecimal.ZERO.setScale(2);
        BigDecimal tope = regimen.getTopeRepartoMensual();
        BigDecimal personalReparto = repartoBruto;
        if (tope != null && tope.signum() > 0 && repartoBruto.compareTo(tope) > 0) {
            personalReparto = dinero(tope);
            avisos.add("Reparto limitado al tope mensual de " + dinero(tope) + " (calculado: " + repartoBruto + ").");
        }
        // Un reparto sobre una base negativa no puede sumar dinero: se corta en cero.
        if (personalReparto.signum() < 0) {
            avisos.add("La base de reparto (" + dinero(baseReparto) + ") es negativa: el reparto se liquidó en 0.");
            personalReparto = BigDecimal.ZERO.setScale(2);
        }

        BigDecimal personalTotal = personalSueldo.add(personalComision).add(personalReparto);
        BigDecimal nominasPagadas = nomina.filter(n -> n.getEstado() == EstadoNomina.PAGADA)
                .map(n -> dinero(n.getTotalNeto())).orElse(BigDecimal.ZERO.setScale(2));

        if (!cobraSueldo && !cobraComision && !cobraReparto) {
            avisos.add("Todos los componentes están apagados: su ganancia personal del periodo es S/ 0.00.");
        }

        /*
         * La utilidad neta de la empresa ya descontó las nóminas PAGADAS, y la del admin está
         * ahí dentro. Así que del resultado solo se vuelve a restar el REPARTO (distribución de
         * ganancia de socio). Restar también sueldo y comisión los contaría dos veces.
         */
        BigDecimal saldoEmpresa = dinero(utilidadNeta.subtract(personalReparto));

        if (nomina.isEmpty() && personalSueldo.signum() > 0) {
            avisos.add("Su nómina de " + periodoStr + " no está generada: el sueldo de "
                    + personalSueldo + " aún no entró en los gastos de la empresa, así que la"
                    + " utilidad mostrada lo incluye.");
        } else if (nomina.isPresent() && nomina.get().getEstado() != EstadoNomina.PAGADA) {
            avisos.add("Su nómina está " + nomina.get().getEstado() + ", no PAGADA: el sueldo todavía"
                    + " no redujo la utilidad neta de la empresa.");
        }
        if (sedeId != null) {
            avisos.add("Filtró por sede: la utilidad es de esa sede, pero sueldo y comisión se calculan"
                    + " sobre su legajo y sus ventas de todas las sedes.");
        }
        if (utilidadNeta.signum() > 0 && personalReparto.compareTo(utilidadNeta) > 0) {
            avisos.add("Su reparto supera la utilidad neta del periodo; revise el porcentaje o el tope mensual.");
        }
        if (comision.isPresent() && comision.get().getEstado() != EstadoComision.APROBADA
                && comision.get().getEstado() != EstadoComision.LIQUIDADA) {
            avisos.add("La comisión del periodo está en estado " + comision.get().getEstado()
                    + "; apruébela en RRHH > Comisiones para darle curso.");
        }

        BigDecimal sobreEmpresa = utilidadNeta.signum() > 0
                ? dinero(personalTotal.multiply(CIEN).divide(utilidadNeta, 4, RoundingMode.HALF_UP))
                : BigDecimal.ZERO.setScale(2);

        return new GananciaPersonalResponseDTO(
                sedeId, periodoStr, mes.atDay(1), mes.atEndOfMonth(),

                dinero(empresa.ventasNetasReales()), dinero(empresa.comprasNetas()),
                dinero(empresa.utilidadBruta()), dinero(empresa.gastosOperativos()),
                dinero(empresa.gastosEmpresariales()), utilidadNeta,
                escalar2(empresa.margenNetoPorcentaje()), dinero(empresa.retirosSocios()),

                cobraSueldo, personalSueldo, sueldoBaseLegajo, diasComputados, divisorPolitica, politicaUsada,
                cobraComision, pctComision, comisionBase, personalComision,
                cobraReparto, regimen.getBaseReparto(), pctReparto, dinero(baseReparto),
                tope != null ? dinero(tope) : null, personalReparto,
                personalTotal, nominasPagadas,

                saldoEmpresa, sobreEmpresa,
                avisos.isEmpty() ? null : String.join(" · ", avisos));
    }

    // ============ CONSUMO POR NÓMINA ============

    @Override
    @Transactional(readOnly = true)
    public boolean componenteActivo(UUID userId, Componente componente) {
        if (userId == null) return true;
        Optional<RrhhRegimenRemuneracion> regimen = regimenRepository.findByUser_Id(userId);
        if (regimen.isEmpty()) return true; // sin régimen: se cobra lo que dice el legajo
        return switch (componente) {
            case SUELDO -> Boolean.TRUE.equals(regimen.get().getSueldoHabilitado());
            case COMISION -> Boolean.TRUE.equals(regimen.get().getComisionHabilitada());
        };
    }

    // ============ HELPERS ============

    /** Fila in-memory para admins que nunca abrieron la pantalla: defaults sensatos. */
    private RrhhRegimenRemuneracion defaults(User admin) {
        RrhhRegimenRemuneracion r = new RrhhRegimenRemuneracion();
        r.setUser(admin);
        r.setSueldoHabilitado(true);
        r.setComisionHabilitada(true);
        r.setRepartoHabilitado(false);
        r.setPorcentajeReparto(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP));
        r.setBaseReparto(BaseRepartoUtilidad.UTILIDAD_NETA);
        return r;
    }

    private RrhhLegajoDigital legajoDe(UUID userId) {
        return legajoRepository.findDetalleByUserId(userId).orElse(null);
    }

    private BigDecimal baseRepartoDe(UtilidadNetaResponseDTO empresa, BaseRepartoUtilidad base) {
        return switch (base) {
            case VENTAS_NETAS -> dinero(empresa.ventasNetasReales());
            case MARGEN_BRUTO -> dinero(empresa.utilidadBruta());
            case UTILIDAD_NETA -> dinero(empresa.utilidadNetaReal());
        };
    }

    private void validar(RegimenRequestDTO r) {
        if (r.porcentajeReparto() != null
                && (r.porcentajeReparto().signum() < 0 || r.porcentajeReparto().compareTo(CIEN) > 0)) {
            throw new IllegalArgumentException("El porcentaje de reparto debe estar entre 0 y 100");
        }
        if (Boolean.TRUE.equals(r.repartoHabilitado())
                && (r.porcentajeReparto() == null || r.porcentajeReparto().signum() <= 0)) {
            throw new IllegalArgumentException("Active un porcentaje de reparto mayor a 0, o desactive el reparto");
        }
        if (r.topeRepartoMensual() != null && r.topeRepartoMensual().signum() < 0) {
            throw new IllegalArgumentException("El tope mensual no puede ser negativo");
        }
        boolean alguno = Boolean.TRUE.equals(r.sueldoHabilitado())
                || Boolean.TRUE.equals(r.comisionHabilitada())
                || Boolean.TRUE.equals(r.repartoHabilitado());
        if (!alguno) {
            throw new IllegalArgumentException("Active al menos un componente de ganancia personal");
        }
    }

    private RegimenResponseDTO responder(RrhhRegimenRemuneracion r, RrhhLegajoDigital legajo) {
        User u = r.getUser();
        return new RegimenResponseDTO(
                r.getId(),
                u != null ? u.getId() : null,
                u != null ? u.getNombre() + " " + u.getApellido() : null,
                u != null && u.getSede() != null ? u.getSede().getId() : null,
                u != null && u.getSede() != null ? u.getSede().getNombre() : null,
                r.getSueldoHabilitado(), r.getComisionHabilitada(), r.getRepartoHabilitado(),
                escalar2(r.getPorcentajeReparto()), r.getBaseReparto(),
                r.getTopeRepartoMensual() != null ? dinero(r.getTopeRepartoMensual()) : null,
                r.getCreatedAt(), r.getUpdatedAt(),
                legajo != null ? dinero(legajo.getSueldoBase()) : BigDecimal.ZERO.setScale(2),
                legajo != null ? escalar2(legajo.getPorcentajeComision()) : BigDecimal.ZERO.setScale(2),
                legajo != null ? legajo.getDiaCobro() : null,
                legajo != null ? legajo.getTipoContrato() : null,
                legajo != null);
    }

    private Map<String, Object> snapshot(RrhhRegimenRemuneracion r) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("userId", r.getUser() != null ? r.getUser().getId().toString() : null);
        m.put("sueldoHabilitado", r.getSueldoHabilitado());
        m.put("comisionHabilitada", r.getComisionHabilitada());
        m.put("repartoHabilitado", r.getRepartoHabilitado());
        m.put("porcentajeReparto", r.getPorcentajeReparto());
        m.put("baseReparto", r.getBaseReparto() != null ? r.getBaseReparto().name() : null);
        m.put("topeRepartoMensual", r.getTopeRepartoMensual());
        return m;
    }

    private User exigirAdminAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario autenticado no válido"));
        if (user.getRol() == null || user.getRol().getNombre() != RolNombre.ROLE_ADMIN) {
            throw new AccessDeniedException("Solo el administrador configura su propio régimen de ganancia");
        }
        return user;
    }

    private static BigDecimal dinero(BigDecimal valor) {
        return (valor == null ? BigDecimal.ZERO : valor).setScale(2, RoundingMode.HALF_UP);
    }

    private static BigDecimal escalar2(BigDecimal valor) {
        return (valor == null ? BigDecimal.ZERO : valor).setScale(2, RoundingMode.HALF_UP);
    }

    private static BigDecimal normalizar(BigDecimal valor) {
        return valor == null ? BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP) : escalar2(valor);
    }
}
