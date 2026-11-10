// src/app/models/asistencia.model.ts

// ✅ Usa los mismos nombres que en el backend
export interface RrhhAsistenciaResponseDTO {
  id: string;
  empleadoId: string;
  empleadoNombreCompleto: string;
  fechaHora: string;
  tipoMarcacion: 'ENTRADA' | 'SALIDA' | 'INICIO_RECESO' | 'FIN_RECESO';
  estado?: 'PRESENTE' | 'TARDANZA' | 'AUSENTE';
  dispositivoInfo: string;
  turnoCajaId?: string;
}

// ✅ Para registrar manualmente (coincide con RrhhAsistenciaRequestDTO del backend)
export interface RrhhAsistenciaRequestDTO {
  empleadoId: string;
  fechaHora: string;
  tipoMarcacion: 'ENTRADA' | 'SALIDA' | 'INICIO_RECESO' | 'FIN_RECESO';
  dispositivoInfo?: string;
  turnoCajaId?: string;
}

// ✅ Para filtros
export interface AsistenciaFilterDTO {
  empleadoId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  tipoMarcacion?: string;
  estado?: string;
}

// ✅ Dashboard
export interface DashboardAsistenciaDTO {
  totalEmpleados: number;
  presentesHoy: number;
  ausentesHoy: number;
  tardanzasHoy: number;
  asistenciasRecientes: RrhhAsistenciaResponseDTO[];
}

// ✅ Estado del día
export interface AsistenciaEstadoDTO {
  yaMarcoEntrada: boolean;
  yaMarcoSalida: boolean;
  mensajeEntrada: string;
  mensajeSalida: string;
}

// ✅ QR (ya lo tienes, pero lo incluimos)
export interface AsistenciaQrDTO {
  payload: string;
  empleadoId: string;
  empleadoNombre: string;
  segundosRestantes: number;
  expiraEnEpoch: number;
}

// ============================================================
// MÓDULO 10: QR personal, escaneo por el admin y roster del día
// ============================================================

/** GET /rrhh/asistencias/mi-qr — QR dinámico del usuario autenticado. */
export interface QrPersonalDTO {
  empleadoId: string;
  empleadoNombre: string;
  payload: string;
  segundosRestantes: number;
  expiraEnEpoch: number;
  ventana: number;
}

/** GET /rrhh/asistencias/roster — una fila por empleado activo, asista o no. */
export interface AsistenciaRosterDTO {
  empleadoId: string;
  empleadoNombre: string;
  sedeNombre: string | null;
  fecha: string;
  marcoEntrada: boolean;
  marcoSalida: boolean;
  horaEntrada: string | null;
  horaSalida: string | null;
  estado: 'PRESENTE' | 'TARDANZA' | 'AUSENTE' | null;
  horasTrabajadas: number | null;
  turnoNombre: string | null;
  origenMarcacion: string | null;
  puedeMarcarEntrada: boolean;
  puedeMarcarSalida: boolean;
}

/** POST /rrhh/asistencias/marcar-lote */
export interface MarcarLoteRequestDTO {
  fecha?: string;
  empleadoIds: string[];
  tipoMarcacion: 'ENTRADA' | 'SALIDA' | 'INICIO_RECESO' | 'FIN_RECESO';
}

export interface MarcarLoteResponseDTO {
  solicitados: number;
  registrados: number;
  omitidos: number;
  rechazados: number;
  detalle: string[];
}
