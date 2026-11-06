import { Component, ElementRef, HostListener, OnInit, effect, inject, signal, viewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CmsStore } from '../core/cms.store';
import { ProyectoPublico } from '../core/models';
import { PortalApi, cortePalabras, media, mensajeError, ritmoObra } from '../core/portal.api';

@Component({
  selector: 'app-portafolio',
  standalone: true,
  templateUrl: './portafolio.component.html',
  styleUrls: ['./portafolio.component.css'],
})
export class PortafolioComponent implements OnInit {
  private readonly api = inject(PortalApi);
  private readonly cms = inject(CmsStore);
  private readonly route = inject(ActivatedRoute, { optional: true });
  private readonly visor = viewChild<ElementRef<HTMLDialogElement>>('visor');
  private abiertoPorRuta = false;
  readonly obras = signal<ProyectoPublico[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly seleccion = signal<ProyectoPublico | null>(null);
  readonly fotoIndice = signal(0);
  readonly breve = cortePalabras;
  readonly ritmo = ritmoObra;

  constructor() {
    effect(() => {
      if (this.cms.cambiosPublicos() > 0) this.cargar();
    });
  }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.api.portafolio().subscribe({
      next: (lista) => {
        this.obras.set(lista ?? []);
        this.cargando.set(false);
        const id = this.route?.snapshot.queryParamMap.get('obra');
        const obra = id ? this.obras().find((item) => item.id === id) : undefined;
        if (obra && !this.abiertoPorRuta) {
          this.abiertoPorRuta = true;
          this.abrir(obra);
        }
      },
      error: (fallo: unknown) => {
        this.obras.set([]);
        this.error.set(mensajeError(fallo));
        this.cargando.set(false);
      },
    });
  }

  galeria(obra: ProyectoPublico): string[] {
    const crudas = obra.imagenes?.length ? obra.imagenes : obra.imagenUrl ? [obra.imagenUrl] : [];
    return crudas.map((ruta) => media(ruta)).filter((ruta): ruta is string => !!ruta);
  }

  portada(obra: ProyectoPublico): string | null {
    return this.galeria(obra)[0] ?? null;
  }

  meta(obra: ProyectoPublico): string {
    return [obra.cliente, obra.lugar, obra.anio].filter((item) => !!item?.trim()).join(' · ');
  }

  amplia(indice: number): boolean {
    const ritmo = this.ritmo(indice);
    return ritmo === 'hero' || ritmo === 'ancha';
  }

  abrir(obra: ProyectoPublico): void {
    this.seleccion.set(obra);
    this.fotoIndice.set(0);
    setTimeout(() => {
      const dialog = this.visor()?.nativeElement;
      if (dialog && !dialog.open) dialog.showModal();
    });
  }

  cerrar(): void {
    this.visor()?.nativeElement.close();
    this.seleccion.set(null);
  }

  alCerrar(): void {
    this.seleccion.set(null);
  }

  mover(paso: number): void {
    const obra = this.seleccion();
    if (!obra) return;
    const total = this.galeria(obra).length;
    if (total < 2) return;
    this.fotoIndice.update((actual) => (actual + paso + total) % total);
  }

  irFoto(indice: number): void {
    this.fotoIndice.set(indice);
  }

  fotoActual(): string | null {
    const obra = this.seleccion();
    if (!obra) return null;
    return this.galeria(obra)[this.fotoIndice()] ?? null;
  }

  imagenFallida(event: Event): void {
    const imagen = event.target;
    if (imagen instanceof HTMLImageElement) {
      imagen.hidden = true;
      imagen.closest('.obra')?.classList.add('sin-imagen');
    }
  }

  @HostListener('document:keydown', ['$event'])
  tecla(event: KeyboardEvent): void {
    if (!this.seleccion()) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.mover(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.mover(-1);
    }
  }
}
