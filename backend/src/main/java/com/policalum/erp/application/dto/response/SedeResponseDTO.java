package com.policalum.erp.application.dto.response;

import com.policalum.erp.domain.enums.PoliticaDivisionSueldo;
import com.policalum.erp.domain.enums.TratamientoAusencias;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record SedeResponseDTO(
        UUID id,
        String nombre,
        String pais,
        String ciudad,
        String direccion,
        String celularSede,
        String moneda,
        Boolean activa,
        LocalDateTime createdAt,
        Double latitud,
        Double longitud,
        String imagen,
        /** Política de la sede. null = hereda la de la empresa (§8.1). */
        PoliticaDivisionSueldo politicaDivision,
        List<String> diasLaborables,
        TratamientoAusencias tratamientoAusencias) {
}
