import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import * as Api from '../../core/api/openapi.types';

@Injectable({ providedIn: 'root' })
export class AlmacenService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl.replace(/\/+$/, '');
  private readonly cache = new Map<string, Observable<Api.AlmacenResponseDTO[]>>();

  /** Lista los almacenes de una sede. Cachea por sedeId. */
  findBySede(sedeId: string): Observable<Api.AlmacenResponseDTO[]> {
    if (!sedeId) return of([]);
    const cached = this.cache.get(sedeId);
    if (cached) return cached;
    const request$ = this.http
      .get<Api.AlmacenResponseDTO[]>(`${this.base}/api/v1/almacenes/sede/${sedeId}`)
      .pipe(shareReplay(1));
    this.cache.set(sedeId, request$);
    return request$;
  }

  invalidate(sedeId?: string): void {
    if (sedeId) this.cache.delete(sedeId);
    else this.cache.clear();
  }
}