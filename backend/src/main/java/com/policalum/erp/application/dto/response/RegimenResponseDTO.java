package com.policalum.erp.application.dto.response;

import com.policalum.erp.domain.enums.BaseRepartoUtilidad;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/** Régimen configurado del admin, con los importes que llegan de su legajo. */
public record RegimenResponseDTO(
        UUID id,
        UUID usuarioId,
        String usuarioNombre,
        UUID sedeId,
        String sedeNombre,
        Boolean sueldoHabilitado,
        Boolean comisionHabilitada,
        Boolean repartoHabilitado,
        BigDecimal porcentajeReparto,
        BaseRepartoUtilidad baseReparto,
        BigDecimal topeRepartoMensual,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,

        // --- Espejo de solo lectura desde el legajo (no se editan aquí) ---
        BigDecimal sueldoBase,
        BigDecimal porcentajeComisionVentas,
        Integer diaCobro,
        String tipoContrato,
        Boolean tieneLegajo
) { }
