import { Component, DestroyRef, OnDestroy, OnInit, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { HeroCinematicComponent } from '../components/hero-cinematic.component';
import { FichaProductoComponent } from '../components/ficha-producto.component';
import { GaleriaMaterialesComponent } from '../components/galeria-materiales.component';
import { MapaLocalComponent } from '../components/mapa-local.component';
import { CmsStore } from '../core/cms.store';
import { EmpresaStore } from '../core/empresa.store';
import { PortalApi, cortePalabras, media, mensajeError, pen, ritmoObra } from '../core/portal.api';
import { CategoriaPublica, ProductoPublico, ProyectoPublico, ServicioPublico } from '../core/models';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, HeroCinematicComponent, FichaProductoComponent, GaleriaMaterialesComponent, MapaLocalComponent],
  templateUrl: './inicio.component.html',
})
export class InicioComponent implements OnInit, OnDestroy {
  private readonly api = inject(PortalApi);
  private readonly destroyRef = inject(DestroyRef);
  private obrasSolicitud?: Subscription;
  readonly cargaPendiente = signal(5);
  readonly erroresCarga = signal<string[]>([]);
  readonly catalogoCache = signal(false);
  readonly marca = inject(EmpresaStore);
  readonly cms = inject(CmsStore);
  readonly pen = pen;
  readonly ofertas = signal<ProductoPublico[]>([]);
  readonly destacados = signal<ProductoPublico[]>([]);
  readonly categorias = signal<CategoriaPublica[]>([]);
  readonly catalogo = signal<ProductoPublico[]>([]);
  readonly servicios = signal<ServicioPublico[]>([]);
  readonly obras = signal<ProyectoPublico[]>([]);
  readonly obrasCargando = signal(true);
  readonly obrasError = signal('');
  readonly cine = signal(typeof matchMedia !== 'function' || !matchMedia('(prefers-reduced-motion: reduce)').matches);
  readonly breve = cortePalabras;
  readonly ritmo = ritmoObra;
  readonly clips = [
    { id: 'espesor', titulo: 'Espesor', src: '/videos/espesor.mp4', poster: '/videos/espesor-poster.jpg' },
    { id: 'colores', titulo: 'Colores', src: '/videos/colores.mp4', poster: '/videos/colores-poster.jpg' },
    { id: 'conectores', titulo: 'Conectores H', src: '/videos/conectores.mp4', poster: '/videos/conectores-poster.jpg' },
  ];
  readonly banner = signal(0);
  private bannerTimer = 0;

  constructor() {
    effect(() => {
      if (this.cms.cambiosPublicos() > 0) this.cargarObras();
    });
  }

  ngOnInit(): void {
    this.cargarPublicado('Ofertas', this.api.ofertas(), (lista) => this.ofertas.set(lista));
    this.cargarPublicado('Destacados', this.api.destacados(), (lista) => this.destacados.set(lista));
    this.cargarPublicado('Categorías', this.api.categorias(), (lista) => this.categorias.set(lista));
    this.cargarPublicado('Catálogo', this.api.productos({ page: 0 }), (pagina) => {
      this.catalogo.set((pagina.content ?? []).slice(0, 6));
      this.catalogoCache.set(!!pagina.enCache);
    });
    this.cargarPublicado('Servicios', this.api.servicios(), (lista) => this.servicios.set(lista));
    this.cargarObras();
  }

  private cargarPublicado<T>(nombre: string, solicitud: Observable<T>, aplicar: (valor: T) => void): void {
    solicitud.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (valor) => aplicar(valor),
      error: (error: unknown) => {
        this.erroresCarga.update((lista) => [...lista, `${nombre}: ${mensajeError(error)}`]);
        this.cargaPendiente.update((total) => total - 1);
      },
      complete: () => this.cargaPendiente.update((total) => total - 1),
    });
  }

  ngOnDestroy(): void {
    this.pausarBanner();
    this.obrasSolicitud?.unsubscribe();
  }

  avanzar(delta: number): void {
    this.banner.update((actual) => (actual + delta + this.clips.length) % this.clips.length);
  }

  irBanner(indice: number): void {
    this.banner.set(indice);
    this.reanudarBanner();
  }

  pausarBanner(): void {
    if (this.bannerTimer) window.clearInterval(this.bannerTimer);
    this.bannerTimer = 0;
  }

  reanudarBanner(): void {
    this.pausarBanner();
    if (!this.cine()) return;
    this.bannerTimer = window.setInterval(() => this.avanzar(1), 7000);
  }

  silenciar(event: Event): void {
    const video = event.target;
    if (!(video instanceof HTMLVideoElement)) return;
    video.defaultMuted = true;
    video.muted = true;
    video.volume = 0;
    void video.play().catch(() => undefined);
  }

  foto(obra: ProyectoPublico): string | null {
    return media(obra.imagenes?.[0] || obra.imagenUrl);
  }

  cargarObras(): void {
    this.obrasCargando.set(true);
    this.obrasError.set('');
    this.obrasSolicitud?.unsubscribe();
    this.obrasSolicitud = this.api.portafolio().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
      imagen.closest('.obra')?.classList.add('sin-imagen');
    }
  }
}
