package com.policalum.erp.application.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Una fila del historial salarial, lista para pintar en la línea de tiempo.
 *
 * @param vigenciaHasta null = esta fila es la vigente (no hay un cambio posterior).
 * @param sueldoDelta   sueldoNuevo − sueldoAnterior. Null en el sueldo inicial, porque
 *                      no hay un "antes" contra el cual restar: mostrar +1500.00 sería
 *                      inventar una subida desde cero.
 */
public record HistorialSalarialResponseDTO(
        UUID id,
        UUID legajoId,
        LocalDate vigenciaDesde,
        LocalDate vigenciaHasta,
        boolean vigente,
        String tipoContratoAnterior,
        String tipoContratoNuevo,
        BigDecimal sueldoAnterior,
        BigDecimal sueldoNuevo,
        BigDecimal sueldoDelta,
        BigDecimal comisionAnterior,
        BigDecimal comisionNuevo,
        Integer diaCobroAnterior,
        Integer diaCobroNuevo,
        String motivo,
        String registradoPorNombre,
        LocalDateTime createdAt
) { }
