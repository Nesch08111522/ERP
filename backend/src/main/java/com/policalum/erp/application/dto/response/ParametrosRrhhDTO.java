package com.policalum.erp.application.dto.response;

import com.policalum.erp.domain.enums.PoliticaDivisionSueldo;
import com.policalum.erp.domain.enums.TratamientoAusencias;
import java.util.List;

/** Política de remuneración vigente a nivel empresa. */
public record ParametrosRrhhDTO(
        PoliticaDivisionSueldo politicaDivision,
        List<String> diasLaborables,
        TratamientoAusencias tratamientoAusencias) {

    /**
     * Valores de fábrica. {@code DIAS_30} no es un capricho: es el divisor con el que el sistema
     * liquidó siempre, así que activar la default no cambia ninguna liquidación existente.
     */
    public static final ParametrosRrhhDTO DEFAULTS = new ParametrosRrhhDTO(
            PoliticaDivisionSueldo.DIAS_30,
            List.of("LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"),
            TratamientoAusencias.NO_AFECTA);
}
