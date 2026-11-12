import { describe, expect, it } from 'vitest';
import { environment } from '../../environments/environment';
import { media } from './portal.api';

describe('backend media origin', () => {
  it('normalizes legacy loopback public media to configured backend', () => {
    expect(media('http://127.0.0.1:8080/api/v1/public/catalogo/imagenes?ruta=a%2Fb#image'))
      .toBe(`${environment.apiUrl}/api/v1/public/catalogo/imagenes?ruta=a%2Fb#image`);
    expect(media('/api/v1/public/catalogo/imagenes?ruta=a'))
      .toBe(`${environment.apiUrl}/api/v1/public/catalogo/imagenes?ruta=a`);
  });
  it('preserves third parties, other ports and nonpublic paths', () => {
    for (const url of ['https://cdn.example.com/api/v1/public/a', 'http://localhost:9000/api/v1/public/a', 'http://localhost:8080/private/a']) {
      expect(media(url)).toBe(url);
    }
    expect(media(null)).toBeNull();
  });
});
