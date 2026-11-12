package com.policalum.erp.application.service;

import com.policalum.erp.application.dto.request.RegimenRequestDTO;
import com.policalum.erp.application.dto.response.GananciaPersonalResponseDTO;
import com.policalum.erp.application.dto.response.RegimenResponseDTO;
import java.time.YearMonth;
import java.util.UUID;

/**
 * Régimen de remuneración del administrador. Solo existe para ROLE_ADMIN y solo
 * el propio admin puede leerlo y escribirlo: nunca el de otro usuario.
 */
public interface RegimenRemuneracionService {

    /** Régimen del admin autenticado. Si no tiene, devuelve el defaults sin guardar. */
    RegimenResponseDTO obtenerMio();

    /** Guarda el régimen del admin autenticado. */
    RegimenResponseDTO guardar(RegimenRequestDTO request);

    /**
     * Ganancia personal del admin vs ganancia de la empresa, para un periodo y sede.
     *
     * @param periodo null = mes en curso
     * @param sedeId  null = todas las sedes
     */
    GananciaPersonalResponseDTO resumen(UUID sedeId, YearMonth periodo);

    /**
     * Resuelve si un usuario puede cobrar un componente. Devuelve {@code true} cuando el
     * usuario no tiene régimen configurado: la ausencia de régimen NUNCA recorta la nómina.
     * Lo consume {@code NominaServiceImpl} al calcular.
     */
    boolean componenteActivo(UUID userId, Componente componente);

    /** Componentes que el régimen puede apagar. */
    enum Componente { SUELDO, COMISION }
}
