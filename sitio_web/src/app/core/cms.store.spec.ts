import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CmsStore, PaletaPublica } from './cms.store';

describe('ERP palette', () => {
  let http: HttpTestingController;
  const palette: PaletaPublica = { acento: '#D85818', fondo: '#FFFFFF', tarjeta: '#FFFFFF', texto: '#222222', textoSuave: '#444444', oferta: '#B00020', franja: '#111111' };
  const response = (colores?: unknown) => ({ colores, primaryColor: '#218048', secondaryColor: '#FDFDFD', baseFontSize: 16 });
  const flush = (body: object) => http.expectOne((r) => r.url.endsWith('/public/cms')).flush(body);
  const css = () => document.getElementById('cms-colores')?.textContent || '';

  beforeEach(() => {
    vi.stubGlobal('EventSource', undefined);
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    http.verify();
    TestBed.resetTestingModule();
    document.getElementById('cms-colores')?.remove();
    document.documentElement.style.removeProperty('--cms-base');
    vi.unstubAllGlobals();
  });

  it('prefers per-mode ERP colors and derives safe cinematic tokens', () => {
    TestBed.inject(CmsStore);
    flush(response({ dia: palette, noche: { ...palette, acento: '#70C030', fondo: '#111111', tarjeta: '#111111', texto: '#EEEEEE' } }));
    expect(css()).toContain('--accent:#D85818');
    expect(css()).toContain('--accent:#70C030');
    expect(css()).not.toContain('--accent:#218048');
    expect(css()).toContain('--cinema-ink:#222222');
    expect(css()).toContain('--cinema-focus:');
    expect(css()).toContain('--accent-ink:#000000');
  });

  it('uses legacy ERP fields when palette is absent and leaves defaults when all are absent', () => {
    const store = TestBed.inject(CmsStore);
    flush(response());
    expect(css()).toContain('--accent:#218048');
    expect(css()).toContain('--paper:#FDFDFD');
    store.cargar();
    flush({ baseFontSize: 16 });
    expect(css()).not.toContain('--accent:');
  });

  it('replaces tokens asynchronously without duplicate style nodes and rejects CSS injection', () => {
    const store = TestBed.inject(CmsStore);
    flush(response({ dia: palette, noche: palette }));
    store.cargar();
    flush(response({ dia: { ...palette, acento: '#008040', textoSuave: '#fff;}body{display:none}' }, noche: palette }));
    expect(css()).toContain('--accent:#008040');
    expect(css()).not.toContain('display:none');
    expect(document.querySelectorAll('#cms-colores')).toHaveLength(1);
    expect(store.revision()).toBe(2);
    expect(store.paquete()?.colores?.dia.acento).toBe('#008040');
  });
});
