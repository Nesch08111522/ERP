import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ServicioPublico } from '../core/models';
import { PortalApi, pen, mensajeError } from '../core/portal.api';

@Component({
  selector: 'app-servicios',
  imports: [RouterLink],
  template: `
    <section class="section page-intro">
      <p class="kicker">Servicios</p>
      <h1>Cada detalle, a la medida de tu proyecto.</h1>
      <p class="lead">Corte, instalación y asesoría para transformar tus ideas en espacios. Consulta las opciones y solicita tu cotización.</p>
    </section>
    @if (cargando()) { <p class="portfolio-state" role="status">Cargando servicios…</p> }
    @if (error()) { <div class="alert" role="alert"><p>{{ error() }}</p><button class="btn btn-line" type="button" (click)="cargar()">Reintentar</button></div> }
    @if (!cargando() && !error() && !servicios().length) {
      <div class="empty-state"><p class="kicker">Conversemos sobre tu obra</p><h2>Un proyecto único merece atención personal.</h2><p>Estamos actualizando nuestros servicios. Cuéntanos qué necesitas.</p><a class="btn btn-primary" routerLink="/reclamaciones">Hablar con un asesor ↗</a></div>
    } @else if (servicios().length) {
      <div class="service-list">
        @for (servicio of servicios(); track servicio.id; let i = $index) {
          <article class="panel service">
            <div>
              <p class="kicker">Servicio / {{ i + 1 }}</p>
              <h2>{{ servicio.nombre }}</h2>
              <p class="muted">{{ servicio.descripcion || 'Sin descripción publicada.' }}</p>
            </div>
            <p class="price">{{ pen(servicio.precio) }}</p>
          </article>
        }
      </div>
      <p class="muted" style="margin-top:1rem"><a routerLink="/cotizar">Pedir este trabajo en una cotización</a></p>
    }
  `,
})
export class ServiciosComponent implements OnInit {
  private readonly api = inject(PortalApi);
  readonly pen = pen;
  readonly servicios = signal<ServicioPublico[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.api.servicios().subscribe({
      next: (lista) => { this.servicios.set(lista); this.cargando.set(false); },
      error: (error: unknown) => { this.error.set(mensajeError(error)); this.cargando.set(false); },
    });
  }
}
