import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

/**
 * Historial de cambios salariales del legajo (§2.4).
 *
 * Escrito a mano (no generado desde OpenAPI) por la misma razón que `mi-regimen.api.ts`:
 * el catálogo `api-endpoints.generated.ts` todavía no incluye los endpoints nuevos de RRHH.
 * Al regenerarlo, estos dos métodos pueden migrar a `RrhhApiService`.
 */

/** Espejo de com.policalum.erp.application.dto.response.HistorialSalarialResponseDTO. */
export interface HistorialSalarialResponseDTO {
  id: string;
  legajoId: string;
  /** Día desde el que rigió este sueldo. */
  vigenciaDesde: string;
  /** null = vigente (no hay un cambio posterior). */
  vigenciaHasta: string | null;
  vigente: boolean;
  tipoContratoAnterior: string | null;
  tipoContratoNuevo: string | null;
  /** null solo en el sueldo inicial: no existía un antes que mostrar. */
  sueldoAnterior: number | null;
  sueldoNuevo: number;
  /** null en el sueldo inicial; positivo en aumento, negativo en reducción. */
  sueldoDelta: number | null;
  comisionAnterior: number | null;
  comisionNuevo: number;
  diaCobroAnterior: number | null;
  diaCobroNuevo: number | null;
  motivo: string | null;
  /** null en las filas sembradas por la migración: nadie las registró. */
  registradoPorNombre: string | null;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class HistorialSalarialApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl.replace(/\/+$/, '')}/api/v1/rrhh/legajos`;

  /** Historial de un empleado (id de USUARIO). Solo ADMIN con rrhh.ver_legajos. */
  deEmpleado(empleadoId: string): Observable<HistorialSalarialResponseDTO[]> {
    return this.http.get<HistorialSalarialResponseDTO[]>(`${this.base}/${empleadoId}/historial-salarial`);
  }

  /** Historial del usuario autenticado. Cualquier rol, solo el propio. */
  mio(): Observable<HistorialSalarialResponseDTO[]> {
    return this.http.get<HistorialSalarialResponseDTO[]>(`${this.base}/me/historial-salarial`);
  }
}
