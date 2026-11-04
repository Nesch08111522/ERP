import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CarritoService } from '../core/carrito.service';
import { EmpresaStore } from '../core/empresa.store';
import { LineaCarrito, VistaCotizacion } from '../core/models';
import { PortalApi } from '../core/portal.api';
import { CotizarComponent } from './cotizar.component';

describe('CotizarComponent', () => {
  let component: CotizarComponent;
  let lineas: LineaCarrito[];
  let api: {
    vistaCotizacion: ReturnType<typeof vi.fn>;
    cotizar: ReturnType<typeof vi.fn>;
  };
  let carrito: { snapshot: () => LineaCarrito[]; vaciar: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    lineas = [{
      productoId: 'producto-1',
      nombre: 'Producto',
      precio: 10,
      cantidad: 2,
      unidad: 'unidad',
    }];
    const vista: VistaCotizacion = { total: 20, cargos: { distrito: 'Trujillo' }, lineas: [] };
    api = {
      vistaCotizacion: vi.fn(() => of(vista)),
      cotizar: vi.fn(() => of({ id: 'cotizacion-1', estado: 'PENDIENTE', total: 20, lineas: [] })),
    };
    carrito = { snapshot: () => lineas, vaciar: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        { provide: PortalApi, useValue: api },
        { provide: CarritoService, useValue: carrito },
        { provide: EmpresaStore, useValue: {} },
      ],
    });
    component = TestBed.runInInjectionContext(() => new CotizarComponent());
    component.form.setValue({
      ruc: '20123456789',
      razonSocial: 'Empresa',
      correo: 'empresa@example.com',
      telefono: '123456789',
      distrito: 'Trujillo',
      observaciones: '',
      website: '',
    });
  });

  it('requires a new preview if the district changes', () => {
    component.realizar();
    component.form.controls.distrito.setValue('Víctor Larco');

    component.enviar();

    expect(api.cotizar).not.toHaveBeenCalled();
    expect(component.vista()).toBeNull();
    expect(component.error()).toContain('Realiza la cotización nuevamente');
  });

  it('requires a new preview if cart quantities change', () => {
    component.realizar();
    lineas[0].cantidad = 3;

    component.enviar();

    expect(api.cotizar).not.toHaveBeenCalled();
    expect(component.vista()).toBeNull();
  });

  it('submits when the preview payload still matches', () => {
    component.realizar();

    component.enviar();

    expect(api.cotizar).toHaveBeenCalledWith(expect.objectContaining({
      distrito: 'Trujillo',
      lineas: [{ productoId: 'producto-1', fraccionId: undefined, cantidad: 2 }],
    }));
    expect(carrito.vaciar).toHaveBeenCalled();
  });
});
