# entidades-tablas

MODELO JPA, NO CATALOGO FISICO VERIFICADO. No se conecto a PostgreSQL. Tablas implicitas dependen de naming strategy. Ninguna FK fisica afirmada.

| Entidad | Tabla JPA declarada/implicita | Table restricciones declaradas | Evidencia |
| --- | --- | --- | --- |
| AjusteStock | stock_ajustes | name = "stock_ajustes", indexes = {         @Index(name = "idx_stock_ajustes_fecha", columnList = "created_at" | backend/src/main/java/com/policalum/erp/domain/model/AjusteStock.java:32 |
| Almacen | almacenes | name = "almacenes", uniqueConstraints = @UniqueConstraint(columnNames = { "sede_id", "nombre" } | backend/src/main/java/com/policalum/erp/domain/model/Almacen.java:25 |
| AuditLog | audit_log | name = "audit_log" | backend/src/main/java/com/policalum/erp/domain/model/AuditLog.java:29 |
| CatalogoFraccion | catalogo_fracciones | name = "catalogo_fracciones",        uniqueConstraints = @UniqueConstraint(name = "uq_producto_fraccion",                columnNames = {"producto_id", "factor_descuento_kardex"} | backend/src/main/java/com/policalum/erp/domain/model/CatalogoFraccion.java:24 |
| Categoria | categorias | name = "categorias" | backend/src/main/java/com/policalum/erp/domain/model/Categoria.java:24 |
| Cliente | clientes | name = "clientes" | backend/src/main/java/com/policalum/erp/domain/model/Cliente.java:19 |
| CmsAjuste | cms_ajustes | name = "cms_ajustes" | backend/src/main/java/com/policalum/erp/domain/model/CmsAjuste.java:13 |
| Compra | compras | name = "compras", indexes = {         @Index(name = "idx_compras_proveedor_fecha", columnList = "proveedor_id, fecha_emision" | backend/src/main/java/com/policalum/erp/domain/model/Compra.java:39 |
| CompraAdjunto | compra_adjuntos | name = "compra_adjuntos" | backend/src/main/java/com/policalum/erp/domain/model/CompraAdjunto.java:25 |
| ConceptoCotizacion | concepto_cotizacion | name = "concepto_cotizacion" | backend/src/main/java/com/policalum/erp/domain/model/ConceptoCotizacion.java:23 |
| ConfiguracionEmpresa | configuracion_empresa | name = "configuracion_empresa" | backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionEmpresa.java:24 |
| ConfiguracionFinanzas | configuracion_finanzas | name = "configuracion_finanzas" | backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionFinanzas.java:21 |
| ConfiguracionInventario | configuracion_inventario | name = "configuracion_inventario" | backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionInventario.java:22 |
| ConfiguracionReportes | configuracion_reportes | name = "configuracion_reportes" | backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionReportes.java:21 |
| ConfiguracionRrhh | configuracion_rrhh | name = "configuracion_rrhh" | backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionRrhh.java:40 |
| ConfiguracionVentas | configuracion_ventas | name = "configuracion_ventas" | backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionVentas.java:21 |
| ConversacionWeb | conversaciones_web | name = "conversaciones_web" | backend/src/main/java/com/policalum/erp/domain/model/ConversacionWeb.java:20 |
| Correlativo | correlativos | name = "correlativos" | backend/src/main/java/com/policalum/erp/domain/model/Correlativo.java:23 |
| Cotizacion | cotizaciones | name = "cotizaciones" | backend/src/main/java/com/policalum/erp/domain/model/Cotizacion.java:31 |
| CuentaFinanciera | finanzas_cuentas | name = "finanzas_cuentas" | backend/src/main/java/com/policalum/erp/domain/model/CuentaFinanciera.java:42 |
| DetalleCompra | detalle_compra | name = "detalle_compra" | backend/src/main/java/com/policalum/erp/domain/model/DetalleCompra.java:24 |
| DetalleCotizacion | detalle_cotizacion | name = "detalle_cotizacion" | backend/src/main/java/com/policalum/erp/domain/model/DetalleCotizacion.java:25 |
| DetalleDevolucion | detalle_devolucion | name = "detalle_devolucion" | backend/src/main/java/com/policalum/erp/domain/model/DetalleDevolucion.java:28 |
| DetallePreforma | detalle_preforma | name = "detalle_preforma" | backend/src/main/java/com/policalum/erp/domain/model/DetallePreforma.java:27 |
| DetalleVenta | detalle_venta | name = "detalle_venta" | backend/src/main/java/com/policalum/erp/domain/model/DetalleVenta.java:25 |
| Devolucion | devoluciones | name = "devoluciones" | backend/src/main/java/com/policalum/erp/domain/model/Devolucion.java:33 |
| FinanzasCuentaPorPagar | finanzas_cuentas_por_pagar | name = "finanzas_cuentas_por_pagar" | backend/src/main/java/com/policalum/erp/domain/model/FinanzasCuentaPorPagar.java:31 |
| FinanzasRetiroSocio | finanzas_retiros_socio | name = "finanzas_retiros_socio" | backend/src/main/java/com/policalum/erp/domain/model/FinanzasRetiroSocio.java:34 |
| GastoEmpresarial | gastos_empresariales | name = "gastos_empresariales" | backend/src/main/java/com/policalum/erp/domain/model/GastoEmpresarial.java:28 |
| HorarioOperativo | horario_operativo | name = "horario_operativo" | backend/src/main/java/com/policalum/erp/domain/model/HorarioOperativo.java:13 |
| KardexMovimiento | kardex_movimientos | name = "kardex_movimientos", indexes = {         @Index(name = "idx_kardex_producto_almacen_fecha", columnList = "producto_id, almacen_id, created_at" | backend/src/main/java/com/policalum/erp/domain/model/KardexMovimiento.java:31 |
| LineaChat | chat_lineas | name = "chat_lineas" | backend/src/main/java/com/policalum/erp/domain/model/LineaChat.java:22 |
| MensajeContacto | mensajes_web | name = "mensajes_web" | backend/src/main/java/com/policalum/erp/domain/model/MensajeContacto.java:23 |
| Movilidad | movilidades | name = "movilidades" | backend/src/main/java/com/policalum/erp/domain/model/Movilidad.java:25 |
| MovimientoCajaChica | movimientos_caja_chica | name = "movimientos_caja_chica" | backend/src/main/java/com/policalum/erp/domain/model/MovimientoCajaChica.java:28 |
| Notificacion | notificaciones | name = "notificaciones" | backend/src/main/java/com/policalum/erp/domain/model/Notificacion.java:20 |
| OrdenDespacho | ordenes_despacho | name = "ordenes_despacho" | backend/src/main/java/com/policalum/erp/domain/model/OrdenDespacho.java:35 |
| PagoCuentaPorPagar | finanzas_pagos_cxp | name = "finanzas_pagos_cxp",         indexes = @Index(name = "idx_pagos_cxp_fecha", columnList = "fecha_pago" | backend/src/main/java/com/policalum/erp/domain/model/PagoCuentaPorPagar.java:31 |
| PagoVenta | pagos_venta | name = "pagos_venta" | backend/src/main/java/com/policalum/erp/domain/model/PagoVenta.java:29 |
| ParametroCotizacion | parametro_cotizacion | name = "parametro_cotizacion" | backend/src/main/java/com/policalum/erp/domain/model/ParametroCotizacion.java:17 |
| PreformaVenta | preformas_venta | name = "preformas_venta" | backend/src/main/java/com/policalum/erp/domain/model/PreformaVenta.java:34 |
| Producto | productos | name = "productos", indexes = {         @Index(name = "idx_productos_sku", columnList = "codigo_sku" | backend/src/main/java/com/policalum/erp/domain/model/Producto.java:23 |
| Proveedor | proveedores | name = "proveedores",         uniqueConstraints = @UniqueConstraint(name = "uk_documento_proveedor",                 columnNames = {"tipo_documento", "numero_documento"} | backend/src/main/java/com/policalum/erp/domain/model/Proveedor.java:22 |
| ProyectoPortafolio | proyectos_portafolio | name = "proyectos_portafolio" | backend/src/main/java/com/policalum/erp/domain/model/ProyectoPortafolio.java:20 |
| PushSuscripcion | suscripciones_push | name = "suscripciones_push" | backend/src/main/java/com/policalum/erp/domain/model/PushSuscripcion.java:18 |
| Reembolso | reembolsos | name = "reembolsos" | backend/src/main/java/com/policalum/erp/domain/model/Reembolso.java:34 |
| RefreshToken | refresh_tokens | name = "refresh_tokens" | backend/src/main/java/com/policalum/erp/domain/model/RefreshToken.java:19 |
| Rol | roles | name = "roles" | backend/src/main/java/com/policalum/erp/domain/model/Rol.java:14 |
| RrhhAsistencia | rrhh_asistencia | name = "rrhh_asistencia" | backend/src/main/java/com/policalum/erp/domain/model/RrhhAsistencia.java:15 |
| RrhhComision | rrhh_comisiones | name = "rrhh_comisiones",         uniqueConstraints = @UniqueConstraint(name = "uk_comision_user_periodo", columnNames = {"user_id", "periodo"} | backend/src/main/java/com/policalum/erp/domain/model/RrhhComision.java:35 |
| RrhhHistorialSalarial | rrhh_historial_salarial | name = "rrhh_historial_salarial",         indexes = @Index(name = "idx_historial_salarial_legajo_vigencia", columnList = "legajo_id, vigencia_desde" | backend/src/main/java/com/policalum/erp/domain/model/RrhhHistorialSalarial.java:41 |
| RrhhLegajoDigital | rrhh_legajo_digital | name = "rrhh_legajo_digital" | backend/src/main/java/com/policalum/erp/domain/model/RrhhLegajoDigital.java:36 |
| RrhhLegajoDocumento | rrhh_legajo_documentos | name = "rrhh_legajo_documentos" | backend/src/main/java/com/policalum/erp/domain/model/RrhhLegajoDocumento.java:32 |
| RrhhNomina | rrhh_nominas | name = "rrhh_nominas",         uniqueConstraints = @UniqueConstraint(name = "uk_nomina_user_periodo", columnNames = {"user_id", "periodo"} | backend/src/main/java/com/policalum/erp/domain/model/RrhhNomina.java:38 |
| RrhhRegimenRemuneracion | rrhh_regimen_remuneracion | name = "rrhh_regimen_remuneracion",         uniqueConstraints = @UniqueConstraint(name = "uk_regimen_user", columnNames = {"user_id"} | backend/src/main/java/com/policalum/erp/domain/model/RrhhRegimenRemuneracion.java:44 |
| RrhhTurnoTrabajo | rrhh_turnos_trabajo | name = "rrhh_turnos_trabajo" | backend/src/main/java/com/policalum/erp/domain/model/RrhhTurnoTrabajo.java:20 |
| SaldoCuentaFinanciera | finanzas_saldos_cuenta | name = "finanzas_saldos_cuenta",         indexes = @Index(name = "idx_saldos_cuenta_fecha", columnList = "cuenta_id, fecha_corte" | backend/src/main/java/com/policalum/erp/domain/model/SaldoCuentaFinanciera.java:29 |
| Sede | sedes | name = "sedes" | backend/src/main/java/com/policalum/erp/domain/model/Sede.java:17 |
| SerieComprobante | series_comprobante | name = "series_comprobante", uniqueConstraints = {         @UniqueConstraint(name = "uk_serie_sede_tipo", columnNames = {"sede_id", "tipo_comprobante"} | backend/src/main/java/com/policalum/erp/domain/model/SerieComprobante.java:31 |
| Servicio | servicios | name = "servicios" | backend/src/main/java/com/policalum/erp/domain/model/Servicio.java:27 |
| ServicioColaborador | servicio_colaboradores | name = "servicio_colaboradores" | backend/src/main/java/com/policalum/erp/domain/model/ServicioColaborador.java:24 |
| Stock | stock | name = "stock",        uniqueConstraints = @UniqueConstraint(columnNames = {"producto_id", "almacen_id"} | backend/src/main/java/com/policalum/erp/domain/model/Stock.java:28 |
| TarifaMovilidad | tarifa_movilidad | name = "tarifa_movilidad" | backend/src/main/java/com/policalum/erp/domain/model/TarifaMovilidad.java:20 |
| TransferenciaStock | stock_transferencias | name = "stock_transferencias", indexes = @Index(name = "idx_stock_transferencias_fecha", columnList = "created_at" | backend/src/main/java/com/policalum/erp/domain/model/TransferenciaStock.java:28 |
| TurnoCaja | turnos_caja | name = "turnos_caja" | backend/src/main/java/com/policalum/erp/domain/model/TurnoCaja.java:29 |
| User | users | name = "users" | backend/src/main/java/com/policalum/erp/domain/model/User.java:14 |
| VapidClave | vapid_claves | name = "vapid_claves" | backend/src/main/java/com/policalum/erp/domain/model/VapidClave.java:13 |
| Venta | ventas | name = "ventas", indexes = {         @Index(name = "idx_ventas_estado_fecha", columnList = "estado, created_at" | backend/src/main/java/com/policalum/erp/domain/model/Venta.java:32 |
