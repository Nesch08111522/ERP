import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CmsStore } from './core/cms.store';
import { EmpresaStore } from './core/empresa.store';
import { PortalApi } from './core/portal.api';
import { InicioComponent } from './pages/inicio.component';

describe('sitio', () => {
  afterEach(() => { TestBed.resetTestingModule(); vi.unstubAllGlobals(); });

  it('prepara el entorno de pruebas', () => {
    expect(TestBed).toBeTruthy();
  });

  function inicio() {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    const paquete = signal<any>(null);
    TestBed.configureTestingModule({
      imports: [InicioComponent],
      providers: [
        provideRouter([]),
        { provide: PortalApi, useValue: {
          ofertas: () => of([]), destacados: () => of([]), categorias: () => of([]),
          productos: () => of({ content: [] }), servicios: () => of([]), portafolio: () => of([]),
        } },
        { provide: CmsStore, useValue: { paquete, cambiosPublicos: signal(0) } },
        { provide: EmpresaStore, useValue: { empresa: signal({ nombreComercial: 'POLICALUM' }) } },
      ],
    });
    const fixture = TestBed.createComponent(InicioComponent);
    fixture.detectChanges();
    return { fixture, paquete, dom: fixture.nativeElement as HTMLElement };
  }

  it('recupera CMS sin segundo h1 y mantiene el recorrido y conjuntos separados', () => {
    const { fixture, paquete, dom } = inicio();
    paquete.set({ heroKicker: 'CMS kicker', heroTitulo: 'CMS titulo', heroTexto: 'CMS texto' });
    fixture.componentInstance.categorias.set([{ id: 'cat', nombre: 'Categoria publicada' }] as any);
    fixture.componentInstance.destacados.set([{ id: 'dest', nombre: 'Destacado publicado', precio: 20 }] as any);
    fixture.detectChanges();
    expect(dom.querySelectorAll('h1')).toHaveLength(1);
    expect(dom.querySelector('#marca')?.textContent).toContain('CMS titulo');
    expect(dom.querySelector('#marca')?.textContent).toContain('CMS texto');
    const orden = ['producto', 'marca', 'ensamblaje', 'categorias', 'catalogo', 'aplicaciones', 'servicios', 'confianza', 'sedes', 'mapa', 'contacto'];
    for (let i = 1; i < orden.length; i++) {
      expect(dom.querySelector('#' + orden[i - 1])!.compareDocumentPosition(dom.querySelector('#' + orden[i])!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    expect(dom.querySelectorAll('#ofertas, #destacados, #novedades')).toHaveLength(3);
    expect(dom.querySelector('#contacto a')?.getAttribute('href')).toBe('/cotizar');
    expect(dom.querySelector('form')).toBeNull();
  });

  it('conserva carrusel, posters y las seis piezas del visor sin recortar la galeria', () => {
    const { fixture, dom } = inicio();
    const component = fixture.componentInstance;
    expect(dom.querySelectorAll('app-galeria-materiales')).toHaveLength(1);
    expect(dom.querySelectorAll('.reel-item:not([aria-hidden])')).toHaveLength(6);
    expect(dom.querySelector('.hero-banner img')?.getAttribute('src')).toBe(component.clips[0].poster);
    component.avanzar(-1);
    fixture.detectChanges();
    expect(component.banner()).toBe(2);
    expect(dom.querySelector('.hero-banner img')?.getAttribute('src')).toBe(component.clips[2].poster);
    component.cine.set(true);
    fixture.detectChanges();
    expect(dom.querySelector('.hero-banner video')?.getAttribute('src')).toBe(component.clips[2].src);
    expect(dom.querySelector('.hero-banner video')?.getAttribute('poster')).toBe(component.clips[2].poster);
    component.irBanner(1);
    component.ngOnDestroy();
  });
});
