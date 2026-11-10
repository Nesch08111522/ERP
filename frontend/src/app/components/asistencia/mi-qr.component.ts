import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as QRCode from 'qrcode';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { AsistenciaService } from '../../services/asistencia.service';
import { problemText } from '../../shared/utils/feedback';

/**
 * El QR personal del empleado, para que el ADMINISTRADOR lo escanee.
 *
 * Regla §2.3 de la especificación: el MULTIFUNCIONAL NO escanea QR ni se autorregistra.
 * Antes esta pantalla tenía un lector de cámara que llamaba a `POST /marcar-qr-real`
 * con la sesión del propio empleado; ese camino se eliminó y el endpoint ahora responde
 * 403 a ROLE_MULTIFUNCIONAL. Aquí solo se muestra el código.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-mi-qr',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="mi-qr">
      <p class="instrucciones text-muted">
        Muestre este código al administrador para que registre su asistencia. Cambia cada
        {{ segundos }} segundos y está firmado con su secreto personal: una fotografía vieja
        o la de otro trabajador no sirven.
      </p>

      <div class="qr-caja" *ngIf="imageUrl; else otroEstado">
        <img [src]="imageUrl" alt="QR de asistencia personal" width="230" height="230" />
        <div class="caducidad" [class.urgente]="segundos <= 10">
          <app-icon name="clock"></app-icon> válido por {{ segundos }}s
        </div>
        <button type="button" class="btn btn-ghost btn-sm" (click)="cargarMiQr()" [disabled]="cargandoQr">
          <app-icon name="refresh"></app-icon> Refrescar ahora
        </button>
      </div>

      <ng-template #otroEstado>
        <p class="text-muted" *ngIf="cargandoQr">Generando su QR…</p>
        <div class="alert alert-error" *ngIf="!cargandoQr && errorQr">
          <app-icon name="alert"></app-icon>
          <span>{{ errorQr }}</span>
          <button type="button" class="btn btn-ghost btn-sm" (click)="cargarMiQr()">Reintentar</button>
        </div>
      </ng-template>

      <p class="aviso text-muted">
        <app-icon name="shield"></app-icon>
        Su QR no contiene datos salariales ni de su cuenta: solo su identificador y un código
        de un solo uso en el tiempo.
      </p>
    </div>
  `,
  styles: [`
    :host { display: block; min-width: 0; }
    .mi-qr { display: grid; gap: 0.8rem; justify-items: center; }
    .instrucciones { margin: 0; font-size: 0.84rem; max-width: 62ch; text-align: center; }
    .qr-caja {
      display: grid; justify-items: center; gap: 0.5rem;
      padding: 1rem; border: 1px solid var(--color-line, #d7e1ec);
      border-radius: var(--radius-md, 10px); background: var(--color-paper, #fff);
    }
    .qr-caja img { image-rendering: pixelated; border-radius: 6px; max-width: 100%; height: auto; }
    .caducidad { display: flex; align-items: center; gap: 0.3rem; font-size: 0.85rem; font-weight: 700; color: var(--color-success, #15803d); }
    .caducidad.urgente { color: var(--color-danger, #b91c1c); }
    .alert-error { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }
    .aviso { display: flex; align-items: center; gap: 0.4rem; margin: 0; font-size: 0.76rem; text-align: center; }
  `],
})
export class MiQrComponent implements OnInit, OnDestroy {
  private readonly api = inject(AsistenciaService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  cargandoQr = false;
  imageUrl = '';
  segundos = 60;
  errorQr: string | null = null;
  private reloj: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void { void this.cargarMiQr(); }

  ngOnDestroy(): void {
    this.pararReloj();
    this.destroy$.next();
    this.destroy$.complete();
  }

  async cargarMiQr(): Promise<void> {
    this.cargandoQr = true;
    this.errorQr = null;
    this.api.obtenerMiQr().pipe(takeUntil(this.destroy$)).subscribe({
      next: async (qr) => {
        try {
          this.imageUrl = await QRCode.toDataURL(qr.payload, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 230,
            color: { dark: '#122033', light: '#ffffff' },
          });
          this.segundos = qr.segundosRestantes || 60;
          this.arrancarReloj();
        } catch (e) {
          this.errorQr = problemText(e);
        }
        this.cargandoQr = false;
        this.cdr.detectChanges();
      },
      error: (e: unknown) => {
        this.errorQr = problemText(e);
        this.cargandoQr = false;
        this.cdr.detectChanges();
      },
    });
  }

  private arrancarReloj(): void {
    this.pararReloj();
    this.reloj = setInterval(() => {
      if (this.segundos <= 0) { void this.cargarMiQr(); return; }
      this.segundos--;
      this.cdr.detectChanges();
    }, 1000);
  }

  private pararReloj(): void {
    if (this.reloj) { clearInterval(this.reloj); this.reloj = null; }
  }
}
