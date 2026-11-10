package com.policalum.erp.application.dto.response;

import com.policalum.erp.domain.enums.AmbitoPoliticaRemuneracion;
import com.policalum.erp.domain.enums.PoliticaDivisionSueldo;
import com.policalum.erp.domain.enums.TratamientoAusencias;
import java.util.List;

/**
 * Política de remuneración realmente aplicable a un legajo, después de resolver la cadena
 * empleado → sede → empresa (§8.1).
 *
 * @param origenDivision        cuál de los tres niveles fijó la división mensual
 * @param divisorMesEnCurso     días en que se divide el sueldo del mes corriente según la
 *                              política; cambia solo si la política es DIAS_CALENDARIO o
 *                              DIAS_LABORABLES (con DIAS_30 es siempre 30)
 * @param periodoReferencia     AAAA-MM al que corresponde {@code divisorMesEnCurso}
 */
public record PoliticaRemuneracionDTO(
        PoliticaDivisionSueldo division,
        List<String> diasLaborables,
        TratamientoAusencias ausencias,
        AmbitoPoliticaRemuneracion origenDivision,
        AmbitoPoliticaRemuneracion origenDiasLaborables,
        AmbitoPoliticaRemuneracion origenAusencias,
        int divisorMesEnCurso,
        String periodoReferencia
) { }
