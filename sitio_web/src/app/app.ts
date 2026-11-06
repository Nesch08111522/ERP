import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AvisoService } from './core/aviso.service';
import { CarritoService } from './core/carrito.service';
import { CmsStore } from './core/cms.store';
import { EmpresaStore } from './core/empresa.store';
import { CategoriaPublica, ProductoPublico, SedePublica } from './core/models';
import { PortalApi, media, pen } from './core/portal.api';
import { TemaService } from './core/tema.service';
import { AsistenteComponent } from './components/asistente.component';

interface FraseVoz { transcript: string; }
interface ResultadoVoz extends ArrayLike<FraseVoz> { isFinal: boolean; }
interface Reconocimiento extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((evento: { resultIndex: number; results: ArrayLike<ResultadoVoz> }) => void) | null;
  onerror: ((evento: { error?: string }) => void) | null;
  onend: (() => void) | null;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, AsistenteComponent],
  templateUrl: './app.html',
})
export class App implements OnDestroy {
  readonly carrito = inject(CarritoService);
  readonly marca = inject(EmpresaStore);
  readonly cms = inject(CmsStore);
  readonly avisos = inject(AvisoService);
  readonly tema = inject(TemaService);
  private readonly api = inject(PortalApi);
  private readonly router = inject(Router);
  private readonly navegacion: Subscription;

  readonly media = media;
  readonly pen = pen;
  readonly menu = signal(false);
  readonly angosto = signal(false);
  private readonly consultaAncho = window.matchMedia('(max-width: 991px)');
  private motor: Reconocimiento | null = null;
  private dictadoFinal = '';
  private readonly alCambiarAncho = () => this.aplicarAncho();
  readonly preguntarCarrito = signal(false);
  readonly anio = new Date().getFullYear();
  readonly ruta = signal(this.router.url);
  readonly categorias = signal<CategoriaPublica[]>([]);
  readonly sedes = signal<SedePublica[]>([]);
  readonly vitrina = signal<ProductoPublico[]>([]);
  readonly sugerencias = signal<ProductoPublico[]>([]);
  readonly escuchando = signal(false);
  readonly vozAviso = signal('');
  private espera = 0;
  @ViewChild('caja') caja?: ElementRef<HTMLInputElement>;

  constructor() {
    this.navegacion = this.router.events.pipe(
      filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
    ).subscribe((evento) => {
      this.ruta.set(evento.urlAfterRedirects);
      if (this.angosto()) {
        this.menu.set(false);
        this.bloquearFondo();
      }
    });
    this.aplicarAncho();
    this.consultaAncho.addEventListener('change', this.alCambiarAncho);
    this.api.categorias().subscribe({ next: (lista) => this.categorias.set(lista), error: () => undefined });
    this.api.sedes().subscribe({ next: (lista) => this.sedes.set(lista), error: () => undefined });
    this.preguntarCarrito.set(this.carrito.deOtroDia());
    this.api.productos({ page: 0 }).subscribe({
      next: (pagina) => this.vitrina.set(pagina.content ?? []),
      error: () => undefined,
    });
  }

  ngOnDestroy(): void {
    this.navegacion.unsubscribe();
    this.consultaAncho.removeEventListener('change', this.alCambiarAncho);
    document.body.style.overflow = '';
  }

  alternarMenu(): void {
    this.menu.update((abierto) => !abierto);
    if (!this.angosto()) localStorage.setItem('policalum-menu', this.menu() ? '1' : '0');
    this.bloquearFondo();
  }

  private aplicarAncho(): void {
    const angosto = this.consultaAncho.matches;
    this.angosto.set(angosto);
    this.menu.set(angosto ? false : localStorage.getItem('policalum-menu') !== '0');
    this.bloquearFondo();
  }

  private bloquearFondo(): void {
    document.body.style.overflow = this.angosto() && this.menu() ? 'hidden' : '';
  }

  consulta(): URLSearchParams {
    return new URLSearchParams(this.ruta().split('?')[1] ?? '');
  }

  conservarCarrito(): void {
    this.carrito.confirmarDia();
    this.preguntarCarrito.set(false);
  }

  descartarCarrito(): void {
    this.carrito.vaciar();
    this.preguntarCarrito.set(false);
  }

  esCatalogo(): boolean {
    const path = this.ruta().split('?')[0];
    return path === '/' || path === '/catalogo';
  }

  categoriaActiva(): string {
    return this.consulta().get('categoria') ?? '';
  }

  enProductos(): boolean {
    return this.ruta().split('?')[0] === '/catalogo';
  }

  sugerir(valor: string): void {
    window.clearTimeout(this.espera);
    const q = valor.trim();
    if (q.length < 2) {
      this.sugerencias.set([]);
      return;
    }
    this.espera = window.setTimeout(() => {
      this.api.productos({ q, page: 0, size: 6 }).subscribe({
        next: (pagina) => this.sugerencias.set(pagina.content ?? []),
        error: () => this.sugerencias.set([]),
      });
    }, 220);
  }

  elegirProducto(id: string): void {
    this.sugerencias.set([]);
    if (this.caja) this.caja.nativeElement.value = '';
    this.router.navigate(['/catalogo', id]);
  }

  dictar(): void {
    if (this.escuchando()) {
      this.motor?.stop();
      return;
    }
    void this.empezarDictado();
  }

  private async empezarDictado(): Promise<void> {
    const ventana = window as Window & { SpeechRecognition?: new () => Reconocimiento; webkitSpeechRecognition?: new () => Reconocimiento };
    const Motor = ventana.SpeechRecognition || ventana.webkitSpeechRecognition;
    if (!Motor) {
      this.vozAviso.set('Este navegador no tiene dictado. Escribe el producto en el buscador.');
      return;
    }
    if (!window.isSecureContext) {
      this.vozAviso.set('El dictado solo funciona con https o en esta computadora.');
      return;
    }
    try {
      const flujo = await navigator.mediaDevices.getUserMedia({ audio: true });
      flujo.getTracks().forEach((pista) => pista.stop());
    } catch {
      this.vozAviso.set('Permite el micrófono para buscar por voz.');
      this.escuchando.set(false);
      return;
    }
    const reconocimiento = new Motor();
    this.motor = reconocimiento;
    this.dictadoFinal = '';
    reconocimiento.lang = 'es-PE';
    reconocimiento.interimResults = true;
    reconocimiento.continuous = true;
    reconocimiento.maxAlternatives = 3;
    this.escuchando.set(true);
    this.vozAviso.set('Di el producto que buscas.');
    reconocimiento.onresult = (evento) => {
      let texto = '';
      let cerro = false;
      for (let i = evento.resultIndex ?? 0; i < evento.results.length; i += 1) {
        const frase = evento.results[i];
        texto += frase?.[0]?.transcript ?? '';
        if (frase?.isFinal) cerro = true;
      }
      const dicho = texto.trim();
      if (dicho && this.caja) this.caja.nativeElement.value = dicho;
      if (dicho) this.vozAviso.set(`Escuché “${dicho}”.`);
      if (cerro && dicho) {
        this.dictadoFinal = dicho;
        reconocimiento.stop();
      }
    };
    reconocimiento.onerror = (evento) => {
      const codigo = evento.error ?? '';
      if (codigo === 'aborted' || codigo === 'no-speech') return;
      if (codigo === 'not-allowed' || codigo === 'service-not-allowed') {
        this.vozAviso.set('Permite el micrófono para buscar por voz.');
      } else if (codigo === 'audio-capture') {
        this.vozAviso.set('No encuentro un micrófono en este aparato.');
      } else if (codigo === 'language-not-supported' && reconocimiento.lang !== 'es-ES') {
        reconocimiento.lang = 'es-ES';
        try { reconocimiento.start(); return; } catch { /* el cierre avisa */ }
      } else if (codigo === 'network') {
        this.vozAviso.set('El dictado necesita internet. Escribe el producto.');
      } else {
        this.vozAviso.set('No se escuchó la frase. Intenta de nuevo.');
      }
      this.escuchando.set(false);
    };
    reconocimiento.onend = () => {
      this.escuchando.set(false);
      const dicho = this.dictadoFinal.trim();
      if (dicho) {
        this.vozAviso.set(`Buscando “${dicho}”.`);
        this.irBusqueda(dicho);
        return;
      }
      if (this.vozAviso() === 'Di el producto que buscas.' || this.vozAviso().startsWith('Escuché')) {
        this.vozAviso.set('No se escuchó la frase. Intenta de nuevo.');
      }
    };
    try {
      reconocimiento.start();
    } catch {
      this.escuchando.set(false);
      this.vozAviso.set('No pude abrir el micrófono. Intenta de nuevo.');
    }
  }

  irBusqueda(texto: string): void {
    const q = texto.trim();
    this.sugerencias.set([]);
    if (!q) {
      this.router.navigate(['/catalogo']);
      return;
    }
    this.api.productos({ q, page: 0, size: 8 }).subscribe({
      next: (pagina) => {
        const lista = pagina.content ?? [];
        const exacto = lista.find((producto) =>
          producto.nombre.toLowerCase() === q.toLowerCase() || (producto.codigoSku ?? '').toLowerCase() === q.toLowerCase());
        const destino = exacto ?? (lista.length === 1 ? lista[0] : null);
        if (destino) this.router.navigate(['/catalogo', destino.id]);
        else this.router.navigate(['/catalogo'], { queryParams: { q } });
      },
      error: () => this.router.navigate(['/catalogo'], { queryParams: { q } }),
    });
  }

  enfocarBusqueda(): void {
    this.caja?.nativeElement.focus();
  }

  sumar(producto: ProductoPublico, evento: Event): void {
    evento.preventDefault();
    evento.stopPropagation();
    this.carrito.agregar({
      productoId: producto.id,
      nombre: producto.nombre,
      precio: producto.precioPublico,
      cantidad: 1,
      imagenUrl: producto.imagenUrl,
      unidad: producto.unidad || 'unidad',
    });
  }

}
