import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ProductoPublico } from './models';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  route(path: string, title: string): void {
    this.product(null);
    this.update(title, `${title.split(' | ')[0]}. Materiales y atención desde Trujillo. Consulta precio, disponibilidad y cotización con POLICALUM.`);
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    // Runtime URL only: no guessed production domain or canonical for filtered pages.
    this.meta.updateTag({ property: 'og:url', content: new URL(path.split('?')[0], this.document.location.origin).href });
    this.meta.removeTag("property='og:image'");
    this.json('local-business', {
      '@context': 'https://schema.org', '@type': 'LocalBusiness', name: 'POLICALUM',
      telephone: '+51954668279',
      address: { '@type': 'PostalAddress', streetAddress: 'Elvira García y García 711', addressLocality: 'Trujillo', addressCountry: 'PE' },
      description: 'Sede frente al Colegio Manucci. Almacén Chicago: coordinar punto de recojo con ventas.',
    });
  }

  update(title: string, description: string): void {
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:locale', content: 'es_PE' });
  }

  product(product: ProductoPublico | null): void {
    this.document.getElementById('seo-product')?.remove();
    if (!product) return;
    this.update(`${product.nombre} | POLICALUM`, product.descripcion || `${product.nombre}: precio y stock publicados por el almacén.`);
    this.meta.updateTag({ property: 'og:type', content: 'product' });
    const data: Record<string, unknown> = { '@context': 'https://schema.org', '@type': 'Product', name: product.nombre };
    if (product.descripcion) data['description'] = product.descripcion;
    if (product.codigoSku) data['sku'] = product.codigoSku;
    if (product.imagenUrl) {
      const image = new URL(product.imagenUrl, this.document.location.origin).href;
      data['image'] = image;
      this.meta.updateTag({ property: 'og:image', content: image });
    } else this.meta.removeTag("property='og:image'");
    if (!product.esFraccionable && typeof product.precioPublico === 'number' && Number.isFinite(product.precioPublico) && product.precioPublico >= 0 && typeof product.stock === 'number') {
      data['offers'] = { '@type': 'Offer', priceCurrency: 'PEN', price: product.precioPublico, availability: product.disponible && product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', inventoryLevel: { '@type': 'QuantitativeValue', value: product.stock } };
    }
    this.json('product', data);
  }

  private json(id: string, data: object): void {
    this.document.getElementById(`seo-${id}`)?.remove();
    const script = this.document.createElement('script');
    script.id = `seo-${id}`;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    this.document.head.append(script);
  }
}
