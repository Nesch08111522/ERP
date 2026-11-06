export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  roles?: string[];
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

const ADMIN = ['ROLE_ADMIN'];
const AMBOS = ['ROLE_ADMIN', 'ROLE_MULTIFUNCIONAL'];

export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'inicio',
    label: 'Inicio',
    items: [
      { id: 'dashboard',      label: 'Dashboard',       path: '/inicio',                 icon: 'home', roles: AMBOS },
      { id: 'notificaciones', label: 'Notificaciones',  path: '/modules/notificaciones', icon: 'bell', roles: AMBOS },
    ],
  },
  {
    id: 'ventas',
    label: 'Operativa Diaria',
    items: [
      { id: 'pos',          label: 'POS',                 path: '/ventas/pos',          icon: 'cash',    roles: AMBOS },
      { id: 'preformas',    label: 'Borrador POS',        path: '/modules/preformas',   icon: 'file',    roles: AMBOS },
      { id: 'turnos-caja',  label: 'Turnos de Caja',      path: '/modules/turnos-caja', icon: 'cash',    roles: AMBOS },
      { id: 'ventas',       label: 'Historial de Ventas', path: '/modules/ventas',      icon: 'cart',    roles: AMBOS },
      { id: 'cotizaciones', label: 'Cotizaciones',        path: '/modules/cotizaciones',icon: 'file',    roles: AMBOS },
      { id: 'devoluciones', label: 'Devoluciones',        path: '/modules/devoluciones',icon: 'refresh', roles: AMBOS },
      { id: 'reembolsos',   label: 'Reembolsos',          path: '/modules/reembolsos',  icon: 'cash',    roles: AMBOS },
    ],
  },
  {
    id: 'crm',
    label: 'CRM',
    items: [
      { id: 'clientes',       label: 'Clientes',              path: '/modules/clientes',       icon: 'users',    roles: AMBOS },
      { id: 'mensajes-web',   label: 'Mensajes Web',          path: '/modules/mensajes-web',   icon: 'mail',     roles: AMBOS },
      { id: 'portafolio-web', label: 'Proyectos Web',         path: '/modules/portafolio-web', icon: 'image',    roles: AMBOS },
      { id: 'gestor-web',     label: 'Ajustes del Sitio Web', path: '/modules/gestor-web',     icon: 'settings', roles: ADMIN },
    ],
  },
  {
    id: 'inventario',
    label: 'Inventario y Logística',
    items: [
      { id: 'productos',           label: 'Productos',   path: '/modules/productos',           icon: 'box',       roles: AMBOS },
      { id: 'servicios',           label: 'Servicios',   path: '/modules/servicios',           icon: 'wrench',    roles: AMBOS },
      { id: 'categorias',          label: 'Categorías',  path: '/modules/categorias',          icon: 'folder',    roles: AMBOS },
      { id: 'catalogo-fracciones', label: 'Fracciones',  path: '/modules/catalogo-fracciones', icon: 'grid',      roles: AMBOS },
      { id: 'stock',               label: 'Stock',       path: '/modules/stock',               icon: 'layers',    roles: AMBOS },
      { id: 'kardex',              label: 'Kardex',      path: '/modules/kardex',              icon: 'chart',     roles: AMBOS },
      { id: 'almacenes',           label: 'Almacenes',   path: '/modules/almacenes',           icon: 'warehouse', roles: AMBOS },
      { id: 'despachos',           label: 'Despachos',   path: '/modules/despachos',           icon: 'pin',       roles: AMBOS },
      { id: 'movilidades',         label: 'Movilidades', path: '/modules/movilidades',         icon: 'car',       roles: AMBOS },
    ],
  },
  {
    id: 'compras',
    label: 'Abastecimiento',
    items: [
      { id: 'compras',     label: 'Compras',     path: '/modules/compras',     icon: 'truck',    roles: AMBOS },
      { id: 'proveedores', label: 'Proveedores', path: '/modules/proveedores', icon: 'building', roles: AMBOS },
    ],
  },
  {
    id: 'finanzas',
    label: 'Contabilidad y Finanzas',
    items: [
      { id: 'finanzas',                label: 'Flujo Financiero',  path: '/modules/finanzas',                icon: 'chart', roles: ADMIN },
      { id: 'cuentas-por-pagar',       label: 'Cuentas por pagar', path: '/modules/cuentas-por-pagar',       icon: 'card',  roles: ADMIN },
      { id: 'facturacion-electronica', label: 'Facturación SUNAT', path: '/modules/facturacion-electronica', icon: 'file',  roles: ADMIN },
    ],
  },
  {
    id: 'rrhh',
    label: 'Talento Humano (RRHH)',
    items: [
      { id: 'rrhh',        label: 'Personal',    path: '/modules/rrhh', icon: 'people', roles: ADMIN },
      { id: 'asistencias', label: 'Asistencias', path: '/asistencias',  icon: 'check',  roles: AMBOS },
    ],
  },
  {
    id: 'analisis',
    label: 'Inteligencia de Negocio',
    items: [
      { id: 'reportes',  label: 'Reportes Gerenciales',  path: '/modules/reportes',  icon: 'report', roles: ADMIN },
      { id: 'auditoria', label: 'Auditoría del Sistema', path: '/modules/auditoria', icon: 'search', roles: ADMIN },
    ],
  },
  {
    id: 'config',
    label: 'Configuración',
    items: [
      { id: 'configuracion', label: 'Parámetros Globales', path: '/modules/configuracion', icon: 'settings', roles: ADMIN },
      { id: 'sedes',         label: 'Sedes',              path: '/modules/sedes',         icon: 'map',      roles: ADMIN },
      { id: 'users',         label: 'Usuarios',           path: '/modules/users',         icon: 'shield',   roles: ADMIN },
      { id: 'roles',         label: 'Roles',              path: '/modules/roles',         icon: 'shield',   roles: ADMIN },
    ],
  },
];

export const QUICK_LINKS = [
  { label: 'Dashboard', path: '/inicio',         roles: AMBOS },
  { label: 'POS',       path: '/ventas/pos',     roles: AMBOS },
  { label: 'Stock',     path: '/modules/stock',  roles: AMBOS },
  { label: 'Ventas',    path: '/modules/ventas', roles: AMBOS },
  { label: 'Asistencia',path: '/asistencias',    roles: AMBOS },
];