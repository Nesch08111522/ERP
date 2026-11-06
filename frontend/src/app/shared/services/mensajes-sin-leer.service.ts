import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';

/** Total de mensajes de la bandeja que todavía no se abrieron. */
@Injectable({ providedIn: 'root' })
export class MensajesSinLeer {
  readonly total = signal(0);

  constructor(private readonly http: HttpClient) {}

  refrescar(): void {
    this.http.get<{ sinLeer: number }>(`${environment.apiUrl}/api/v1/mensajes-web/sin-leer`).subscribe({
      next: (respuesta) => this.total.set(respuesta.sinLeer ?? 0),
      error: () => undefined,
    });
  }

  ajustar(delta: number): void {
    this.total.update((actual) => Math.max(0, actual + delta));
  }
}
