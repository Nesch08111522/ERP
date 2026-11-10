import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

/**
 * Régimen de ganancia personal del ADMINISTRADOR.
 *
 * Escrito a mano (no generado desde OpenAPI) porque el contrato aún no se regeneró;
 * sigue el mismo patrón que `features/dashboard/pages/data-access/mi-dia.api.ts`.
 * Al regenerar `api-endpoints.generated.ts` estos métodos pueden migrar a `RrhhApiService`.
 */

/** GET/PUT /api/v1/rrhh/mi-regimen */
export interface RegimenResponseDTO {
  id: string | null;
  usuarioId: string;
  usuarioNombre: string;
  sedeId: string | null;
  sedeNombre: string | null;
  sueldoHabilitado: boolean;
  comisionHabilitada: boolean;
  repartoHabilitado: boolean;
  porcentajeReparto: number;
  baseReparto: BaseReparto;
  topeRepartoMensual: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  sueldoBase: number;
  porcentajeComisionVentas: number;
  diaCobro: number | null;
  tipoContrato: string | null;
  tieneLegajo: boolean;
}

export interface RegimenRequestDTO {
  sueldoHabilitado: boolean;
  comisionHabilitada: boolean;
  repartoHabilitado: boolean;
  porcentajeReparto?: number;
  baseReparto?: BaseReparto;
  topeRepartoMensual?: number | null;
}

export type BaseReparto = 'UTILIDAD_NETA' | 'VENTAS_NETAS' | 'MARGEN_BRUTO';

/** GET /api/v1/rrhh/mi-regimen/resumen — los dos bolsillos del periodo. */
export interface GananciaPersonalResponseDTO {
  sedeId: string | null;
  periodo: string;
  desde: string;
  hasta: string;

  empresaVentasNetas: number;
  empresaComprasNetas: number;
  empresaUtilidadBruta: number;
  empresaGastosOperativos: number;
  empresaGastosEmpresariales: number;
  empresaUtilidadNeta: number;
  empresaMargenNetoPct: number;
  empresaRetirosSocios: number;

  sueldoHabilitado: boolean;
  personalSueldo: number;
  personalSueldoBase: number;
  personalDiasComputados: number;

  comisionHabilitada: boolean;
  personalComisionPct: number;
  personalComisionBaseVentas: number;
  personalComision: number;

  repartoHabilitado: boolean;
  personalBaseReparto: BaseReparto;
  personalPorcentajeReparto: number;
  personalMontoBaseReparto: number;
  personalTopeRepartoMensual: number | null;
  personalRepartoUtilidad: number;

  personalTotal: number;
  personalNominasPagadas: number;

  saldoEmpresaTrasReparto: number;
  personalSobreEmpresaPct: number;

  advertencia: string | null;
}

export const ETIQUETA_BASE_REPARTO: Record<BaseReparto, string> = {
  UTILIDAD_NETA: 'Utilidad neta de la empresa',
  VENTAS_NETAS: 'Ventas netas de la empresa',
  MARGEN_BRUTO: 'Margen bruto (ventas − compras)',
};

@Injectable({ providedIn: 'root' })
export class MiRegimenApiService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl.replace(/\/+$/, '')}/api/v1/rrhh/mi-regimen`;

  mio(): Observable<RegimenResponseDTO> {
    return this.http.get<RegimenResponseDTO>(this.base);
  }

  guardar(body: RegimenRequestDTO): Observable<RegimenResponseDTO> {
    return this.http.put<RegimenResponseDTO>(this.base, body);
  }

  resumen(periodo?: string, sedeId?: string): Observable<GananciaPersonalResponseDTO> {
    let params = new HttpParams();
    if (periodo) params = params.set('periodo', periodo);
    if (sedeId) params = params.set('sedeId', sedeId);
    return this.http.get<GananciaPersonalResponseDTO>(`${this.base}/resumen`, { params });
  }
}
