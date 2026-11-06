import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MapaLocalComponent } from '../components/mapa-local.component';
import { EmpresaStore } from '../core/empresa.store';
import { SedePublica } from '../core/models';
import { PortalApi, mensajeError } from '../core/portal.api';

@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule, MapaLocalComponent],
  templateUrl: './contacto.component.html',
})
export class ContactoComponent {
  private readonly api = inject(PortalApi);
  readonly marca = inject(EmpresaStore);
  readonly sedes = signal<SedePublica[]>([]);
  readonly enviado = signal(false);
  readonly error = signal('');
  readonly enviando = signal(false);
  readonly direccionMapa = computed(() => {
    const sede = this.sedes().find((item) => item.direccion);
    if (sede) return [sede.direccion, sede.ciudad].filter(Boolean).join(', ');
    return this.marca.empresa().direccion || '';
  });
  readonly form = inject(FormBuilder).nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: [''],
    empresa: ['', Validators.maxLength(150)],
    asunto: ['', [Validators.required, Validators.maxLength(120)]],
    mensaje: ['', [Validators.required, Validators.maxLength(2000)]],
    website: [''],
  });

  constructor() {
    this.api.sedes().subscribe({ next: (lista) => this.sedes.set(lista), error: () => undefined });
  }

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Completa nombre, correo, asunto y mensaje.');
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    const valor = this.form.getRawValue();
    this.api.contacto({
      nombre: valor.nombre,
      correo: valor.correo,
      telefono: valor.telefono || undefined,
      empresa: valor.empresa || undefined,
      asunto: valor.asunto,
      mensaje: valor.mensaje,
      website: valor.website,
    }).subscribe({
      next: () => {
        this.enviando.set(false);
        this.enviado.set(true);
        this.form.reset();
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.error.set(mensajeError(error));
      },
    });
  }
}
