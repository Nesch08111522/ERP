package com.policalum.erp.application.service;

import com.policalum.erp.application.dto.response.HistorialSalarialResponseDTO;
import com.policalum.erp.domain.model.RrhhLegajoDigital;
import com.policalum.erp.domain.model.User;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Historial de cambios salariales del legajo (§2.4).
 *
 * <p>Dos reglas que definen el módulo y no son negociables:
 * <ol>
 *   <li><b>Append-only.</b> No hay edición ni borrado. Un historial que se puede reescribir
 *       deja de ser prueba. Si un registro quedó mal, se corrige con uno nuevo.</li>
 *   <li><b>Solo escribe lo remunerativo.</b> Sueldo base, % de comisión, día de paga y tipo
 *       de contrato. Un legajo guardado que no mueve ninguno de esos cuatro campos NO
 *       genera fila: el historial no es un registro de ediciones (eso ya lo hace audit_log).</li>
 * </ol>
 *
 * <p>El porcentaje de reparto del administrador vive en {@code rrhh_regimen_remuneracion} y
 * queda fuera por decisión explícita: es ganancia de socio, no remuneración del legajo, y
 * mezclarlos obligaría a clavar la tabla en el usuario en vez de en el legajo.
 */
public interface HistorialSalarialService {

    /**
     * Los campos remunerativos del legajo tal como estaban ANTES de guardar.
     * Lo construye {@code LegajoServiceImpl} antes de mutar la entidad, porque después de
     * {@code mapper.updateEntityFromDto} el objeto gestionado ya no conserva el valor previo.
     */
    record Retrato(String tipoContrato, BigDecimal sueldoBase, BigDecimal porcentajeComision, Integer diaCobro) { }

    /**
     * Escribe una fila si (y solo si) hay un cambio remunerativo respecto de {@code antes}.
     *
     * @param antes        null = alta del legajo, se registra el sueldo inicial sin "antes"
     * @param despues      legajo ya guardado, con los valores nuevos
     * @param vigencia     desde cuándo rige el cambio; null = hoy
     * @param motivo       texto libre opcional (máx. 255)
     * @param registradoPor quien guardó el cambio
     * @throws IllegalArgumentException si la vigencia es futura, anterior a la fecha de
     *         ingreso del legajo, o anterior a la última vigencia registrada
     */
    void registrarCambios(Retrato antes, RrhhLegajoDigital despues, LocalDate vigencia,
                          String motivo, User registradoPor);

    /** Historial de un empleado por su id de usuario, del más reciente al más antiguo. Solo ADMIN. */
    List<HistorialSalarialResponseDTO> listarPorEmpleado(UUID empleadoId);

    /** Historial del usuario autenticado. Cualquier rol, solo el propio (§2.4). */
    List<HistorialSalarialResponseDTO> listarMio();
}
