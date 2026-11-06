import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpresaStore } from '../core/empresa.store';
import { PortalApi, mensajeError } from '../core/portal.api';

@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule],
  templateUrl: './contacto.component.html',
})
export class ContactoComponent {
  private readonly api = inject(PortalApi);
  readonly marca = inject(EmpresaStore);
  readonly enviado = signal(false);
  readonly error = signal('');
  readonly enviando = signal(false);
  readonly form = inject(FormBuilder).nonNullable.group({
    tipo: ['CONSULTA', Validators.required],
    nombre: ['', [Validators.required, Validators.maxLength(120)]],
    documentoTipo: ['DNI'],
    documentoNumero: ['', Validators.maxLength(20)],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9+()\- ]{6,20}$/)]],
    empresa: ['', Validators.maxLength(150)],
    direccion: ['', Validators.maxLength(200)],
    bien: ['', Validators.maxLength(160)],
    monto: ['', Validators.maxLength(40)],
    pedido: ['', [Validators.required, Validators.maxLength(1000)]],
    mensaje: ['', [Validators.required, Validators.maxLength(2000)]],
    website: [''],
  });

  constructor() {
    this.form.controls.tipo.valueChanges.subscribe((tipo) => this.ajustar(tipo));
  }

  esLibro(): boolean {
    const tipo = this.form.controls.tipo.value;
    return tipo === 'RECLAMO' || tipo === 'QUEJA';
  }

  enviar(): void {
    this.ajustar(this.form.controls.tipo.value);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set(this.esLibro()
        ? 'Completa nombre, documento, correo, teléfono, dirección, el producto o servicio, el pedido y el detalle.'
        : 'Completa nombre, correo, teléfono, el pedido y el detalle.');
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    const valor = this.form.getRawValue();
    this.api.contacto({
      tipo: valor.tipo,
      nombre: valor.nombre,
      documentoTipo: valor.documentoTipo || undefined,
      documentoNumero: valor.documentoNumero || undefined,
      correo: valor.correo,
      telefono: valor.telefono,
      empresa: valor.empresa || undefined,
      direccion: valor.direccion || undefined,
      bien: valor.bien || undefined,
      monto: valor.monto || undefined,
      pedido: valor.pedido,
      mensaje: valor.mensaje,
      website: valor.website,
    }).subscribe({
      next: () => {
        this.enviando.set(false);
        this.enviado.set(true);
        this.form.reset({ tipo: 'CONSULTA', documentoTipo: 'DNI' });
      },
      error: (error: unknown) => {
        this.enviando.set(false);
        this.error.set(mensajeError(error));
      },
    });
  }

  private ajustar(tipo: string): void {
    const libro = tipo === 'RECLAMO' || tipo === 'QUEJA';
    this.exigir('documentoNumero', libro, 20);
    this.exigir('direccion', libro, 200);
    this.exigir('bien', libro, 160);
  }

  private exigir(campo: 'documentoNumero' | 'direccion' | 'bien', obligatorio: boolean, tope: number): void {
    const control = this.form.controls[campo];
    control.setValidators(obligatorio
      ? [Validators.required, Validators.maxLength(tope)]
      : [Validators.maxLength(tope)]);
    control.updateValueAndValidity({ emitEvent: false });
  }
}
