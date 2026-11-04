export function normalizarTextoBusqueda(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

export function coincideBusqueda(texto: string, consulta: string): boolean {
  const terminos = normalizarTextoBusqueda(consulta).split(' ').filter(Boolean);
  if (!terminos.length) return true;
  const valor = normalizarTextoBusqueda(texto);
  return terminos.every((termino) => valor.includes(termino));
}
