import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

/**
 * Política de remuneración efectiva (§8.1): el resultado de resolver legajo → sede → empresa.
 *
 * Escrito a mano por la misma razón que `historial-salarial.api.ts`: el catálogo generado aún
 * no incluye los endpoints nuevos de RRHH.
 */

/** Espejo de com.policalum.erp.application.dto.response.PoliticaRemuneracionDTO. */
export interface PoliticaRemuneracionDTO {
  division: 'DIAS_30' | 'DIAS_CALENDARIO' | 'DIAS_LABORABLES';
  diasLaborables: string[] | null;
  ausencias: 'NO_AFECTA' | 'DESCUENTO_DIAS_SIN_MARCACION';
  origenDivision: 'EMPLEADO' | 'SEDE' | 'EMPRESA';
  origenDiasLaborables: 'EMPLEADO' | 'SEDE' | 'EMPRESA';
  origenAusencias: 'EMPLEADO' | 'SEDE' | 'EMPRESA';
  /** Entre cuántos días se divide el sueldo del mes en curso. */
  divisorMesEnCurso: number;
  periodoReferencia: string;
}

export const ETIQUETA_DIVISION: Record<PoliticaRemuneracionDTO['division'], string> = {
  DIAS_30: '30 días siempre',
  DIAS_CALENDARIO: 'días reales del mes',
  DIAS_LABORABLES: 'solo días laborables',
};

export const ETIQUETA_ORIGEN: Record<PoliticaRemuneracionDTO['origenDivision'], string> = {
  EMPLEADO: 'del legajo',
  SEDE: 'de la sede',
  EMPRESA: 'de la empresa',
};

@Injectable({ providedIn: 'root' })
export class PoliticaRemuneracionApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl.replace(/\/+$/, '')}/api/v1/rrhh/legajos`;

  deEmpleado(empleadoId: string): Observable<PoliticaRemuneracionDTO> {
    return this.http.get<PoliticaRemuneracionDTO>(`${this.base}/${empleadoId}/politica-remuneracion`);
  }

  mia(): Observable<PoliticaRemuneracionDTO> {
    return this.http.get<PoliticaRemuneracionDTO>(`${this.base}/me/politica-remuneracion`);
  }
}
