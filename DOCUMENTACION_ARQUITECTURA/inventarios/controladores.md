# controladores



| Controlador | Mapping clase | Dependencias inyectadas | Evidencia |
| --- | --- | --- | --- |
| AlmacenController | "/api/v1/almacenes" | AlmacenService almacenService | backend/src/main/java/com/policalum/erp/infrastructure/controller/AlmacenController.java:37 |
| AuditoriaController | "/api/v1/auditoria" | AuditoriaService auditoriaService | backend/src/main/java/com/policalum/erp/infrastructure/controller/AuditoriaController.java:35 |
| AuthController | "/api/v1/auth" | AuthService authService; RateLimitService rateLimitService | backend/src/main/java/com/policalum/erp/infrastructure/controller/AuthController.java:28 |
| CanalWebController | "/api/v1" | MensajeWebService mensajes; ChatWebService chat; CanalWebNotificador notificador | backend/src/main/java/com/policalum/erp/infrastructure/controller/CanalWebController.java:43 |
| CatalogoFraccionController | "/api/v1/catalogo-fracciones" | CatalogoFraccionService catalogoFraccionService | backend/src/main/java/com/policalum/erp/infrastructure/controller/CatalogoFraccionController.java:38 |
| CategoriaController | "/api/v1/categorias" | CategoriaService categoriaService | backend/src/main/java/com/policalum/erp/infrastructure/controller/CategoriaController.java:37 |
| ClienteController | "/api/v1/clientes" | ClienteService clienteService | backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:35 |
| CmsController |  | CmsService cms; CmsMedioService medios; CmsPublicador publicador; PortafolioService portafolio | backend/src/main/java/com/policalum/erp/infrastructure/controller/CmsController.java:36 |
| ComisionController | "/api/v1/rrhh/comisiones" | ComisionService comisionService | backend/src/main/java/com/policalum/erp/infrastructure/controller/ComisionController.java:36 |
| CompraController | "/api/v1/compras" | CompraService compraService; CompraAdjuntoService adjuntoService | backend/src/main/java/com/policalum/erp/infrastructure/controller/CompraController.java:43 |
| ConfiguracionController | "/api/v1/configuracion" | ConfiguracionService service; CotizacionService cotizaciones | backend/src/main/java/com/policalum/erp/infrastructure/controller/ConfiguracionController.java:46 |
| CotizacionController | "/api/v1/cotizaciones" | CotizacionService cotizacionService; CotizacionDocumentoService cotizacionDocumento; UserRepository userRepository | backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:44 |
| CuentaFinancieraController | "/api/v1/finanzas/cuentas" | CuentaFinancieraService cuentaService | backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaFinancieraController.java:36 |
| CuentaPorPagarController | "/api/v1/cuentas-por-pagar" | CuentaPorPagarService cuentaPorPagarService | backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaPorPagarController.java:27 |
| DevolucionController | "/api/v1/devoluciones" | DevolucionService devolucionService | backend/src/main/java/com/policalum/erp/infrastructure/controller/DevolucionController.java:40 |
| ExportacionController | "/api/v1/exportacion" | ExportacionServiceImpl exportacion | backend/src/main/java/com/policalum/erp/infrastructure/controller/ExportacionController.java:19 |
| FacturacionElectronicaController | "/api/v1/facturacion-electronica" | FacturacionElectronicaService service; SunatFacturacionClient sunat | backend/src/main/java/com/policalum/erp/infrastructure/controller/FacturacionElectronicaController.java:26 |
| FinanzasController | "/api/v1/finanzas" | FlujoCajaService flujoCajaService; DashboardFinancieroService dashboardService | backend/src/main/java/com/policalum/erp/infrastructure/controller/FinanzasController.java:32 |
| FinanzasRetiroSocioController | "/api/v1/finanzas/retiros-socios" | RetiroSocioService retiroSocioService | backend/src/main/java/com/policalum/erp/infrastructure/controller/FinanzasRetiroSocioController.java:39 |
| GastoEmpresarialController | "/api/v1/finanzas/gastos" | GastoEmpresarialServiceImpl service | backend/src/main/java/com/policalum/erp/infrastructure/controller/GastoEmpresarialController.java:31 |
| KardexController | "/api/v1/kardex" | KardexService kardexService | backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:47 |
| LegajoController | "/api/v1/rrhh/legajos" | LegajoService legajoService; HistorialSalarialService historialSalarialService; PoliticaRemuneracionService politicaRemuneracion | backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:57 |
| MovilidadController | "/api/v1/movilidades" | MovilidadService service | backend/src/main/java/com/policalum/erp/infrastructure/controller/MovilidadController.java:42 |
| NominaController | "/api/v1/rrhh/nominas" | NominaService nominaService | backend/src/main/java/com/policalum/erp/infrastructure/controller/NominaController.java:42 |
| NotificacionController | "/api/v1/notificaciones" | NotificacionServiceImpl service | backend/src/main/java/com/policalum/erp/infrastructure/controller/NotificacionController.java:24 |
| OrdenDespachoController | "/api/v1/despachos" | OrdenDespachoService despachoService | backend/src/main/java/com/policalum/erp/infrastructure/controller/OrdenDespachoController.java:53 |
| PerfilController | "/api/v1/perfil" | PerfilServiceImpl perfilService | backend/src/main/java/com/policalum/erp/infrastructure/controller/PerfilController.java:32 |
| PortafolioController | "/api/v1/portafolio" | PortafolioService service | backend/src/main/java/com/policalum/erp/infrastructure/controller/PortafolioController.java:26 |
| PortalPublicoController | "/api/v1/public" | PortalPublicoService portal; CatalogoPdfService catalogoPdf; ProductoImagenService imagenes; CmsMedioService medios | backend/src/main/java/com/policalum/erp/infrastructure/controller/PortalPublicoController.java:43 |
| PortalRecepcionController | "/api/v1/public" | CotizacionService cotizacionService; CotizacionDocumentoService documentos; MensajeWebService mensajes; ChatWebService chat; CanalWebNotificador notificador; PedidoWhatsappService pedidosWhatsapp; LimitePublico limite | backend/src/main/java/com/policalum/erp/infrastructure/controller/PortalRecepcionController.java:43 |
| PreformaController | "/api/v1/preformas" | PreformaService preformaService | backend/src/main/java/com/policalum/erp/infrastructure/controller/PreformaController.java:48 |
| ProductoController | "/api/v1/productos" | ProductoService productoService; ProductoImportacionService productoImportacionService; ProductoImagenService productoImagenService; StockService stockService | backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:54 |
| ProveedorController | "/api/v1/proveedores" | ProveedorService proveedorService | backend/src/main/java/com/policalum/erp/infrastructure/controller/ProveedorController.java:39 |
| PushController | "/api/v1/notificaciones/push" | EnvioPushService push | backend/src/main/java/com/policalum/erp/infrastructure/controller/PushController.java:21 |
| ReembolsoController | "/api/v1/reembolsos" | ReembolsoService reembolsoService | backend/src/main/java/com/policalum/erp/infrastructure/controller/ReembolsoController.java:37 |
| RegimenController | "/api/v1/rrhh/mi-regimen" | RegimenRemuneracionService regimenService | backend/src/main/java/com/policalum/erp/infrastructure/controller/RegimenController.java:34 |
| RendimientoController | "/api/v1/reportes/ventas/vendedores" | VentaRepository ventaRepository | backend/src/main/java/com/policalum/erp/infrastructure/controller/RendimientoController.java:26 |
| ReporteController | "/api/v1/reportes" | ReporteService service | backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:49 |
| RolController | "/api/v1/roles" | RolService rolService | backend/src/main/java/com/policalum/erp/infrastructure/controller/RolController.java:35 |
| RrhhAsistenciaController | "/api/v1/rrhh/asistencias" | RrhhAsistenciaService asistenciaService; TotpService totpService; UserRepository userRepository; RrhhAsistenciaRepository asistenciaRepository | backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:43 |
| SedeController | "/api/v1/sedes" | SedeService sedeService; FileStorageService fileStorageService | backend/src/main/java/com/policalum/erp/infrastructure/controller/SedeController.java:32 |
| ServicioController | "/api/v1/servicios" | ServicioService servicioService | backend/src/main/java/com/policalum/erp/infrastructure/controller/ServicioController.java:26 |
| ServicioImportacionController | "/api/v1/servicios/importar" | ServicioImportacionServiceImpl service | backend/src/main/java/com/policalum/erp/infrastructure/controller/ServicioImportacionController.java:23 |
| StockController | "/api/v1/stock" | StockService stockService | backend/src/main/java/com/policalum/erp/infrastructure/controller/StockController.java:35 |
| StockOperacionController | "/api/v1/stock" | StockOperacionService service | backend/src/main/java/com/policalum/erp/infrastructure/controller/StockOperacionController.java:42 |
| TurnoCajaController | "/api/v1/turnos-caja" | TurnoCajaService turnoService; CajaChicaServiceImpl cajaChicaService | backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoCajaController.java:28 |
| TurnoTrabajoController | "/api/v1/rrhh/turnos" | TurnoTrabajoService turnoService | backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoTrabajoController.java:38 |
| UserController | "/api/v1/users" | UserService userService | backend/src/main/java/com/policalum/erp/infrastructure/controller/UserController.java:33 |
| UtilidadNetaController | "/api/v1/finanzas/utilidad-neta" | UtilidadNetaService utilidadNetaService | backend/src/main/java/com/policalum/erp/infrastructure/controller/UtilidadNetaController.java:23 |
| VentaController | "/api/v1/ventas" | VentaService ventaService; UserRepository userRepository | backend/src/main/java/com/policalum/erp/infrastructure/controller/VentaController.java:40 |
