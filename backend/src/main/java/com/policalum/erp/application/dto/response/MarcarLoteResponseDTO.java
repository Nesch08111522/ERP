package com.policalum.erp.application.dto.response;

import java.util.List;

/** Resultado de una marcación en lote. Se procesan todos los ids; los rechazos se devuelven, no abortan. */
public record MarcarLoteResponseDTO(
        int solicitados,
        int registrados,
        int omitidos,
        int rechazados,
        List<String> detalle
) { }
