# transacciones-procesos

No se inicio Spring, schedulers ni listeners. readOnly es declaracion, no garantia de conexion de auditoria segura.

| Anotacion | Parametros | Evidencia |
| --- | --- | --- |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/AuthService.java:38 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/AuthService.java:61 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/AuthService.java:83 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/AuthService.java:95 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:26 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:52 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:58 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:68 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:90 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:98 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditoriaServiceImpl.java:50 |
| Transactional | propagation = Propagation.REQUIRES_NEW | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditServiceImpl.java:42 |
| Transactional | propagation = Propagation.REQUIRES_NEW | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditServiceImpl.java:63 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditServiceImpl.java:72 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CajaChicaServiceImpl.java:28 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CajaChicaServiceImpl.java:41 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:30 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:60 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:66 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:77 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:100 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:109 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:26 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:56 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:62 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:72 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:81 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:104 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:112 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:37 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:56 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:61 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:69 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:77 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:82 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:87 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:100 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:110 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:118 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:126 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:134 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:232 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:240 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:256 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:266 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:274 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:282 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:30 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:72 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:80 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:109 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:122 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:130 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:138 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:149 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:159 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:169 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:179 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:185 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:191 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:199 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:206 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:221 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:235 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:241 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:247 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:71 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:121 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:145 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:154 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:207 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:212 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:217 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ComisionServiceImpl.java:46 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ComisionServiceImpl.java:166 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ComisionServiceImpl.java:174 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ComisionServiceImpl.java:184 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraAdjuntoServiceImpl.java:33 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraAdjuntoServiceImpl.java:79 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraAdjuntoServiceImpl.java:86 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:36 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:178 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:189 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:264 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:74 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:113 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:153 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:226 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:239 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:266 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:273 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:280 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:287 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:294 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:406 |
| Transactional | propagation = Propagation.MANDATORY | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CorrelativoServiceImpl.java:20 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionDocumentoService.java:35 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionDocumentoService.java:44 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:33 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:109 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:115 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:126 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:196 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:202 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:286 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:301 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:45 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:95 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:103 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:154 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:39 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:49 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:57 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:132 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:141 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:149 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:162 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DashboardFinancieroServiceImpl.java:58 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:65 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:161 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:169 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:178 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:270 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/EnvioPushService.java:37 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/EnvioPushService.java:42 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/EnvioPushService.java:54 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:82 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FacturacionElectronicaServiceImpl.java:25 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FlujoCajaServiceImpl.java:55 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FormatoCotizacionService.java:46 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FormatoCotizacionService.java:67 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FormatoCotizacionService.java:85 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FormatoCotizacionService.java:120 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/GastoEmpresarialServiceImpl.java:29 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/GastoEmpresarialServiceImpl.java:47 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/GastoEmpresarialServiceImpl.java:54 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:38 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:124 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:134 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:94 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:153 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:159 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:213 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:228 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:237 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:244 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:251 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:260 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:269 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:276 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:285 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:307 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:331 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:52 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:103 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:110 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:151 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:200 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:210 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:248 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:25 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:66 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:74 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:79 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:84 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:92 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:100 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:108 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:115 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:51 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:84 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:92 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:162 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:170 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:196 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCajaCalculator.java:55 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:55 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:144 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:152 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:211 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:267 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:30 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:36 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:44 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:58 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:67 |
| Scheduled | cron = "0 20 3 * * *" | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:68 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:73 |
| Scheduled | fixedDelay = 120_000, initialDelay = 15_000 | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:74 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:57 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:118 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:124 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:133 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:270 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:283 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:290 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PedidoWhatsappService.java:30 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:62 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:67 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:90 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:124 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:132 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:142 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:158 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:173 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:43 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:29 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:34 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:43 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:51 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:45 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:71 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:56 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:101 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:108 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:57 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:120 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:129 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:144 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:179 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:193 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:28 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:54 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:60 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:85 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:95 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:101 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:107 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:115 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:127 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:138 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReembolsoServiceImpl.java:46 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReembolsoServiceImpl.java:108 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReembolsoServiceImpl.java:115 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:59 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:78 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:129 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:274 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:93 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:49 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:125 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:132 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:193 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RolImpl.java:22 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RolImpl.java:31 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RolImpl.java:52 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RolImpl.java:67 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RolImpl.java:86 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:72 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:151 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:298 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:311 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:454 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:513 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:557 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:38 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:76 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:108 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:116 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:135 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioImportacionServiceImpl.java:41 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:40 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:53 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:73 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:83 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:101 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:112 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:64 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:153 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:220 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:231 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:248 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:261 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:270 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockServiceImpl.java:42 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockServiceImpl.java:53 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockServiceImpl.java:62 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockServiceImpl.java:70 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockServiceImpl.java:174 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:42 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:53 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:70 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:77 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:53 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:88 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:138 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:183 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:193 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UserImpl.java:63 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UserImpl.java:91 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UserImpl.java:102 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UserImpl.java:111 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UserImpl.java:169 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UtilidadNetaServiceImpl.java:38 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:44 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:94 |
| Transactional | readOnly = true | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:101 |
| Transactional | rollbackFor = Exception.class | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:113 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/TotpConfigService.java:25 |
| Transactional | default | backend/src/main/java/com/policalum/erp/application/service/TotpConfigService.java:52 |
| Scheduled | fixedDelayString = "${policalum.preformas.expiracion-ms:300000}",                initialDelayString = "${policalum.preformas.expiracion-delay-ms:60000}" | backend/src/main/java/com/policalum/erp/infrastructure/config/PreformaExpiracionScheduler.java:23 |
| Transactional | default | backend/src/main/java/com/policalum/erp/infrastructure/loader/CatalogoSeeder.java:60 |
| Transactional | default | backend/src/main/java/com/policalum/erp/infrastructure/loader/DataLoader.java:40 |
