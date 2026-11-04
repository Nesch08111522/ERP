import { coincideBusqueda, normalizarTextoBusqueda } from './search-text';

describe('search text', () => {
  it('normalizes accents, case, and repeated spaces', () => {
    expect(normalizarTextoBusqueda('  Polí   Alum  ')).toBe('poli alum');
  });

  it('matches every partial term regardless of order or accents', () => {
    expect(coincideBusqueda('Policalum Producto', 'producto poli')).toBe(true);
    expect(coincideBusqueda('Policalum Producto', 'producto inexistente')).toBe(false);
  });

  it('matches an empty query', () => {
    expect(coincideBusqueda('Cualquier producto', '   ')).toBe(true);
  });
});
