import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CmsStore } from '../core/cms.store';
import { ProyectoPublico } from '../core/models';
import { PortalApi } from '../core/portal.api';
import { PortafolioComponent } from './portafolio.component';

describe('PortafolioComponent', () => {
  const proyecto: ProyectoPublico = {
    id: 'proyecto-1',
    titulo: 'Proyecto publicado',
    descripcion: 'Descripción',
    orden: 1,
  };
  afterEach(() => TestBed.resetTestingModule());

  function crear(api: { portafolio: () => Observable<ProyectoPublico[]> }): PortafolioComponent {
    TestBed.configureTestingModule({
      imports: [PortafolioComponent],
      providers: [
        { provide: PortalApi, useValue: api },
        { provide: CmsStore, useValue: { cambiosPublicos: signal(0) } },
      ],
    });
    return TestBed.createComponent(PortafolioComponent).componentInstance;
  }

  it('carga solo los proyectos entregados por el endpoint público', () => {
    const api = { portafolio: vi.fn(() => of([proyecto])) };
    const component = crear(api);

    component.ngOnInit();

    expect(api.portafolio).toHaveBeenCalledOnce();
    expect(component.obras()).toEqual([proyecto]);
    expect(component.cargando()).toBe(false);
    expect(component.error()).toBe('');
  });

  it('no conserva contenido de muestra si falla la API', () => {
    const api = { portafolio: vi.fn(() => throwError(() => ({ status: 0 }))) };
    const component = crear(api);

    component.ngOnInit();

    expect(component.obras()).toEqual([]);
    expect(component.error()).toContain('No hay conexión');
    expect(component.cargando()).toBe(false);
  });
});
