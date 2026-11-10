import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';

export interface PaletaPublica {
  acento: string;
  fondo: string;
  tarjeta: string;
  texto: string;
  textoSuave: string;
  oferta: string;
  franja: string;
}

export interface CmsPublico {
  primaryColor: string;
  secondaryColor: string;
  baseFontSize: number;
  themeMode: string;
  aviso: string;
  avisoActivo: boolean;
  avisoImagen?: string | null;
  colores?: {
    dia: PaletaPublica;
    noche: PaletaPublica;
  } | null;
  banner?: string;
  resumen?: string;
  horarioSemana?: string;
  horarioSabado?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  correoSoporte?: string;
  textoPrivacidad?: string;
  textoTerminos?: string;
  textoGarantia?: string;
  textoFaq?: string;
  heroKicker?: string;
  heroTitulo?: string;
  heroTexto?: string;
  materialesKicker?: string;
  materialesTitulo?: string;
  materialesTexto?: string;
  materiales?: Array<{ id: string; nombre: string; resumen?: string; imagenUrl?: string; videoUrl?: string; activo?: boolean }>;
  atencion?: { configurado: boolean; abiertoAhora: boolean; atiendeHoy: boolean; texto: string };
  dias?: Array<{ dia: string; abierto: boolean; desde?: string; hasta?: string }>;
}

@Injectable({ providedIn: 'root' })
export class CmsStore {
  private readonly http = inject(HttpClient);
  readonly paquete = signal<CmsPublico | null>(null);
  readonly revision = signal(0);
  readonly cambiosPublicos = signal(0);
  private eventos?: EventSource;
  private estilo?: HTMLStyleElement;

  constructor() {
    this.cargar();
    this.escuchar();
  }

  cargar(): void {
    this.http.get<CmsPublico>(`${environment.apiUrl}/api/v1/public/cms`).subscribe({
      next: (paquete) => {
        this.paquete.set(paquete);
        this.aplicar(paquete);
        this.revision.update((valor) => valor + 1);
      },
      error: () => undefined,
    });
  }

  private escuchar(): void {
    if (typeof EventSource === 'undefined') return;
    this.eventos = new EventSource(`${environment.apiUrl}/api/v1/public/cms/eventos`);
    this.eventos.addEventListener('cms', () => {
      this.cambiosPublicos.update((valor) => valor + 1);
      this.cargar();
    });
    this.eventos.onerror = () => undefined;
  }

  private aplicar(paquete: CmsPublico): void {
    const raiz = document.documentElement;
    if (Number.isFinite(paquete.baseFontSize)) raiz.style.setProperty('--cms-base', `${paquete.baseFontSize}px`);
    const dia = paquete.colores?.dia;
    const noche = paquete.colores?.noche;
    // Legacy ERP fields apply only when the per-mode palette is absent.
    const legado = [
      hex(paquete.primaryColor, '') ? `--accent:${paquete.primaryColor};--accent-ink:${textoSobre(paquete.primaryColor)}` : '',
      hex(paquete.secondaryColor, '') ? `--paper:${paquete.secondaryColor};--card:${paquete.secondaryColor}` : '',
    ].filter(Boolean).join(';');
    const css = `:root, [data-tema="dia"] { ${dia ? variables(dia) : legado} } [data-tema="noche"] { ${noche ? variables(noche, true) : legado} }`;
    if (!this.estilo) {
      this.estilo = document.createElement('style');
      this.estilo.id = 'cms-colores';
      document.head.appendChild(this.estilo);
    }
    this.estilo.textContent = css;
  }
}

function variables(paleta: PaletaPublica, noche = false): string {
  const acento = hex(paleta.acento, noche ? '#bba5ff' : '#0d47a1');
  const fondo = hex(paleta.fondo, noche ? '#0b071b' : '#f3f6fb');
  const tarjeta = hex(paleta.tarjeta, noche ? '#171229' : '#ffffff');
  const texto = hex(paleta.texto, noche ? '#f3f7fb' : '#0c1724');
  const suave = hex(paleta.textoSuave, noche ? '#b7c6d3' : '#3c4d5c');
  const oferta = hex(paleta.oferta, '#c62828');
  const franja = hex(paleta.franja, '#0c1724');
  return [
    `--accent:${acento}`,
    `--accent-ink:${textoSobre(acento)}`,
    `--bg:${fondo}`,
    `--paper:${tarjeta}`,
    `--ink:${texto}`,
    `--muted:${suave}`,
    `--promo:${oferta}`,
    `--promo-ink:${textoSobre(oferta)}`,
    `--trust:${franja}`,
    `--trust-ink:${textoSobre(franja)}`,
    `--stage:${fondo}`,
    `--card:${tarjeta}`,
    `--line:color-mix(in srgb, ${texto} 16%, ${tarjeta})`,
    `--soft:color-mix(in srgb, ${acento} 10%, ${tarjeta})`,
    `--cinema-ink:${contraste(texto, fondo, tarjeta)}`,
    `--cinema-muted:${contraste(suave, fondo, tarjeta)}`,
    `--cinema-accent-text:${contraste(acento, fondo, tarjeta)}`,
    `--cinema-focus:${contraste(acento, fondo, tarjeta)}`,
  ].join(';');
}

function hex(valor: string | undefined, respaldo: string): string {
  return /^#[0-9A-Fa-f]{6}$/.test(valor ?? '') ? (valor as string) : respaldo;
}

function luminancia(color: string): number {
  const canales = [1, 3, 5].map((i) => {
    const valor = parseInt(color.slice(i, i + 2), 16) / 255;
    return valor <= .04045 ? valor / 12.92 : ((valor + .055) / 1.055) ** 2.4;
  });
  return canales[0] * .2126 + canales[1] * .7152 + canales[2] * .0722;
}

function ratio(a: string, b: string): number {
  const x = luminancia(a), y = luminancia(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}

function textoSobre(color: string): string {
  return ratio('#000000', color) >= ratio('#ffffff', color) ? '#000000' : '#ffffff';
}

function contraste(color: string, fondo: string, tarjeta: string): string {
  if (Math.min(ratio(color, fondo), ratio(color, tarjeta)) >= 4.5) return color;
  // Glass is almost opaque; choose the strongest shared neutral when ERP text is unreadable.
  const peor = (c: string) => Math.min(ratio(c, fondo), ratio(c, tarjeta));
  return peor('#000000') >= peor('#ffffff') ? '#000000' : '#ffffff';
}
