import { Component, ElementRef, HostListener, OnDestroy, inject, signal } from '@angular/core';
import { media } from '../core/portal.api';
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
    imagenUrl: '/videos/conectores-colores-poster.jpg',
    videoUrl: '/videos/conectores-colores.mp4',
  },
  {
    id: 'ubicanos',
    nombre: 'Ubícanos',
    resumen: 'La sede y el taller en Trujillo, para llegar, cotizar y recoger en persona.',
    imagenUrl: '/videos/ubicanos-poster.jpg',
    videoUrl: '/videos/ubicanos.mp4',
  },
  {
    id: 'conector-blanco',
    nombre: 'Conector blanco',
    resumen: 'El perfil de unión en blanco, alineado con la plancha y listo para la cubierta.',
    imagenUrl: '/videos/conector-blanco-poster.jpg',
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

        </div>
        <div class="reel" aria-label="Reel de POLICALUM">
          @for (item of piezas; track item.id; let i = $index) {
            <button type="button" class="reel-item" (click)="abrir(i)" [attr.aria-label]="'Abrir ' + item.nombre">
              @if (item.imagenUrl && !imagenesFallidas().has(item.id)) {
                <img [src]="item.imagenUrl" [alt]="item.nombre" loading="lazy" decoding="async" (error)="falloImagen(item.id)" />
              } @else {
                <video class="reel-preview" muted playsinline preload="metadata" [src]="item.videoUrl" aria-hidden="true"></video>
              }
              <span class="reel-play" aria-hidden="true">{{ item.videoUrl ? '▶' : '＋' }}</span>
              <span class="reel-copy">
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
              <video controls playsinline preload="metadata" [poster]="pieza.imagenUrl" [src]="pieza.videoUrl" (error)="errorVideo.set(true)"></video>
              @if (errorVideo()) { <div class="media-error" role="alert"><p>No pudimos reproducir este video. Comprueba tu conexión y vuelve a intentarlo.</p><button type="button" class="btn btn-line" (click)="reintentarVideo()">Reintentar video</button></div> }
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
export class GaleriaMaterialesComponent implements OnDestroy {
  private readonly cms = inject(CmsStore);
  private readonly host = inject(ElementRef<HTMLElement>);
  private apertura = 0;
  readonly errorVideo = signal(false);
  readonly imagenesFallidas = signal<Set<string>>(new Set());

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
      imagenUrl: medioVisible(item.imagenUrl) || portadaLocal(item.videoUrl),
      videoUrl: medioVisible(item.videoUrl),
    }));
  }

  get actual(): MaterialVista | null {
    return this.piezas[this.indice()] ?? null;
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.apertura);
    this.callar();
  }

  falloImagen(id: string): void {
    this.imagenesFallidas.update(actual => new Set([...actual, id]));
  }

  reintentarVideo(): void {
    this.errorVideo.set(false);
    this.sonar();
  }

  abrir(indice: number): void {
    this.errorVideo.set(false);
    this.indice.set(indice);
    this.abierto.set(true);
    this.sonar();
  }

  cerrar(): void {
    window.clearTimeout(this.apertura);
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
    this.errorVideo.set(false);
    this.indice.set((this.indice() + paso + total) % total);
    this.sonar();
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
    window.clearTimeout(this.apertura);
    this.apertura = window.setTimeout(() => {
      if (!this.abierto()) return;
      const video = this.host.nativeElement.querySelector('.visor-reel video') as HTMLVideoElement | null;
      const dialogo = this.host.nativeElement.querySelector('dialog') as HTMLDialogElement | null;
      if (dialogo && !dialogo.open) dialogo.showModal();
      if (!video) return;
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
  if (/^https?:\/\//i.test(texto) || texto.startsWith('/api/')) return media(texto) ?? '';
  return texto;
}

// Only use a generated poster for an exact bundled video URL, never an unrelated CMS asset.
function portadaLocal(ruta?: string | null): string {
  const conocida = RESPALDO.find(item => item.videoUrl === ruta?.trim());
  return conocida?.imagenUrl ?? '';
}
