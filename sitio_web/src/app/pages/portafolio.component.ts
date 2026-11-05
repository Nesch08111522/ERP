import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { CmsStore } from '../core/cms.store';
import { ProyectoPublico } from '../core/models';
import { PortalApi, media, mensajeError } from '../core/portal.api';

@Component({
  selector: 'app-portafolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portafolio.component.html',
  styleUrls: ['./portafolio.component.css'],
})
export class PortafolioComponent implements OnInit {
  private readonly api = inject(PortalApi);
  private readonly cms = inject(CmsStore);
  readonly obras = signal<ProyectoPublico[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');

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
      },
      error: (fallo: unknown) => {
        this.obras.set([]);
        this.error.set(mensajeError(fallo));
        this.cargando.set(false);
      },
    });
  }

  foto(obra: ProyectoPublico): string | null {
    return media(obra.imagenUrl);
  }

  imagenFallida(event: Event): void {
    const imagen = event.target;
    if (imagen instanceof HTMLImageElement) {
      imagen.hidden = true;
      imagen.closest('.work')?.classList.add('sin-imagen');
    }
  }
}
