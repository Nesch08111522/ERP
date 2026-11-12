// src/main/java/com/policalum/erp/application/service/RrhhAsistenciaService.java
package com.policalum.erp.application.service;

import com.policalum.erp.application.dto.request.AsistenciaQrDTO;
import com.policalum.erp.application.dto.request.MarcarLoteRequestDTO;
import com.policalum.erp.application.dto.request.RrhhAsistenciaRequestDTO;
import com.policalum.erp.application.dto.response.AsistenciaEstadoDTO;
import com.policalum.erp.application.dto.response.AsistenciaRosterDTO;
import com.policalum.erp.application.dto.response.DashboardAsistenciaDTO;
import com.policalum.erp.application.dto.response.MarcarLoteResponseDTO;
import com.policalum.erp.application.dto.response.QrPersonalDTO;
import com.policalum.erp.application.dto.response.RrhhAsistenciaResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface RrhhAsistenciaService {

    // ============================================
    // ✅ MÉTODOS EXISTENTES
    // ============================================

    RrhhAsistenciaResponseDTO procesarMarcacionQr(AsistenciaQrDTO qrRequest);

    RrhhAsistenciaResponseDTO procesarMarcacionManual(RrhhAsistenciaRequestDTO manualRequest);

    Page<RrhhAsistenciaResponseDTO> listarTodas(Pageable pageable);

    Page<RrhhAsistenciaResponseDTO> buscarPorEmpleado(UUID empleadoId, Pageable pageable);

    RrhhAsistenciaResponseDTO buscarPorId(UUID id);

    RrhhAsistenciaResponseDTO actualizarMarcacionManual(UUID id, RrhhAsistenciaRequestDTO updateRequest);

    void eliminarMarcacion(UUID id);

    // ============================================
    // ✅ NUEVOS MÉTODOS
    // ============================================

    /**
     * Listar asistencias con filtros (empleado y rango de fechas)
     */
    Page<RrhhAsistenciaResponseDTO> listarAsistencias(
            UUID empleadoId,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin,
            Pageable pageable);

    /**
     * Obtener solo las asistencias de un empleado específico (para MULTIFUNCIONAL)
     */
    Page<RrhhAsistenciaResponseDTO> misAsistencias(
            UUID empleadoId,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin,
            Pageable pageable);

    /**
     * Obtener dashboard con resumen de asistencias
     */
    DashboardAsistenciaDTO obtenerDashboard(UUID empleadoId);

    /**
     * Obtener la última marcación de un empleado
     */
    RrhhAsistenciaResponseDTO obtenerUltimaMarcacion(UUID empleadoId);

    /**
     * Obtener el estado del día de un empleado (entrada/salida)
     */
    AsistenciaEstadoDTO obtenerEstadoDelDia(UUID empleadoId);

    // ============================================
    // MÓDULO 10: QR PERSONAL, ESCANEO DEL ADMIN Y ROSTER
    // ============================================

    /**
     * QR dinámico del usuario autenticado, para que el administrador lo escanee.
     * Provisiona el secreto TOTP personal en la primera llamada.
     */
    QrPersonalDTO qrPersonal();

    /**
     * El administrador escanea el QR personal de un empleado y le registra la marcación
     * que corresponda (entrada o salida según su estado del día).
     */
    RrhhAsistenciaResponseDTO marcarPorQrEscaneado(String payload);

    /**
     * "Quiénes asistieron el día de hoy": una fila por empleado activo, marque o no.
     *
     * @param fecha  null = hoy
     * @param sedeId null = todas las sedes
     */
    List<AsistenciaRosterDTO> roster(LocalDate fecha, UUID sedeId);

    /** Marca en lote desde el roster. Los que ya tienen la marcación se omiten. */
    MarcarLoteResponseDTO marcarLote(MarcarLoteRequestDTO request);
}