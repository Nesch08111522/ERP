import { Injectable } from '@angular/core';

/** Dos timbres distintos: el ERP es agudo y el cliente del sitio no usa esta clase. */
@Injectable({ providedIn: 'root' })
export class AvisoSonoro {
  private ctx?: AudioContext;
  private ultimo = 0;

  preparar(): void {
    const Fabrica = window.AudioContext;
    if (!Fabrica) return;
    this.ctx = this.ctx ?? new Fabrica();
    void this.ctx.resume();
  }

  erp(): void {
    const ahora = Date.now();
    if (ahora - this.ultimo < 2000) return;
    this.ultimo = ahora;
    this.preparar();
    this.nota(880, 0, 0.09, 'sine');
    this.nota(1175, 0.11, 0.14, 'sine');
  }

  private nota(hz: number, espera: number, duracion: number, tipo: OscillatorType): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const ganancia = ctx.createGain();
    osc.type = tipo;
    osc.frequency.value = hz;
    ganancia.gain.setValueAtTime(0.0001, ctx.currentTime + espera);
    ganancia.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + espera + 0.02);
    ganancia.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + espera + duracion);
    osc.connect(ganancia);
    ganancia.connect(ctx.destination);
    osc.start(ctx.currentTime + espera);
    osc.stop(ctx.currentTime + espera + duracion + 0.02);
  }
}
