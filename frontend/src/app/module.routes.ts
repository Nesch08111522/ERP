import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

const ADMIN = ['ROLE_ADMIN'];
const OPERACION = ['ROLE_ADMIN', 'ROLE_MULTIFUNCIONAL'];

/**
 * Rutas de los módulos protegidas por rol.
 *
 * - ADMIN: ve todo.
 * - MULTIFUNCIONAL: solo ve lo operativo. NO ve finanzas, RRHH, configuración,
 *   auditoría, usuarios, roles, reportes, sedes, ni facturación SUNAT.
 */
export const MODULE_ROUTES: Routes = [
  // ─────────────── Inicio ───────────────
  {
    path: 'inicio',
    loadChildren: () => import('./features/dashboard/pages/dashboard-page.component').then((m) => m.DASHBOARD_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/notificaciones',
    loadChildren: () => import('./features/notificaciones/notificaciones-page.component').then((m) => m.NOTIFICACIONES_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },

  // ─────────────── Ventas / Operativa Diaria ───────────────
  {
    path: 'modules/ventas',
    loadChildren: () => import('./features/ventas/pages/ventas-page.component').then((m) => m.VENTAS_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/preformas',
    loadChildren: () => import('./features/preformas/pages/preformas-page.component').then((m) => m.PREFORMAS_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/cotizaciones',
    loadChildren: () => import('./features/cotizaciones/pages/cotizaciones-page.component').then((m) => m.COTIZACIONES_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/devoluciones',
    loadChildren: () => import('./features/devoluciones/pages/devoluciones-page.component').then((m) => m.DEVOLUCIONES_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/reembolsos',
    loadChildren: () => import('./features/reembolsos/pages/reembolsos-page.component').then((m) => m.REEMBOLSOS_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/turnos-caja',
    loadChildren: () => import('./features/turnos-caja/pages/turnos-caja-page.component').then((m) => m.TURNOS_CAJA_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },

  // ─────────────── CRM ───────────────
  {
    path: 'modules/clientes',
    loadChildren: () => import('./features/clientes/pages/clientes-page.component').then((m) => m.CLIENTES_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/mensajes-web',
    loadChildren: () => import('./features/mensajes-web/mensajes-web-page.component').then((m) => m.MENSAJES_WEB_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/portafolio-web',
    loadChildren: () => import('./features/portafolio-web/portafolio-web-page.component').then((m) => m.PORTAFOLIO_WEB_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/gestor-web',
    loadChildren: () => import('./features/gestor-web/gestor-web-page.component').then((m) => m.GESTOR_WEB_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: ADMIN },
  },

  // ─────────────── Inventario / Catálogo ───────────────
  {
    path: 'modules/productos',
    loadChildren: () => import('./features/productos/pages/productos-page.component').then((m) => m.PRODUCTOS_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/servicios',
    loadChildren: () => import('./features/servicios/pages/servicios-page.component').then((m) => m.SERVICIOS_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/categorias',
    loadChildren: () => import('./features/categorias/pages/categorias-page.component').then((m) => m.CATEGORIAS_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/catalogo-fracciones',
    loadChildren: () => import('./features/catalogo-fracciones/pages/catalogo-fracciones-page.component').then((m) => m.CATALOGO_FRACCIONES_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/almacenes',
    loadChildren: () => import('./features/almacenes/pages/almacenes-page.component').then((m) => m.ALMACENES_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/stock',
    loadChildren: () => import('./features/stock/pages/stock-page.component').then((m) => m.STOCK_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/kardex',
    loadChildren: () => import('./features/kardex/pages/kardex-page.component').then((m) => m.KARDEX_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/despachos',
    loadChildren: () => import('./features/despachos/pages/despachos-page.component').then((m) => m.DESPACHOS_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/movilidades',
    loadChildren: () => import('./features/movilidades/pages/movilidades-page.component').then((m) => m.MOVILIDADES_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },

  // ─────────────── Abastecimiento ───────────────
  {
    path: 'modules/compras',
    loadChildren: () => import('./features/compras/pages/compras-page.component').then((m) => m.COMPRAS_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },
  {
    path: 'modules/proveedores',
    loadChildren: () => import('./features/proveedores/pages/proveedores-page.component').then((m) => m.PROVEEDORES_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: OPERACION },
  },

  // ─────────────── Finanzas (SOLO ADMIN) ───────────────
  {
    path: 'modules/finanzas',
    loadChildren: () => import('./features/finanzas/pages/finanzas-page.component').then((m) => m.FINANZAS_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: ADMIN },
  },
  {
    path: 'modules/cuentas-por-pagar',
    loadChildren: () => import('./features/cuentas-por-pagar/pages/cuentas-por-pagar-page.component').then((m) => m.CUENTAS_POR_PAGAR_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: ADMIN },
  },
  {
    path: 'modules/facturacion-electronica',
    loadChildren: () => import('./features/facturacion-electronica/pages/facturacion-electronica-page.component').then((m) => m.FACTURACION_ELECTRONICA_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: ADMIN },
  },

  // ─────────────── RRHH (SOLO ADMIN) ───────────────
  {
    path: 'modules/rrhh',
    loadChildren: () => import('./features/rrhh/pages/rrhh-page.component').then((m) => m.RRHH_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: ADMIN },
  },

  // ─────────────── Reportes (SOLO ADMIN) ───────────────
  {
    path: 'modules/reportes',
    loadChildren: () => import('./features/reportes/pages/reportes-page.component').then((m) => m.REPORTES_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: ADMIN },
  },

  // ─────────────── Auditoría (SOLO ADMIN) ───────────────
  {
    path: 'modules/auditoria',
    loadChildren: () => import('./features/auditoria/pages/auditoria-page.component').then((m) => m.AUDITORIA_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: ADMIN },
  },

  // ─────────────── Configuración (SOLO ADMIN) ───────────────
  {
    path: 'modules/configuracion',
    loadChildren: () => import('./features/configuracion/pages/configuracion-page.component').then((m) => m.CONFIGURACION_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: ADMIN },
  },
  {
    path: 'modules/sedes',
    loadChildren: () => import('./features/sedes/pages/sedes-page.component').then((m) => m.SEDES_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: ADMIN },
  },
  {
    path: 'modules/users',
    loadChildren: () => import('./features/users/pages/users-page.component').then((m) => m.USERS_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: ADMIN },
  },
  {
    path: 'modules/roles',
    loadChildren: () => import('./features/roles/pages/roles-page.component').then((m) => m.ROLES_ROUTES),
    canActivate: [RoleGuard],
    data: { expectedRoles: ADMIN },
  },
];