package com.policalum.erp.application.dto.request;

import com.policalum.erp.domain.enums.TipoMarcacion;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Marcación en lote desde el roster del día.
 *
 * @param fecha         día a marcar; null = hoy. No se aceptan fechas futuras.
 * @param empleadoIds   empleados a marcar; los que ya tienen esa marcación se omiten, no fallan.
 * @param tipoMarcacion ENTRADA (por defecto) o SALIDA.
 */
public record MarcarLoteRequestDTO(
        LocalDate fecha,

        @NotEmpty(message = "Seleccione al menos un empleado")
        List<UUID> empleadoIds,

        @NotNull(message = "Indique el tipo de marcación")
        TipoMarcacion tipoMarcacion
) { }
