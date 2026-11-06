import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SedeFiltroService } from '../../shared/services/sede-filtro.service';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Estas lecturas son de la empresa, no de una sede. */
const SIN_SEDE = [
  '/api/v1/sedes',
  '/api/v1/auth',
  '/api/v1/configuracion',
  '/api/v1/perfil',
  '/api/v1/public',
  '/api/v1/canal-web',
  '/api/v1/notificaciones',
  '/api/v1/cms',
  '/api/v1/usuarios',
  '/api/v1/roles',
];

/**
 * Cuando hay una sede elegida, las consultas del ERP salen filtradas por ella.
 * Si la pantalla ya manda su propio sedeId, se respeta. «Todas» deja el filtro vacío.
 */
export const sedeInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.method !== 'GET' || !request.url.includes('/api/v1/')) return next(request);
  if (SIN_SEDE.some((ruta) => request.url.includes(ruta))) return next(request);
  const sedeId = inject(SedeFiltroService).sedeId();
  if (!UUID.test(sedeId) || request.params.get('sedeId')) return next(request);
  return next(request.clone({ params: request.params.set('sedeId', sedeId) }));
};
