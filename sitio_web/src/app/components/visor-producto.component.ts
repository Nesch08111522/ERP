import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-visor',
  styles: `
    :host { display: block; width: 100%; height: 100%; }
    img, .visor { width: 100%; height: 100%; object-fit: contain; display: block; }
    .sin-foto { position:relative; width:100%; height:100%; min-height:140px; }
    .sin-foto small { position:absolute; bottom:10px; left:8px; right:8px; text-align:center; color:#b8cdd6; font-size:10px; letter-spacing:.03em; }
  `,
  template: `
    @if (src && fallida() !== src) {
      <img [src]="src" [alt]="alt" loading="lazy" decoding="async" (error)="fallida.set(src)" />
    } @else {
      <div class="sin-foto">
      <svg class="visor" viewBox="0 0 320 240" aria-hidden="true">
        @switch (tipo) {
          @case ('perfil') {
            <rect width="320" height="240" fill="#163044" />
            <path d="M70 70h180v18H168v84h-16V88H70V70Z" fill="#d7e4ee" />
            <path d="M152 88h16v84h-16Z" fill="#8fd4e6" />
          }
          @case ('placa') {
            <rect width="320" height="240" fill="#102433" />
            <g opacity="0.95">
              <path d="M48 150 150 58l122 78-102 62Z" fill="#7fd3ea" />
              <path d="M64 162 154 78l96 62-90 58Z" fill="#d8f6ff" opacity="0.85" />
              <path d="M80 168 158 96l74 48-78 50Z" fill="#49b7d4" opacity="0.9" />
            </g>
          }
          @default {
            <rect width="320" height="240" fill="#142838" />
            <path d="M160 55 222 88v64l-62 34-62-34V88Z M98 88l62 34 62-34 M160 122v64" fill="#193746" stroke="#7b9dad" stroke-width="2" />
          }
        }
      </svg>
      <small>{{ tipo === 'accesorio' ? 'Foto pendiente' : 'Ilustración referencial · foto pendiente' }}</small>
      </div>
    }
  `,
})
export class VisorProductoComponent {
  @Input() src: string | null = null;
  @Input() alt = 'Producto';
  @Input() nombre = '';
  readonly fallida = signal<string | null>(null);

  get tipo(): 'placa' | 'perfil' | 'accesorio' {
    const texto = `${this.nombre} ${this.alt}`.toLowerCase();
    if (texto.includes('perfil')) return 'perfil';
    if (texto.includes('policarbonato') || texto.includes('plancha') || texto.includes('tapa')) return 'placa';
    return 'accesorio';
  }
}
