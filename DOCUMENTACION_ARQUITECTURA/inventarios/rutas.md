# rutas

Incluye rutas anidadas y redirecciones. El fragmento no representa necesariamente URL absoluta. La columna cercana de roles es candidata: revisar bloque exacto.

| Path fragmento | Componente carga | Roles declarados cercanos | Evidencia |
| --- | --- | --- | --- |
|  | loadComponent: () => import('./features/elegir-sede/elegir-sede.component').then((m) => m.ElegirSedeComponent),  | Ver guard y ruta padre | frontend/src/app/app.routes.ts:14 |
| login | loadComponent: () => import('./features/elegir-sede/elegir-sede.component').then((m) => m.ElegirSedeComponent),  | Ver guard y ruta padre | frontend/src/app/app.routes.ts:15 |
| elegir-sede | loadComponent: () => import('./features/elegir-sede/elegir-sede.component').then((m) => m.ElegirSedeComponent),  | Ver guard y ruta padre | frontend/src/app/app.routes.ts:17 |
| recuperar-password | component: AuthenticatedLayoutComponent | expectedRoles: operacion  | frontend/src/app/app.routes.ts:22 |
|  | loadChildren: () => import('./features/perf | expectedRoles: operacion  | frontend/src/app/app.routes.ts:24 |
|  | loadChildren: () => import('./features/perfil/pages/perfil-page.component').then((m) => m.PERFIL_ROUTES),  | expectedRoles: operacion  | frontend/src/app/app.routes.ts:28 |
| admin | loadChildren: () => import('./features/perfil/pages/perfil-page.component').then((m) => m.PERFIL_ROUTES),  | expectedRoles: operacion  | frontend/src/app/app.routes.ts:29 |
| empleado | loadChildren: () => import('./features/perfil/pages/perfil-page.component').then((m) => m.PERFIL_ROUTES),  | expectedRoles: operacion  | frontend/src/app/app.routes.ts:30 |
| dashboard | loadChildren: () => import('./features/perfil/pages/perfil-page.component').then((m) => m.PERFIL_ROUTES),  | expectedRoles: operacion  | frontend/src/app/app.routes.ts:31 |
| asistencias | loadChildren: () => import('./features/perfil/pages/perfil-page.component').then((m) => m.PERFIL_ROUTES),  | expectedRoles: operacion  | frontend/src/app/app.routes.ts:33 |
| cuenta/perfil | loadChildren: () => import('./features/perfil/pages/perfil-page.component').then((m) => m.PERFIL_ROUTES),  | expectedRoles: operacion  | frontend/src/app/app.routes.ts:39 |
| ventas/pos | component: PosComponent | expectedRoles: operacion  | frontend/src/app/app.routes.ts:43 |
| workspace/:module | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:48 |
| ventas/cotizaciones | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:50 |
| ventas/clientes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:51 |
| inventario/productos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:52 |
| inventario/servicios | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:53 |
| inventario/stock | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:54 |
| inventario/kardex | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:55 |
| compras/ordenes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:56 |
| compras/proveedores | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:57 |
| compras/despachos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:58 |
| compras/movilidades | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:59 |
| finanzas/turnos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:60 |
| finanzas/cuentas-pagar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:61 |
| finanzas/pagos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:62 |
| finanzas/retiro-socios | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:63 |
| rrhh/legajo | redirect/anidada | Ver guard y ruta padre | frontend/src/app/app.routes.ts:64 |
| rrhh/nominas | component: Err | Ver guard y ruta padre | frontend/src/app/app.routes.ts:65 |
| reportes/ventas | component: ErrorPageComponent | Ver guard y ruta padre | frontend/src/app/app.routes.ts:66 |
| reportes/financieros | component: ErrorPageComponent | Ver guard y ruta padre | frontend/src/app/app.routes.ts:67 |
| config/sedes | component: ErrorPageComponent | Ver guard y ruta padre | frontend/src/app/app.routes.ts:68 |
| config/usuarios | component: ErrorPageComponent | Ver guard y ruta padre | frontend/src/app/app.routes.ts:69 |
| config/parametros | component: ErrorPageComponent | Ver guard y ruta padre | frontend/src/app/app.routes.ts:70 |
| config/auditoria | component: ErrorPageComponent | Ver guard y ruta padre | frontend/src/app/app.routes.ts:71 |
| error/404 | component: ErrorPageComponent | Ver guard y ruta padre | frontend/src/app/app.routes.ts:74 |
| error/500 | component: ErrorPageComponent | Ver guard y ruta padre | frontend/src/app/app.routes.ts:75 |
| error/permisos | component: ErrorPageComponent | Ver guard y ruta padre | frontend/src/app/app.routes.ts:76 |
| ** | component: ErrorPageComponent | Ver guard y ruta padre | frontend/src/app/app.routes.ts:77 |
| /api/v1/almacenes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:18 |
| /api/v1/almacenes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:28 |
| /api/v1/almacenes/estadisticas/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:38 |
| /api/v1/almacenes/sede/{sedeId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:48 |
| /api/v1/almacenes/validar-nombre | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:58 |
| /api/v1/almacenes/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:68 |
| /api/v1/almacenes/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:78 |
| /api/v1/almacenes/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:88 |
| /api/v1/auditoria/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:98 |
| /api/v1/auditoria/logs | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:108 |
| /api/v1/auditoria/logs/entidad/{tabla}/{registroId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:118 |
| /api/v1/auditoria/logs/exportar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:128 |
| /api/v1/auditoria/logs/usuario/{userId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:138 |
| /api/v1/auditoria/logs/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:148 |
| /api/v1/auth/login | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:158 |
| /api/v1/perfil | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:168 |
| /api/v1/perfil | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:178 |
| /api/v1/perfil/contrasena | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:188 |
| /api/v1/perfil/totp | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:198 |
| /api/v1/perfil/cerrar-sesiones | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:208 |
| /api/v1/catalogo-fracciones | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:218 |
| /api/v1/catalogo-fracciones | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:228 |
| /api/v1/catalogo-fracciones/estadisticas/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:238 |
| /api/v1/catalogo-fracciones/producto/{productoId}/disponibles | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:248 |
| /api/v1/catalogo-fracciones/validar-factor | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:258 |
| /api/v1/catalogo-fracciones/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:268 |
| /api/v1/catalogo-fracciones/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:278 |
| /api/v1/catalogo-fracciones/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:288 |
| /api/v1/categorias | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:298 |
| /api/v1/categorias | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:308 |
| /api/v1/categorias/estadisticas/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:318 |
| /api/v1/categorias/raices | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:328 |
| /api/v1/categorias/validar-slug | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:338 |
| /api/v1/categorias/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:348 |
| /api/v1/categorias/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:358 |
| /api/v1/categorias/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:368 |
| /api/v1/categorias/{parentId}/hijas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:378 |
| /api/v1/clientes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:388 |
| /api/v1/clientes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:398 |
| /api/v1/clientes/compras/activos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:408 |
| /api/v1/clientes/compras/inactivos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:418 |
| /api/v1/clientes/documento/{numeroDocumento} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:428 |
| /api/v1/clientes/estadisticas/count | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:438 |
| /api/v1/clientes/estadisticas/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:448 |
| /api/v1/clientes/estadisticas/hoy | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:458 |
| /api/v1/clientes/estadisticas/tipo-documento | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:468 |
| /api/v1/clientes/incompletos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:478 |
| /api/v1/clientes/recientes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:488 |
| /api/v1/clientes/validar/documento | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:498 |
| /api/v1/clientes/validar/email | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:508 |
| /api/v1/clientes/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:518 |
| /api/v1/clientes/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:528 |
| /api/v1/clientes/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:538 |
| /api/v1/compras | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:548 |
| /api/v1/compras | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:558 |
| /api/v1/compras/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:568 |
| /api/v1/compras/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:578 |
| /api/v1/compras/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:588 |
| /api/v1/compras/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:598 |
| /api/v1/compras/{id}/adjuntos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:608 |
| /api/v1/compras/{id}/adjuntos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:618 |
| /api/v1/compras/{id}/adjuntos/{adjuntoId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:628 |
| /api/v1/compras/{id}/adjuntos/{adjuntoId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:638 |
| /api/v1/compras/{id}/anulacion | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:648 |
| /api/v1/compras/{id}/recepcion | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:658 |
| /api/v1/configuracion/empresa | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:668 |
| /api/v1/configuracion/empresa | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:678 |
| /api/v1/configuracion/parametros | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:688 |
| /api/v1/configuracion/parametros | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:698 |
| /api/v1/configuracion/publica | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:708 |
| /api/v1/configuracion/series | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:718 |
| /api/v1/configuracion/series | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:728 |
| /api/v1/cotizaciones | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:738 |
| /api/v1/cotizaciones | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:748 |
| /api/v1/cotizaciones/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:758 |
| /api/v1/cotizaciones/vencidas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:768 |
| /api/v1/cotizaciones/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:778 |
| /api/v1/cotizaciones/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:788 |
| /api/v1/cotizaciones/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:798 |
| /api/v1/cotizaciones/{id}/aceptar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:808 |
| /api/v1/cotizaciones/{id}/convertir | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:818 |
| /api/v1/cotizaciones/{id}/rechazar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:828 |
| /api/v1/cuentas-por-pagar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:838 |
| /api/v1/cuentas-por-pagar/compra/{compraId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:848 |
| /api/v1/cuentas-por-pagar/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:858 |
| /api/v1/cuentas-por-pagar/proximas-vencer | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:868 |
| /api/v1/cuentas-por-pagar/vencidas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:878 |
| /api/v1/cuentas-por-pagar/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:888 |
| /api/v1/cuentas-por-pagar/{id}/pago | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:898 |
| /api/v1/despachos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:908 |
| /api/v1/despachos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:928 |
| /api/v1/despachos/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:938 |
| /api/v1/despachos/repartidor/{userId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:948 |
| /api/v1/despachos/seguimiento/{codigo} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:958 |
| /api/v1/despachos/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:968 |
| /api/v1/despachos/{id}/asignar-repartidor | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:978 |
| /api/v1/despachos/{id}/estado | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:988 |
| /api/v1/despachos/{id}/evidencia | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:998 |
| /api/v1/despachos/{id}/evidencia | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1008 |
| /api/v1/devoluciones | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1025 |
| /api/v1/devoluciones | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1035 |
| /api/v1/devoluciones/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1045 |
| /api/v1/devoluciones/venta/{ventaId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1055 |
| /api/v1/devoluciones/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1065 |
| /api/v1/devoluciones/{id}/aprobar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1075 |
| /api/v1/devoluciones/{id}/rechazar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1085 |
| /api/v1/finanzas/cuentas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1095 |
| /api/v1/finanzas/cuentas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1105 |
| /api/v1/finanzas/cuentas/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1115 |
| /api/v1/finanzas/cuentas/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1125 |
| /api/v1/finanzas/cuentas/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1135 |
| /api/v1/finanzas/cuentas/{id}/saldos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1145 |
| /api/v1/finanzas/cuentas/{id}/saldos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1155 |
| /api/v1/finanzas/dashboard/evolucion-mensual | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1165 |
| /api/v1/finanzas/dashboard/kpis | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1175 |
| /api/v1/finanzas/dashboard/patrimonio | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1185 |
| /api/v1/finanzas/flujo-caja | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1195 |
| /api/v1/finanzas/flujo-caja/devengado | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1205 |
| /api/v1/finanzas/flujo-caja/proyeccion | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1215 |
| /api/v1/finanzas/retiros-socios | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1225 |
| /api/v1/finanzas/retiros-socios | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1235 |
| /api/v1/finanzas/retiros-socios/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1245 |
| /api/v1/finanzas/retiros-socios/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1255 |
| /api/v1/finanzas/retiros-socios/{id}/anular | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1265 |
| /api/v1/finanzas/utilidad-neta | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1275 |
| /api/v1/finanzas/utilidad-neta/periodo | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1285 |
| /api/v1/kardex | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1295 |
| /api/v1/kardex/exportar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1305 |
| /api/v1/kardex/mermas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1315 |
| /api/v1/kardex/movimientos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1325 |
| /api/v1/kardex/movimientos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1344 |
| /api/v1/kardex/movimientos/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1354 |
| /api/v1/kardex/producto/{productoId}/historial | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1364 |
| /api/v1/kardex/saldos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1374 |
| /api/v1/kardex/saldos/almacen/{almacenId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1384 |
| /api/v1/kardex/saldos/producto/{productoId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1394 |
| /api/v1/kardex/transferencias | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1404 |
| /api/v1/kardex/valorizacion | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1414 |
| /api/v1/kardex/valorizacion/almacen/{almacenId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1424 |
| /api/v1/movilidades | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1434 |
| /api/v1/movilidades | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1444 |
| /api/v1/movilidades/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1454 |
| /api/v1/movilidades/reportes/uso | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1464 |
| /api/v1/movilidades/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1474 |
| /api/v1/movilidades/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1484 |
| /api/v1/movilidades/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1494 |
| /api/v1/movilidades/{id}/asignar-conductor | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1504 |
| /api/v1/movilidades/{id}/historial | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1514 |
| /api/v1/preformas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1524 |
| /api/v1/preformas/abiertas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1534 |
| /api/v1/preformas/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1544 |
| /api/v1/preformas/vencidas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1554 |
| /api/v1/preformas/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1564 |
| /api/v1/preformas/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1574 |
| /api/v1/preformas/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1584 |
| /api/v1/preformas/{id}/cancelar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1594 |
| /api/v1/preformas/{id}/confirmar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1604 |
| /api/v1/productos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1614 |
| /api/v1/productos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1633 |
| /api/v1/productos/check-sku | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1643 |
| /api/v1/productos/dashboard/statistics | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1653 |
| /api/v1/productos/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1663 |
| /api/v1/productos/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1673 |
| /api/v1/productos/{id}/stock | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1683 |
| /api/v1/productos/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1693 |
| /api/v1/proveedores | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1703 |
| /api/v1/proveedores | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1713 |
| /api/v1/proveedores/documento | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1723 |
| /api/v1/proveedores/estadisticas/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1733 |
| /api/v1/proveedores/estadisticas/tipo-documento | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1743 |
| /api/v1/proveedores/incompletos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1753 |
| /api/v1/proveedores/validar/documento | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1763 |
| /api/v1/proveedores/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1773 |
| /api/v1/proveedores/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1783 |
| /api/v1/proveedores/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1793 |
| /api/v1/reembolsos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1803 |
| /api/v1/reembolsos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1813 |
| /api/v1/reembolsos/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1823 |
| /api/v1/reembolsos/{id}/procesar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1833 |
| /api/v1/reportes/caja/arqueos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1843 |
| /api/v1/reportes/caja/arqueos/exportar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1853 |
| /api/v1/reportes/clientes/frecuentes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1863 |
| /api/v1/reportes/clientes/frecuentes/exportar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1873 |
| /api/v1/reportes/productos/estrella | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1883 |
| /api/v1/reportes/productos/rentabilidad | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1893 |
| /api/v1/reportes/productos/rentabilidad/exportar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1903 |
| /api/v1/reportes/proveedores/ranking | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1913 |
| /api/v1/reportes/proveedores/ranking/exportar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1923 |
| /api/v1/reportes/ventas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1933 |
| /api/v1/reportes/ventas/exportar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1955 |
| /api/v1/reportes/ventas/resumen | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1974 |
| /api/v1/roles | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:1994 |
| /api/v1/roles | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2004 |
| /api/v1/roles/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2014 |
| /api/v1/roles/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2024 |
| /api/v1/roles/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2034 |
| /api/v1/rrhh/asistencias/configurar-totp/{empleadoId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2044 |
| /api/v1/rrhh/asistencias/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2054 |
| /api/v1/rrhh/asistencias/empleados | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2064 |
| /api/v1/rrhh/asistencias/estado-dia | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2074 |
| /api/v1/rrhh/asistencias/listar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2084 |
| /api/v1/rrhh/asistencias/manual | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2094 |
| /api/v1/rrhh/asistencias/marcar-qr | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2104 |
| /api/v1/rrhh/asistencias/marcar-qr-real | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2114 |
| /api/v1/rrhh/asistencias/mis-asistencias | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2124 |
| /api/v1/rrhh/asistencias/qr-config/{empleadoId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2134 |
| /api/v1/rrhh/asistencias/qr-publico | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2144 |
| /api/v1/rrhh/asistencias/ultima-marcacion | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2154 |
| /api/v1/rrhh/asistencias/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2164 |
| /api/v1/rrhh/asistencias/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2174 |
| /api/v1/rrhh/asistencias/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2184 |
| /api/v1/rrhh/comisiones | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2194 |
| /api/v1/rrhh/comisiones/calcular | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2204 |
| /api/v1/rrhh/comisiones/empleado/{userId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2214 |
| /api/v1/rrhh/comisiones/periodo | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2224 |
| /api/v1/rrhh/comisiones/{id}/aprobar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2234 |
| /api/v1/rrhh/legajos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2244 |
| /api/v1/rrhh/legajos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2263 |
| /api/v1/rrhh/legajos/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2273 |
| /api/v1/rrhh/legajos/me | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2283 |
| /api/v1/rrhh/legajos/{empleadoId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2293 |
| /api/v1/rrhh/legajos/{empleadoId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2303 |
| /api/v1/rrhh/legajos/{id}/documentos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2313 |
| /api/v1/rrhh/legajos/{id}/documentos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2323 |
| /api/v1/rrhh/legajos/{id}/documentos/{docId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2333 |
| /api/v1/rrhh/legajos/{id}/documentos/{docId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2343 |
| /api/v1/rrhh/nominas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2353 |
| /api/v1/rrhh/nominas/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2363 |
| /api/v1/rrhh/nominas/generar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2373 |
| /api/v1/rrhh/nominas/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2383 |
| /api/v1/rrhh/nominas/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2393 |
| /api/v1/rrhh/nominas/{id}/aprobar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2403 |
| /api/v1/rrhh/nominas/{id}/boleta | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2413 |
| /api/v1/rrhh/nominas/{id}/pagar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2423 |
| /api/v1/rrhh/turnos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2433 |
| /api/v1/rrhh/turnos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2443 |
| /api/v1/rrhh/turnos/asignar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2453 |
| /api/v1/rrhh/turnos/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2463 |
| /api/v1/rrhh/turnos/empleado/{userId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2473 |
| /api/v1/rrhh/turnos/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2483 |
| /api/v1/rrhh/turnos/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2493 |
| /api/v1/rrhh/turnos/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2503 |
| /api/v1/sedes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2513 |
| /api/v1/sedes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2523 |
| /api/v1/sedes/estado | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2533 |
| /api/v1/sedes/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2543 |
| /api/v1/sedes/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2553 |
| /api/v1/sedes/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2563 |
| /api/v1/servicios | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2573 |
| /api/v1/servicios | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2583 |
| /api/v1/servicios/check-nombre | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2593 |
| /api/v1/servicios/dashboard/statistics | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2603 |
| /api/v1/servicios/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2613 |
| /api/v1/servicios/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2623 |
| /api/v1/servicios/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2633 |
| /api/v1/stock | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2643 |
| /api/v1/stock/ajuste | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2653 |
| /api/v1/stock/ajustes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2663 |
| /api/v1/stock/almacen/{almacenId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2684 |
| /api/v1/stock/almacen/{almacenId}/producto/{productoId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2694 |
| /api/v1/stock/bajo-stock | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2704 |
| /api/v1/stock/consolidado | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2714 |
| /api/v1/stock/dashboard | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2724 |
| /api/v1/stock/producto/{productoId} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2734 |
| /api/v1/stock/transferencia | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2744 |
| /api/v1/stock/transferencias | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2754 |
| /api/v1/stock/transferencias/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2774 |
| /api/v1/turnos-caja | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2784 |
| /api/v1/turnos-caja/{id}/cierre | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2794 |
| /api/v1/turnos-caja/{id}/resumen | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2804 |
| /api/v1/users | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2814 |
| /api/v1/users | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2824 |
| /api/v1/users/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2834 |
| /api/v1/users/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2844 |
| /api/v1/users/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2854 |
| /api/v1/ventas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2864 |
| /api/v1/ventas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2885 |
| /api/v1/ventas/{id} | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2895 |
| /api/v1/ventas/{id}/anulacion | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2905 |
| /api/v1/facturacion-electronica/panel | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2915 |
| /api/v1/facturacion-electronica/emitir | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2925 |
| /api/v1/facturacion-electronica/consultar-validez | redirect/anidada | Ver guard y ruta padre | frontend/src/app/core/api/api-endpoints.generated.ts:2935 |
|  | component: AlmacenesPageComponent | Ver guard y ruta padre | frontend/src/app/features/almacenes/pages/almacenes-page.component.ts:114 |
|  | component: AuditoriaPageComponent | expectedRoles: ['ROLE_ADMIN'], section: 'Análisis', breadcrumb: 'Auditoría'  | frontend/src/app/features/auditoria/pages/auditoria-page.component.ts:118 |
|  | component: CatalogoFraccionesPageComponent | Ver guard y ruta padre | frontend/src/app/features/catalogo-fracciones/pages/catalogo-fracciones-page.component.ts:266 |
|  | component: CategoriasPageComponent | Ver guard y ruta padre | frontend/src/app/features/categorias/pages/categorias-page.component.ts:180 |
|  | component: ClientesPageComponent | Ver guard y ruta padre | frontend/src/app/features/clientes/pages/clientes-page.component.ts:192 |
|  | component: ComprasPageComponent | Ver guard y ruta padre | frontend/src/app/features/compras/pages/compras-page.component.ts:323 |
|  | component: ConfiguracionPageComponent | expectedRoles: ['ROLE_ADMIN'], section: 'Configuración', breadcrumb: 'Parámetros'  | frontend/src/app/features/configuracion/pages/configuracion-page.component.ts:330 |
|  | component: CotizacionesPageComponent | Ver guard y ruta padre | frontend/src/app/features/cotizaciones/pages/cotizaciones-page.component.ts:385 |
|  | component: CuentasPorPagarPageComponent | Ver guard y ruta padre | frontend/src/app/features/cuentas-por-pagar/pages/cuentas-por-pagar-page.component.ts:95 |
|  | component: DashboardPageComponent | Ver guard y ruta padre | frontend/src/app/features/dashboard/pages/dashboard-page.component.ts:36 |
|  | component: DespachosPageComponent | Ver guard y ruta padre | frontend/src/app/features/despachos/pages/despachos-page.component.ts:256 |
|  | component: DevolucionesPageComponent | Ver guard y ruta padre | frontend/src/app/features/devoluciones/pages/devoluciones-page.component.ts:240 |
|  | component: FacturacionElectronicaPageComponent | Ver guard y ruta padre | frontend/src/app/features/facturacion-electronica/pages/facturacion-electronica-page.component.ts:22 |
|  | component: FinanzasPageComponent | expectedRoles: ['ROLE_ADMIN'], section: 'Finanzas', breadcrumb: 'Finanzas'  | frontend/src/app/features/finanzas/pages/finanzas-page.component.ts:354 |
|  | component: GestorWebPageComponent | expectedRoles: ['ROLE_ADMIN']  | frontend/src/app/features/gestor-web/gestor-web-page.component.ts:1341 |
|  | component: KardexPageComponent | Ver guard y ruta padre | frontend/src/app/features/kardex/pages/kardex-page.component.ts:196 |
|  | component: MensajesWebPageComponent | Ver guard y ruta padre | frontend/src/app/features/mensajes-web/mensajes-web-page.component.ts:547 |
|  | component: MovilidadesPageComponent | Ver guard y ruta padre | frontend/src/app/features/movilidades/pages/movilidades-page.component.ts:127 |
|  | component: NotificacionesPageComponent | Ver guard y ruta padre | frontend/src/app/features/notificaciones/notificaciones-page.component.ts:117 |
|  | component: PerfilPageComponent | Ver guard y ruta padre | frontend/src/app/features/perfil/pages/perfil-page.component.ts:326 |
|  | component: PortafolioWebPageComponent | expectedRoles: ['ROLE_ADMIN', 'ROLE_MULTIFUNCIONAL']  | frontend/src/app/features/portafolio-web/portafolio-web-page.component.ts:321 |
|  | component: PreformasPageComponent | Ver guard y ruta padre | frontend/src/app/features/preformas/pages/preformas-page.component.ts:338 |
|  | component: ProductosPageComponent | Ver guard y ruta padre | frontend/src/app/features/productos/pages/productos-page.component.ts:2077 |
|  | component: ProveedoresPageComponent | Ver guard y ruta padre | frontend/src/app/features/proveedores/pages/proveedores-page.component.ts:121 |
|  | component: ReembolsosPageComponent | Ver guard y ruta padre | frontend/src/app/features/reembolsos/pages/reembolsos-page.component.ts:180 |
|  | component: ReportesPageComponent | Ver guard y ruta padre | frontend/src/app/features/reportes/pages/reportes-page.component.ts:167 |
|  | component: RolesPageComponent | expectedRoles: ['ROLE_ADMIN'], section: 'Configuración', breadcrumb: 'Roles'  | frontend/src/app/features/roles/pages/roles-page.component.ts:555 |
|  | component: RrhhPageComponent | Ver guard y ruta padre | frontend/src/app/features/rrhh/pages/rrhh-page.component.ts:512 |
|  | component: SedesPageComponent | expectedRoles: ['ROLE_ADMIN'], section: 'Configuración', breadcrumb: 'Sedes'  | frontend/src/app/features/sedes/pages/sedes-page.component.ts:382 |
|  | component: ServiciosPageComponent | Ver guard y ruta padre | frontend/src/app/features/servicios/pages/servicios-page.component.ts:337 |
|  | component: StockPageComponent | Ver guard y ruta padre | frontend/src/app/features/stock/pages/stock-page.component.ts:168 |
|  | component: TurnosCajaPageComponent | Ver guard y ruta padre | frontend/src/app/features/turnos-caja/pages/turnos-caja-page.component.ts:203 |
|  | component: UsersPageComponent | expectedRoles: ['ROLE_ADMIN'], section: 'Configuración', breadcrumb: 'Usuarios'  | frontend/src/app/features/users/pages/users-page.component.ts:140 |
|  | component: VentasPageComponent | Ver guard y ruta padre | frontend/src/app/features/ventas/pages/ventas-page.component.ts:311 |
| /inicio | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:23 |
| /modules/notificaciones | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:24 |
| /ventas/pos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:31 |
| /modules/preformas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:32 |
| /modules/turnos-caja | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:33 |
| /modules/ventas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:34 |
| /modules/cotizaciones | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:35 |
| /modules/devoluciones | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:36 |
| /modules/reembolsos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:37 |
| /modules/clientes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:44 |
| /modules/mensajes-web | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:45 |
| /modules/portafolio-web | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:46 |
| /modules/gestor-web | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:47 |
| /modules/productos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:54 |
| /modules/servicios | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:55 |
| /modules/categorias | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:56 |
| /modules/catalogo-fracciones | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:57 |
| /modules/stock | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:58 |
| /modules/kardex | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:59 |
| /modules/almacenes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:60 |
| /modules/despachos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:61 |
| /modules/movilidades | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:62 |
| /modules/compras | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:69 |
| /modules/proveedores | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:70 |
| /modules/finanzas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:77 |
| /modules/cuentas-por-pagar | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:78 |
| /modules/facturacion-electronica | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:79 |
| /modules/rrhh | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:86 |
| /asistencias | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:87 |
| /modules/reportes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:94 |
| /modules/auditoria | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:95 |
| /modules/configuracion | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:102 |
| /modules/sedes | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:103 |
| /modules/users | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:104 |
| /modules/roles | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:105 |
| /inicio | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:111 |
| /ventas/pos | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:112 |
| /modules/stock | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:113 |
| /modules/ventas | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:114 |
| /asistencias | redirect/anidada | Ver guard y ruta padre | frontend/src/app/layout/navigation.ts:115 |
| inicio | loadChildren: () => import('./features/dashboard/pages/dashboard-page.component').then((m) => m.DASHBOARD_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:17 |
| modules/notificaciones | loadChildren: () => import('./features/notificaciones/notificaciones-page.component').then((m) => m.NOTIFICACIONES_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:23 |
| modules/ventas | loadChildren: () => import('./features/ventas/pages/ventas-page.component').then((m) => m.VENTAS_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:31 |
| modules/preformas | loadChildren: () => import('./features/preformas/pages/preformas-page.component').then((m) => m.PREFORMAS_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:37 |
| modules/cotizaciones | loadChildren: () => import('./features/cotizaciones/pages/cotizaciones-page.component').then((m) => m.COTIZACIONES_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:43 |
| modules/devoluciones | loadChildren: () => import('./features/devoluciones/pages/devoluciones-page.component').then((m) => m.DEVOLUCIONES_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:49 |
| modules/reembolsos | loadChildren: () => import('./features/reembolsos/pages/reembolsos-page.component').then((m) => m.REEMBOLSOS_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:55 |
| modules/turnos-caja | loadChildren: () => import('./features/turnos-caja/pages/turnos-caja-page.component').then((m) => m.TURNOS_CAJA_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:61 |
| modules/clientes | loadChildren: () => import('./features/clientes/pages/clientes-page.component').then((m) => m.CLIENTES_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:69 |
| modules/mensajes-web | loadChildren: () => import('./features/mensajes-web/mensajes-web-page.component').then((m) => m.MENSAJES_WEB_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:75 |
| modules/portafolio-web | loadChildren: () => import('./features/portafolio-web/portafolio-web-page.component').then((m) => m.PORTAFOLIO_WEB_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:81 |
| modules/gestor-web | loadChildren: () => import('./features/gestor-web/gestor-web-page.component').then((m) => m.GESTOR_WEB_ROUTES),  | expectedRoles: ADMIN  | frontend/src/app/module.routes.ts:87 |
| modules/productos | loadChildren: () => import('./features/productos/pages/productos-page.component').then((m) => m.PRODUCTOS_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:95 |
| modules/servicios | loadChildren: () => import('./features/servicios/pages/servicios-page.component').then((m) => m.SERVICIOS_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:101 |
| modules/categorias | loadChildren: () => import('./features/categorias/pages/categorias-page.component').then((m) => m.CATEGORIAS_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:107 |
| modules/catalogo-fracciones | loadChildren: () => import('./features/catalogo-fracciones/pages/catalogo-fracciones-page.component').then((m) => m.CATALOGO_FRACCIONES_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:113 |
| modules/almacenes | loadChildren: () => import('./features/almacenes/pages/almacenes-page.component').then((m) => m.ALMACENES_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:119 |
| modules/stock | loadChildren: () => import('./features/stock/pages/stock-page.component').then((m) => m.STOCK_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:125 |
| modules/kardex | loadChildren: () => import('./features/kardex/pages/kardex-page.component').then((m) => m.KARDEX_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:131 |
| modules/despachos | loadChildren: () => import('./features/despachos/pages/despachos-page.component').then((m) => m.DESPACHOS_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:137 |
| modules/movilidades | loadChildren: () => import('./features/movilidades/pages/movilidades-page.component').then((m) => m.MOVILIDADES_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:143 |
| modules/compras | loadChildren: () => import('./features/compras/pages/compras-page.component').then((m) => m.COMPRAS_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:151 |
| modules/proveedores | loadChildren: () => import('./features/proveedores/pages/proveedores-page.component').then((m) => m.PROVEEDORES_ROUTES),  | expectedRoles: OPERACION  | frontend/src/app/module.routes.ts:157 |
| modules/finanzas | loadChildren: () => import('./features/finanzas/pages/finanzas-page.component').then((m) => m.FINANZAS_ROUTES),  | expectedRoles: ADMIN  | frontend/src/app/module.routes.ts:165 |
| modules/cuentas-por-pagar | loadChildren: () => import('./features/cuentas-por-pagar/pages/cuentas-por-pagar-page.component').then((m) => m.CUENTAS_POR_PAGAR_ROUTES),  | expectedRoles: ADMIN  | frontend/src/app/module.routes.ts:171 |
| modules/facturacion-electronica | loadChildren: () => import('./features/facturacion-electronica/pages/facturacion-electronica-page.component').then((m) => m.FACTURACION_ELECTRONICA_ROUTES),  | expectedRoles: ADMIN  | frontend/src/app/module.routes.ts:177 |
| modules/rrhh | loadChildren: () => import('./features/rrhh/pages/rrhh-page.component').then((m) => m.RRHH_ROUTES),  | expectedRoles: ADMIN  | frontend/src/app/module.routes.ts:185 |
| modules/reportes | loadChildren: () => import('./features/reportes/pages/reportes-page.component').then((m) => m.REPORTES_ROUTES),  | expectedRoles: ADMIN  | frontend/src/app/module.routes.ts:193 |
| modules/auditoria | loadChildren: () => import('./features/auditoria/pages/auditoria-page.component').then((m) => m.AUDITORIA_ROUTES),  | expectedRoles: ADMIN  | frontend/src/app/module.routes.ts:201 |
| modules/configuracion | loadChildren: () => import('./features/configuracion/pages/configuracion-page.component').then((m) => m.CONFIGURACION_ROUTES),  | expectedRoles: ADMIN  | frontend/src/app/module.routes.ts:209 |
| modules/sedes | loadChildren: () => import('./features/sedes/pages/sedes-page.component').then((m) => m.SEDES_ROUTES),  | expectedRoles: ADMIN  | frontend/src/app/module.routes.ts:215 |
| modules/users | loadChildren: () => import('./features/users/pages/users-page.component').then((m) => m.USERS_ROUTES),  | expectedRoles: ADMIN  | frontend/src/app/module.routes.ts:221 |
| modules/roles | loadChildren: () => import('./features/roles/pages/roles-page.component').then((m) => m.ROLES_ROUTES),  | expectedRoles: ADMIN  | frontend/src/app/module.routes.ts:227 |
|  | loadComponent: () => import('./pages/inicio.component').then((m) => m.InicioComponent), title: 'POLICALUM \| Policarbonatos y cubiertas' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:4 |
| catalogo | loadComponent: () => import('./pages/catalogo.component').then((m) => m.CatalogoComponent), title: 'Catálogo \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:5 |
| catalogo/:id | loadComponent: () => import('./pages/producto.component').then((m) => m.ProductoComponent), title: 'Producto \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:6 |
| carrito | loadComponent: () => import('./pages/carrito.component').then((m) => m.CarritoComponent), title: 'Carrito \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:7 |
| cotizar | loadComponent: () => import('./pages/cotizar.component').then((m) => m.CotizarComponent), title: 'Cotización \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:8 |
| servicios | loadComponent: () => import('./pages/servicios.component').then((m) => m.ServiciosComponent), title: 'Servicios \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:9 |
| portafolio | loadComponent: () => import('./pages/portafolio.component').then((m) => m.PortafolioComponent), title: 'Proyectos \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:10 |
| contacto | loadComponent: () => import('./pages/legal.component').then((m) => m.PrivacidadComponent), title: 'Política de privacidad \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:11 |
| privacidad | loadComponent: () => import('./pages/legal.component').then((m) => m.PrivacidadComponent), title: 'Política de privacidad \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:12 |
| terminos | loadComponent: () => import('./pages/legal.component').then((m) => m.TerminosComponent), title: 'Términos y condiciones \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:13 |
| envios | loadComponent: () => import('./pages/legal.component').then((m) => m.EnviosComponent), title: 'Envíos y cambios \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:14 |
| reclamaciones | loadComponent: () => import('./pages/contacto.component').then((m) => m.ContactoComponent), title: 'Libro de reclamaciones \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:15 |
| nosotros | loadComponent: () => import('./pages/legal.component').then((m) => m.NosotrosComponent), title: 'Nosotros \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:16 |
| blog | loadComponent: () => import('./pages/legal.component').then((m) => m.BlogComponent), title: 'Blog y noticias \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:17 |
| garantia | loadComponent: () => import('./pages/legal.component').then((m) => m.GarantiaComponent), title: 'Garantía \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:18 |
| faq | loadComponent: () => import('./pages/legal.component').then((m) => m.FaqComponent), title: 'Preguntas frecuentes \| POLICALUM' },  | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:19 |
| ** | redirect/anidada | Ver guard y ruta padre | sitio_web/src/app/app.routes.ts:20 |
