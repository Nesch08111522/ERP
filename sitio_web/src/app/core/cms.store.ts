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
    raiz.style.setProperty('--cms-base', `${paquete.baseFontSize}px`);
    const dia = paquete.colores?.dia;
    const noche = paquete.colores?.noche;
    if (!dia || !noche) {
      this.estilo?.remove();
      this.estilo = undefined;
      return;
    }
    const css = `:root, [data-tema="dia"] { ${variables(dia)} } [data-tema="noche"] { ${variables(noche)} }`;
    if (!this.estilo) {
      this.estilo = document.createElement('style');
      this.estilo.id = 'cms-colores';
      document.head.appendChild(this.estilo);
    }
    this.estilo.textContent = css;
  }
}

function variables(paleta: PaletaPublica): string {
  const acento = hex(paleta.acento, '#0d47a1');
  const fondo = hex(paleta.fondo, '#f3f6fb');
  const tarjeta = hex(paleta.tarjeta, '#ffffff');
  const texto = hex(paleta.texto, '#0c1724');
  const suave = hex(paleta.textoSuave, '#3c4d5c');
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
  ].join(';');
}

function hex(valor: string | undefined, respaldo: string): string {
  return /^#[0-9A-Fa-f]{6}$/.test(valor ?? '') ? (valor as string) : respaldo;
}

function textoSobre(hex: string): string {
  const limpio = hex.replace('#', '');
  if (limpio.length !== 6) return '#ffffff';
  const r = parseInt(limpio.slice(0, 2), 16);
  const g = parseInt(limpio.slice(2, 4), 16);
  const b = parseInt(limpio.slice(4, 6), 16);
  const luma = (r * 299 + g * 587 + b * 114) / 1000;
  return luma > 160 ? '#050505' : '#ffffff';
}
