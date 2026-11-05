import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FichaProductoComponent } from '../components/ficha-producto.component';
import { CmsStore } from '../core/cms.store';
import { EmpresaStore } from '../core/empresa.store';
import { PortalApi, media, mensajeError, pen } from '../core/portal.api';
import { ProductoPublico, ProyectoPublico, ServicioPublico } from '../core/models';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, FichaProductoComponent],
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit {
  private readonly api = inject(PortalApi);
  readonly marca = inject(EmpresaStore);
  readonly cms = inject(CmsStore);
  readonly pen = pen;
  readonly ofertas = signal<ProductoPublico[]>([]);
  readonly catalogo = signal<ProductoPublico[]>([]);
  readonly servicios = signal<ServicioPublico[]>([]);
  readonly obras = signal<ProyectoPublico[]>([]);
  readonly obrasCargando = signal(true);
  readonly obrasError = signal('');

  constructor() {
    effect(() => {
      if (this.cms.cambiosPublicos() > 0) this.cargarObras();
    });
  }

  ngOnInit(): void {
    this.api.ofertas().subscribe({ next: (lista) => this.ofertas.set(lista), error: () => undefined });
    this.api.productos({ page: 0 }).subscribe({
      next: (pagina) => this.catalogo.set((pagina.content ?? []).slice(0, 6)),
      error: () => undefined,
    });
    this.api.servicios().subscribe({ next: (lista) => this.servicios.set(lista), error: () => undefined });
    this.cargarObras();
  }

  foto(obra: ProyectoPublico): string | null {
    return media(obra.imagenUrl);
  }

  cargarObras(): void {
    this.obrasCargando.set(true);
    this.obrasError.set('');
    this.api.portafolio().subscribe({
      next: (lista) => {
        this.obras.set(lista ?? []);
        this.obrasCargando.set(false);
      },
      error: (error: unknown) => {
        this.obras.set([]);
        this.obrasError.set(mensajeError(error));
        this.obrasCargando.set(false);
      },
    });
  }

  imagenFallida(event: Event): void {
    const imagen = event.target;
    if (imagen instanceof HTMLImageElement) {
      imagen.hidden = true;
      imagen.closest('.work')?.classList.add('sin-imagen');
    }
  }
}
