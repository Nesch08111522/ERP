package com.policalum.erp.application.dto.request;

import com.policalum.erp.domain.enums.PoliticaDivisionSueldo;
import com.policalum.erp.domain.enums.TratamientoAusencias;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * Política de remuneración de la empresa (§8.1). Es el nivel más bajo de la cadena de herencia:
 * la sede y el legajo pueden sobreescribirla campo por campo.
 *
 * @param diasLaborables solo exige contenido cuando {@code politicaDivision} es DIAS_LABORABLES;
 *        se valida en el servicio, no con anotaciones, porque la regla depende de otro campo
 * @param tratamientoAusencias hay valores declarados que el ERP aún no sabe aplicar: el servicio
 *        los rechaza con mensaje explícito (ver {@code TratamientoAusencias})
 */
public record ParametrosRrhhRequestDTO(
        @NotNull(message = "La política de división mensual es obligatoria")
        PoliticaDivisionSueldo politicaDivision,

        @Size(max = 7, message = "Máximo 7 días laborables")
        List<String> diasLaborables,

        @NotNull(message = "El tratamiento de ausencias es obligatorio")
        TratamientoAusencias tratamientoAusencias) { }
