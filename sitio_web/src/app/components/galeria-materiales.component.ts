import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { CmsStore } from '../core/cms.store';

interface MaterialVista {
  id: string;
  nombre: string;
  resumen: string;
  imagenUrl: string;
  videoUrl: string;
}

const RESPALDO: MaterialVista[] = [
  {
    id: 'espesor',
    nombre: 'Espesor',
    resumen: 'Compara el cuerpo de la plancha y elige el milimetraje según la luz del vano y la cubierta.',
    imagenUrl: '/videos/espesor-poster.jpg',
    videoUrl: '/videos/espesor.mp4',
  },
  {
    id: 'colores',
    nombre: 'Colores',
    resumen: 'Transparente, humo, bronce y tonos de color para dosificar la luz y el carácter del ambiente.',
    imagenUrl: '/videos/colores-poster.jpg',
    videoUrl: '/videos/colores.mp4',
  },
  {
    id: 'conectores',
    nombre: 'Conectores H',
    resumen: 'La unión entre planchas: un encuentro firme, alineado y del mismo tono del policarbonato.',
    imagenUrl: '/videos/conectores-poster.jpg',
    videoUrl: '/videos/conectores.mp4',
  },
  {
    id: 'conectores-colores',
    nombre: 'Conectores y colores',
    resumen: 'Perfiles y tonos de policarbonato para unir la cubierta y dosificar la luz.',
    imagenUrl: '',
    videoUrl: '/videos/conectores-colores.mp4',
  },
  {
    id: 'ubicanos',
    nombre: 'Ubícanos',
    resumen: 'La sede y el taller en Trujillo, para llegar, cotizar y recoger en persona.',
    imagenUrl: '',
    videoUrl: '/videos/ubicanos.mp4',
  },
  {
    id: 'conector-blanco',
    nombre: 'Conector blanco',
    resumen: 'El perfil de unión en blanco, alineado con la plancha y listo para la cubierta.',
    imagenUrl: '',
    videoUrl: '/videos/conector-blanco.mp4',
  },
];

@Component({
  selector: 'app-galeria-materiales',
  template: `
    @if (piezas.length) {
      <section class="section materiales" id="materiales">
        <div class="section-head">
          <div>
            <p class="kicker">{{ kickerVisible }}</p>
            <h2>{{ tituloVisible }}</h2>
            @if (textoVisible) { <p class="lead">{{ textoVisible }}</p> }
          </div>
          @if (piezas.length > 1) {
            <div class="reel-nav">
              <button type="button" (click)="girar(-1)" aria-label="Anterior">‹</button>
              <button type="button" (click)="girar(1)" aria-label="Siguiente">›</button>
            </div>
          }
        </div>
        <div class="reel" aria-label="Reel de POLICALUM">
          @for (item of cinta; track item.clave) {
            <button type="button" class="reel-item" (click)="abrir(item.origen)" [attr.aria-label]="'Abrir ' + item.nombre" [attr.aria-hidden]="item.vuelta ? true : null" [attr.tabindex]="item.vuelta ? -1 : null">
              @if (item.imagenUrl) {
                <img [src]="item.imagenUrl" [alt]="item.nombre" />
              } @else {
                <video muted playsinline preload="metadata" [src]="item.videoUrl"></video>
              }
              <span class="reel-play" aria-hidden="true">{{ item.videoUrl ? '▶' : '＋' }}</span>
              <span>
                <strong>{{ item.nombre }}</strong>
                <small>{{ item.resumen }}</small>
              </span>
            </button>
          }
        </div>
      </section>
      @if (abierto() && actual; as pieza) {
        <dialog class="visor-reel" [attr.aria-label]="pieza.nombre" (click)="cerrar()" (close)="alCerrar()">
          <button type="button" class="x" (click)="cerrar()" aria-label="Cerrar">×</button>
          @if (piezas.length > 1) {
            <button type="button" class="lado prev" (click)="$event.stopPropagation(); mover(-1)" aria-label="Pieza anterior">‹</button>
            <button type="button" class="lado next" (click)="$event.stopPropagation(); mover(1)" aria-label="Pieza siguiente">›</button>
          }
          <div class="escena" (click)="$event.stopPropagation()">
            @if (pieza.videoUrl) {
              <video controls playsinline [src]="pieza.videoUrl"></video>
            } @else {
              <img [src]="pieza.imagenUrl" [alt]="pieza.nombre" />
            }
            <p><strong>{{ pieza.nombre }}</strong> @if (pieza.resumen) { <span>{{ pieza.resumen }}</span> }</p>
          </div>
        </dialog>
      }
    }
  `,
})
export class GaleriaMaterialesComponent implements AfterViewInit, OnDestroy {
  private readonly cms = inject(CmsStore);
  private readonly host = inject(ElementRef<HTMLElement>);
  private reloj = 0;

  readonly abierto = signal(false);
  readonly indice = signal(0);

  get kickerVisible(): string {
    return this.cms.paquete()?.materialesKicker?.trim() || 'Nosotros';
  }

  get tituloVisible(): string {
    return this.cms.paquete()?.materialesTitulo?.trim() || 'Conoce más sobre nosotros';
  }

  get textoVisible(): string {
    return this.cms.paquete()?.materialesTexto?.trim() || 'Espesor, color y conectores, contados en corto desde el taller.';
  }

  get piezas(): MaterialVista[] {
    const publicados = (this.cms.paquete()?.materiales ?? [])
      .filter((item) => item.activo !== false && item.nombre?.trim() && (item.videoUrl?.trim() || item.imagenUrl?.trim()));
    const lista = publicados.length ? publicados : this.cms.paquete()?.materiales ? [] : RESPALDO;
    return lista.map((item) => ({
      id: item.id || item.nombre,
      nombre: textoClaro(item.nombre),
      resumen: textoClaro(item.resumen?.trim() || ''),
      imagenUrl: medioVisible(item.imagenUrl),
      videoUrl: medioVisible(item.videoUrl),
    }));
  }

  get cinta(): Array<MaterialVista & { clave: string; origen: number; vuelta: number }> {
    const base = this.piezas;
    const vueltas = base.length > 1 ? 2 : 1;
    const salida: Array<MaterialVista & { clave: string; origen: number; vuelta: number }> = [];
    for (let vuelta = 0; vuelta < vueltas; vuelta++) {
      base.forEach((item, origen) => salida.push({ ...item, clave: `${item.id}-${vuelta}`, origen, vuelta }));
    }
    return salida;
  }

  get actual(): MaterialVista | null {
    return this.piezas[this.indice()] ?? null;
  }

  ngAfterViewInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.reloj = window.setInterval(() => {
      if (!this.abierto()) this.girar(1);
    }, 4200);
  }

  ngOnDestroy(): void {
    window.clearInterval(this.reloj);
  }

  abrir(indice: number): void {
    this.indice.set(indice);
    this.abierto.set(true);
    this.sonar();
  }

  cerrar(): void {
    this.callar();
    const dialogo = this.host.nativeElement.querySelector('dialog') as HTMLDialogElement | null;
    if (dialogo?.open) dialogo.close();
    this.abierto.set(false);
  }

  alCerrar(): void {
    if (this.abierto()) this.cerrar();
  }

  mover(paso: number): void {
    const total = this.piezas.length;
    if (!total) return;
    this.callar();
    this.indice.set((this.indice() + paso + total) % total);
    this.sonar();
  }

  girar(paso: number): void {
    const reel = this.pista();
    const medida = this.medida(reel);
    if (!reel || !medida) return;
    const { ancho, ciclo, bloque } = medida;
    if (paso < 0 && reel.scrollLeft < ancho) reel.scrollLeft += ciclo;
    if (paso > 0 && reel.scrollLeft >= ciclo) reel.scrollLeft -= ciclo;
    const destino = reel.scrollLeft + paso * bloque;
    const cerrar = () => {
      reel.removeEventListener('scrollend', cerrar);
      if (reel.scrollLeft >= ciclo - 1) reel.scrollLeft -= ciclo;
    };
    reel.addEventListener('scrollend', cerrar);
    reel.scrollTo({ left: destino, behavior: 'smooth' });
  }

  private pista(): HTMLElement | null {
    return this.host.nativeElement.querySelector('.reel');
  }

  private medida(reel: HTMLElement | null): { ancho: number; ciclo: number; bloque: number } | null {
    const tarjeta = reel?.querySelector('.reel-item') as HTMLElement | null;
    const total = this.piezas.length;
    if (!reel || !tarjeta || total < 2) return null;
    const ancho = tarjeta.getBoundingClientRect().width + 14;
    const cupo = Math.max(1, Math.floor((reel.clientWidth + 14) / ancho));
    const porBloque = cupo >= total ? Math.max(1, Math.floor(total / 2)) : cupo;
    return { ancho, ciclo: ancho * total, bloque: ancho * porBloque };
  }

  @HostListener('document:keydown', ['$event'])
  tecla(evento: KeyboardEvent): void {
    if (!this.abierto()) return;
    if (evento.key === 'ArrowRight') {
      evento.preventDefault();
      this.mover(1);
    }
    if (evento.key === 'ArrowLeft') {
      evento.preventDefault();
      this.mover(-1);
    }
  }

  private sonar(): void {
    window.setTimeout(() => {
      const video = this.host.nativeElement.querySelector('.visor-reel video') as HTMLVideoElement | null;
      if (!video) return;
      const dialogo = this.host.nativeElement.querySelector('dialog') as HTMLDialogElement | null;
      if (dialogo && !dialogo.open) dialogo.showModal();
      video.muted = false;
      video.volume = 1;
      video.load();
      void video.play().catch(() => undefined);
    }, 40);
  }

  private callar(): void {
    this.host.nativeElement.querySelectorAll('.visor-reel video').forEach((video: HTMLVideoElement) => {
      video.pause();
      video.currentTime = 0;
    });
  }
}

function textoClaro(valor: string): string {
  if (!valor || !/[\u00C2\u00C3]/.test(valor)) return valor;
  try {
    const bytes = Uint8Array.from(valor, (letra) => letra.charCodeAt(0) & 0xff);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return valor
      .replaceAll('Ã¡', 'á').replaceAll('Ã©', 'é').replaceAll('Ã­', 'í')
      .replaceAll('Ã³', 'ó').replaceAll('Ãº', 'ú').replaceAll('Ã±', 'ñ').replaceAll('Ã‘', 'Ñ');
  }
}

function medioVisible(ruta?: string | null): string {
  const texto = ruta?.trim() ?? '';
  if (!texto) return '';
  if (texto.startsWith('http://') || texto.startsWith('https://')) return texto;
  if (texto.startsWith('/api/')) return `${environment.apiUrl}${texto}`;
  return texto;
}
