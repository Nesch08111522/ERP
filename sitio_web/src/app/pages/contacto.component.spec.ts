import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EmpresaStore } from '../core/empresa.store';
import { PortalApi } from '../core/portal.api';
import { ContactoComponent } from './contacto.component';

describe('ContactoComponent local transport', () => {
  let component: ContactoComponent;
  const contacto = vi.fn();
  beforeEach(() => {
    contacto.mockReset().mockReturnValue(of({ id: 'test-only' }));
    TestBed.configureTestingModule({ providers: [
      { provide: PortalApi, useValue: { contacto } },
      { provide: EmpresaStore, useValue: {} },
    ] });
    component = TestBed.runInInjectionContext(() => new ContactoComponent());
  });
  it('blocks empty and invalid submissions without transport', () => {
    component.enviar();
    expect(contacto).not.toHaveBeenCalled();
    component.form.patchValue({ nombre: 'QA', correo: 'invalid', telefono: 'abc', pedido: 'QA', mensaje: 'QA' });
    component.enviar();
    expect(contacto).not.toHaveBeenCalled();
  });
  it('requires legal complaint fields and submits only to mocked transport', () => {
    component.form.patchValue({ tipo: 'RECLAMO', nombre: 'QA', correo: 'qa@example.invalid', telefono: '123456789', pedido: 'QA', mensaje: 'QA' });
    component.enviar();
    expect(contacto).not.toHaveBeenCalled();
    component.form.patchValue({ documentoNumero: '00000000', direccion: 'Test only', bien: 'Test only' });
    component.enviar();
    expect(contacto).toHaveBeenCalledOnce();
    expect(component.enviado()).toBe(true);
    expect(component.enviando()).toBe(false);
  });
  it('retains inputs and exposes a failed transport', () => {
    contacto.mockReturnValue(throwError(() => ({ status: 0 })));
    component.form.patchValue({ nombre: 'QA', correo: 'qa@example.invalid', telefono: '123456789', pedido: 'QA', mensaje: 'QA' });
    component.enviar();
    expect(component.enviado()).toBe(false);
    expect(component.enviando()).toBe(false);
    expect(component.form.controls.nombre.value).toBe('QA');
    expect(component.error()).toContain('conexi');
  });
});
