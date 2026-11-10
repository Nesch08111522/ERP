import { booleanAttribute, Component, Input, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../core/carrito.service';
import { ProductoPublico } from '../core/models';
import { media, pen } from '../core/portal.api';
import { VisorProductoComponent } from './visor-producto.component';

@Component({
  selector: 'app-ficha',
  imports: [RouterLink, VisorProductoComponent],
  template: `
    <article class="tile" [class.elegida]="enCarrito" [class.lista]="lista">
      <div class="tile-photo" [class.gira]="girando()">
        <a [routerLink]="['/catalogo', producto.id]" [attr.aria-label]="producto.nombre">
          <app-visor [src]="foto" [alt]="producto.nombre" [nombre]="producto.nombre" />
        </a>
        @if (producto.oferta) {
          <span class="tile-badge oferta">Oferta</span>
        } @else if (ultimas) {
          <span class="tile-badge bajo">Últimas unidades</span>
        } @else if (producto.destacado) {
          <span class="tile-badge">Destacado</span>
        }
        <button type="button" class="giro" (click)="girar()" aria-label="Ver en 3D">3D</button>
      </div>
      <div class="tile-copy">
        <p class="eyebrow">{{ producto.categoriaNombre || 'Catálogo' }}</p>
        <h3><a [routerLink]="['/catalogo', producto.id]">{{ producto.nombre }}</a></h3>
        @if (producto.descripcion && (lista || abierta())) { <p class="tile-desc">{{ producto.descripcion }}</p> }
        @if (producto.descripcion && !lista) {
          <button type="button" class="linkish" (click)="abierta.set(!abierta())">{{ abierta() ? 'Ocultar descripción' : 'Ver descripción' }}</button>
        }
        <p class="tile-meta">
          <span [class.on]="producto.disponible" [class.off]="!producto.disponible">{{ existencia }}</span>
          @if (producto.codigoSku) { <span>{{ producto.codigoSku }}</span> }
        </p>
        @if (producto.esFraccionable) {
          <label class="fraccion-picker">Corte publicado
            <select [value]="fraccionElegida?.id || ''" (change)="fraccionId.set($any($event.target).value)">
              @for (fraccion of producto.fracciones; track fraccion.id) {
                <option [value]="fraccion.id">{{ etiquetaFraccion(fraccion.factor, fraccion.nombre) }} · {{ pen(fraccion.precio) }}</option>
              }
            </select>
          </label>
        }
        <div class="tile-row">
          <p class="tile-price">@if (antes) { <span class="precio-antes">{{ antes }}</span> }{{ precio }}</p>
          <button type="button" class="btn btn-sm" [class.btn-primary]="!enCarrito" [class.btn-ok]="enCarrito" [disabled]="!producto.disponible || (producto.esFraccionable && !fraccionElegida)" (click)="sumar()">
            {{ enCarrito ? 'En el carrito' : 'Agregar' }}
          </button>
        </div>
      </div>
    </article>
  `,
})
export class FichaProductoComponent {
  private readonly carrito = inject(CarritoService);
  readonly girando = signal(false);
  readonly abierta = signal(false);
  readonly fraccionId = signal('');
  readonly pen = pen;

  get fraccionElegida() {
    return this.producto.esFraccionable ? this.producto.fracciones.find((item) => item.id === this.fraccionId()) ?? this.producto.fracciones[0] : undefined;
  }

  etiquetaFraccion(factor: number, nombre: string): string {
    return ({ 0.25: '1/4', 0.5: '1/2', 0.75: '3/4', 1: '1' } as Record<number, string>)[factor] || nombre;
  }
  @Input({ required: true }) producto!: ProductoPublico;
  @Input({ transform: booleanAttribute }) lista = false;

  get enCarrito(): boolean {
    return this.carrito.tiene(this.producto.id);
  }

  get ultimas(): boolean {
    const stock = this.producto.stock;
    return this.producto.disponible && stock != null && stock > 0 && stock <= 8;
  }

  girar(): void {
    this.girando.set(true);
    window.setTimeout(() => this.girando.set(false), 1100);
  }

  sumar(): void {
    if (!this.producto.disponible) return;
    const fraccion = this.fraccionElegida;
    if (this.producto.esFraccionable && !fraccion) return;
    this.carrito.agregar({
      productoId: this.producto.id,
      nombre: this.producto.nombre,
      fraccionId: fraccion?.id,
      fraccionNombre: fraccion?.nombre,
      precio: fraccion?.precio ?? this.producto.precioPublico,
      cantidad: 1,
      imagenUrl: this.producto.imagenUrl,
      unidad: this.producto.unidad || 'UND',
    });
  }

  get foto(): string | null {
    return media(this.producto.imagenUrl);
  }

  get inicial(): string {
    return (this.producto.nombre || 'P').charAt(0).toUpperCase();
  }

  get precio(): string {
    return pen(this.fraccionElegida?.precio ?? this.producto.precioPublico);
  }

  get antes(): string {
    const lista = Number(this.fraccionElegida ? this.fraccionElegida.precioLista : this.producto.precioLista);
    if (!this.producto.oferta || !(lista > Number(this.fraccionElegida?.precio ?? this.producto.precioPublico))) return '';
    return pen(lista);
  }

  get existencia(): string {
    const stock = Number(this.producto.stock ?? 0);
    if (!this.producto.disponible || stock <= 0) return 'Agotado';
    return `Stock ${stock}`;
  }
}
