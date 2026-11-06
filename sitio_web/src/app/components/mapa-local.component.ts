import { booleanAttribute, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { EmpresaStore } from '../core/empresa.store';

const RESPALDO = 'Elvira García y García 711, Trujillo, La Libertad, Perú';

@Component({
  selector: 'app-mapa-local',
  template: `
    <section class="mapa-local" [class.compacto]="compacto()">
      @if (!compacto()) {
        <div class="section-head">
          <div>
            <p class="kicker">Ubicación</p>
            <h2>Visítanos en el local</h2>
            <p class="lead">{{ direccion() }}</p>
          </div>
          <a class="btn btn-primary btn-sm" [href]="ruta()" target="_blank" rel="noopener noreferrer">Cómo llegar</a>
        </div>
      }
      <div class="mapa-marco">
        <iframe
          [src]="embed()"
          [title]="'Mapa de ' + marca.empresa().nombreComercial"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen>
        </iframe>
      </div>
      <div class="mapa-pie">
        <div>
          <strong>{{ marca.empresa().nombreComercial }}</strong>
          <p>{{ direccion() }}</p>
        </div>
        @if (compacto()) {
          <a class="btn btn-primary btn-sm" [href]="ruta()" target="_blank" rel="noopener noreferrer">Cómo llegar</a>
        }
      </div>
    </section>
  `,
})
export class MapaLocalComponent {
  private readonly sanitizer = inject(DomSanitizer);
  readonly marca = inject(EmpresaStore);
  readonly compacto = input(false, { transform: booleanAttribute });
  readonly direccionFija = input('');

  readonly direccion = computed(() => this.direccionFija().trim() || (this.marca.empresa().direccion || '').trim() || RESPALDO);
  readonly embed = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://maps.google.com/maps?q=${encodeURIComponent(this.direccion())}&output=embed&hl=es&z=16`,
  ));
  readonly ruta = computed(() => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(this.direccion())}`);
}
