import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MarcaService } from '../../services/marca.service';
import { AvisosSistema } from '../../services/avisos-sistema.service';

@Component({
  selector: 'app-aviso-sistema-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avisos-sistema" aria-live="polite">
      @for (aviso of sistema.locales(); track aviso.id) {
        <article class="aviso-sistema" [class.aviso-barra]="aviso.celular" role="status">
          <button type="button" class="aviso-cuerpo" (click)="abrir(aviso.url, aviso.id)">
            <img [src]="marca.logoSrc()" [alt]="marca.nombre()" (error)="marca.usarRespaldo()" />
            <span>
              <strong>{{ aviso.titulo }}</strong>
              <em>{{ aviso.cuerpo }}</em>
            </span>
          </button>
          <button type="button" class="aviso-cerrar" (click)="sistema.cerrar(aviso.id)" aria-label="Cerrar aviso">×</button>
        </article>
      }
    </div>
  `,
  styles: `
    .avisos-sistema { position: fixed; z-index: 80; right: 16px; bottom: 16px; display: grid; gap: 8px; width: min(360px, calc(100vw - 24px)); pointer-events: none; }
    .aviso-sistema {
      pointer-events: auto; display: flex; align-items: flex-start; gap: 8px;
      padding: 12px; border-radius: 14px; color: #f4f7fb;
      background: #1c2430; border: 1px solid rgb(255 255 255 / 12%);
      box-shadow: 0 16px 40px rgb(0 0 0 / 35%);
    }
    .aviso-cuerpo { flex: 1; display: flex; gap: 10px; align-items: flex-start; border: 0; background: transparent; color: inherit; text-align: left; padding: 0; cursor: pointer; }
    .aviso-cuerpo img { width: 28px; height: 28px; object-fit: contain; border-radius: 6px; background: #fff; flex: 0 0 auto; }
    .aviso-cuerpo span { display: grid; gap: 2px; min-width: 0; }
    .aviso-cuerpo strong, .aviso-cuerpo em { overflow-wrap: anywhere; }
    .aviso-cuerpo em { font-style: normal; color: #c5d0dc; font-size: 0.92rem; }
    .aviso-cerrar { border: 0; background: transparent; color: #c5d0dc; font-size: 1.2rem; line-height: 1; cursor: pointer; }
    .aviso-barra { position: fixed; top: 8px; left: 8px; right: 8px; width: auto; border-radius: 12px; }
    @media (max-width: 900px) {
      .avisos-sistema:has(.aviso-barra) { top: 8px; right: 8px; bottom: auto; left: 8px; width: auto; }
    }
  `,
})
export class AvisoSistemaHostComponent {
  readonly sistema = inject(AvisosSistema);
  readonly marca = inject(MarcaService);
  private readonly router = inject(Router);

  abrir(url: string, id: number): void {
    this.sistema.cerrar(id);
    const ruta = url.startsWith('http') ? url : url;
    if (ruta.startsWith('http')) {
      location.assign(ruta);
      return;
    }
    void this.router.navigateByUrl(ruta);
  }
}
