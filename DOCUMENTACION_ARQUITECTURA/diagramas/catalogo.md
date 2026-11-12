# Catalogo de diagramas

Entrega principal: 92 imagenes PNG renderizadas y verificadas localmente; 91 fuentes previas y 1 flujo general. Fuentes PlantUML complementarias. UML no usa include/extend ni composicion sin evidencia. ERD es modelo JPA, no catalogo fisico.

## Clases identidad

- Fuente: [clases-identidad.puml](clases-identidad.puml)
- Imagen: [PNG](../imagenes/clases-identidad.png)
- Objetivo: Mostrar entidades, campos y asociaciones JPA sin atribuir composicion
- Descripcion y funcionamiento: Participantes: AuditLog, Notificacion, PushSuscripcion, RefreshToken, Rol, User, VapidClave. Minimos no declarados quedan conservadores. Colecciones inversas pueden duplicar visualmente una asociacion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/AuditLog.java:31; backend/src/main/java/com/policalum/erp/domain/model/Notificacion.java:22; backend/src/main/java/com/policalum/erp/domain/model/PushSuscripcion.java:22; backend/src/main/java/com/policalum/erp/domain/model/RefreshToken.java:21; backend/src/main/java/com/policalum/erp/domain/model/Rol.java:16; backend/src/main/java/com/policalum/erp/domain/model/User.java:16; backend/src/main/java/com/policalum/erp/domain/model/VapidClave.java:17

## ERD JPA inferido - identidad

- Fuente: [erd-identidad.puml](erd-identidad.puml)
- Imagen: [PNG](../imagenes/erd-identidad.png)
- Objetivo: Mostrar mappings, no certificar catalogo fisico
- Descripcion y funcionamiento: Campos y nombres implicitos son inferidos. Cardinalidades exactas: inventarios/relaciones-jpa.md. Tablas auxiliares: mappings-auxiliares.md. No se ha verificado PostgreSQL.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/AuditLog.java:31; backend/src/main/java/com/policalum/erp/domain/model/Notificacion.java:22; backend/src/main/java/com/policalum/erp/domain/model/PushSuscripcion.java:22; backend/src/main/java/com/policalum/erp/domain/model/RefreshToken.java:21; backend/src/main/java/com/policalum/erp/domain/model/Rol.java:16; backend/src/main/java/com/policalum/erp/domain/model/User.java:16; backend/src/main/java/com/policalum/erp/domain/model/VapidClave.java:17

## Clases ubicacion

- Fuente: [clases-ubicacion.puml](clases-ubicacion.puml)
- Imagen: [PNG](../imagenes/clases-ubicacion.png)
- Objetivo: Mostrar entidades, campos y asociaciones JPA sin atribuir composicion
- Descripcion y funcionamiento: Participantes: Almacen, HorarioOperativo, Sede. Minimos no declarados quedan conservadores. Colecciones inversas pueden duplicar visualmente una asociacion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/Almacen.java:31; backend/src/main/java/com/policalum/erp/domain/model/HorarioOperativo.java:17; backend/src/main/java/com/policalum/erp/domain/model/Sede.java:19

## ERD JPA inferido - ubicacion

- Fuente: [erd-ubicacion.puml](erd-ubicacion.puml)
- Imagen: [PNG](../imagenes/erd-ubicacion.png)
- Objetivo: Mostrar mappings, no certificar catalogo fisico
- Descripcion y funcionamiento: Campos y nombres implicitos son inferidos. Cardinalidades exactas: inventarios/relaciones-jpa.md. Tablas auxiliares: mappings-auxiliares.md. No se ha verificado PostgreSQL.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/Almacen.java:31; backend/src/main/java/com/policalum/erp/domain/model/HorarioOperativo.java:17; backend/src/main/java/com/policalum/erp/domain/model/Sede.java:19

## Clases inventario

- Fuente: [clases-inventario.puml](clases-inventario.puml)
- Imagen: [PNG](../imagenes/clases-inventario.png)
- Objetivo: Mostrar entidades, campos y asociaciones JPA sin atribuir composicion
- Descripcion y funcionamiento: Participantes: AjusteStock, CatalogoFraccion, Categoria, KardexMovimiento, Producto, Stock, TransferenciaStock. Minimos no declarados quedan conservadores. Colecciones inversas pueden duplicar visualmente una asociacion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/AjusteStock.java:36; backend/src/main/java/com/policalum/erp/domain/model/CatalogoFraccion.java:28; backend/src/main/java/com/policalum/erp/domain/model/Categoria.java:26; backend/src/main/java/com/policalum/erp/domain/model/KardexMovimiento.java:36; backend/src/main/java/com/policalum/erp/domain/model/Producto.java:28; backend/src/main/java/com/policalum/erp/domain/model/Stock.java:31; backend/src/main/java/com/policalum/erp/domain/model/TransferenciaStock.java:30

## ERD JPA inferido - inventario

- Fuente: [erd-inventario.puml](erd-inventario.puml)
- Imagen: [PNG](../imagenes/erd-inventario.png)
- Objetivo: Mostrar mappings, no certificar catalogo fisico
- Descripcion y funcionamiento: Campos y nombres implicitos son inferidos. Cardinalidades exactas: inventarios/relaciones-jpa.md. Tablas auxiliares: mappings-auxiliares.md. No se ha verificado PostgreSQL.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/AjusteStock.java:36; backend/src/main/java/com/policalum/erp/domain/model/CatalogoFraccion.java:28; backend/src/main/java/com/policalum/erp/domain/model/Categoria.java:26; backend/src/main/java/com/policalum/erp/domain/model/KardexMovimiento.java:36; backend/src/main/java/com/policalum/erp/domain/model/Producto.java:28; backend/src/main/java/com/policalum/erp/domain/model/Stock.java:31; backend/src/main/java/com/policalum/erp/domain/model/TransferenciaStock.java:30

## Clases compras

- Fuente: [clases-compras.puml](clases-compras.puml)
- Imagen: [PNG](../imagenes/clases-compras.png)
- Objetivo: Mostrar entidades, campos y asociaciones JPA sin atribuir composicion
- Descripcion y funcionamiento: Participantes: Compra, CompraAdjunto, DetalleCompra, Proveedor. Minimos no declarados quedan conservadores. Colecciones inversas pueden duplicar visualmente una asociacion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/Compra.java:44; backend/src/main/java/com/policalum/erp/domain/model/CompraAdjunto.java:27; backend/src/main/java/com/policalum/erp/domain/model/DetalleCompra.java:26; backend/src/main/java/com/policalum/erp/domain/model/Proveedor.java:26

## ERD JPA inferido - compras

- Fuente: [erd-compras.puml](erd-compras.puml)
- Imagen: [PNG](../imagenes/erd-compras.png)
- Objetivo: Mostrar mappings, no certificar catalogo fisico
- Descripcion y funcionamiento: Campos y nombres implicitos son inferidos. Cardinalidades exactas: inventarios/relaciones-jpa.md. Tablas auxiliares: mappings-auxiliares.md. No se ha verificado PostgreSQL.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/Compra.java:44; backend/src/main/java/com/policalum/erp/domain/model/CompraAdjunto.java:27; backend/src/main/java/com/policalum/erp/domain/model/DetalleCompra.java:26; backend/src/main/java/com/policalum/erp/domain/model/Proveedor.java:26

## Clases ventas

- Fuente: [clases-ventas.puml](clases-ventas.puml)
- Imagen: [PNG](../imagenes/clases-ventas.png)
- Objetivo: Mostrar entidades, campos y asociaciones JPA sin atribuir composicion
- Descripcion y funcionamiento: Participantes: Cliente, ConceptoCotizacion, Cotizacion, DetalleCotizacion, DetalleDevolucion, DetallePreforma, DetalleVenta, Devolucion, PagoVenta, ParametroCotizacion, PreformaVenta, Reembolso, SerieComprobante, Venta. Minimos no declarados quedan conservadores. Colecciones inversas pueden duplicar visualmente una asociacion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/Cliente.java:21; backend/src/main/java/com/policalum/erp/domain/model/ConceptoCotizacion.java:25; backend/src/main/java/com/policalum/erp/domain/model/Cotizacion.java:33; backend/src/main/java/com/policalum/erp/domain/model/DetalleCotizacion.java:27; backend/src/main/java/com/policalum/erp/domain/model/DetalleDevolucion.java:30; backend/src/main/java/com/policalum/erp/domain/model/DetallePreforma.java:29; backend/src/main/java/com/policalum/erp/domain/model/DetalleVenta.java:27; backend/src/main/java/com/policalum/erp/domain/model/Devolucion.java:35; backend/src/main/java/com/policalum/erp/domain/model/PagoVenta.java:31; backend/src/main/java/com/policalum/erp/domain/model/ParametroCotizacion.java:19; backend/src/main/java/com/policalum/erp/domain/model/PreformaVenta.java:36; backend/src/main/java/com/policalum/erp/domain/model/Reembolso.java:36; backend/src/main/java/com/policalum/erp/domain/model/SerieComprobante.java:35; backend/src/main/java/com/policalum/erp/domain/model/Venta.java:37

## ERD JPA inferido - ventas

- Fuente: [erd-ventas.puml](erd-ventas.puml)
- Imagen: [PNG](../imagenes/erd-ventas.png)
- Objetivo: Mostrar mappings, no certificar catalogo fisico
- Descripcion y funcionamiento: Campos y nombres implicitos son inferidos. Cardinalidades exactas: inventarios/relaciones-jpa.md. Tablas auxiliares: mappings-auxiliares.md. No se ha verificado PostgreSQL.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/Cliente.java:21; backend/src/main/java/com/policalum/erp/domain/model/ConceptoCotizacion.java:25; backend/src/main/java/com/policalum/erp/domain/model/Cotizacion.java:33; backend/src/main/java/com/policalum/erp/domain/model/DetalleCotizacion.java:27; backend/src/main/java/com/policalum/erp/domain/model/DetalleDevolucion.java:30; backend/src/main/java/com/policalum/erp/domain/model/DetallePreforma.java:29; backend/src/main/java/com/policalum/erp/domain/model/DetalleVenta.java:27; backend/src/main/java/com/policalum/erp/domain/model/Devolucion.java:35; backend/src/main/java/com/policalum/erp/domain/model/PagoVenta.java:31; backend/src/main/java/com/policalum/erp/domain/model/ParametroCotizacion.java:19; backend/src/main/java/com/policalum/erp/domain/model/PreformaVenta.java:36; backend/src/main/java/com/policalum/erp/domain/model/Reembolso.java:36; backend/src/main/java/com/policalum/erp/domain/model/SerieComprobante.java:35; backend/src/main/java/com/policalum/erp/domain/model/Venta.java:37

## Clases finanzas

- Fuente: [clases-finanzas.puml](clases-finanzas.puml)
- Imagen: [PNG](../imagenes/clases-finanzas.png)
- Objetivo: Mostrar entidades, campos y asociaciones JPA sin atribuir composicion
- Descripcion y funcionamiento: Participantes: CuentaFinanciera, FinanzasCuentaPorPagar, FinanzasRetiroSocio, GastoEmpresarial, MovimientoCajaChica, PagoCuentaPorPagar, SaldoCuentaFinanciera, TurnoCaja. Minimos no declarados quedan conservadores. Colecciones inversas pueden duplicar visualmente una asociacion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/CuentaFinanciera.java:44; backend/src/main/java/com/policalum/erp/domain/model/FinanzasCuentaPorPagar.java:33; backend/src/main/java/com/policalum/erp/domain/model/FinanzasRetiroSocio.java:36; backend/src/main/java/com/policalum/erp/domain/model/GastoEmpresarial.java:30; backend/src/main/java/com/policalum/erp/domain/model/MovimientoCajaChica.java:30; backend/src/main/java/com/policalum/erp/domain/model/PagoCuentaPorPagar.java:34; backend/src/main/java/com/policalum/erp/domain/model/SaldoCuentaFinanciera.java:32; backend/src/main/java/com/policalum/erp/domain/model/TurnoCaja.java:31

## ERD JPA inferido - finanzas

- Fuente: [erd-finanzas.puml](erd-finanzas.puml)
- Imagen: [PNG](../imagenes/erd-finanzas.png)
- Objetivo: Mostrar mappings, no certificar catalogo fisico
- Descripcion y funcionamiento: Campos y nombres implicitos son inferidos. Cardinalidades exactas: inventarios/relaciones-jpa.md. Tablas auxiliares: mappings-auxiliares.md. No se ha verificado PostgreSQL.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/CuentaFinanciera.java:44; backend/src/main/java/com/policalum/erp/domain/model/FinanzasCuentaPorPagar.java:33; backend/src/main/java/com/policalum/erp/domain/model/FinanzasRetiroSocio.java:36; backend/src/main/java/com/policalum/erp/domain/model/GastoEmpresarial.java:30; backend/src/main/java/com/policalum/erp/domain/model/MovimientoCajaChica.java:30; backend/src/main/java/com/policalum/erp/domain/model/PagoCuentaPorPagar.java:34; backend/src/main/java/com/policalum/erp/domain/model/SaldoCuentaFinanciera.java:32; backend/src/main/java/com/policalum/erp/domain/model/TurnoCaja.java:31

## Clases rrhh

- Fuente: [clases-rrhh.puml](clases-rrhh.puml)
- Imagen: [PNG](../imagenes/clases-rrhh.png)
- Objetivo: Mostrar entidades, campos y asociaciones JPA sin atribuir composicion
- Descripcion y funcionamiento: Participantes: RrhhAsistencia, RrhhComision, RrhhHistorialSalarial, RrhhLegajoDigital, RrhhLegajoDocumento, RrhhNomina, RrhhRegimenRemuneracion, RrhhTurnoTrabajo. Minimos no declarados quedan conservadores. Colecciones inversas pueden duplicar visualmente una asociacion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/RrhhAsistencia.java:17; backend/src/main/java/com/policalum/erp/domain/model/RrhhComision.java:38; backend/src/main/java/com/policalum/erp/domain/model/RrhhHistorialSalarial.java:44; backend/src/main/java/com/policalum/erp/domain/model/RrhhLegajoDigital.java:38; backend/src/main/java/com/policalum/erp/domain/model/RrhhLegajoDocumento.java:34; backend/src/main/java/com/policalum/erp/domain/model/RrhhNomina.java:41; backend/src/main/java/com/policalum/erp/domain/model/RrhhRegimenRemuneracion.java:47; backend/src/main/java/com/policalum/erp/domain/model/RrhhTurnoTrabajo.java:22

## ERD JPA inferido - rrhh

- Fuente: [erd-rrhh.puml](erd-rrhh.puml)
- Imagen: [PNG](../imagenes/erd-rrhh.png)
- Objetivo: Mostrar mappings, no certificar catalogo fisico
- Descripcion y funcionamiento: Campos y nombres implicitos son inferidos. Cardinalidades exactas: inventarios/relaciones-jpa.md. Tablas auxiliares: mappings-auxiliares.md. No se ha verificado PostgreSQL.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/RrhhAsistencia.java:17; backend/src/main/java/com/policalum/erp/domain/model/RrhhComision.java:38; backend/src/main/java/com/policalum/erp/domain/model/RrhhHistorialSalarial.java:44; backend/src/main/java/com/policalum/erp/domain/model/RrhhLegajoDigital.java:38; backend/src/main/java/com/policalum/erp/domain/model/RrhhLegajoDocumento.java:34; backend/src/main/java/com/policalum/erp/domain/model/RrhhNomina.java:41; backend/src/main/java/com/policalum/erp/domain/model/RrhhRegimenRemuneracion.java:47; backend/src/main/java/com/policalum/erp/domain/model/RrhhTurnoTrabajo.java:22

## Clases servicios

- Fuente: [clases-servicios.puml](clases-servicios.puml)
- Imagen: [PNG](../imagenes/clases-servicios.png)
- Objetivo: Mostrar entidades, campos y asociaciones JPA sin atribuir composicion
- Descripcion y funcionamiento: Participantes: Movilidad, OrdenDespacho, Servicio, ServicioColaborador. Minimos no declarados quedan conservadores. Colecciones inversas pueden duplicar visualmente una asociacion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/Movilidad.java:27; backend/src/main/java/com/policalum/erp/domain/model/OrdenDespacho.java:37; backend/src/main/java/com/policalum/erp/domain/model/Servicio.java:29; backend/src/main/java/com/policalum/erp/domain/model/ServicioColaborador.java:30

## ERD JPA inferido - servicios

- Fuente: [erd-servicios.puml](erd-servicios.puml)
- Imagen: [PNG](../imagenes/erd-servicios.png)
- Objetivo: Mostrar mappings, no certificar catalogo fisico
- Descripcion y funcionamiento: Campos y nombres implicitos son inferidos. Cardinalidades exactas: inventarios/relaciones-jpa.md. Tablas auxiliares: mappings-auxiliares.md. No se ha verificado PostgreSQL.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/Movilidad.java:27; backend/src/main/java/com/policalum/erp/domain/model/OrdenDespacho.java:37; backend/src/main/java/com/policalum/erp/domain/model/Servicio.java:29; backend/src/main/java/com/policalum/erp/domain/model/ServicioColaborador.java:30

## Clases web

- Fuente: [clases-web.puml](clases-web.puml)
- Imagen: [PNG](../imagenes/clases-web.png)
- Objetivo: Mostrar entidades, campos y asociaciones JPA sin atribuir composicion
- Descripcion y funcionamiento: Participantes: CmsAjuste, ConversacionWeb, LineaChat, MensajeContacto, ProyectoPortafolio. Minimos no declarados quedan conservadores. Colecciones inversas pueden duplicar visualmente una asociacion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/CmsAjuste.java:17; backend/src/main/java/com/policalum/erp/domain/model/ConversacionWeb.java:22; backend/src/main/java/com/policalum/erp/domain/model/LineaChat.java:24; backend/src/main/java/com/policalum/erp/domain/model/MensajeContacto.java:25; backend/src/main/java/com/policalum/erp/domain/model/ProyectoPortafolio.java:22

## ERD JPA inferido - web

- Fuente: [erd-web.puml](erd-web.puml)
- Imagen: [PNG](../imagenes/erd-web.png)
- Objetivo: Mostrar mappings, no certificar catalogo fisico
- Descripcion y funcionamiento: Campos y nombres implicitos son inferidos. Cardinalidades exactas: inventarios/relaciones-jpa.md. Tablas auxiliares: mappings-auxiliares.md. No se ha verificado PostgreSQL.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/CmsAjuste.java:17; backend/src/main/java/com/policalum/erp/domain/model/ConversacionWeb.java:22; backend/src/main/java/com/policalum/erp/domain/model/LineaChat.java:24; backend/src/main/java/com/policalum/erp/domain/model/MensajeContacto.java:25; backend/src/main/java/com/policalum/erp/domain/model/ProyectoPortafolio.java:22

## Clases configuracion

- Fuente: [clases-configuracion.puml](clases-configuracion.puml)
- Imagen: [PNG](../imagenes/clases-configuracion.png)
- Objetivo: Mostrar entidades, campos y asociaciones JPA sin atribuir composicion
- Descripcion y funcionamiento: Participantes: ConfiguracionEmpresa, ConfiguracionFinanzas, ConfiguracionInventario, ConfiguracionReportes, ConfiguracionRrhh, ConfiguracionVentas. Minimos no declarados quedan conservadores. Colecciones inversas pueden duplicar visualmente una asociacion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionEmpresa.java:26; backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionFinanzas.java:23; backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionInventario.java:24; backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionReportes.java:23; backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionRrhh.java:42; backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionVentas.java:23

## ERD JPA inferido - configuracion

- Fuente: [erd-configuracion.puml](erd-configuracion.puml)
- Imagen: [PNG](../imagenes/erd-configuracion.png)
- Objetivo: Mostrar mappings, no certificar catalogo fisico
- Descripcion y funcionamiento: Campos y nombres implicitos son inferidos. Cardinalidades exactas: inventarios/relaciones-jpa.md. Tablas auxiliares: mappings-auxiliares.md. No se ha verificado PostgreSQL.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionEmpresa.java:26; backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionFinanzas.java:23; backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionInventario.java:24; backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionReportes.java:23; backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionRrhh.java:42; backend/src/main/java/com/policalum/erp/domain/model/ConfiguracionVentas.java:23

## Casos de uso general

- Fuente: [uso-general.puml](uso-general.puml)
- Imagen: [PNG](../imagenes/uso-general.png)
- Objetivo: Mostrar actores y limites
- Descripcion y funcionamiento: ADMIN tiene acceso por diseno. No se modela generalizacion ADMIN/MULTIFUNCIONAL: no es herencia de roles. El acceso MULTIFUNCIONAL por modulo depende de restricciones y permiso JSON, no asociaciones indiscriminadas.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: frontend/src/app/module.routes.ts:14; sitio_web/src/app/app.routes.ts:3; backend/src/main/java/com/policalum/erp/infrastructure/security/RolePermissionGuard.java:61

## Casos de uso notificaciones

- Fuente: [uso-notificaciones.puml](uso-notificaciones.puml)
- Imagen: [PNG](../imagenes/uso-notificaciones.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/NotificacionController.java:28; backend/src/main/java/com/policalum/erp/infrastructure/controller/NotificacionController.java:33; backend/src/main/java/com/policalum/erp/infrastructure/controller/NotificacionController.java:39; backend/src/main/java/com/policalum/erp/infrastructure/controller/NotificacionController.java:45; backend/src/main/java/com/policalum/erp/infrastructure/controller/PushController.java:25; backend/src/main/java/com/policalum/erp/infrastructure/controller/PushController.java:30; backend/src/main/java/com/policalum/erp/infrastructure/controller/PushController.java:36

## Casos de uso ventas

- Fuente: [uso-ventas.puml](uso-ventas.puml)
- Imagen: [PNG](../imagenes/uso-ventas.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/DevolucionController.java:65; backend/src/main/java/com/policalum/erp/infrastructure/controller/RendimientoController.java:30; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:56; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:72; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:88; backend/src/main/java/com/policalum/erp/infrastructure/controller/VentaController.java:52; backend/src/main/java/com/policalum/erp/infrastructure/controller/VentaController.java:66; backend/src/main/java/com/policalum/erp/infrastructure/controller/VentaController.java:75; backend/src/main/java/com/policalum/erp/infrastructure/controller/VentaController.java:109

## Casos de uso preformas

- Fuente: [uso-preformas.puml](uso-preformas.puml)
- Imagen: [PNG](../imagenes/uso-preformas.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/PreformaController.java:58; backend/src/main/java/com/policalum/erp/infrastructure/controller/PreformaController.java:72; backend/src/main/java/com/policalum/erp/infrastructure/controller/PreformaController.java:82; backend/src/main/java/com/policalum/erp/infrastructure/controller/PreformaController.java:94; backend/src/main/java/com/policalum/erp/infrastructure/controller/PreformaController.java:109; backend/src/main/java/com/policalum/erp/infrastructure/controller/PreformaController.java:121; backend/src/main/java/com/policalum/erp/infrastructure/controller/PreformaController.java:135; backend/src/main/java/com/policalum/erp/infrastructure/controller/PreformaController.java:149; backend/src/main/java/com/policalum/erp/infrastructure/controller/PreformaController.java:166

## Casos de uso cotizaciones

- Fuente: [uso-cotizaciones.puml](uso-cotizaciones.puml)
- Imagen: [PNG](../imagenes/uso-cotizaciones.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:56; backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:70; backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:80; backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:109; backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:122; backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:136; backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:149; backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:155; backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:161; backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:167; backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:179; backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:190; backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:200; backend/src/main/java/com/policalum/erp/infrastructure/controller/PortalRecepcionController.java:53; backend/src/main/java/com/policalum/erp/infrastructure/controller/PortalRecepcionController.java:58; backend/src/main/java/com/policalum/erp/infrastructure/controller/PortalRecepcionController.java:64; backend/src/main/java/com/policalum/erp/infrastructure/controller/PortalRecepcionController.java:76

## Casos de uso devoluciones

- Fuente: [uso-devoluciones.puml](uso-devoluciones.puml)
- Imagen: [PNG](../imagenes/uso-devoluciones.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/DevolucionController.java:45; backend/src/main/java/com/policalum/erp/infrastructure/controller/DevolucionController.java:55; backend/src/main/java/com/policalum/erp/infrastructure/controller/DevolucionController.java:65; backend/src/main/java/com/policalum/erp/infrastructure/controller/DevolucionController.java:71; backend/src/main/java/com/policalum/erp/infrastructure/controller/DevolucionController.java:83; backend/src/main/java/com/policalum/erp/infrastructure/controller/DevolucionController.java:89; backend/src/main/java/com/policalum/erp/infrastructure/controller/DevolucionController.java:97

## Casos de uso reembolsos

- Fuente: [uso-reembolsos.puml](uso-reembolsos.puml)
- Imagen: [PNG](../imagenes/uso-reembolsos.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/ReembolsoController.java:42; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReembolsoController.java:52; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReembolsoController.java:64; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReembolsoController.java:70

## Casos de uso turnos-caja

- Fuente: [uso-turnos-caja.puml](uso-turnos-caja.puml)
- Imagen: [PNG](../imagenes/uso-turnos-caja.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoCajaController.java:31; backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoCajaController.java:32; backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoCajaController.java:33; backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoCajaController.java:36; backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoCajaController.java:43; backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoCajaController.java:44

## Casos de uso clientes

- Fuente: [uso-clientes.puml](uso-clientes.puml)
- Imagen: [PNG](../imagenes/uso-clientes.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/CanalWebController.java:153; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:41; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:56; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:72; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:84; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:96; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:114; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:135; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:142; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:151; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:167; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:185; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:192; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:199; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:206; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:215; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:230; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:141; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:152

## Casos de uso mensajes-web

- Fuente: [uso-mensajes-web.puml](uso-mensajes-web.puml)
- Imagen: [PNG](../imagenes/uso-mensajes-web.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/CanalWebController.java:49; backend/src/main/java/com/policalum/erp/infrastructure/controller/CanalWebController.java:56; backend/src/main/java/com/policalum/erp/infrastructure/controller/CanalWebController.java:61; backend/src/main/java/com/policalum/erp/infrastructure/controller/CanalWebController.java:66; backend/src/main/java/com/policalum/erp/infrastructure/controller/CanalWebController.java:72; backend/src/main/java/com/policalum/erp/infrastructure/controller/CanalWebController.java:78; backend/src/main/java/com/policalum/erp/infrastructure/controller/CanalWebController.java:85; backend/src/main/java/com/policalum/erp/infrastructure/controller/CanalWebController.java:92

## Casos de uso portafolio-web

- Fuente: [uso-portafolio-web.puml](uso-portafolio-web.puml)
- Imagen: [PNG](../imagenes/uso-portafolio-web.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: frontend/src/app/module.routes.ts:14

## Casos de uso gestor-web

- Fuente: [uso-gestor-web.puml](uso-gestor-web.puml)
- Imagen: [PNG](../imagenes/uso-gestor-web.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: frontend/src/app/module.routes.ts:14

## Casos de uso productos

- Fuente: [uso-productos.puml](uso-productos.puml)
- Imagen: [PNG](../imagenes/uso-productos.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/CatalogoFraccionController.java:70; backend/src/main/java/com/policalum/erp/infrastructure/controller/CmsController.java:79; backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:123; backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:167; backend/src/main/java/com/policalum/erp/infrastructure/controller/PortalPublicoController.java:80; backend/src/main/java/com/policalum/erp/infrastructure/controller/PortalPublicoController.java:89; backend/src/main/java/com/policalum/erp/infrastructure/controller/PortalPublicoController.java:98; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:68; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:84; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:93; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:105; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:113; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:126; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:152; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:165; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:177; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:186; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:193; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:205; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:211; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:106; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:116; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:127; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockController.java:48; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockController.java:55; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockController.java:64

## Casos de uso servicios

- Fuente: [uso-servicios.puml](uso-servicios.puml)
- Imagen: [PNG](../imagenes/uso-servicios.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/PortalPublicoController.java:65; backend/src/main/java/com/policalum/erp/infrastructure/controller/ServicioController.java:35; backend/src/main/java/com/policalum/erp/infrastructure/controller/ServicioController.java:55; backend/src/main/java/com/policalum/erp/infrastructure/controller/ServicioController.java:69; backend/src/main/java/com/policalum/erp/infrastructure/controller/ServicioController.java:84; backend/src/main/java/com/policalum/erp/infrastructure/controller/ServicioController.java:100; backend/src/main/java/com/policalum/erp/infrastructure/controller/ServicioController.java:110; backend/src/main/java/com/policalum/erp/infrastructure/controller/ServicioController.java:122; backend/src/main/java/com/policalum/erp/infrastructure/controller/ServicioImportacionController.java:27; backend/src/main/java/com/policalum/erp/infrastructure/controller/ServicioImportacionController.java:35

## Casos de uso categorias

- Fuente: [uso-categorias.puml](uso-categorias.puml)
- Imagen: [PNG](../imagenes/uso-categorias.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/CategoriaController.java:41; backend/src/main/java/com/policalum/erp/infrastructure/controller/CategoriaController.java:47; backend/src/main/java/com/policalum/erp/infrastructure/controller/CategoriaController.java:54; backend/src/main/java/com/policalum/erp/infrastructure/controller/CategoriaController.java:59; backend/src/main/java/com/policalum/erp/infrastructure/controller/CategoriaController.java:67; backend/src/main/java/com/policalum/erp/infrastructure/controller/CategoriaController.java:72; backend/src/main/java/com/policalum/erp/infrastructure/controller/CategoriaController.java:77; backend/src/main/java/com/policalum/erp/infrastructure/controller/CategoriaController.java:87; backend/src/main/java/com/policalum/erp/infrastructure/controller/CategoriaController.java:95; backend/src/main/java/com/policalum/erp/infrastructure/controller/PortalPublicoController.java:55

## Casos de uso catalogo-fracciones

- Fuente: [uso-catalogo-fracciones.puml](uso-catalogo-fracciones.puml)
- Imagen: [PNG](../imagenes/uso-catalogo-fracciones.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/CatalogoFraccionController.java:42; backend/src/main/java/com/policalum/erp/infrastructure/controller/CatalogoFraccionController.java:49; backend/src/main/java/com/policalum/erp/infrastructure/controller/CatalogoFraccionController.java:56; backend/src/main/java/com/policalum/erp/infrastructure/controller/CatalogoFraccionController.java:61; backend/src/main/java/com/policalum/erp/infrastructure/controller/CatalogoFraccionController.java:70; backend/src/main/java/com/policalum/erp/infrastructure/controller/CatalogoFraccionController.java:76; backend/src/main/java/com/policalum/erp/infrastructure/controller/CatalogoFraccionController.java:86; backend/src/main/java/com/policalum/erp/infrastructure/controller/CatalogoFraccionController.java:95

## Casos de uso almacenes

- Fuente: [uso-almacenes.puml](uso-almacenes.puml)
- Imagen: [PNG](../imagenes/uso-almacenes.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/AlmacenController.java:41; backend/src/main/java/com/policalum/erp/infrastructure/controller/AlmacenController.java:47; backend/src/main/java/com/policalum/erp/infrastructure/controller/AlmacenController.java:54; backend/src/main/java/com/policalum/erp/infrastructure/controller/AlmacenController.java:59; backend/src/main/java/com/policalum/erp/infrastructure/controller/AlmacenController.java:68; backend/src/main/java/com/policalum/erp/infrastructure/controller/AlmacenController.java:73; backend/src/main/java/com/policalum/erp/infrastructure/controller/AlmacenController.java:83; backend/src/main/java/com/policalum/erp/infrastructure/controller/AlmacenController.java:92

## Casos de uso stock

- Fuente: [uso-stock.puml](uso-stock.puml)
- Imagen: [PNG](../imagenes/uso-stock.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/ProductoController.java:113; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockController.java:39; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockController.java:48; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockController.java:55; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockController.java:64; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockController.java:69; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockOperacionController.java:47; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockOperacionController.java:57; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockOperacionController.java:71; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockOperacionController.java:81; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockOperacionController.java:94; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockOperacionController.java:100; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockOperacionController.java:110; backend/src/main/java/com/policalum/erp/infrastructure/controller/StockOperacionController.java:119

## Casos de uso kardex

- Fuente: [uso-kardex.puml](uso-kardex.puml)
- Imagen: [PNG](../imagenes/uso-kardex.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:55; backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:63; backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:71; backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:90; backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:105; backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:112; backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:123; backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:130; backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:141; backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:148; backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:155; backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:167; backend/src/main/java/com/policalum/erp/infrastructure/controller/KardexController.java:179

## Casos de uso despachos

- Fuente: [uso-despachos.puml](uso-despachos.puml)
- Imagen: [PNG](../imagenes/uso-despachos.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/OrdenDespachoController.java:58; backend/src/main/java/com/policalum/erp/infrastructure/controller/OrdenDespachoController.java:68; backend/src/main/java/com/policalum/erp/infrastructure/controller/OrdenDespachoController.java:77; backend/src/main/java/com/policalum/erp/infrastructure/controller/OrdenDespachoController.java:83; backend/src/main/java/com/policalum/erp/infrastructure/controller/OrdenDespachoController.java:91; backend/src/main/java/com/policalum/erp/infrastructure/controller/OrdenDespachoController.java:104; backend/src/main/java/com/policalum/erp/infrastructure/controller/OrdenDespachoController.java:110; backend/src/main/java/com/policalum/erp/infrastructure/controller/OrdenDespachoController.java:118; backend/src/main/java/com/policalum/erp/infrastructure/controller/OrdenDespachoController.java:129; backend/src/main/java/com/policalum/erp/infrastructure/controller/OrdenDespachoController.java:145

## Casos de uso movilidades

- Fuente: [uso-movilidades.puml](uso-movilidades.puml)
- Imagen: [PNG](../imagenes/uso-movilidades.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/MovilidadController.java:47; backend/src/main/java/com/policalum/erp/infrastructure/controller/MovilidadController.java:56; backend/src/main/java/com/policalum/erp/infrastructure/controller/MovilidadController.java:67; backend/src/main/java/com/policalum/erp/infrastructure/controller/MovilidadController.java:76; backend/src/main/java/com/policalum/erp/infrastructure/controller/MovilidadController.java:82; backend/src/main/java/com/policalum/erp/infrastructure/controller/MovilidadController.java:88; backend/src/main/java/com/policalum/erp/infrastructure/controller/MovilidadController.java:95; backend/src/main/java/com/policalum/erp/infrastructure/controller/MovilidadController.java:103; backend/src/main/java/com/policalum/erp/infrastructure/controller/MovilidadController.java:111

## Casos de uso compras

- Fuente: [uso-compras.puml](uso-compras.puml)
- Imagen: [PNG](../imagenes/uso-compras.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:151; backend/src/main/java/com/policalum/erp/infrastructure/controller/ClienteController.java:167; backend/src/main/java/com/policalum/erp/infrastructure/controller/CompraController.java:55; backend/src/main/java/com/policalum/erp/infrastructure/controller/CompraController.java:70; backend/src/main/java/com/policalum/erp/infrastructure/controller/CompraController.java:82; backend/src/main/java/com/policalum/erp/infrastructure/controller/CompraController.java:91; backend/src/main/java/com/policalum/erp/infrastructure/controller/CompraController.java:108; backend/src/main/java/com/policalum/erp/infrastructure/controller/CompraController.java:122; backend/src/main/java/com/policalum/erp/infrastructure/controller/CompraController.java:135; backend/src/main/java/com/policalum/erp/infrastructure/controller/CompraController.java:146; backend/src/main/java/com/policalum/erp/infrastructure/controller/CompraController.java:158; backend/src/main/java/com/policalum/erp/infrastructure/controller/CompraController.java:172; backend/src/main/java/com/policalum/erp/infrastructure/controller/CompraController.java:182; backend/src/main/java/com/policalum/erp/infrastructure/controller/CompraController.java:198; backend/src/main/java/com/policalum/erp/infrastructure/controller/CotizacionController.java:155; backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaPorPagarController.java:53

## Casos de uso proveedores

- Fuente: [uso-proveedores.puml](uso-proveedores.puml)
- Imagen: [PNG](../imagenes/uso-proveedores.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/ProveedorController.java:43; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProveedorController.java:49; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProveedorController.java:56; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProveedorController.java:61; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProveedorController.java:68; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProveedorController.java:78; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProveedorController.java:89; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProveedorController.java:94; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProveedorController.java:99; backend/src/main/java/com/policalum/erp/infrastructure/controller/ProveedorController.java:104; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:165; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:176

## Casos de uso finanzas

- Fuente: [uso-finanzas.puml](uso-finanzas.puml)
- Imagen: [PNG](../imagenes/uso-finanzas.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaFinancieraController.java:41; backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaFinancieraController.java:50; backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaFinancieraController.java:58; backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaFinancieraController.java:64; backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaFinancieraController.java:72; backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaFinancieraController.java:80; backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaFinancieraController.java:90; backend/src/main/java/com/policalum/erp/infrastructure/controller/FinanzasController.java:38; backend/src/main/java/com/policalum/erp/infrastructure/controller/FinanzasController.java:47; backend/src/main/java/com/policalum/erp/infrastructure/controller/FinanzasController.java:56; backend/src/main/java/com/policalum/erp/infrastructure/controller/FinanzasController.java:64; backend/src/main/java/com/policalum/erp/infrastructure/controller/FinanzasController.java:70; backend/src/main/java/com/policalum/erp/infrastructure/controller/FinanzasController.java:79; backend/src/main/java/com/policalum/erp/infrastructure/controller/FinanzasRetiroSocioController.java:44; backend/src/main/java/com/policalum/erp/infrastructure/controller/FinanzasRetiroSocioController.java:54; backend/src/main/java/com/policalum/erp/infrastructure/controller/FinanzasRetiroSocioController.java:63; backend/src/main/java/com/policalum/erp/infrastructure/controller/FinanzasRetiroSocioController.java:69; backend/src/main/java/com/policalum/erp/infrastructure/controller/FinanzasRetiroSocioController.java:82; backend/src/main/java/com/policalum/erp/infrastructure/controller/GastoEmpresarialController.java:35; backend/src/main/java/com/policalum/erp/infrastructure/controller/GastoEmpresarialController.java:44; backend/src/main/java/com/policalum/erp/infrastructure/controller/GastoEmpresarialController.java:50; backend/src/main/java/com/policalum/erp/infrastructure/controller/UtilidadNetaController.java:28; backend/src/main/java/com/policalum/erp/infrastructure/controller/UtilidadNetaController.java:37

## Casos de uso cuentas-por-pagar

- Fuente: [uso-cuentas-por-pagar.puml](uso-cuentas-por-pagar.puml)
- Imagen: [PNG](../imagenes/uso-cuentas-por-pagar.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaPorPagarController.java:31; backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaPorPagarController.java:41; backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaPorPagarController.java:46; backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaPorPagarController.java:53; backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaPorPagarController.java:58; backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaPorPagarController.java:64; backend/src/main/java/com/policalum/erp/infrastructure/controller/CuentaPorPagarController.java:71

## Casos de uso facturacion-electronica

- Fuente: [uso-facturacion-electronica.puml](uso-facturacion-electronica.puml)
- Imagen: [PNG](../imagenes/uso-facturacion-electronica.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/FacturacionElectronicaController.java:31; backend/src/main/java/com/policalum/erp/infrastructure/controller/FacturacionElectronicaController.java:36; backend/src/main/java/com/policalum/erp/infrastructure/controller/FacturacionElectronicaController.java:41

## Casos de uso rrhh

- Fuente: [uso-rrhh.puml](uso-rrhh.puml)
- Imagen: [PNG](../imagenes/uso-rrhh.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/ComisionController.java:41; backend/src/main/java/com/policalum/erp/infrastructure/controller/ComisionController.java:53; backend/src/main/java/com/policalum/erp/infrastructure/controller/ComisionController.java:63; backend/src/main/java/com/policalum/erp/infrastructure/controller/ComisionController.java:72; backend/src/main/java/com/policalum/erp/infrastructure/controller/ComisionController.java:79; backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:64; backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:77; backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:84; backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:91; backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:104; backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:111; backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:124; backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:134; backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:144; backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:151; backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:160; backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:174; backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:181; backend/src/main/java/com/policalum/erp/infrastructure/controller/LegajoController.java:193; backend/src/main/java/com/policalum/erp/infrastructure/controller/NominaController.java:53; backend/src/main/java/com/policalum/erp/infrastructure/controller/NominaController.java:70; backend/src/main/java/com/policalum/erp/infrastructure/controller/NominaController.java:81; backend/src/main/java/com/policalum/erp/infrastructure/controller/NominaController.java:97; backend/src/main/java/com/policalum/erp/infrastructure/controller/NominaController.java:108; backend/src/main/java/com/policalum/erp/infrastructure/controller/NominaController.java:121; backend/src/main/java/com/policalum/erp/infrastructure/controller/NominaController.java:134; backend/src/main/java/com/policalum/erp/infrastructure/controller/NominaController.java:148; backend/src/main/java/com/policalum/erp/infrastructure/controller/RegimenController.java:39; backend/src/main/java/com/policalum/erp/infrastructure/controller/RegimenController.java:45; backend/src/main/java/com/policalum/erp/infrastructure/controller/RegimenController.java:56; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:55; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:82; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:113; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:143; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:158; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:165; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:173; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:182; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:191; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:212; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:242; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:266; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:283; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:295; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:305; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:326; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:342; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:361; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:383; backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoTrabajoController.java:43; backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoTrabajoController.java:53; backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoTrabajoController.java:63; backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoTrabajoController.java:69; backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoTrabajoController.java:80; backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoTrabajoController.java:87; backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoTrabajoController.java:94; backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoTrabajoController.java:102

## Casos de uso reportes

- Fuente: [uso-reportes.puml](uso-reportes.puml)
- Imagen: [PNG](../imagenes/uso-reportes.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/MovilidadController.java:67; backend/src/main/java/com/policalum/erp/infrastructure/controller/RendimientoController.java:30; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:56; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:72; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:88; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:106; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:116; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:127; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:141; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:152; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:165; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:176; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:189; backend/src/main/java/com/policalum/erp/infrastructure/controller/ReporteController.java:201

## Casos de uso auditoria

- Fuente: [uso-auditoria.puml](uso-auditoria.puml)
- Imagen: [PNG](../imagenes/uso-auditoria.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/AuditoriaController.java:40; backend/src/main/java/com/policalum/erp/infrastructure/controller/AuditoriaController.java:52; backend/src/main/java/com/policalum/erp/infrastructure/controller/AuditoriaController.java:67; backend/src/main/java/com/policalum/erp/infrastructure/controller/AuditoriaController.java:78; backend/src/main/java/com/policalum/erp/infrastructure/controller/AuditoriaController.java:84; backend/src/main/java/com/policalum/erp/infrastructure/controller/AuditoriaController.java:90

## Casos de uso configuracion

- Fuente: [uso-configuracion.puml](uso-configuracion.puml)
- Imagen: [PNG](../imagenes/uso-configuracion.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/ConfiguracionController.java:52; backend/src/main/java/com/policalum/erp/infrastructure/controller/ConfiguracionController.java:58; backend/src/main/java/com/policalum/erp/infrastructure/controller/ConfiguracionController.java:65; backend/src/main/java/com/policalum/erp/infrastructure/controller/ConfiguracionController.java:71; backend/src/main/java/com/policalum/erp/infrastructure/controller/ConfiguracionController.java:78; backend/src/main/java/com/policalum/erp/infrastructure/controller/ConfiguracionController.java:84; backend/src/main/java/com/policalum/erp/infrastructure/controller/ConfiguracionController.java:91; backend/src/main/java/com/policalum/erp/infrastructure/controller/ConfiguracionController.java:98; backend/src/main/java/com/policalum/erp/infrastructure/controller/ConfiguracionController.java:105; backend/src/main/java/com/policalum/erp/infrastructure/controller/ConfiguracionController.java:112; backend/src/main/java/com/policalum/erp/infrastructure/controller/ConfiguracionController.java:125; backend/src/main/java/com/policalum/erp/infrastructure/controller/ConfiguracionController.java:130

## Casos de uso sedes

- Fuente: [uso-sedes.puml](uso-sedes.puml)
- Imagen: [PNG](../imagenes/uso-sedes.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/AlmacenController.java:68; backend/src/main/java/com/policalum/erp/infrastructure/controller/PortalPublicoController.java:60; backend/src/main/java/com/policalum/erp/infrastructure/controller/SedeController.java:37; backend/src/main/java/com/policalum/erp/infrastructure/controller/SedeController.java:44; backend/src/main/java/com/policalum/erp/infrastructure/controller/SedeController.java:50; backend/src/main/java/com/policalum/erp/infrastructure/controller/SedeController.java:57; backend/src/main/java/com/policalum/erp/infrastructure/controller/SedeController.java:62; backend/src/main/java/com/policalum/erp/infrastructure/controller/SedeController.java:74; backend/src/main/java/com/policalum/erp/infrastructure/controller/SedeController.java:79; backend/src/main/java/com/policalum/erp/infrastructure/controller/SedeController.java:85; backend/src/main/java/com/policalum/erp/infrastructure/controller/SedeController.java:94

## Casos de uso users

- Fuente: [uso-users.puml](uso-users.puml)
- Imagen: [PNG](../imagenes/uso-users.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/AuditoriaController.java:67; backend/src/main/java/com/policalum/erp/infrastructure/controller/ComisionController.java:63; backend/src/main/java/com/policalum/erp/infrastructure/controller/OrdenDespachoController.java:83; backend/src/main/java/com/policalum/erp/infrastructure/controller/TurnoTrabajoController.java:80; backend/src/main/java/com/policalum/erp/infrastructure/controller/UserController.java:37; backend/src/main/java/com/policalum/erp/infrastructure/controller/UserController.java:44; backend/src/main/java/com/policalum/erp/infrastructure/controller/UserController.java:50; backend/src/main/java/com/policalum/erp/infrastructure/controller/UserController.java:58; backend/src/main/java/com/policalum/erp/infrastructure/controller/UserController.java:67

## Casos de uso roles

- Fuente: [uso-roles.puml](uso-roles.puml)
- Imagen: [PNG](../imagenes/uso-roles.png)
- Objetivo: Mostrar operaciones declaradas por modulo
- Descripcion y funcionamiento: Asociacion a ADMIN representa acceso administrativo por diseno. Agrupacion lexica candidata: no inventa endpoint; consultar inventario para operaciones transversales y permisos exactos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/RolController.java:39; backend/src/main/java/com/policalum/erp/infrastructure/controller/RolController.java:45; backend/src/main/java/com/policalum/erp/infrastructure/controller/RolController.java:51; backend/src/main/java/com/policalum/erp/infrastructure/controller/RolController.java:56; backend/src/main/java/com/policalum/erp/infrastructure/controller/RolController.java:61; backend/src/main/java/com/policalum/erp/infrastructure/controller/RolController.java:69

## Casos de uso portal

- Fuente: [uso-publico.puml](uso-publico.puml)
- Imagen: [PNG](../imagenes/uso-publico.png)
- Objetivo: Representar la implementacion actual
- Descripcion y funcionamiento: Las relaciones y operaciones proceden de las evidencias indicadas; no acredita ejecucion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/PortalPublicoController.java:80; sitio_web/src/app/core/cms.store.ts:65

## Inicio de sesion

- Fuente: [actividad-login.puml](actividad-login.puml)
- Imagen: [PNG](../imagenes/actividad-login.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/AuthService.java:39

## Autenticacion y autorizacion

- Fuente: [actividad-autorizacion.puml](actividad-autorizacion.puml)
- Imagen: [PNG](../imagenes/actividad-autorizacion.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/security/JwtAuthenticationFilter.java:29

## Registro de productos

- Fuente: [actividad-producto.puml](actividad-producto.puml)
- Imagen: [PNG](../imagenes/actividad-producto.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:75

## Asignacion producto almacen sede

- Fuente: [actividad-asignacion.puml](actividad-asignacion.puml)
- Imagen: [PNG](../imagenes/actividad-asignacion.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:225

## Entrada de inventario

- Fuente: [actividad-entrada.puml](actividad-entrada.puml)
- Imagen: [PNG](../imagenes/actividad-entrada.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:89

## Salida de inventario

- Fuente: [actividad-salida.puml](actividad-salida.puml)
- Imagen: [PNG](../imagenes/actividad-salida.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:89

## Transferencia entre almacenes

- Fuente: [actividad-transferencia.puml](actividad-transferencia.puml)
- Imagen: [PNG](../imagenes/actividad-transferencia.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:166

## Compra de productos

- Fuente: [actividad-compra.puml](actividad-compra.puml)
- Imagen: [PNG](../imagenes/actividad-compra.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:60

## Venta de productos

- Fuente: [actividad-venta.puml](actividad-venta.puml)
- Imagen: [PNG](../imagenes/actividad-venta.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:45

## Apertura y cierre de caja

- Fuente: [actividad-caja.puml](actividad-caja.puml)
- Imagen: [PNG](../imagenes/actividad-caja.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:43

## Registro de asistencia QR

- Fuente: [actividad-qr.puml](actividad-qr.puml)
- Imagen: [PNG](../imagenes/actividad-qr.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: MODELO PARCIAL: muestra frontera confirmada; validaciones internas pendientes.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:165

## Registro manual de asistencia

- Fuente: [actividad-manual.puml](actividad-manual.puml)
- Imagen: [PNG](../imagenes/actividad-manual.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: MODELO PARCIAL: muestra frontera confirmada; validaciones internas pendientes.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:191

## Administracion de legajos

- Fuente: [actividad-legajo.puml](actividad-legajo.puml)
- Imagen: [PNG](../imagenes/actividad-legajo.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:73

## Calculo de remuneraciones

- Fuente: [actividad-remuneracion.puml](actividad-remuneracion.puml)
- Imagen: [PNG](../imagenes/actividad-remuneracion.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:81

## Asignacion colaboradores a servicios

- Fuente: [actividad-colaboradores.puml](actividad-colaboradores.puml)
- Imagen: [PNG](../imagenes/actividad-colaboradores.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:124

## Registro de gastos

- Fuente: [actividad-gastos.puml](actividad-gastos.puml)
- Imagen: [PNG](../imagenes/actividad-gastos.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: MODELO PARCIAL: muestra frontera confirmada; validaciones internas pendientes.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/GastoEmpresarialServiceImpl.java:1

## Generacion de reportes

- Fuente: [actividad-reportes.puml](actividad-reportes.puml)
- Imagen: [PNG](../imagenes/actividad-reportes.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:1

## Publicacion de productos sitio web

- Fuente: [actividad-publicacion.puml](actividad-publicacion.puml)
- Imagen: [PNG](../imagenes/actividad-publicacion.png)
- Objetivo: Mostrar pasos y decisiones del proceso
- Descripcion y funcionamiento: Resumen estatico: los pasos son ordenados por implementacion, excepciones interrumpen el flujo en el paso correspondiente. No prueba comportamiento concurrente.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:57

## Login

- Fuente: [secuencia-login.puml](secuencia-login.puml)
- Imagen: [PNG](../imagenes/secuencia-login.png)
- Objetivo: Mostrar interaccion confirmada sin componentes inventados
- Descripcion y funcionamiento: Secuencia de frontera y resumen de persistencia, no traza completa de cada repositorio. No se agrega PostgreSQL como participante: acceso fisico no observado. Usuario representa iniciador; componente exacto pendiente de enlace para algunas operaciones.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: frontend/src/app/services/auth.service.ts:23; backend/src/main/java/com/policalum/erp/application/service/AuthService.java:39

## Consulta productos

- Fuente: [secuencia-productos-consulta.puml](secuencia-productos-consulta.puml)
- Imagen: [PNG](../imagenes/secuencia-productos-consulta.png)
- Objetivo: Mostrar interaccion confirmada sin componentes inventados
- Descripcion y funcionamiento: Secuencia de frontera y resumen de persistencia, no traza completa de cada repositorio. No se agrega PostgreSQL como participante: acceso fisico no observado. Usuario representa iniciador; componente exacto pendiente de enlace para algunas operaciones.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: frontend/src/app/features/productos/data-access/productos.api.ts:12; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:130

## Registro productos

- Fuente: [secuencia-productos-registro.puml](secuencia-productos-registro.puml)
- Imagen: [PNG](../imagenes/secuencia-productos-registro.png)
- Objetivo: Mostrar interaccion confirmada sin componentes inventados
- Descripcion y funcionamiento: Secuencia de frontera y resumen de persistencia, no traza completa de cada repositorio. No se agrega PostgreSQL como participante: acceso fisico no observado. Usuario representa iniciador; componente exacto pendiente de enlace para algunas operaciones.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: frontend/src/app/features/productos/data-access/productos.api.ts:16; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:75

## Consulta stock por sede

- Fuente: [secuencia-stock-sede.puml](secuencia-stock-sede.puml)
- Imagen: [PNG](../imagenes/secuencia-stock-sede.png)
- Objetivo: Mostrar interaccion confirmada sin componentes inventados
- Descripcion y funcionamiento: Secuencia de frontera y resumen de persistencia, no traza completa de cada repositorio. No se agrega PostgreSQL como participante: acceso fisico no observado. Usuario representa iniciador; componente exacto pendiente de enlace para algunas operaciones.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: frontend/src/app/features/stock/data-access/stock.api.ts:18; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:262

## Transferencia inventario

- Fuente: [secuencia-transferencia.puml](secuencia-transferencia.puml)
- Imagen: [PNG](../imagenes/secuencia-transferencia.png)
- Objetivo: Mostrar interaccion confirmada sin componentes inventados
- Descripcion y funcionamiento: Secuencia de frontera y resumen de persistencia, no traza completa de cada repositorio. No se agrega PostgreSQL como participante: acceso fisico no observado. Usuario representa iniciador; componente exacto pendiente de enlace para algunas operaciones.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: frontend/src/app/features/stock/data-access/stock.api.ts:21; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:166

## Registro venta

- Fuente: [secuencia-venta.puml](secuencia-venta.puml)
- Imagen: [PNG](../imagenes/secuencia-venta.png)
- Objetivo: Mostrar interaccion confirmada sin componentes inventados
- Descripcion y funcionamiento: Secuencia de frontera y resumen de persistencia, no traza completa de cada repositorio. No se agrega PostgreSQL como participante: acceso fisico no observado. Usuario representa iniciador; componente exacto pendiente de enlace para algunas operaciones.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: frontend/src/app/features/ventas/data-access/ventas.api.ts:1; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:45

## Registro compra

- Fuente: [secuencia-compra.puml](secuencia-compra.puml)
- Imagen: [PNG](../imagenes/secuencia-compra.png)
- Objetivo: Mostrar interaccion confirmada sin componentes inventados
- Descripcion y funcionamiento: Secuencia de frontera y resumen de persistencia, no traza completa de cada repositorio. No se agrega PostgreSQL como participante: acceso fisico no observado. Usuario representa iniciador; componente exacto pendiente de enlace para algunas operaciones.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: frontend/src/app/features/compras/data-access/compras.api.ts:1; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:60

## Registro asistencia QR

- Fuente: [secuencia-asistencia-qr.puml](secuencia-asistencia-qr.puml)
- Imagen: [PNG](../imagenes/secuencia-asistencia-qr.png)
- Objetivo: Mostrar interaccion confirmada sin componentes inventados
- Descripcion y funcionamiento: Secuencia de frontera y resumen de persistencia, no traza completa de cada repositorio. No se agrega PostgreSQL como participante: acceso fisico no observado. Usuario representa iniciador; componente exacto pendiente de enlace para algunas operaciones.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: frontend/src/app/services/asistencia.service.ts:1; backend/src/main/java/com/policalum/erp/infrastructure/controller/RrhhAsistenciaController.java:165

## Consulta legajo propio

- Fuente: [secuencia-legajo.puml](secuencia-legajo.puml)
- Imagen: [PNG](../imagenes/secuencia-legajo.png)
- Objetivo: Mostrar interaccion confirmada sin componentes inventados
- Descripcion y funcionamiento: Secuencia de frontera y resumen de persistencia, no traza completa de cada repositorio. No se agrega PostgreSQL como participante: acceso fisico no observado. Usuario representa iniciador; componente exacto pendiente de enlace para algunas operaciones.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: frontend/src/app/features/rrhh/data-access/rrhh.api.ts:35; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:111

## Registro remuneraciones

- Fuente: [secuencia-remuneraciones.puml](secuencia-remuneraciones.puml)
- Imagen: [PNG](../imagenes/secuencia-remuneraciones.png)
- Objetivo: Mostrar interaccion confirmada sin componentes inventados
- Descripcion y funcionamiento: Secuencia de frontera y resumen de persistencia, no traza completa de cada repositorio. No se agrega PostgreSQL como participante: acceso fisico no observado. Usuario representa iniciador; componente exacto pendiente de enlace para algunas operaciones.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: frontend/src/app/features/rrhh/data-access/rrhh.api.ts:44; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:81

## Validacion JWT

- Fuente: [secuencia-jwt.puml](secuencia-jwt.puml)
- Imagen: [PNG](../imagenes/secuencia-jwt.png)
- Objetivo: Mostrar validacion JWT real
- Descripcion y funcionamiento: Cache y denylist son participantes reales. Sin Bearer continua cadena; SecurityConfig decide si exige autenticacion. Token query solo en eventos canal-web.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/infrastructure/security/JwtAuthenticationFilter.java:35

## Componentes

- Fuente: [componentes.puml](componentes.puml)
- Imagen: [PNG](../imagenes/componentes.png)
- Objetivo: Mostrar limites de componentes
- Descripcion y funcionamiento: No microservicios demostrados: monolito backend con dos aplicaciones cliente. Seguridad de metodos tambien intercepta invocaciones.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/pom.xml:28; frontend/src/app/core/api/backend-api.service.ts:45; sitio_web/src/app/core/cms.store.ts:66

## Despliegue configurado no observado

- Fuente: [despliegue.puml](despliegue.puml)
- Imagen: [PNG](../imagenes/despliegue.png)
- Objetivo: Distinguir configuracion de infraestructura observada
- Descripcion y funcionamiento: No se inicio ni inspecciono infraestructura activa. Puertos efectivos quedan pendientes; inventario describe nombres no valores.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/pom.xml:20; backend/pom.xml:88; inventarios/configuracion.md

## Paquetes backend

- Fuente: [paquetes.puml](paquetes.puml)
- Imagen: [PNG](../imagenes/paquetes.png)
- Objetivo: Mostrar dependencias observadas
- Descripcion y funcionamiento: La aplicacion importa repositorios infrastructure: no Clean Architecture estricta. Dominio usa JPA/Hibernate. No se acredita ausencia de ciclos.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/AuthService.java:8; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:35; inventarios/dependencias-paquetes.md

## Estados nomina

- Fuente: [estados-nomina.puml](estados-nomina.puml)
- Imagen: [PNG](../imagenes/estados-nomina.png)
- Objetivo: Representar la implementacion actual
- Descripcion y funcionamiento: Las relaciones y operaciones proceden de las evidencias indicadas; no acredita ejecucion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:159; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:179; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:253

## Estados compra

- Fuente: [estados-compra.puml](estados-compra.puml)
- Imagen: [PNG](../imagenes/estados-compra.png)
- Objetivo: Representar la implementacion actual
- Descripcion y funcionamiento: Las relaciones y operaciones proceden de las evidencias indicadas; no acredita ejecucion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:85; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:112; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:333

## Estados venta

- Fuente: [estados-venta.puml](estados-venta.puml)
- Imagen: [PNG](../imagenes/estados-venta.png)
- Objetivo: Representar la implementacion actual
- Descripcion y funcionamiento: Las relaciones y operaciones proceden de las evidencias indicadas; no acredita ejecucion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:68; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:113

## Estados turno caja

- Fuente: [estados-caja.puml](estados-caja.puml)
- Imagen: [PNG](../imagenes/estados-caja.png)
- Objetivo: Representar la implementacion actual
- Descripcion y funcionamiento: Las relaciones y operaciones proceden de las evidencias indicadas; no acredita ejecucion.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:43; backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:54

## Estados producto

- Fuente: [estados-producto.puml](estados-producto.puml)
- Imagen: [PNG](../imagenes/estados-producto.png)
- Objetivo: Mostrar borrado logico y fisico
- Descripcion y funcionamiento: Activo/Inactivo representan boolean persistido, no enum inventado. Transiciones de update no se dibujan como politica editorial.
- Participantes: declarados explicitamente en la fuente.
- Evidencias: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:162


## Flujo general empresarial y arquitectura

- Imagen principal: [PNG en raiz](../FLUJO_GENERAL_POLICALUM.png)
- Imagen en carpeta: [PNG](../imagenes/FLUJO_GENERAL_POLICALUM.png)
- Fuente: [PlantUML](FLUJO_GENERAL_POLICALUM.puml)
- Objetivo: integrar ramas comerciales, abastecimiento, caja, RRHH, servicios y consultas sin inventar automatizaciones.
- Evidencias: VERIFICACIONES.md contiene clases y rangos cotejados; codigo bajo backend/src/main/java/com/policalum/erp/application/service/serviceImpl/.
- Alcance: lectura estatica focal, no prueba operativa ni catalogo fisico de PostgreSQL. Flechas representan llamadas, requisitos o lecturas segun etiqueta.
