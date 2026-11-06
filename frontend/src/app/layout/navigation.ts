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

const admin = ['ROLE_ADMIN'];

export const NAV_SECTIONS: NavSection[] = [
  { id: 'inicio', label: 'Inicio', items: [
    { id: 'dashboard', label: 'Dashboard', path: '/inicio', icon: 'home' },
    { id: 'notificaciones', label: 'Notificaciones', path: '/modules/notificaciones', icon: 'bell' },
  ] },
  {
    id: 'ventas',
    label: 'Operativa Diaria',
    items: [
      { id: 'pos', label: 'POS', path: '/ventas/pos', icon: 'cash' },
      { id: 'preformas', label: 'Borrador POS', path: '/modules/preformas', icon: 'file' },
      { id: 'turnos-caja', label: 'Turnos de Caja', path: '/modules/turnos-caja', icon: 'cash' },
      { id: 'ventas', label: 'Historial de Ventas', path: '/modules/ventas', icon: 'cart' },
      { id: 'cotizaciones', label: 'Cotizaciones', path: '/modules/cotizaciones', icon: 'file' },
      { id: 'devoluciones', label: 'Devoluciones', path: '/modules/devoluciones', icon: 'refresh' },
      { id: 'reembolsos', label: 'Reembolsos', path: '/modules/reembolsos', icon: 'cash' },
    ],
  },
  {
    id: 'crm',
    label: 'CRM',
    items: [
      { id: 'clientes', label: 'Clientes', path: '/modules/clientes', icon: 'users' },
      { id: 'mensajes-web', label: 'Mensajes Web', path: '/modules/mensajes-web', icon: 'mail' },
      { id: 'portafolio-web', label: 'Proyectos Web', path: '/modules/portafolio-web', icon: 'image', roles: ['ROLE_ADMIN', 'ROLE_MULTIFUNCIONAL'] },
      { id: 'gestor-web', label: 'Ajustes del Sitio Web', path: '/modules/gestor-web', icon: 'settings', roles: admin },
    ],
  },
  {
    id: 'inventario',
    label: 'Inventario y Logística',
    items: [
      { id: 'productos', label: 'Productos', path: '/modules/productos', icon: 'box' },
      { id: 'servicios', label: 'Servicios', path: '/modules/servicios', icon: 'wrench' },
      { id: 'categorias', label: 'Categorías', path: '/modules/categorias', icon: 'folder' },
      { id: 'catalogo-fracciones', label: 'Fracciones', path: '/modules/catalogo-fracciones', icon: 'grid' },
      { id: 'stock', label: 'Stock', path: '/modules/stock', icon: 'layers' },
      { id: 'kardex', label: 'Kardex', path: '/modules/kardex', icon: 'chart' },
      { id: 'almacenes', label: 'Almacenes', path: '/modules/almacenes', icon: 'warehouse' },
      { id: 'despachos', label: 'Despachos ', path: '/modules/despachos', icon: 'pin' },
      { id: 'movilidades', label: 'Movilidades', path: '/modules/movilidades', icon: 'car' },
    ],
  },
  {
    id: 'compras',
    label: 'Abastecimiento',
    items: [
      { id: 'compras', label: 'Compras', path: '/modules/compras', icon: 'truck' },
      { id: 'proveedores', label: 'Proveedores', path: '/modules/proveedores', icon: 'building' },
    ],
  },
  {
    id: 'finanzas',
    label: 'Contabilidad y Finanzas',
    items: [
      { id: 'finanzas', label: 'Flujo Financiero', path: '/modules/finanzas', icon: 'chart', roles: admin },
      { id: 'cuentas-por-pagar', label: 'Cuentas por pagar', path: '/modules/cuentas-por-pagar', icon: 'card' },
      { id: 'facturacion-electronica', label: 'Facturación SUNAT', path: '/modules/facturacion-electronica', icon: 'file' },
    ],
  },
  {
    id: 'rrhh',
    label: 'Talento Humano (RRHH)',
    items: [
      { id: 'rrhh', label: 'Personal', path: '/modules/rrhh', icon: 'people' },
      { id: 'asistencias', label: 'Asistencias', path: '/asistencias', icon: 'check', roles: ['ROLE_ADMIN', 'ROLE_MULTIFUNCIONAL'] },
    ],
  },
  {
    id: 'analisis',
    label: 'Inteligencia de Negocio',
    items: [
      { id: 'reportes', label: 'Reportes Gerenciales', path: '/modules/reportes', icon: 'report' },
      { id: 'auditoria', label: 'Auditoría del Sistema', path: '/modules/auditoria', icon: 'search', roles: admin },
    ],
  },
  {
    id: 'config',
    label: 'Configuración',
    items: [
      { id: 'configuracion', label: 'Parámetros Globales', path: '/modules/configuracion', icon: 'settings', roles: admin },
      { id: 'sedes', label: 'Sedes', path: '/modules/sedes', icon: 'map', roles: admin },
      { id: 'users', label: 'Usuarios', path: '/modules/users', icon: 'shield', roles: admin },
      { id: 'roles', label: 'Roles', path: '/modules/roles', icon: 'shield', roles: admin },
    ],
  },
];

export const QUICK_LINKS = [
  { label: 'Dashboard', path: '/inicio' },
  { label: 'POS', path: '/ventas/pos' },
  { label: 'Stock', path: '/modules/stock' },
  { label: 'Ventas', path: '/modules/ventas' },
  { label: 'Asistencia', path: '/asistencias' },
];
