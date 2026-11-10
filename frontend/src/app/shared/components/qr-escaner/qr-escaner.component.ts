import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, Output, EventEmitter, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Html5Qrcode } from 'html5-qrcode';
import { IconComponent } from '../icon/icon.component';

/**
 * Lector de QR con la cámara real del navegador.
 *
 * Antes de este componente el "escaneo" consistía en pegar el texto del QR a mano
 * (`qr-publico.component.ts:marcarConCodigoManual`), aunque `html5-qrcode` estuviera
 * instalado: nunca se importó en ningún `.ts`. Además el backend enviaba
 * `Permissions-Policy: camera=()`, que deniega `getUserMedia` en todo el origen.
 *
 * Uso:
 *   <app-qr-escaner [activo]="abierto" (detectado)="onQr($event)"></app-qr-escaner>
 *
 * El escáner solo corre mientras `activo` es true; al desmontar o apagar libera la
 * cámara (crítico en kioscos compartidos y en laptops con una sola webcam).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-qr-escaner',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="escaner">
      <div class="video-wrap">
        <div [id]="regionId" class="video-region"></div>
        <p class="ayuda" *ngIf="!activo">{{ ayudaInactivo }}</p>
        <p class="error" *ngIf="error">
          <app-icon name="alert"></app-icon>
          <span>{{ error }}</span>
        </p>
      </div>

      <div class="acciones">
        <button type="button" class="btn btn-primary btn-sm" *ngIf="!activo && !iniciando" (click)="iniciar()">
          <app-icon name="qr"></app-icon> {{ etiquetaIniciar }}
        </button>
        <button type="button" class="btn btn-ghost btn-sm" *ngIf="activo && !iniciando" (click)="detener()">
          <app-icon name="x"></app-icon> Cerrar cámara
        </button>
        <span class="text-muted" *ngIf="iniciando">Solicitando permiso de cámara…</span>
        <span class="texto-ultimo" *ngIf="ultimo">{{ ultimo }}</span>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .escaner { display: grid; gap: 8px; }
    .video-wrap { position: relative; border-radius: 10px; overflow: hidden; background: #0f172a; min-height: 40px; }
    .video-region { width: 100%; min-height: 240px; }
    .video-region:empty { min-height: 0; }
    .ayuda { margin: 0; padding: 10px 12px; color: #cbd5e1; font-size: 12.5px; }
    .error { display: flex; gap: 6px; align-items: flex-start; margin: 0; padding: 10px 12px; color: #fecaca; font-size: 12.5px; }
    .acciones { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .texto-ultimo { font-size: 12px; color: var(--color-success, #16a34a); font-weight: 600; }
  `],
})
export class QrEscanerComponent implements OnDestroy {
  private readonly host = inject(ElementRef);
  private readonly cdr = inject(ChangeDetectorRef);

  /** Region id único por instancia: dos escáneres en la misma página no se pisan. */
  private static secuencia = 0;
  readonly regionId = `qr-escaner-${++QrEscanerComponent.secuencia}`;

  @Input() etiquetaIniciar = 'Escanear QR con la cámara';
  @Input() ayudaInactivo = 'La cámara está apagada.';
  /** Preferencia de cámara: 'back' para el kiosco/PC de escritorio, 'front' para el móvil. */
  @Input() facingMode: 'front' | 'back' = 'back';

  /** Se emite el texto crudo del QR. El padre decide qué hacer con él. */
  @Output() detectado = new EventEmitter<string>();

  activo = false;
  iniciando = false;
  error: string | null = null;
  ultimo = '';

  private escaner: Html5Qrcode | null = null;

  async iniciar(): Promise<void> {
    if (this.activo || this.iniciando) return;
    this.iniciando = true;
    this.error = null;
    this.cdr.detectChanges();

    try {
      if (!this.escaner) {
        this.escaner = new Html5Qrcode(this.regionId);
      }
      await this.escaner.start(
        { facingMode: this.facingMode },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (texto) => this.alDetectar(texto),
        // html5-qrcode dispara este callback en casi cada frame sin QR; silenciarlo evita ruido.
        () => undefined,
      );
      this.activo = true;
    } catch (e) {
      this.error = this.mensajeError(e);
      await this.liberarCamara();
    } finally {
      this.iniciando = false;
      this.cdr.detectChanges();
    }
  }

  async detener(): Promise<void> {
    if (!this.activo) return;
    await this.liberarCamara();
    this.activo = false;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    void this.liberarCamara();
  }

  private alDetectar(texto: string): void {
    // Pausa corta: el mismo QR dinámico sigue visible y generaría marcaciones duplicadas.
    this.escaner?.pause(true);
    this.ultimo = texto.length > 42 ? `${texto.slice(0, 42)}…` : texto;
    this.detectado.emit(texto);
    this.cdr.detectChanges();
  }

  /** Reanuda tras un rechazo del backend, para poder reintentar con el QR refrescado. */
  reanudar(): void {
    if (!this.activo || !this.escaner) return;
    this.escaner.resume();
    this.ultimo = '';
    this.cdr.detectChanges();
  }

  private async liberarCamara(): Promise<void> {
    if (!this.escaner) return;
    try {
      await this.escaner.stop();
    } catch {
      // stop() falla si la cámara nunca llegó a abrirse: no hay nada que liberar.
    }
    try {
      this.escaner.clear();
    } catch {
      // clear() es idempotente en la práctica; un fallo aquí no debe romper el cierre.
    }
    this.escaner = null;
  }

  private mensajeError(e: unknown): string {
    const nombre = (e as { name?: string })?.name ?? '';
    const texto = String((e as Error)?.message ?? e ?? '');
    if (nombre === 'NotAllowedError' || /permission|denied/i.test(texto)) {
      return 'Permiso de cámara denegado. HABILÍTALO en el candado de la barra de direcciones y vuelve a intentar.';
    }
    if (nombre === 'NotFoundError' || /notfound/i.test(texto)) {
      return 'No se detectó ninguna cámara en este equipo.';
    }
    if (/in use|notreadablesourcestate|busy/i.test(texto)) {
      return 'La cámara está siendo usada por otra aplicación. Ciérrala e intenta de nuevo.';
    }
    return `No se pudo abrir la cámara: ${texto || nombre || 'error desconocido'}. `
      + 'Puedes pegar el contenido del QR manualmente.';
  }
}
