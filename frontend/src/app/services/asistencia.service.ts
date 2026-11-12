// src/app/services/asistencia.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AsistenciaEstadoDTO,
  AsistenciaFilterDTO,
  AsistenciaQrDTO,
  AsistenciaRosterDTO,
  DashboardAsistenciaDTO,
  MarcarLoteRequestDTO,
  MarcarLoteResponseDTO,
  QrPersonalDTO,
  RrhhAsistenciaRequestDTO,
  RrhhAsistenciaResponseDTO,
} from '../models/asistencia.model';
import { UserInfoDTO } from '../models/user.model'; // ← IMPORTAR
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AsistenciaService {
  private apiUrl = `${environment.apiUrl}/api/v1/rrhh/asistencias`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {}

  private getHeaders() {
    const token = this.tokenService.getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // ============================================
  // ✅ QR
  // ============================================

  obtenerQr(): Observable<AsistenciaQrDTO> {
    return this.http.get<AsistenciaQrDTO>(`${this.apiUrl}/qr-publico`, {
      headers: this.getHeaders(),
    });
  }

  marcarAsistenciaQr(payload: string): Observable<RrhhAsistenciaResponseDTO> {
    const userId = this.tokenService.getUserId();

    if (!userId) {
      throw new Error('Usuario no autenticado');
    }

    const body = {
      payload: payload,
      empleadoId: userId,
      expiraEnSegundos: 60,
    };

    return this.http.post<RrhhAsistenciaResponseDTO>(`${this.apiUrl}/marcar-qr-real`, body, {
      headers: this.getHeaders(),
    });
  }

  // ============================================
  // ✅ LISTAR CON FILTROS
  // ============================================

  listarAsistencias(
    filtro?: AsistenciaFilterDTO,
    page: number = 0,
    size: number = 20,
  ): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (filtro?.empleadoId) params = params.set('empleadoId', filtro.empleadoId);
    if (filtro?.fechaInicio) params = params.set('fechaInicio', filtro.fechaInicio);
    if (filtro?.fechaFin) params = params.set('fechaFin', filtro.fechaFin);
    if (filtro?.tipoMarcacion) params = params.set('tipoMarcacion', filtro.tipoMarcacion);
    if (filtro?.estado) params = params.set('estado', filtro.estado);

    return this.http.get(`${this.apiUrl}/listar`, {
      headers: this.getHeaders(),
      params,
    });
  }

  misAsistencias(
    filtro?: AsistenciaFilterDTO,
    page: number = 0,
    size: number = 20,
  ): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    if (filtro?.fechaInicio) params = params.set('fechaInicio', filtro.fechaInicio);
    if (filtro?.fechaFin) params = params.set('fechaFin', filtro.fechaFin);
    if (filtro?.tipoMarcacion) params = params.set('tipoMarcacion', filtro.tipoMarcacion);
    if (filtro?.estado) params = params.set('estado', filtro.estado);

    return this.http.get(`${this.apiUrl}/mis-asistencias`, {
      headers: this.getHeaders(),
      params,
    });
  }

  // ============================================
  // ✅ CRUD
  // ============================================

  buscarPorId(id: string): Observable<RrhhAsistenciaResponseDTO> {
    return this.http.get<RrhhAsistenciaResponseDTO>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  registrarManual(data: RrhhAsistenciaRequestDTO): Observable<RrhhAsistenciaResponseDTO> {
    return this.http.post<RrhhAsistenciaResponseDTO>(`${this.apiUrl}/manual`, data, {
      headers: this.getHeaders(),
    });
  }

  actualizarAsistencia(
    id: string,
    data: RrhhAsistenciaRequestDTO,
  ): Observable<RrhhAsistenciaResponseDTO> {
    return this.http.put<RrhhAsistenciaResponseDTO>(`${this.apiUrl}/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  eliminarAsistencia(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // ============================================
  // ✅ DASHBOARD Y ESTADO
  // ============================================

  obtenerDashboard(): Observable<DashboardAsistenciaDTO> {
    return this.http.get<DashboardAsistenciaDTO>(`${this.apiUrl}/dashboard`, {
      headers: this.getHeaders(),
    });
  }

  obtenerUltimaMarcacion(): Observable<RrhhAsistenciaResponseDTO> {
    return this.http.get<RrhhAsistenciaResponseDTO>(`${this.apiUrl}/ultima-marcacion`, {
      headers: this.getHeaders(),
    });
  }

  obtenerEstadoDelDia(): Observable<AsistenciaEstadoDTO> {
    return this.http.get<AsistenciaEstadoDTO>(`${this.apiUrl}/estado-dia`, {
      headers: this.getHeaders(),
    });
  }

  // ============================================
  // ✅ ✅ ✅ NUEVO: OBTENER EMPLEADOS PARA COMBO BOX
  // ============================================
  obtenerEmpleados(): Observable<UserInfoDTO[]> {
    return this.http.get<UserInfoDTO[]>(`${this.apiUrl}/empleados`, {
      headers: this.getHeaders(),
    });
  }

  // ============================================================
  // MÓDULO 10: QR personal, escaneo del admin y roster del día
  // ============================================================

  /** QR dinámico del usuario autenticado, para que el admin lo escanee. */
  obtenerMiQr(): Observable<QrPersonalDTO> {
    return this.http.get<QrPersonalDTO>(`${this.apiUrl}/mi-qr`, { headers: this.getHeaders() });
  }

  /** El admin escaneó el QR personal de un empleado: le registra la marcación. */
  escanearQrEmpleado(payload: string): Observable<RrhhAsistenciaResponseDTO> {
    return this.http.post<RrhhAsistenciaResponseDTO>(
      `${this.apiUrl}/escanear-qr`, { payload }, { headers: this.getHeaders() });
  }

  /** "Quiénes asistieron hoy". fecha en YYYY-MM-DD; vacío = hoy. */
  obtenerRoster(fecha?: string, sedeId?: string): Observable<AsistenciaRosterDTO[]> {
    let params = new HttpParams();
    if (fecha) params = params.set('fecha', fecha);
    if (sedeId) params = params.set('sedeId', sedeId);
    return this.http.get<AsistenciaRosterDTO[]>(`${this.apiUrl}/roster`, {
      headers: this.getHeaders(), params,
    });
  }

  /** Marca entrada o salida en lote desde el roster. */
  marcarLote(body: MarcarLoteRequestDTO): Observable<MarcarLoteResponseDTO> {
    return this.http.post<MarcarLoteResponseDTO>(`${this.apiUrl}/marcar-lote`, body, {
      headers: this.getHeaders(),
    });
  }
}
