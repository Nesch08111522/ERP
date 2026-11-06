import { Injectable, effect, inject, signal } from '@angular/core';
import { CmsStore } from './cms.store';
import { PortalApi, media } from './portal.api';
import { EmpresaPublica } from './models';

@Injectable({ providedIn: 'root' })
export class EmpresaStore {
  private readonly api = inject(PortalApi);
  private readonly cms = inject(CmsStore);
  readonly empresa = signal<EmpresaPublica>({ nombreComercial: 'POLICALUM' });

  logo(): string | null {
    const ruta = this.empresa().logoUrl;
    if (!ruta) return null;
    const url = media(ruta);
    if (!url) return null;
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}v=${this.cms.revision()}`;
  }

  private pintarMarca(): void {
    const nombre = this.empresa().nombreComercial?.trim() || 'POLICALUM';
    document.title = `${nombre} | Policarbonatos y cubiertas`;
    const icono = this.logo() || 'favicon.svg';
    let enlace = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!enlace) {
      enlace = document.createElement('link');
      enlace.rel = 'icon';
      document.head.appendChild(enlace);
    }
    enlace.type = icono.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
    enlace.href = icono;
  }

  constructor() {
    effect(() => {
      this.cms.revision();
      this.api.empresa().subscribe({
        next: (empresa) => {
          this.empresa.set(empresa);
          this.pintarMarca();
        },
        error: () => undefined,
      });
    });
  }
}
