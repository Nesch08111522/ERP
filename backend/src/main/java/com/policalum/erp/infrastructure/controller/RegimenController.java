package com.policalum.erp.infrastructure.controller;

import com.policalum.erp.application.dto.request.RegimenRequestDTO;
import com.policalum.erp.application.dto.response.GananciaPersonalResponseDTO;
import com.policalum.erp.application.dto.response.RegimenResponseDTO;
import com.policalum.erp.application.service.RegimenRemuneracionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Régimen de ganancia personal del administrador.
 *
 * <p>No existe variante "/{userId}": el endpoint siempre opera sobre el admin autenticado.
 * Así es imposible que un admin lea o escriba el régimen de otro, y el MULTIFUNCIONAL
 * queda fuera por el rol.
 */
@Tag(name = "RRHH")
@RestController
@RequestMapping("/api/v1/rrhh/mi-regimen")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class RegimenController {

    private final RegimenRemuneracionService regimenService;

    /** Régimen del admin autenticado (con sus importes espejados desde el legajo). */
    @GetMapping
    public ResponseEntity<RegimenResponseDTO> mio() {
        return ResponseEntity.ok(regimenService.obtenerMio());
    }

    /** Guarda el régimen del admin autenticado. */
    @PutMapping
    public ResponseEntity<RegimenResponseDTO> guardar(@Valid @RequestBody RegimenRequestDTO request) {
        return ResponseEntity.ok(regimenService.guardar(request));
    }

    /**
     * Ganancia personal vs ganancia de la empresa.
     *
     * @param periodo "YYYY-MM"; vacío = mes en curso
     * @param sedeId  vacío = todas las sedes
     */
    @GetMapping("/resumen")
    public ResponseEntity<GananciaPersonalResponseDTO> resumen(
            @RequestParam(required = false) UUID sedeId,
            @RequestParam(required = false) String periodo) {
        return ResponseEntity.ok(regimenService.resumen(sedeId, parsePeriodo(periodo)));
    }

    private YearMonth parsePeriodo(String periodo) {
        if (periodo == null || periodo.isBlank()) return null;
        try {
            return YearMonth.parse(periodo);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Periodo inválido: '" + periodo + "'. Formato esperado: YYYY-MM");
        }
    }
}
