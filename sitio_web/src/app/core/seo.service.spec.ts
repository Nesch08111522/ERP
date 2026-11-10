import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { SeoService } from './seo.service';
import { ProductoPublico } from './models';

describe('SEO publico', () => {
  let seo: SeoService;
  const product: ProductoPublico = { id: 'real', nombre: 'Publicado', precioPublico: 127.45, stock: 3.75, disponible: true, destacado: false, esFraccionable: false, fracciones: [] };
  beforeEach(() => { TestBed.configureTestingModule({}); seo = TestBed.inject(SeoService); seo.route('/catalogo', 'Catalogo | POLICALUM'); });
  it('publica precio y stock exactos y limpia Product al navegar', () => {
    seo.product(product);
    const data = JSON.parse(document.getElementById('seo-product')!.textContent!);
    expect(data.offers.price).toBe(127.45);
    expect(data.offers.inventoryLevel.value).toBe(3.75);
    seo.route('/cotizar', 'Cotizacion | POLICALUM');
    expect(document.getElementById('seo-product')).toBeNull();
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe('Cotizacion | POLICALUM');
  });
  it('no inventa Offer cuando falta stock o el precio corresponde a cortes', () => {
    seo.product({ ...product, stock: undefined });
    expect(JSON.parse(document.getElementById('seo-product')!.textContent!).offers).toBeUndefined();
    seo.product({ ...product, esFraccionable: true });
    expect(JSON.parse(document.getElementById('seo-product')!.textContent!).offers).toBeUndefined();
  });
  it('solo incluye direccion conocida en LocalBusiness', () => {
    const data = JSON.parse(document.getElementById('seo-local-business')!.textContent!);
    expect(data.address.streetAddress).toBe('Elvira García y García 711');
    expect(data.url).toBeUndefined();
    expect(data.openingHours).toBeUndefined();
  });
});
