import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

/**
 * Buffer predictivo de baja fricción para listas paginadas (catálogo y stock).
 *
 * Guarda en memoria la última respuesta de una clave de consulta durante un TTL corto
 * y permite "precalentar" la siguiente página en segundo plano. Así, cuando el usuario
 * avanza de página, el dato suele estar ya listo y el render no espera al servidor.
 *
 * Es intencionalmente tolerante a fallos: un prefetch que falla se descarta en silencio
 * (no ensucia la caché ni lanza al usuario); la recarga visible sigue su propio curso.
 */
@Injectable({ providedIn: 'root' })
export class PredictiveBufferService {
  private static readonly TTL_MS = 15_000;
  private readonly cache = new Map<string, { valor: unknown; expira: number }>();

  /** Devuelve el observable de la consulta, sirviendo de caché si hay una entrada fresca. */
  obtener<T>(clave: string, fabrica: () => Observable<T>): Observable<T> {
    const hoy = Date.now();
    const golpe = this.cache.get(clave);
    if (golpe && golpe.expira > hoy) {
      return of(golpe.valor as T);
    }
    return fabrica().pipe(
      tap((valor) => this.guardar(clave, valor)),
    );
  }

  /**
   * Precarga una clave en segundo plano. Si ya está fresca, no hace nada.
   * El error se ignora a propósito: es un extra de rendimiento, no un requisito.
   */
  precalentar<T>(clave: string, fabrica: () => Observable<T>): void {
    const hoy = Date.now();
    const golpe = this.cache.get(clave);
    if (golpe && golpe.expira > hoy) return;
    fabrica().pipe(
      tap((valor) => this.guardar(clave, valor)),
    ).subscribe({
      error: () => {
        /* prefetch silencioso */
      },
    });
  }

  /** Invalida todas las entradas cuyo prefijo coincide (p. ej. al mutar el catálogo). */
  invalidarPrefijo(prefijo: string): void {
    for (const clave of [...this.cache.keys()]) {
      if (clave.startsWith(prefijo)) this.cache.delete(clave);
    }
  }

  private guardar(clave: string, valor: unknown): void {
    this.cache.set(clave, { valor, expira: Date.now() + PredictiveBufferService.TTL_MS });
  }
}
