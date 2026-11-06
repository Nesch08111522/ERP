import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../../../../environments/environment';  
/**
 * Servicio para el dashboard "Mi Día" del MULTIFUNCIONAL.
 * Centraliza las llamadas HTTP específicas de este rol.
 * (Actualmente el componente usa HttpClient directo. Este servicio es para refactor futuro.)
 */
@Injectable({ providedIn: 'root' })
export class MiDiaApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl.replace(/\/+$/, '');

  estadoDia(): Observable<any> {
    return this.http.get(`${this.base}/api/v1/rrhh/asistencias/estado-dia`);
  }

  ultimaMarcacion(): Observable<any> {
    return this.http.get(`${this.base}/api/v1/rrhh/asistencias/ultima-marcacion`);
  }

  misAsistencias(desde: string, hasta: string, size = 50): Observable<any> {
    return this.http.get(`${this.base}/api/v1/rrhh/asistencias/mis-asistencias`, {
      params: { fechaInicio: desde, fechaFin: hasta, page: 0, size, sort: 'fechaHora,asc' },
    });
  }

  misVentas(userId: string, desde: string, hasta: string, size = 100): Observable<any> {
    return this.http.get(`${this.base}/api/v1/ventas`, {
      params: { userId, desde, hasta, page: 0, size, sort: 'createdAt,desc' },
    });
  }

  turnoAbierto(sedeId: string): Observable<any> {
    return this.http.get(`${this.base}/api/v1/turnos-caja/abierto`, {
      params: sedeId ? { sedeId } : {},
    });
  }

  misComisiones(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/rrhh/comisiones/empleado/${userId}`);
  }

  miLegajo(): Observable<any> {
    return this.http.get(`${this.base}/api/v1/rrhh/legajos/me`);
  }

  preformasAbiertas(): Observable<any> {
    return this.http.get(`${this.base}/api/v1/preformas/abiertas`);
  }

  misCotizaciones(userId: string): Observable<any> {
    return this.http.get(`${this.base}/api/v1/cotizaciones`, {
      params: { userId, estado: 'EMITIDA', page: 0, size: 50 },
    });
  }

  misDespachos(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/v1/despachos/repartidor/${userId}`);
  }
}