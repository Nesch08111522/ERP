package com.policalum.erp.application.dto.response;

import com.policalum.erp.domain.enums.EstadoAsistencia;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Fila del roster "quiénes asistieron el día de hoy". Un empleado activo = una fila,
 * haya marcado o no, para que el administrador pueda marcarlo desde la misma lista.
 */
public record AsistenciaRosterDTO(
        UUID empleadoId,
        String empleadoNombre,
        String sedeNombre,
        LocalDate fecha,
        Boolean marcoEntrada,
        Boolean marcoSalida,
        LocalDateTime horaEntrada,
        LocalDateTime horaSalida,
        EstadoAsistencia estado,
        BigDecimal horasTrabajadas,
        String turnoNombre,
        String origenMarcacion,
        Boolean puedeMarcarEntrada,
        Boolean puedeMarcarSalida
) { }
