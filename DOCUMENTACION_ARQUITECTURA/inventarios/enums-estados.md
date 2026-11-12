# enums-estados

Enumeraciones no equivalen a transiciones. Algunas incluyen constructores; consultar fuente.

| Enum | Valores declarados | Evidencia |
| --- | --- | --- |
| AccionAudit |  INSERT, UPDATE, DELETE, LOGIN, LOGOUT, ACCESS }  | backend/src/main/java/com/policalum/erp/domain/enums/AccionAudit.java:3 |
| AgrupacionReporte |  DIA, SEMANA, MES }  | backend/src/main/java/com/policalum/erp/domain/enums/AgrupacionReporte.java:4 |
| AmbitoPoliticaRemuneracion |  EMPLEADO, SEDE, EMPRESA }  | backend/src/main/java/com/policalum/erp/domain/enums/AmbitoPoliticaRemuneracion.java:10 |
| AutorChat |  CLIENTE, EQUIPO }  | backend/src/main/java/com/policalum/erp/domain/enums/AutorChat.java:3 |
| BaseRepartoUtilidad |  UTILIDAD_NETA, VENTAS_NETAS, MARGEN_BRUTO }  | backend/src/main/java/com/policalum/erp/domain/enums/BaseRepartoUtilidad.java:10 |
| CanalCotizacion |  INTERNO, WEB }  | backend/src/main/java/com/policalum/erp/domain/enums/CanalCotizacion.java:4 |
| CanalVenta |  LOCAL, ONLINE }  | backend/src/main/java/com/policalum/erp/domain/enums/CanalVenta.java:3 |
| ClienteTipoDocumentoEnum |  DNI, RUC, CE, PASAPORTE }  | backend/src/main/java/com/policalum/erp/domain/enums/ClienteTipoDocumentoEnum.java:3 |
| ConceptoCajaChica |  TRANSPORTE, SUMINISTRO, OFICINA, OTRO }  | backend/src/main/java/com/policalum/erp/domain/enums/ConceptoCajaChica.java:3 |
| CriterioRankingCliente |  CANTIDAD, MONTO, FRECUENCIA }  | backend/src/main/java/com/policalum/erp/domain/enums/CriterioRankingCliente.java:4 |
| CriterioRankingProducto |  CANTIDAD, INGRESO, MARGEN }  | backend/src/main/java/com/policalum/erp/domain/enums/CriterioRankingProducto.java:4 |
| CriterioRankingProveedor |  VOLUMEN, FRECUENCIA, ENTREGA }  | backend/src/main/java/com/policalum/erp/domain/enums/CriterioRankingProveedor.java:4 |
| EstadoAsistencia |  PENDIENTE, PRESENTE, TARDANZA, AUSENTE }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoAsistencia.java:3 |
| EstadoComision |  CALCULADA, APROBADA, LIQUIDADA }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoComision.java:4 |
| EstadoCompra |  BORRADOR, RECIBIDA, ANULADA } | backend/src/main/java/com/policalum/erp/domain/enums/EstadoCompra.java:3 |
| EstadoCotizacion |  PENDIENTE, EMITIDA, ACEPTADA, RECHAZADA, NO_COMPRADO, VENCIDA, CONVERTIDA }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoCotizacion.java:3 |
| EstadoCxP |  PENDIENTE, PAGADO_PARCIAL, PAGADO }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoCxP.java:3 |
| EstadoDespacho |  PENDIENTE, EN_CAMINO, ENTREGADO, FALLIDO }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoDespacho.java:3 |
| EstadoDevolucion |  PENDIENTE, APROBADA, RECHAZADA }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoDevolucion.java:3 |
| EstadoMensajeWeb |  NUEVO, GESTIONADO }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoMensajeWeb.java:3 |
| EstadoNomina |  PENDIENTE, APROBADA, PAGADA }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoNomina.java:3 |
| EstadoPago |  PENDIENTE, PAGADO_PARCIAL, PAGADO }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoPago.java:3 |
| EstadoPreforma |  ABIERTA, CONFIRMADA, CANCELADA, EXPIRADA }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoPreforma.java:3 |
| EstadoProducto |  BUENO, DAÑADO, USADO }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoProducto.java:3 |
| EstadoRecepcion |  PENDIENTE, RECIBIDO_PARCIAL, RECIBIDO }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoRecepcion.java:3 |
| EstadoReembolso |  PENDIENTE, PROCESADO }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoReembolso.java:3 |
| EstadoRetiro |  REGISTRADO, ANULADO }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoRetiro.java:3 |
| EstadoSunat |  PENDIENTE, ACEPTADO, RECHAZADO, ANULADO }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoSunat.java:3 |
| EstadoTurno |  ABIERTO, CERRADO }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoTurno.java:3 |
| EstadoVenta |  COMPLETADA, ANULADA }  | backend/src/main/java/com/policalum/erp/domain/enums/EstadoVenta.java:3 |
| MetodoPago |  EFECTIVO, YAPE, PLIN, SIP_AGORA, TARJETA, TRANSFERENCIA }  | backend/src/main/java/com/policalum/erp/domain/enums/MetodoPago.java:3 |
| MetodoReembolso |  EFECTIVO, YAPE, PLIN, TARJETA, TRANSFERENCIA }  | backend/src/main/java/com/policalum/erp/domain/enums/MetodoReembolso.java:3 |
| Moneda |  PEN, USD, EUR } | backend/src/main/java/com/policalum/erp/domain/enums/Moneda.java:3 |
| OrigenFondos |  CAJA_FISICA, CUENTA_BANCARIA }  | backend/src/main/java/com/policalum/erp/domain/enums/OrigenFondos.java:3 |
| PoliticaDivisionSueldo |  DIAS_30, DIAS_CALENDARIO, DIAS_LABORABLES | backend/src/main/java/com/policalum/erp/domain/enums/PoliticaDivisionSueldo.java:12 |
| ResultadoArqueo |  ABIERTO, CUADRADO, FALTANTE, SOBRANTE, SIN_DECLARAR }  | backend/src/main/java/com/policalum/erp/domain/enums/ResultadoArqueo.java:4 |
| RolNombre |  ROLE_ADMIN, ROLE_MULTIFUNCIONAL }  | backend/src/main/java/com/policalum/erp/domain/enums/RolNombre.java:3 |
| SistemaPension |  ONP, AFP, NINGUNO }  | backend/src/main/java/com/policalum/erp/domain/enums/SistemaPension.java:4 |
| TipoCajaChica |  INGRESO, EGRESO }  | backend/src/main/java/com/policalum/erp/domain/enums/TipoCajaChica.java:3 |
| TipoCargoCotizacion |  MONTO, PORCENTAJE }  | backend/src/main/java/com/policalum/erp/domain/enums/TipoCargoCotizacion.java:3 |
| TipoComprobante |  BOLETA, FACTURA, TICKET }  | backend/src/main/java/com/policalum/erp/domain/enums/TipoComprobante.java:3 |
| TipoCuentaFinanciera |  EFECTIVO, BANCO, BILLETERA_DIGITAL }  | backend/src/main/java/com/policalum/erp/domain/enums/TipoCuentaFinanciera.java:4 |
| TipoDocumentoLegajo |  CONTRATO, DNI, CV, CERTIFICADO_ESTUDIOS, CERTIFICADO_TRABAJO, ANTECEDENTES_POLICIALES, OTRO }  | backend/src/main/java/com/policalum/erp/domain/enums/TipoDocumentoLegajo.java:3 |
| TipoGastoEmpresarial |  ALQUILER, AGUA, LUZ, PERSONAL, OTRO }  | backend/src/main/java/com/policalum/erp/domain/enums/TipoGastoEmpresarial.java:3 |
| TipoMarcacion |  ENTRADA, SALIDA, INICIO_RECESO, FIN_RECESO } | backend/src/main/java/com/policalum/erp/domain/enums/TipoMarcacion.java:3 |
| TipoMovilidad |  MOTO, AUTO, CAMIONETA, CAMION }  | backend/src/main/java/com/policalum/erp/domain/enums/TipoMovilidad.java:4 |
| TipoMovimiento |  ENTRADA, SALIDA }  | backend/src/main/java/com/policalum/erp/domain/enums/TipoMovimiento.java:3 |
| TipoProducto |  FISICO, SERVICIO }  | backend/src/main/java/com/policalum/erp/domain/enums/TipoProducto.java:3 |
| TipoReferencia |  VENTA, COMPRA, AJUSTE, MERMA, TRANSFERENCIA, DEVOLUCION, APERTURA } | backend/src/main/java/com/policalum/erp/domain/enums/TipoReferencia.java:3 |
| TipoReferenciaCxP |  COMPRA, PLANILLA, SERVICIO, OTRO }  | backend/src/main/java/com/policalum/erp/domain/enums/TipoReferenciaCxP.java:3 |
| TratamientoAusencias |  NO_AFECTA, DESCUENTO_DIAS_SIN_MARCACION | backend/src/main/java/com/policalum/erp/domain/enums/TratamientoAusencias.java:16 |
| creci |  private static final String ESTADOS = "'PENDIENTE','EMITIDA','ACEPTADA','RECHAZADA','NO_COMPRADO','VENCIDA','CONVERTIDA'" | backend/src/main/java/com/policalum/erp/infrastructure/loader/CotizacionEsquemaInicializador.java:13 |
