import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FichaProductoComponent } from './ficha-producto.component';
import { CarritoService } from '../core/carrito.service';

describe('Cortes publicos', () => {
  const agregar = vi.fn();
  let card: FichaProductoComponent;
  beforeEach(() => {
    agregar.mockClear();
    TestBed.configureTestingModule({ providers: [{ provide: CarritoService, useValue: { agregar, tiene: () => false } }] });
    card = TestBed.runInInjectionContext(() => new FichaProductoComponent());
    card.producto = { id: 'plancha', nombre: 'Real', precioPublico: 100, stock: 2.75, disponible: true, destacado: false, esFraccionable: true, fracciones: [
      { id: 'cuarto', nombre: 'Cuarto', factor: .25, precio: 33.17 },
      { id: 'medio', nombre: 'Medio', factor: .5, precio: 61.92 },
    ] };
  });
  it('usa precio del ERP sin recalcular proporcionalmente', () => {
    card.fraccionId.set('medio');
    card.sumar();
    expect(agregar).toHaveBeenCalledWith(expect.objectContaining({ fraccionId: 'medio', precio: 61.92 }));
    expect(card.existencia).toBe('Stock 2.75');
  });
  it('etiqueta factores conocidos sin crear cortes inexistentes', () => {
    expect([.25, .5, .75, 1].map((factor) => card.etiquetaFraccion(factor, 'ERP'))).toEqual(['1/4', '1/2', '3/4', '1']);
    expect(card.etiquetaFraccion(.3, 'Especial ERP')).toBe('Especial ERP');
    card.producto.fracciones = [];
    card.sumar();
    expect(agregar).not.toHaveBeenCalled();
  });
});
