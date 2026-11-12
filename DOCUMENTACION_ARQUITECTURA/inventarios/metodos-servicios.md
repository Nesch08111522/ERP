# metodos-servicios

Metodos con cuerpo extraidos; las firmas de interfaces se inventarian por archivo y declaracion. Regex no es compilador Java.

| Clase | Metodo | Parametros | Evidencia |
| --- | --- | --- | --- |
| AtencionHorario | evaluar | List<DiaAtencionDTO> dias, LocalDateTime ahora | backend/src/main/java/com/policalum/erp/application/service/AtencionHorario.java:16 |
| AtencionHorario | clave | DayOfWeek dia | backend/src/main/java/com/policalum/erp/application/service/AtencionHorario.java:41 |
| AtencionHorario | enBlanco | String valor | backend/src/main/java/com/policalum/erp/application/service/AtencionHorario.java:53 |
| AtencionHorario | frase | String dia, String verbo, String rango, String cierre | backend/src/main/java/com/policalum/erp/application/service/AtencionHorario.java:57 |
| AtencionHorario | nombre | String clave | backend/src/main/java/com/policalum/erp/application/service/AtencionHorario.java:69 |
| AuthService | login | LoginRequestDTO request, String ip | backend/src/main/java/com/policalum/erp/application/service/AuthService.java:39 |
| AuthService | refrescar | String refreshToken | backend/src/main/java/com/policalum/erp/application/service/AuthService.java:62 |
| AuthService | cerrarSesion | String refreshToken, String accessToken | backend/src/main/java/com/policalum/erp/application/service/AuthService.java:84 |
| AuthService | reemplazarRefresh | User user | backend/src/main/java/com/policalum/erp/application/service/AuthService.java:96 |
| AuthService | respuesta | User user | backend/src/main/java/com/policalum/erp/application/service/AuthService.java:102 |
| AuthService | emitirRefresh | User user | backend/src/main/java/com/policalum/erp/application/service/AuthService.java:122 |
| AuthService | hash | String raw | backend/src/main/java/com/policalum/erp/application/service/AuthService.java:135 |
| AuthService | isUserActive | UUID userId | backend/src/main/java/com/policalum/erp/application/service/AuthService.java:145 |
| AuthService | existsActiveUserByEmail | String email | backend/src/main/java/com/policalum/erp/application/service/AuthService.java:152 |
| EmpresaSitioVinculo | propuestas | DatoEmpresaSitioDTO origen, DatoEmpresaSitioDTO global, DatoEmpresaSitioDTO sitio | backend/src/main/java/com/policalum/erp/application/service/EmpresaSitioVinculo.java:23 |
| EmpresaSitioVinculo | origenAlGuardar |  DatoEmpresaSitioDTO previo, DatoEmpresaSitioDTO global, DatoEmpresaSitioDTO sitio, Set<String> descartados, boolean yaPersonalizado | backend/src/main/java/com/policalum/erp/application/service/EmpresaSitioVinculo.java:32 |
| EmpresaSitioVinculo | elegir | String clave, String previo, String global, String sitio, Set<String> descartados | backend/src/main/java/com/policalum/erp/application/service/EmpresaSitioVinculo.java:49 |
| EmpresaSitioVinculo | igual | String izquierda, String derecha | backend/src/main/java/com/policalum/erp/application/service/EmpresaSitioVinculo.java:54 |
| EmpresaSitioVinculo | texto | String valor | backend/src/main/java/com/policalum/erp/application/service/EmpresaSitioVinculo.java:58 |
| EmpresaSitioVinculo | Campo | String clave, String etiqueta | backend/src/main/java/com/policalum/erp/application/service/EmpresaSitioVinculo.java:62 |
| PoliticaRemuneracionService | mesCompleto |  | backend/src/main/java/com/policalum/erp/application/service/PoliticaRemuneracionService.java:29 |
| PrecioComercial | vigente | Producto producto | backend/src/main/java/com/policalum/erp/application/service/PrecioComercial.java:18 |
| PrecioComercial | vigente | Producto producto, LocalDate hoy | backend/src/main/java/com/policalum/erp/application/service/PrecioComercial.java:26 |
| PrecioComercial | venta | Producto producto | backend/src/main/java/com/policalum/erp/application/service/PrecioComercial.java:33 |
| PrecioComercial | fraccion | Producto producto, BigDecimal precioLista | backend/src/main/java/com/policalum/erp/application/service/PrecioComercial.java:38 |
| PrecioComercial | fraccion | Producto producto, CatalogoFraccion fraccion | backend/src/main/java/com/policalum/erp/application/service/PrecioComercial.java:46 |
| PrecioComercial | mostrar | Producto producto | backend/src/main/java/com/policalum/erp/application/service/PrecioComercial.java:55 |
| AlmacenServiceImpl | create | AlmacenRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:35 |
| AlmacenServiceImpl | update | UUID id, AlmacenRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:43 |
| AlmacenServiceImpl | findById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:53 |
| AlmacenServiceImpl | search | String searchTerm, UUID sedeId, Boolean activo, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:59 |
| AlmacenServiceImpl | findBySede | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:69 |
| AlmacenServiceImpl | delete | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:76 |
| AlmacenServiceImpl | isNombreDisponible | UUID sedeId, String nombre, UUID excludeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:91 |
| AlmacenServiceImpl | getDashboardStatistics |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:99 |
| AlmacenServiceImpl | findEntityById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:107 |
| AlmacenServiceImpl | validateNombreAvailability | UUID sedeId, String nombre, UUID excludeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AlmacenServiceImpl.java:113 |
| AuditoriaServiceImpl | buscar | String tabla, AccionAudit accion, UUID userId, LocalDate desde, LocalDate hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditoriaServiceImpl.java:72 |
| AuditoriaServiceImpl | obtener | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditoriaServiceImpl.java:81 |
| AuditoriaServiceImpl | porUsuario | UUID userId, AccionAudit accion, LocalDate desde, LocalDate hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditoriaServiceImpl.java:88 |
| AuditoriaServiceImpl | porEntidad | String tabla, UUID registroId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditoriaServiceImpl.java:99 |
| AuditoriaServiceImpl | exportarCsv | String tabla, AccionAudit accion, UUID userId, LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditoriaServiceImpl.java:108 |
| AuditoriaServiceImpl | dashboard | LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditoriaServiceImpl.java:151 |
| AuditoriaServiceImpl | linea | StringBuilder sb, String[] valores | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditoriaServiceImpl.java:209 |
| AuditoriaServiceImpl | Rango | LocalDateTime inicio, LocalDateTime fin, boolean incluirSinFecha | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditoriaServiceImpl.java:220 |
| AuditoriaServiceImpl | sinOrden | Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditoriaServiceImpl.java:231 |
| AuditoriaServiceImpl | normalizarTabla | String tabla | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditoriaServiceImpl.java:235 |
| AuditoriaServiceImpl | exigirAdmin |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditoriaServiceImpl.java:239 |
| AuditServiceImpl | registrar | String tabla, UUID registroId, AccionAudit accion, User user, String userAgent, Map<String, Object> datosJson | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditServiceImpl.java:43 |
| AuditServiceImpl | registrar | String tabla, UUID registroId, AccionAudit accion, Map<String, Object> datosJson | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditServiceImpl.java:64 |
| AuditServiceImpl | search | String tabla, UUID registroId, UUID userId, AccionAudit accion, LocalDateTime desde, LocalDateTime hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditServiceImpl.java:73 |
| AuditServiceImpl | obtenerUsuarioAutenticado |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditServiceImpl.java:95 |
| AuditServiceImpl | obtenerUserAgent |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/AuditServiceImpl.java:103 |
| CajaChicaServiceImpl | registrar | UUID turnoId, CajaChicaRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CajaChicaServiceImpl.java:29 |
| CajaChicaServiceImpl | listar | UUID turnoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CajaChicaServiceImpl.java:42 |
| CajaChicaServiceImpl | dto | MovimientoCajaChica movimiento | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CajaChicaServiceImpl.java:47 |
| CajaChicaServiceImpl | usuario |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CajaChicaServiceImpl.java:52 |
| CanalWebNotificador | suscribir |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CanalWebNotificador.java:29 |
| CanalWebNotificador | cotizacion | CotizacionResponseDTO cotizacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CanalWebNotificador.java:44 |
| CanalWebNotificador | compraWhatsapp | UUID id, String detalle | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CanalWebNotificador.java:51 |
| CanalWebNotificador | mensaje | MensajeContacto mensaje | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CanalWebNotificador.java:56 |
| CanalWebNotificador | mensajeChat | UUID lineaId, String nombre, String texto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CanalWebNotificador.java:71 |
| CanalWebNotificador | avisar | String clave, String tipo, String titulo, String detalle, String ruta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CanalWebNotificador.java:76 |
| CanalWebNotificador | leerAvisoDe | UUID mensajeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CanalWebNotificador.java:98 |
| CanalWebNotificador | retirarAvisoDe | UUID mensajeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CanalWebNotificador.java:112 |
| CanalWebNotificador | refrescar |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CanalWebNotificador.java:120 |
| CanalWebNotificador | empujar | String titulo, String detalle, String ruta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CanalWebNotificador.java:132 |
| CatalogoFraccionServiceImpl | create | CatalogoFraccionRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:40 |
| CatalogoFraccionServiceImpl | update | UUID id, CatalogoFraccionRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:49 |
| CatalogoFraccionServiceImpl | findById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:61 |
| CatalogoFraccionServiceImpl | search | UUID productoId, Boolean activo, String searchTerm, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:67 |
| CatalogoFraccionServiceImpl | findAvailableByProducto | UUID productoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:78 |
| CatalogoFraccionServiceImpl | delete | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:86 |
| CatalogoFraccionServiceImpl | isFactorDisponible | UUID productoId, BigDecimal factor, UUID excludeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:101 |
| CatalogoFraccionServiceImpl | getDashboardStatistics |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:110 |
| CatalogoFraccionServiceImpl | findEntityById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:118 |
| CatalogoFraccionServiceImpl | validateRequest | CatalogoFraccionRequestDTO requestDTO, UUID excludeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:124 |
| CatalogoFraccionServiceImpl | normalize | CatalogoFraccion fraccion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoFraccionServiceImpl.java:140 |
| CatalogoPdfService | generar |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoPdfService.java:45 |
| CatalogoPdfService | crearPdf | List<ProductoPublicoDTO> productos, EmpresaPublicaDTO empresa | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoPdfService.java:59 |
| CatalogoPdfService | celdaProducto | ProductoPublicoDTO producto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoPdfService.java:106 |
| CatalogoPdfService | imagenProducto | ProductoPublicoDTO producto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CatalogoPdfService.java:152 |
| CategoriaServiceImpl | create | CategoriaRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:36 |
| CategoriaServiceImpl | update | UUID id, CategoriaRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:45 |
| CategoriaServiceImpl | findById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:57 |
| CategoriaServiceImpl | search | String searchTerm, Boolean activa, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:63 |
| CategoriaServiceImpl | findRoots |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:74 |
| CategoriaServiceImpl | findChildren | UUID parentId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:82 |
| CategoriaServiceImpl | delete | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:90 |
| CategoriaServiceImpl | isSlugDisponible | String slug, UUID excludeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:105 |
| CategoriaServiceImpl | getDashboardStatistics |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:113 |
| CategoriaServiceImpl | findEntityById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:121 |
| CategoriaServiceImpl | validateSlugAvailability | String slug, UUID excludeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:127 |
| CategoriaServiceImpl | validateParent | UUID categoryId, Categoria parent | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:133 |
| CategoriaServiceImpl | resolverParent | Categoria categoria, CategoriaRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:151 |
| CategoriaServiceImpl | normalize | Categoria categoria | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CategoriaServiceImpl.java:161 |
| ChatWebService | enviarCliente | ChatClienteRequest request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:38 |
| ChatWebService | leerCliente | String clave | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:57 |
| ChatWebService | marcarLeidoCliente | String clave | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:62 |
| ChatWebService | presenciaCliente | String clave, boolean activo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:70 |
| ChatWebService | listar |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:78 |
| ChatWebService | leerEquipo | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:83 |
| ChatWebService | responder | UUID id, ChatTextoRequest request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:88 |
| ChatWebService | marcarLeidoEquipo | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:101 |
| ChatWebService | marcarNoLeido | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:111 |
| ChatWebService | archivar | UUID id, boolean archivado | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:119 |
| ChatWebService | sinLeer |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:127 |
| ChatWebService | presenciaEquipo | UUID id, boolean activo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:135 |
| ChatWebService | nueva | ChatClienteRequest request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:141 |
| ChatWebService | agregar | ConversacionWeb conversacion, AutorChat autor, String autorNombre, String texto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:156 |
| ChatWebService | localizar | String clave | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:169 |
| ChatWebService | exigirClave | String clave | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:179 |
| ChatWebService | exigir | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:183 |
| ChatWebService | hiloPublico | ConversacionWeb conversacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:187 |
| ChatWebService | hiloEquipo | ConversacionWeb conversacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:197 |
| ChatWebService | resumen | ConversacionWeb conversacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:211 |
| ChatWebService | visibles | ConversacionWeb conversacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:227 |
| ChatWebService | reconocer | String correo, String telefono, String dispositivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:233 |
| ChatWebService | continuar | UUID referencia, String correo, String telefono, String dispositivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:241 |
| ChatWebService | actualizarDatos | UUID id, DatosChatRequest request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:257 |
| ChatWebService | cambiarEstado | UUID id, String estado | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:267 |
| ChatWebService | eliminar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:275 |
| ChatWebService | guardarCliente | UUID id, ClienteRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:283 |
| ChatWebService | buscarParecida | String correo, String telefono, String dispositivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:294 |
| ChatWebService | coincide | ConversacionWeb conversacion, String correo, String telefono | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:313 |
| ChatWebService | digitos | String valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:321 |
| ChatWebService | lineasDe | UUID conversacionId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:326 |
| ChatWebService | vigente | LocalDateTime hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:332 |
| ChatWebService | vacio | String valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ChatWebService.java:336 |
| ClienteServiceImpl | create | ClienteRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:41 |
| ClienteServiceImpl | update | UUID id, ClienteRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:58 |
| ClienteServiceImpl | findById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:73 |
| ClienteServiceImpl | findByNumeroDocumento | String numeroDocumento | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:81 |
| ClienteServiceImpl | delete | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:90 |
| ClienteServiceImpl | search | String searchTerm, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:110 |
| ClienteServiceImpl | findAll | Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:123 |
| ClienteServiceImpl | findByTipoDocumento | String tipoDocumento, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:131 |
| ClienteServiceImpl | findTop10Recent |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:139 |
| ClienteServiceImpl | findClientesWithIncompleteData |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:150 |
| ClienteServiceImpl | findClientesWithPurchasesSince | LocalDateTime fechaDesde | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:160 |
| ClienteServiceImpl | findClientesWithoutPurchasesSince | LocalDateTime fechaDesde | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:170 |
| ClienteServiceImpl | countTotalClientes |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:180 |
| ClienteServiceImpl | countClientesByDateRange | LocalDateTime start, LocalDateTime end | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:186 |
| ClienteServiceImpl | countClientesRegistradosHoy |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:192 |
| ClienteServiceImpl | countClientesByTipoDocumento | String tipoDocumento | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:200 |
| ClienteServiceImpl | getEstadisticasPorTipoDocumento |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:207 |
| ClienteServiceImpl | getDashboardStatistics |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:222 |
| ClienteServiceImpl | existsByNumeroDocumento | String numeroDocumento | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:236 |
| ClienteServiceImpl | existsByEmail | String email | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:242 |
| ClienteServiceImpl | validateDocumentoUniqueness | String numeroDocumento, UUID excludeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:248 |
| ClienteServiceImpl | findClienteById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:259 |
| ClienteServiceImpl | validateClientCreation | ClienteRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:265 |
| ClienteServiceImpl | validateClientUpdate | ClienteRequestDTO requestDTO, Cliente existingCliente | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ClienteServiceImpl.java:280 |
| CmsMedioService | guardar | MultipartFile archivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsMedioService.java:37 |
| CmsMedioService | cargar | String ruta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsMedioService.java:70 |
| CmsMedioService | tipo | String ruta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsMedioService.java:82 |
| CmsMedioService | resolver | String ruta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsMedioService.java:92 |
| CmsMedioService | baseAbsoluta |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsMedioService.java:104 |
| CmsMedioService | extensionDe | String nombre | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsMedioService.java:112 |
| CmsPublicador | suscribir |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsPublicador.java:25 |
| CmsPublicador | publicar | String tipo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsPublicador.java:40 |
| CmsPublicador | afterCommit |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsPublicador.java:44 |
| CmsPublicador | emitir | String tipo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsPublicador.java:53 |
| CmsService | guardarAjustes | CmsAjusteRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:72 |
| CmsService | guardarHorario | HorarioOperativoRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:122 |
| CmsService | sincronizarOfertas |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:146 |
| CmsService | marcarOferta | UUID productoId, OfertaManualRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:155 |
| CmsService | publico |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:208 |
| CmsService | actual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:213 |
| CmsService | empresaSitio |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:218 |
| CmsService | leer |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:229 |
| CmsService | sanearColores | ColoresSitioDTO colores | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:271 |
| CmsService | sanearPaleta | ColoresSitioDTO.PaletaColorDTO paleta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:275 |
| CmsService | leerColores | CmsAjuste ajuste | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:286 |
| CmsService | leerMateriales | CmsAjuste ajuste | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:295 |
| CmsService | normalizarMateriales | List<MaterialPublicoDTO> entrada | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:307 |
| CmsService | urlMaterial | String valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:333 |
| CmsService | leerDias | HorarioOperativo horario | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:342 |
| CmsService | validarDias | List<DiaAtencionDTO> dias | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:352 |
| CmsService | reflejarTextos | List<DiaAtencionDTO> dias | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:370 |
| CmsService | textoDe | List<DiaAtencionDTO> dias, List<String> claves | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:377 |
| CmsService | cortar | String texto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:392 |
| CmsService | limpio | String valor, int maximo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:396 |
| CmsService | guardarIdentidad | CmsAjuste fila, CmsAjusteRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:403 |
| CmsService | datoGlobal |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:434 |
| CmsService | datoVisible | DatoEmpresaSitioDTO global | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:450 |
| CmsService | unir | String direccion, String ciudad | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:470 |
| CmsService | datoSitio | CmsAjuste ajuste | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:476 |
| CmsService | datoOrigen | CmsAjuste ajuste | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:487 |
| CmsService | asegurarAjuste |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:498 |
| CmsService | aplicarFracciones | Producto producto, OfertaManualRequestDTO request, BigDecimal porcentaje | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:506 |
| CmsService | limpiarFracciones | Producto producto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:529 |
| CmsService | asegurarHorario |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CmsService.java:538 |
| ComisionServiceImpl | calcular | CalcularComisionesRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ComisionServiceImpl.java:61 |
| ComisionServiceImpl | aprobar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ComisionServiceImpl.java:140 |
| ComisionServiceImpl | buscar | String periodo, UUID sedeId, EstadoComision estado, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ComisionServiceImpl.java:167 |
| ComisionServiceImpl | porEmpleado | UUID userId, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ComisionServiceImpl.java:175 |
| ComisionServiceImpl | porPeriodo | String periodo, UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ComisionServiceImpl.java:185 |
| ComisionServiceImpl | parsePeriodo | String periodo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ComisionServiceImpl.java:193 |
| ComisionServiceImpl | esAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ComisionServiceImpl.java:201 |
| ComisionServiceImpl | exigirAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ComisionServiceImpl.java:205 |
| ComisionServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ComisionServiceImpl.java:211 |
| CompraAdjuntoServiceImpl | subir | UUID compraId, MultipartFile archivo, String tipo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraAdjuntoServiceImpl.java:46 |
| CompraAdjuntoServiceImpl | listar | UUID compraId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraAdjuntoServiceImpl.java:80 |
| CompraAdjuntoServiceImpl | descargar | UUID compraId, UUID adjuntoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraAdjuntoServiceImpl.java:87 |
| CompraAdjuntoServiceImpl | eliminar | UUID compraId, UUID adjuntoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraAdjuntoServiceImpl.java:93 |
| CompraAdjuntoServiceImpl | findAdjunto | UUID compraId, UUID adjuntoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraAdjuntoServiceImpl.java:111 |
| CompraAdjuntoServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraAdjuntoServiceImpl.java:120 |
| CompraAdjuntoServiceImpl | toDto | CompraAdjunto a | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraAdjuntoServiceImpl.java:126 |
| CompraServiceImpl | crear | CompraRequestDTO dto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:60 |
| CompraServiceImpl | actualizar | UUID id, CompraRequestDTO dto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:122 |
| CompraServiceImpl | obtener | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:179 |
| CompraServiceImpl | buscar | UUID proveedorId, UUID sedeId, EstadoCompra estado, LocalDate desde, LocalDate hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:190 |
| CompraServiceImpl | recibir | UUID id, RecepcionCompraRequestDTO dto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:200 |
| CompraServiceImpl | anular | UUID id, AnularCompraRequestDTO dto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:218 |
| CompraServiceImpl | eliminar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:250 |
| CompraServiceImpl | dashboard |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:265 |
| CompraServiceImpl | ingresar | Compra compra, User user, RecepcionCompraRequestDTO dto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:284 |
| CompraServiceImpl | findCompra | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:346 |
| CompraServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:351 |
| CompraServiceImpl | generarNumeroOrdenCompra |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:357 |
| CompraServiceImpl | procesarLineas | Compra compra, List<DetalleCompraCommandDTO> lineas, Sede sede | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:368 |
| CompraServiceImpl | stockPrevio | UUID productoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:443 |
| CompraServiceImpl | actualizarCostoPromedioPonderado | DetalleCompra detalle, BigDecimal cantidadKardex, BigDecimal stockPrevio | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CompraServiceImpl.java:450 |
| ConfiguracionServiceImpl | obtenerEmpresa |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:114 |
| ConfiguracionServiceImpl | actualizarEmpresa | EmpresaRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:120 |
| ConfiguracionServiceImpl | publica |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:155 |
| ConfiguracionServiceImpl | actualizarMarca | MarcaRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:162 |
| ConfiguracionServiceImpl | guardarLogo | MultipartFile archivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:204 |
| ConfiguracionServiceImpl | cargarLogo |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:227 |
| ConfiguracionServiceImpl | obtenerParametros |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:240 |
| ConfiguracionServiceImpl | actualizarParametros | ParametrosRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:245 |
| ConfiguracionServiceImpl | ventas |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:267 |
| ConfiguracionServiceImpl | inventario |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:274 |
| ConfiguracionServiceImpl | finanzas |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:281 |
| ConfiguracionServiceImpl | reportes |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:288 |
| ConfiguracionServiceImpl | rrhh |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:295 |
| ConfiguracionServiceImpl | actualizarVentas | ParametrosVentasRequestDTO r, User admin | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:300 |
| ConfiguracionServiceImpl | actualizarInventario | ParametrosInventarioRequestDTO r, User admin | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:314 |
| ConfiguracionServiceImpl | actualizarFinanzas | ParametrosFinanzasRequestDTO r, User admin | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:330 |
| ConfiguracionServiceImpl | actualizarReportes | ParametrosReportesRequestDTO r, User admin | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:344 |
| ConfiguracionServiceImpl | actualizarRrhh | ParametrosRrhhRequestDTO r, User admin | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:364 |
| ConfiguracionServiceImpl | validarVentas | ParametrosVentasRequestDTO v | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:386 |
| ConfiguracionServiceImpl | validarFinanzas | ParametrosFinanzasRequestDTO f | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:396 |
| ConfiguracionServiceImpl | listarSeries | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:407 |
| ConfiguracionServiceImpl | actualizarSeries | SeriesRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:417 |
| ConfiguracionServiceImpl | guardarSerie | SerieComprobanteRequestDTO s, Sede sede, User admin | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:445 |
| ConfiguracionServiceImpl | inicializarSiFalta |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:507 |
| ConfiguracionServiceImpl | seriesDeFabrica |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:536 |
| ConfiguracionServiceImpl | asegurarSerie | Sede sede, TipoComprobante tipo, String codigo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:544 |
| ConfiguracionServiceImpl | registrarInicial | String tabla | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:561 |
| ConfiguracionServiceImpl | auditar | String tabla, AccionAudit accion, Map<String, Object> antes, Map<String, Object> despues | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:594 |
| ConfiguracionServiceImpl | cambio | Map<String, Object> antes, Map<String, Object> despues | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:598 |
| ConfiguracionServiceImpl | aMapa | Record r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:605 |
| ConfiguracionServiceImpl | datosEmpresa | ConfiguracionEmpresa e | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:618 |
| ConfiguracionServiceImpl | datosSerie | SerieComprobante s | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:631 |
| ConfiguracionServiceImpl | nombreSede | SerieComprobante s | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:640 |
| ConfiguracionServiceImpl | empresaPorDefecto |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:644 |
| ConfiguracionServiceImpl | faltante | String tabla, T defaults | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:648 |
| ConfiguracionServiceImpl | vacioANull | String s | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:653 |
| ConfiguracionServiceImpl | exigirAdmin |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ConfiguracionServiceImpl.java:657 |
| CorrelativoServiceImpl | siguiente | String clave | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CorrelativoServiceImpl.java:21 |
| CotizacionDocumentoService | descargar | UUID id, String formato | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionDocumentoService.java:36 |
| CotizacionDocumentoService | descargar | UUID id, String formato, boolean publico | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionDocumentoService.java:45 |
| CotizacionDocumentoService | armar | CotizacionResponseDTO cotizacion, boolean publico | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionDocumentoService.java:57 |
| CotizacionDocumentoService | empresa |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionDocumentoService.java:106 |
| CotizacionDocumentoService | usuario |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionDocumentoService.java:123 |
| CotizacionServiceImpl | create | CotizacionRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:57 |
| CotizacionServiceImpl | crearDesdeWeb | CotizacionWebRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:76 |
| CotizacionServiceImpl | formatoPublico |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:110 |
| CotizacionServiceImpl | formatoErp |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:116 |
| CotizacionServiceImpl | guardarFormato | FormatoCotizacionRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:121 |
| CotizacionServiceImpl | vista | VistaCotizacionRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:127 |
| CotizacionServiceImpl | ajustarCargos | UUID id, AjusteCargoCotizacionRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:149 |
| CotizacionServiceImpl | update | UUID id, CotizacionRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:179 |
| CotizacionServiceImpl | findById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:197 |
| CotizacionServiceImpl | search | UUID clienteId, UUID sedeId, UUID userId, EstadoCotizacion estado, LocalDateTime desde, LocalDateTime hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:203 |
| CotizacionServiceImpl | delete | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:211 |
| CotizacionServiceImpl | aceptar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:222 |
| CotizacionServiceImpl | rechazar | UUID id, RechazarCotizacionRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:237 |
| CotizacionServiceImpl | marcarNoComprada | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:249 |
| CotizacionServiceImpl | convertir | UUID id, ConvertirCotizacionRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:261 |
| CotizacionServiceImpl | vencidas |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:287 |
| CotizacionServiceImpl | dashboard |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:302 |
| CotizacionServiceImpl | recalcularLineas | Cotizacion cotizacion, List<DetalleCotizacionCommandDTO> lineas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:314 |
| CotizacionServiceImpl | calcular | DetalleCotizacionCommandDTO l | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:336 |
| CotizacionServiceImpl | obtener | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:365 |
| CotizacionServiceImpl | sede | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:369 |
| CotizacionServiceImpl | cliente | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:373 |
| CotizacionServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:377 |
| CotizacionServiceImpl | exigirEstado | Cotizacion c, EstadoCotizacion estadoEsperado, String accion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:382 |
| CotizacionServiceImpl | exigirEstados | Cotizacion c, String accion, EstadoCotizacion... esperados | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:390 |
| CotizacionServiceImpl | exigirCreadorOAdmin | Cotizacion c | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:397 |
| CotizacionServiceImpl | sedeRecepcionWeb |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:411 |
| CotizacionServiceImpl | clienteWeb | CotizacionWebRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:418 |
| CotizacionServiceImpl | origenDe | Cotizacion c | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:437 |
| CotizacionServiceImpl | listado | Cotizacion c | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:444 |
| CotizacionServiceImpl | response | Cotizacion c | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:449 |
| CotizacionServiceImpl | aplicarCargos | Cotizacion cotizacion, CargosCotizacionDTO cargos | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:457 |
| CotizacionServiceImpl | cargosDe | Cotizacion c | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:472 |
| CotizacionServiceImpl | totalConCargos | CargosCotizacionDTO cargos | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:479 |
| CotizacionServiceImpl | totalDe | BigDecimal materiales, BigDecimal utilidad, BigDecimal movilidad, BigDecimal otros | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:483 |
| CotizacionServiceImpl | Calculada | Producto producto, Servicio servicio, CatalogoFraccion fraccion, BigDecimal precio, BigDecimal neto, BigDecimal igv, BigDecimal total | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CotizacionServiceImpl.java:488 |
| CuentaFinancieraServiceImpl | crear | CuentaFinancieraRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:60 |
| CuentaFinancieraServiceImpl | actualizar | UUID id, CuentaFinancieraRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:77 |
| CuentaFinancieraServiceImpl | obtener | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:96 |
| CuentaFinancieraServiceImpl | listar | UUID sedeId, boolean incluirInactivas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:104 |
| CuentaFinancieraServiceImpl | desactivar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:116 |
| CuentaFinancieraServiceImpl | registrarSaldo | UUID cuentaId, RegistrarSaldoCuentaRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:129 |
| CuentaFinancieraServiceImpl | historialSaldos | UUID cuentaId, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:155 |
| CuentaFinancieraServiceImpl | metodos | Set<MetodoPago> solicitados | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:184 |
| CuentaFinancieraServiceImpl | sede | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:189 |
| CuentaFinancieraServiceImpl | buscar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:194 |
| CuentaFinancieraServiceImpl | corte | String texto, LocalDateTime ahora | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:200 |
| CuentaFinancieraServiceImpl | ultimoSaldo | UUID cuentaId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:216 |
| CuentaFinancieraServiceImpl | datos | CuentaFinanciera c, String operacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:220 |
| CuentaFinancieraServiceImpl | exigirAdmin |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaFinancieraServiceImpl.java:230 |
| CuentaPorPagarServiceImpl | buscar | UUID sedeId, UUID proveedorId, EstadoCxP estado, Boolean soloVencidas, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:50 |
| CuentaPorPagarServiceImpl | obtener | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:58 |
| CuentaPorPagarServiceImpl | registrarPago | UUID id, PagoCxPRequestDTO dto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:63 |
| CuentaPorPagarServiceImpl | obtenerPorCompra | UUID compraId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:133 |
| CuentaPorPagarServiceImpl | vencidas | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:142 |
| CuentaPorPagarServiceImpl | proximasAVencer | UUID sedeId, int dias | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:150 |
| CuentaPorPagarServiceImpl | dashboard | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:163 |
| CuentaPorPagarServiceImpl | findById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:202 |
| CuentaPorPagarServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:208 |
| CuentaPorPagarServiceImpl | toDto | FinanzasCuentaPorPagar c | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/CuentaPorPagarServiceImpl.java:214 |
| DashboardFinancieroServiceImpl | patrimonio | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DashboardFinancieroServiceImpl.java:81 |
| DashboardFinancieroServiceImpl | kpis | UUID sedeId, LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DashboardFinancieroServiceImpl.java:149 |
| DashboardFinancieroServiceImpl | evolucionMensual | UUID sedeId, Integer meses | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DashboardFinancieroServiceImpl.java:205 |
| DashboardFinancieroServiceImpl | porcentaje | BigDecimal parte, BigDecimal base | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DashboardFinancieroServiceImpl.java:237 |
| DashboardFinancieroServiceImpl | disponibleDe | List<SaldoCuentaEstimadoDTO> cuentas, UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DashboardFinancieroServiceImpl.java:241 |
| DashboardFinancieroServiceImpl | porSede | List<MontoPorSedeProjection> filas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DashboardFinancieroServiceImpl.java:246 |
| DashboardFinancieroServiceImpl | total | Map<UUID, BigDecimal> mapa | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DashboardFinancieroServiceImpl.java:252 |
| DashboardFinancieroServiceImpl | cero | BigDecimal v | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DashboardFinancieroServiceImpl.java:256 |
| DashboardFinancieroServiceImpl | cero2 |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DashboardFinancieroServiceImpl.java:260 |
| DashboardFinancieroServiceImpl | escala | BigDecimal v | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DashboardFinancieroServiceImpl.java:264 |
| DashboardFinancieroServiceImpl | sedesDelReporte | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DashboardFinancieroServiceImpl.java:268 |
| DashboardFinancieroServiceImpl | exigirAdmin |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DashboardFinancieroServiceImpl.java:278 |
| DevolucionServiceImpl | crear | DevolucionRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:89 |
| DevolucionServiceImpl | obtener | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:162 |
| DevolucionServiceImpl | buscar | UUID sedeId, EstadoDevolucion estado, UUID ventaId, LocalDate desde, LocalDate hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:170 |
| DevolucionServiceImpl | porVenta | UUID ventaId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:179 |
| DevolucionServiceImpl | aprobar | UUID id, AprobarDevolucionRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:186 |
| DevolucionServiceImpl | rechazar | UUID id, RechazarDevolucionRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:247 |
| DevolucionServiceImpl | dashboard | UUID sedeId, LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:271 |
| DevolucionServiceImpl | generarCodigo |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:300 |
| DevolucionServiceImpl | respuesta | Devolucion d, List<DetalleDevolucion> detalles | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:305 |
| DevolucionServiceImpl | bloquear | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:310 |
| DevolucionServiceImpl | datos | Devolucion d, String operacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:315 |
| DevolucionServiceImpl | validarRango | LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:325 |
| DevolucionServiceImpl | inicio | LocalDate d | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:331 |
| DevolucionServiceImpl | finExclusivo | LocalDate h | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:335 |
| DevolucionServiceImpl | cero | BigDecimal v | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:339 |
| DevolucionServiceImpl | exigirAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:343 |
| DevolucionServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/DevolucionServiceImpl.java:349 |
| EnvioPushService | clavePublica |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/EnvioPushService.java:38 |
| EnvioPushService | guardar | String endpoint, String p256dh, String auth, String dispositivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/EnvioPushService.java:43 |
| EnvioPushService | quitar | String endpoint | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/EnvioPushService.java:55 |
| EnvioPushService | enviar | String titulo, String cuerpo, String ruta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/EnvioPushService.java:59 |
| EnvioPushService | enviarUna | PushService servicio, PushSuscripcion fila, String carga | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/EnvioPushService.java:72 |
| EnvioPushService | asegurar |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/EnvioPushService.java:83 |
| EnvioPushService | crear |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/EnvioPushService.java:87 |
| EnvioPushService | actual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/EnvioPushService.java:105 |
| EnvioPushService | json | String valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/EnvioPushService.java:110 |
| ExportacionServiceImpl | generar | String modulo, String formato, String filtros | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:71 |
| ExportacionServiceImpl | materializar | String modulo, String formato, String filtros, String usuario | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:83 |
| ExportacionServiceImpl | armar | String modulo, String filtros, String usuario | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:91 |
| ExportacionServiceImpl | reporteVentas | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:115 |
| ExportacionServiceImpl | rentabilidad | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:148 |
| ExportacionServiceImpl | productosEstrella | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:157 |
| ExportacionServiceImpl | clientesFrecuentes | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:168 |
| ExportacionServiceImpl | rankingProveedores | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:190 |
| ExportacionServiceImpl | arqueos | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:213 |
| ExportacionServiceImpl | filaRentabilidad | RentabilidadItemDTO item, boolean costosVisibles | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:238 |
| ExportacionServiceImpl | columnasRentabilidad | boolean costosVisibles | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:255 |
| ExportacionServiceImpl | clientes | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:272 |
| ExportacionServiceImpl | productos | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:287 |
| ExportacionServiceImpl | stock | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:300 |
| ExportacionServiceImpl | kardex | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:314 |
| ExportacionServiceImpl | ventas | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:330 |
| ExportacionServiceImpl | compras | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:349 |
| ExportacionServiceImpl | proveedores | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:365 |
| ExportacionServiceImpl | gastos | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:398 |
| ExportacionServiceImpl | nominas | String usuario, List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:415 |
| ExportacionServiceImpl | rango | List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:428 |
| ExportacionServiceImpl | sedeId | List<String> notas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:444 |
| ExportacionServiceImpl | valorFiltro | List<String> notas, String clave | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:459 |
| ExportacionServiceImpl | enumFiltro | Class<T> tipo, String valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:469 |
| ExportacionServiceImpl | Rango | LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:473 |
| ExportacionServiceImpl | empresa |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:476 |
| ExportacionServiceImpl | logo |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:485 |
| ExportacionServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ExportacionServiceImpl.java:497 |
| FacturacionElectronicaServiceImpl | panel | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FacturacionElectronicaServiceImpl.java:33 |
| FacturacionElectronicaServiceImpl | contarTipos | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FacturacionElectronicaServiceImpl.java:57 |
| FacturacionElectronicaServiceImpl | contarEstados | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FacturacionElectronicaServiceImpl.java:65 |
| FacturacionElectronicaServiceImpl | comprobante | Venta venta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FacturacionElectronicaServiceImpl.java:73 |
| FileStorageServiceImpl | guardar | MultipartFile archivo, String subcarpeta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FileStorageServiceImpl.java:28 |
| FileStorageServiceImpl | guardarFijo | MultipartFile archivo, String rutaSinExtension | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FileStorageServiceImpl.java:39 |
| FileStorageServiceImpl | descartarVariantes | String rutaConservada | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FileStorageServiceImpl.java:52 |
| FileStorageServiceImpl | cargar | String rutaRelativa | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FileStorageServiceImpl.java:77 |
| FileStorageServiceImpl | eliminar | String rutaRelativa | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FileStorageServiceImpl.java:100 |
| FileStorageServiceImpl | existe | String rutaRelativa | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FileStorageServiceImpl.java:113 |
| FileStorageServiceImpl | baseAbsoluta |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FileStorageServiceImpl.java:127 |
| FileStorageServiceImpl | validar | MultipartFile archivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FileStorageServiceImpl.java:140 |
| FileStorageServiceImpl | escribir | String rutaRelativa, MultipartFile archivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FileStorageServiceImpl.java:161 |
| FileStorageServiceImpl | extraerExtension | String nombre | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FileStorageServiceImpl.java:181 |
| FlujoCajaServiceImpl | flujoReal | UUID sedeId, LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FlujoCajaServiceImpl.java:71 |
| FlujoCajaServiceImpl | devengado | UUID sedeId, LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FlujoCajaServiceImpl.java:92 |
| FlujoCajaServiceImpl | proyeccion | UUID sedeId, Integer meses | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FlujoCajaServiceImpl.java:113 |
| FlujoCajaServiceImpl | prorrateo | BigDecimal monto, BigDecimal fraccion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FlujoCajaServiceImpl.java:224 |
| FlujoCajaServiceImpl | ceros | int n | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FlujoCajaServiceImpl.java:228 |
| FlujoCajaServiceImpl | suma | List<MontoPorSedeProjection> filas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FlujoCajaServiceImpl.java:234 |
| FlujoCajaServiceImpl | cero | BigDecimal v | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FlujoCajaServiceImpl.java:238 |
| FlujoCajaServiceImpl | tieneMovimiento | UtilidadNetaResponseDTO u | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FlujoCajaServiceImpl.java:242 |
| FlujoCajaServiceImpl | sedesDelReporte | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FlujoCajaServiceImpl.java:247 |
| FlujoCajaServiceImpl | exigirAdmin |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FlujoCajaServiceImpl.java:257 |
| FormatoCotizacionService | asegurar |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FormatoCotizacionService.java:47 |
| FormatoCotizacionService | actual | boolean soloActivos | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FormatoCotizacionService.java:68 |
| FormatoCotizacionService | guardar | FormatoCotizacionRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FormatoCotizacionService.java:86 |
| FormatoCotizacionService | calcular | BigDecimal subtotal, BigDecimal piezas, String distrito | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FormatoCotizacionService.java:121 |
| FormatoCotizacionService | parametro |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FormatoCotizacionService.java:153 |
| FormatoCotizacionService | TarifaSemilla | String distrito, String base, int incluidas, String extra | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/FormatoCotizacionService.java:160 |
| GastoEmpresarialServiceImpl | registrar | GastoEmpresarialRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/GastoEmpresarialServiceImpl.java:30 |
| GastoEmpresarialServiceImpl | listar | UUID sedeId, LocalDate desde, LocalDate hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/GastoEmpresarialServiceImpl.java:48 |
| GastoEmpresarialServiceImpl | anular | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/GastoEmpresarialServiceImpl.java:55 |
| GastoEmpresarialServiceImpl | dto | GastoEmpresarial gasto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/GastoEmpresarialServiceImpl.java:60 |
| GastoEmpresarialServiceImpl | usuario |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/GastoEmpresarialServiceImpl.java:75 |
| HistorialSalarialServiceImpl | registrarCambios | Retrato antes, RrhhLegajoDigital despues, LocalDate vigencia, String motivo, User registradoPor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:54 |
| HistorialSalarialServiceImpl | resolverVigencia | LocalDate pedida, RrhhLegajoDigital legajo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:99 |
| HistorialSalarialServiceImpl | listarPorEmpleado | UUID empleadoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:125 |
| HistorialSalarialServiceImpl | listarMio |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:135 |
| HistorialSalarialServiceImpl | lineaDeTiempo | RrhhLegajoDigital legajo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:146 |
| HistorialSalarialServiceImpl | responder | RrhhHistorialSalarial h, UUID legajoId, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:158 |
| HistorialSalarialServiceImpl | legajoDe | UUID empleadoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:178 |
| HistorialSalarialServiceImpl | texto | String valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:183 |
| HistorialSalarialServiceImpl | recortar | String valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:187 |
| HistorialSalarialServiceImpl | dinero | BigDecimal valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:192 |
| HistorialSalarialServiceImpl | porcentaje | BigDecimal valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:196 |
| HistorialSalarialServiceImpl | esAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:200 |
| HistorialSalarialServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/HistorialSalarialServiceImpl.java:204 |
| KardexServiceImpl | registrarMovimiento | KardexMovimientoRequestDTO dto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:95 |
| KardexServiceImpl | registrarTransferencia | TransferenciaRequestDTO dto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:154 |
| KardexServiceImpl | registrarTransferencia | TransferenciaRequestDTO dto, UUID referenciaId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:160 |
| KardexServiceImpl | searchMovimientos |  UUID productoId, UUID almacenId, LocalDateTime fechaInicio, LocalDateTime fechaFin, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:214 |
| KardexServiceImpl | buscarMovimientos | UUID productoId, UUID almacenId, TipoReferencia tipoReferencia, LocalDate desde, LocalDate hasta, UUID sedeId, String busqueda, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:229 |
| KardexServiceImpl | obtenerMovimiento | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:238 |
| KardexServiceImpl | saldos | UUID almacenId, UUID sedeId, String busqueda, boolean soloBajoMinimo, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:245 |
| KardexServiceImpl | saldosPorProducto | UUID productoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:252 |
| KardexServiceImpl | saldosPorAlmacen | UUID almacenId, String busqueda, boolean soloBajoMinimo, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:261 |
| KardexServiceImpl | valorizacion | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:270 |
| KardexServiceImpl | valorizacionAlmacen | UUID almacenId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:277 |
| KardexServiceImpl | mermas | UUID productoId, UUID almacenId, LocalDate desde, LocalDate hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:286 |
| KardexServiceImpl | historialProducto | UUID productoId, UUID almacenId, LocalDate desde, LocalDate hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:308 |
| KardexServiceImpl | exportarCsv | UUID productoId, UUID almacenId, TipoReferencia tipoReferencia, LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:332 |
| KardexServiceImpl | construirValorizacion | UUID almacenId, String almacenNombre, UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:374 |
| KardexServiceImpl | saldosDeProducto | UUID productoId, UUID almacenId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:404 |
| KardexServiceImpl | Rango | LocalDateTime inicio, LocalDateTime fin, boolean incluirSinFecha | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:436 |
| KardexServiceImpl | sinOrden | Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:453 |
| KardexServiceImpl | sumar | List<SaldoKardexDTO> saldos | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:457 |
| KardexServiceImpl | cero | BigDecimal v | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:461 |
| KardexServiceImpl | escala | BigDecimal v | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:465 |
| KardexServiceImpl | exigirAdmin |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:469 |
| KardexServiceImpl | bloquearSaldosEnOrden | UUID productoId, UUID almacenOrigenId, UUID almacenDestinoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:482 |
| KardexServiceImpl | crearStockInicial | Producto producto, Almacen almacen | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:489 |
| KardexServiceImpl | obtenerUsuarioAutenticado |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/KardexServiceImpl.java:497 |
| LegajoServiceImpl | crear | LegajoRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:73 |
| LegajoServiceImpl | obtenerPorEmpleado | UUID empleadoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:104 |
| LegajoServiceImpl | obtenerMio |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:111 |
| LegajoServiceImpl | actualizar | UUID empleadoId, LegajoRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:119 |
| LegajoServiceImpl | buscar | UUID sedeId, String tipoContrato, SistemaPension sistemaPension, Boolean activo, String texto, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:152 |
| LegajoServiceImpl | subirDocumento | UUID legajoId, MultipartFile archivo, String tipo, String descripcion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:164 |
| LegajoServiceImpl | listarDocumentos | UUID legajoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:201 |
| LegajoServiceImpl | descargarDocumento | UUID legajoId, UUID documentoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:211 |
| LegajoServiceImpl | eliminarDocumento | UUID legajoId, UUID documentoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:229 |
| LegajoServiceImpl | dashboard | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:249 |
| LegajoServiceImpl | normalizarTipoContrato | String tipo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:328 |
| LegajoServiceImpl | aplicarCamposNormalizados | RrhhLegajoDigital legajo, LegajoRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:336 |
| LegajoServiceImpl | parseTipo | String tipo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:345 |
| LegajoServiceImpl | legajoDe | UUID empleadoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:356 |
| LegajoServiceImpl | documentoDe | UUID legajoId, UUID documentoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:361 |
| LegajoServiceImpl | respuestaCompleta | RrhhLegajoDigital legajo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:367 |
| LegajoServiceImpl | retrato | RrhhLegajoDigital l | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:374 |
| LegajoServiceImpl | snapshot | RrhhLegajoDigital l | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:379 |
| LegajoServiceImpl | nombreArchivo | MultipartFile archivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:393 |
| LegajoServiceImpl | borrarArchivoSiHayRollback | String ruta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:402 |
| LegajoServiceImpl | afterCompletion | int status | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:406 |
| LegajoServiceImpl | borrarArchivoTrasCommit | String ruta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:412 |
| LegajoServiceImpl | afterCommit |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:419 |
| LegajoServiceImpl | nombre | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:425 |
| LegajoServiceImpl | esAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:429 |
| LegajoServiceImpl | exigirAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:433 |
| LegajoServiceImpl | exigirAdminODueno | User user, RrhhLegajoDigital legajo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:439 |
| LegajoServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LegajoServiceImpl.java:445 |
| LimitePublico | permitir | String clave | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/LimitePublico.java:14 |
| MensajeWebService | recibir | ContactoWebRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:26 |
| MensajeWebService | listar | EstadoMensajeWeb estado, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:67 |
| MensajeWebService | nuevos |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:75 |
| MensajeWebService | sinLeer |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:80 |
| MensajeWebService | marcarLeido | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:85 |
| MensajeWebService | marcarNoLeido | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:93 |
| MensajeWebService | archivar | UUID id, boolean archivado | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:101 |
| MensajeWebService | eliminar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:109 |
| MensajeWebService | gestionar | UUID id, GestionarMensajeRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:116 |
| MensajeWebService | dto | MensajeContacto mensaje | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:124 |
| MensajeWebService | exigir | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:132 |
| MensajeWebService | vacio | String valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MensajeWebService.java:136 |
| MovilidadServiceImpl | crear | MovilidadRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:69 |
| MovilidadServiceImpl | listar | UUID sedeId, Boolean activo, TipoMovilidad tipo, String texto, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:85 |
| MovilidadServiceImpl | obtener | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:93 |
| MovilidadServiceImpl | actualizar | UUID id, MovilidadRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:100 |
| MovilidadServiceImpl | desactivar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:121 |
| MovilidadServiceImpl | asignarConductor | UUID id, AsignarConductorRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:135 |
| MovilidadServiceImpl | historial | UUID id, EstadoDespacho estado, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:163 |
| MovilidadServiceImpl | reporteUso | UUID sedeId, LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:171 |
| MovilidadServiceImpl | dashboard | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:197 |
| MovilidadServiceImpl | validarPlacaUnica | String placa, UUID excluirId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:225 |
| MovilidadServiceImpl | exigirSinDespachosActivos | Movilidad m | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:231 |
| MovilidadServiceImpl | bloquear | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:239 |
| MovilidadServiceImpl | sede | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:244 |
| MovilidadServiceImpl | datos | Movilidad m, String operacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:248 |
| MovilidadServiceImpl | n | Long v | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:258 |
| MovilidadServiceImpl | exigirAdmin |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovilidadServiceImpl.java:262 |
| MovimientosCaja | MovimientosCaja | List<Movimiento> items | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:22 |
| MovimientosCaja | esIngreso |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:27 |
| MovimientosCaja | Movimiento | UUID sedeId, Concepto concepto, MetodoPago metodo, BigDecimal monto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:33 |
| MovimientosCaja | conSigno |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:34 |
| MovimientosCaja | esEfectivo |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:38 |
| MovimientosCaja | estaVacio |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:47 |
| MovimientosCaja | sedes |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:52 |
| MovimientosCaja | neto | Predicate<Movimiento> filtro | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:57 |
| MovimientosCaja | total | Concepto concepto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:63 |
| MovimientosCaja | egresosSinMetodo |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:69 |
| MovimientosCaja | resumen |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:74 |
| MovimientosCaja | resumenSede | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:78 |
| MovimientosCaja | resumen | Predicate<Movimiento> filtro | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:82 |
| MovimientosCaja | porMedio | Predicate<Movimiento> filtro, Concepto concepto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:95 |
| MovimientosCaja | cobrosPorMetodo | Predicate<Movimiento> filtro | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCaja.java:106 |
| MovimientosCajaCalculator | movimientos | LocalDateTime desde, LocalDateTime hasta, UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCajaCalculator.java:70 |
| MovimientosCajaCalculator | disponible | UUID sedeId, LocalDateTime ahora | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCajaCalculator.java:99 |
| MovimientosCajaCalculator | agregar | List<Movimiento> items, UUID sedeId, Concepto concepto, MetodoPago metodo, BigDecimal monto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/MovimientosCajaCalculator.java:164 |
| NominaServiceImpl | generar | GenerarNominaRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:81 |
| NominaServiceImpl | buscar | String periodo, UUID sedeId, EstadoNomina estado, UUID userId, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:145 |
| NominaServiceImpl | obtener | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:153 |
| NominaServiceImpl | aprobar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:159 |
| NominaServiceImpl | pagar | UUID id, PagarNominaRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:179 |
| NominaServiceImpl | boleta | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:212 |
| NominaServiceImpl | eliminar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:253 |
| NominaServiceImpl | dashboard | String periodo, UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:268 |
| NominaServiceImpl | buscarDetalle | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:367 |
| NominaServiceImpl | bloquear | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:372 |
| NominaServiceImpl | datosAuditoria | RrhhNomina n, String operacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:377 |
| NominaServiceImpl | parsePeriodo | String periodo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:387 |
| NominaServiceImpl | dinero | BigDecimal valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:395 |
| NominaServiceImpl | cero | BigDecimal valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:399 |
| NominaServiceImpl | porcentaje | BigDecimal valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:403 |
| NominaServiceImpl | nombre | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:407 |
| NominaServiceImpl | esAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:411 |
| NominaServiceImpl | exigirAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:416 |
| NominaServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NominaServiceImpl.java:422 |
| NotificacionServiceImpl | listar |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:31 |
| NotificacionServiceImpl | marcarLeida | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:37 |
| NotificacionServiceImpl | marcarTodasLeidas |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:45 |
| NotificacionServiceImpl | archivar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:59 |
| NotificacionServiceImpl | purgarVencidas |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:69 |
| NotificacionServiceImpl | sincronizarStock |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:75 |
| NotificacionServiceImpl | afterCommit |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:100 |
| NotificacionServiceImpl | buscar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:112 |
| NotificacionServiceImpl | dto | Notificacion aviso | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/NotificacionServiceImpl.java:116 |
| OrdenDespachoServiceImpl | crear | CrearDespachoRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:87 |
| OrdenDespachoServiceImpl | obtener | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:119 |
| OrdenDespachoServiceImpl | seguimiento | String codigo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:125 |
| OrdenDespachoServiceImpl | buscar | UUID sedeId, EstadoDespacho estado, UUID responsableId, UUID ventaId, LocalDate desde, LocalDate hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:134 |
| OrdenDespachoServiceImpl | asignarRepartidor | UUID id, AsignarRepartidorRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:148 |
| OrdenDespachoServiceImpl | cambiarEstado | UUID id, CambiarEstadoDespachoRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:176 |
| OrdenDespachoServiceImpl | registrarEntrega | UUID id, MultipartFile foto, EvidenciaEntregaRequestDTO e | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:229 |
| OrdenDespachoServiceImpl | descargarEvidencia | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:271 |
| OrdenDespachoServiceImpl | porRepartidor | UUID userId, boolean soloActivas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:284 |
| OrdenDespachoServiceImpl | dashboard | UUID sedeId, LocalDate fecha | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:291 |
| OrdenDespachoServiceImpl | generarCodigo |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:319 |
| OrdenDespachoServiceImpl | resolverMovilidad | UUID movilidadId, User repartidor, Sede sedeOrden | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:325 |
| OrdenDespachoServiceImpl | detalle | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:372 |
| OrdenDespachoServiceImpl | bloquear | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:377 |
| OrdenDespachoServiceImpl | datos | OrdenDespacho o, String operacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:382 |
| OrdenDespachoServiceImpl | blankANull | String s | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:391 |
| OrdenDespachoServiceImpl | nombreArchivo | MultipartFile f | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:395 |
| OrdenDespachoServiceImpl | borrarArchivoSiHayRollback | String ruta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:403 |
| OrdenDespachoServiceImpl | afterCompletion | int status | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:407 |
| OrdenDespachoServiceImpl | borrarArchivoTrasCommit | String ruta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:413 |
| OrdenDespachoServiceImpl | afterCommit |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:420 |
| OrdenDespachoServiceImpl | nombre | User u | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:426 |
| OrdenDespachoServiceImpl | esAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:430 |
| OrdenDespachoServiceImpl | exigirAdminOResponsable | User user, OrdenDespacho orden | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:435 |
| OrdenDespachoServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/OrdenDespachoServiceImpl.java:442 |
| PedidoWhatsappService | recibir | PedidoWhatsappRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PedidoWhatsappService.java:31 |
| PerfilServiceImpl | actual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:63 |
| PerfilServiceImpl | actualizar | PerfilActualizarRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:68 |
| PerfilServiceImpl | guardarFoto | MultipartFile archivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:91 |
| PerfilServiceImpl | quitarFoto |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:125 |
| PerfilServiceImpl | cargarFoto |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:133 |
| PerfilServiceImpl | cambiarContrasena | PerfilContrasenaRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:143 |
| PerfilServiceImpl | cambiarTotp | boolean activo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:159 |
| PerfilServiceImpl | cerrarOtrasSesiones |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:174 |
| PerfilServiceImpl | aplicarFoto | User user, String foto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:183 |
| PerfilServiceImpl | aplicarSede | User user, java.util.UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:196 |
| PerfilServiceImpl | aplicarLaboral | User user, BigDecimal sueldo, Integer diaCobro | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:204 |
| PerfilServiceImpl | respuesta | User user, String token, String secreto, String url | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:227 |
| PerfilServiceImpl | usuario |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:260 |
| PerfilServiceImpl | correoActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:265 |
| PerfilServiceImpl | esAdmin |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:273 |
| PerfilServiceImpl | version | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:278 |
| PerfilServiceImpl | vacio | String valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PerfilServiceImpl.java:282 |
| PoliticaRemuneracionServiceImpl | resolver | RrhhLegajoDigital legajo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:56 |
| PoliticaRemuneracionServiceImpl | liquidar | RrhhLegajoDigital legajo, YearMonth periodo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:67 |
| PoliticaRemuneracionServiceImpl | efectiva | RrhhLegajoDigital legajo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:99 |
| PoliticaRemuneracionServiceImpl | Efectiva | PoliticaDivisionSueldo division, List<String> dias, TratamientoAusencias ausencias, AmbitoPoliticaRemuneracion origenDivision, AmbitoPoliticaRemuneracion origenDias, AmbitoPoliticaRemuneracion origenAusencias | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:122 |
| PoliticaRemuneracionServiceImpl | deEmpleado | UUID empleadoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:131 |
| PoliticaRemuneracionServiceImpl | mia |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:140 |
| PoliticaRemuneracionServiceImpl | legajoDe | UUID empleadoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:144 |
| PoliticaRemuneracionServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:149 |
| PoliticaRemuneracionServiceImpl | validarPolitica | PoliticaDivisionSueldo division, List<String> diasLaborables, TratamientoAusencias ausencias | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:209 |
| PoliticaRemuneracionServiceImpl | validarPoliticaEmpresa | PoliticaDivisionSueldo division, List<String> diasLaborables, TratamientoAusencias ausencias | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:222 |
| PoliticaRemuneracionServiceImpl | empresaPorDefecto |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:234 |
| PoliticaRemuneracionServiceImpl | sedeDe | RrhhLegajoDigital legajo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:243 |
| PoliticaRemuneracionServiceImpl | normalizarDias | List<String> dias | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:248 |
| PoliticaRemuneracionServiceImpl | aDayOfWeek | List<String> dias | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:253 |
| PoliticaRemuneracionServiceImpl | dinero | BigDecimal valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:263 |
| PoliticaRemuneracionServiceImpl | heredar | T delEmpleado, T delSede, T deLaEmpresa | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PoliticaRemuneracionServiceImpl.java:270 |
| PortafolioService | listar |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:30 |
| PortafolioService | crear | ProyectoPortafolioRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:35 |
| PortafolioService | actualizar | UUID id, ProyectoPortafolioRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:44 |
| PortafolioService | eliminar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:52 |
| PortafolioService | aplicar | ProyectoPortafolio proyecto, ProyectoPortafolioRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:57 |
| PortafolioService | buscar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:81 |
| PortafolioService | dto | ProyectoPortafolio proyecto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:85 |
| PortafolioService | exigirPalabras | String texto, int tope, String mensaje | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:93 |
| PortafolioService | palabras | String texto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:97 |
| PortafolioService | etiquetas | List<String> crudas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:102 |
| PortafolioService | imagenes | ProyectoPortafolioRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:119 |
| PortafolioService | url | String valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:136 |
| PortafolioService | limpio | String valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortafolioService.java:155 |
| PortalPublicoService | catalogo | UUID categoriaId, String busqueda, boolean soloDestacados, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:57 |
| PortalPublicoService | producto | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:67 |
| PortalPublicoService | sedes |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:73 |
| PortalPublicoService | categorias |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:79 |
| PortalPublicoService | ofertas |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:85 |
| PortalPublicoService | servicios |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:91 |
| PortalPublicoService | destacados |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:97 |
| PortalPublicoService | empresa |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:102 |
| PortalPublicoService | portafolio |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:143 |
| PortalPublicoService | proyecto | ProyectoPortafolio proyecto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:147 |
| PortalPublicoService | saldos | List<Producto> productos | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:155 |
| PortalPublicoService | ficha | Producto producto, Map<UUID, BigDecimal> saldos | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:167 |
| PortalPublicoService | servicioPublico | Servicio servicio | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:200 |
| PortalPublicoService | texto | String valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:204 |
| PortalPublicoService | unir | String direccion, String ciudad | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:210 |
| PortalPublicoService | sedePublica | Sede sede | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:216 |
| PortalPublicoService | imagen | String ruta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PortalPublicoService.java:220 |
| PreformaServiceImpl | crear | PreformaVentaRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:100 |
| PreformaServiceImpl | obtener | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:125 |
| PreformaServiceImpl | actualizar | UUID id, PreformaVentaRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:133 |
| PreformaServiceImpl | eliminar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:161 |
| PreformaServiceImpl | confirmar | UUID id, ConfirmarPreformaRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:178 |
| PreformaServiceImpl | cancelar | UUID id, CancelarPreformaRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:239 |
| PreformaServiceImpl | abiertasDelUsuario |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:260 |
| PreformaServiceImpl | vencidas | UUID sedeId, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:270 |
| PreformaServiceImpl | dashboard | UUID sedeId, LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:279 |
| PreformaServiceImpl | expirarVencidas |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:309 |
| PreformaServiceImpl | calcularTodas | List<DetallePreformaRequestDTO> lineas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:320 |
| PreformaServiceImpl | aplicarTotales | PreformaVenta p, List<Calculada> lineas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:355 |
| PreformaServiceImpl | guardarLineas | PreformaVenta p, List<Calculada> lineas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:363 |
| PreformaServiceImpl | comando | DetallePreforma d | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:372 |
| PreformaServiceImpl | expirarSiVencida | PreformaVenta p | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:381 |
| PreformaServiceImpl | exigirAbiertaVigente | PreformaVenta p, String accion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:389 |
| PreformaServiceImpl | generarCodigo |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:409 |
| PreformaServiceImpl | sedeActiva | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:414 |
| PreformaServiceImpl | cliente | UUID clienteId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:420 |
| PreformaServiceImpl | bloquear | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:425 |
| PreformaServiceImpl | respuesta | PreformaVenta p, List<DetallePreforma> detalles | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:430 |
| PreformaServiceImpl | datos | PreformaVenta p, String operacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:434 |
| PreformaServiceImpl | blankANull | String s | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:443 |
| PreformaServiceImpl | esAdmin | User u | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:447 |
| PreformaServiceImpl | exigirAdmin | User u | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:451 |
| PreformaServiceImpl | exigirCreadorOAdmin | User u, PreformaVenta p, String accion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:455 |
| PreformaServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/PreformaServiceImpl.java:461 |
| ProductoImagenService | guardar | MultipartFile archivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImagenService.java:26 |
| ProductoImagenService | aplicar | ProductoRequestDTO dto, MultipartFile archivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImagenService.java:53 |
| ProductoImagenService | cargar | String ruta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImagenService.java:89 |
| ProductoImportacionServiceImpl | importar | ProductoImportacionRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:57 |
| ProductoImportacionServiceImpl | exportar | String searchTerm, UUID categoriaId, TipoProducto tipo, Boolean activo, Boolean esFraccionable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:102 |
| ProductoImportacionServiceImpl | exportar | String searchTerm, UUID categoriaId, TipoProducto tipo, Boolean activo, Boolean esFraccionable, UUID sedeId, UUID almacenId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:109 |
| ProductoImportacionServiceImpl | preparar | int numero, ProductoImportacionFilaDTO fila, Set<String> skus | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:122 |
| ProductoImportacionServiceImpl | requestDe | Producto existente, ProductoImportacionFilaDTO fila, Categoria categoria, String sku | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:146 |
| ProductoImportacionServiceImpl | fraccionesDe | Producto existente, Boolean fraccionable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:241 |
| ProductoImportacionServiceImpl | resolverCategoria | String texto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:258 |
| ProductoImportacionServiceImpl | resolverAlmacen | String texto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:275 |
| ProductoImportacionServiceImpl | stockDe | BigDecimal stock, boolean existente | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:303 |
| ProductoImportacionServiceImpl | resolverTipo | String tipo, Producto existente | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:316 |
| ProductoImportacionServiceImpl | validarImagenDeclarada | String imagen | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:327 |
| ProductoImportacionServiceImpl | registrarEntrada | UUID productoId, Almacen almacen, BigDecimal cantidad, String sku | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:344 |
| ProductoImportacionServiceImpl | filaDe | Producto producto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:359 |
| ProductoImportacionServiceImpl | texto | String valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:378 |
| ProductoImportacionServiceImpl | mensaje | RuntimeException ex | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:385 |
| ProductoImportacionServiceImpl | FilaLista | int numero, Producto existente, ProductoRequestDTO request, Almacen almacen, BigDecimal stock, String sku | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoImportacionServiceImpl.java:390 |
| ProductoServiceImpl | create | ProductoRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:75 |
| ProductoServiceImpl | update | UUID id, ProductoRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:97 |
| ProductoServiceImpl | findById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:121 |
| ProductoServiceImpl | search | String searchTerm, UUID categoriaId, TipoProducto tipo, Boolean activo, Boolean esFraccionable, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:130 |
| ProductoServiceImpl | searchPorUbicacion | String searchTerm, UUID categoriaId, TipoProducto tipo, Boolean activo, Boolean esFraccionable, UUID sedeId, UUID almacenId, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:145 |
| ProductoServiceImpl | delete | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:162 |
| ProductoServiceImpl | isSkuDisponible | String codigoSku, UUID excludeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:180 |
| ProductoServiceImpl | getDashboardStatistics |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:194 |
| ProductoServiceImpl | registrarStockInicialSiAplica | Producto producto, ProductoRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:225 |
| ProductoServiceImpl | procesarFracciones | Producto producto, ProductoRequestDTO requestDTO, BigDecimal precioAnterior | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:267 |
| ProductoServiceImpl | validarFactores | List<CatalogoFraccionRequestDTO> pedidas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:319 |
| ProductoServiceImpl | buscarPorFactor | List<CatalogoFraccion> actuales, BigDecimal factor, Set<CatalogoFraccion> usadas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:335 |
| ProductoServiceImpl | resolverPrecio | Producto producto, CatalogoFraccionRequestDTO dto, BigDecimal precioAnterior | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:350 |
| ProductoServiceImpl | precioProporcional | BigDecimal precio, BigDecimal base, BigDecimal factor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:365 |
| ProductoServiceImpl | conservarConHistorial | List<CatalogoFraccion> actuales, Set<CatalogoFraccion> usadas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:372 |
| ProductoServiceImpl | reemplazarFracciones | Producto producto, List<CatalogoFraccion> destino | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:386 |
| ProductoServiceImpl | generarFraccionesEstandar | Producto producto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:396 |
| ProductoServiceImpl | calcularPrecioFraccion | BigDecimal precioBase, BigDecimal factor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:418 |
| ProductoServiceImpl | findEntityById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:425 |
| ProductoServiceImpl | validateSkuAvailability | String codigoSku, UUID excludeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:431 |
| ProductoServiceImpl | resolverReferencias | Producto producto, ProductoRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:437 |
| ProductoServiceImpl | normalize | Producto producto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:452 |
| ProductoServiceImpl | normalizarImagen | String imagen | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:465 |
| ProductoServiceImpl | descartarImagenAnterior | String anterior, String nueva | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:486 |
| ProductoServiceImpl | FraccionEstandar | String nombre, BigDecimal factor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProductoServiceImpl.java:492 |
| ProveedorServiceImpl | create | ProveedorRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:36 |
| ProveedorServiceImpl | update | UUID id, ProveedorRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:45 |
| ProveedorServiceImpl | findById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:55 |
| ProveedorServiceImpl | findByDocumento | String tipoDocumento, String numeroDocumento | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:61 |
| ProveedorServiceImpl | delete | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:70 |
| ProveedorServiceImpl | search | String searchTerm, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:86 |
| ProveedorServiceImpl | findAll | Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:96 |
| ProveedorServiceImpl | findByActivo | Boolean activo, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:102 |
| ProveedorServiceImpl | findWithIncompleteContactData |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:108 |
| ProveedorServiceImpl | getDashboardStatistics |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:116 |
| ProveedorServiceImpl | getStatisticsByDocumentType |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:128 |
| ProveedorServiceImpl | isDocumentoDisponible | String tipoDocumento, String numeroDocumento, UUID excludeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:139 |
| ProveedorServiceImpl | findEntityById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:145 |
| ProveedorServiceImpl | validateDocumentAvailability | String tipoDocumento, String numeroDocumento, UUID excludeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:151 |
| ProveedorServiceImpl | validateCreditTerms | ProveedorRequestDTO requestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ProveedorServiceImpl.java:157 |
| ReembolsoServiceImpl | crear | ReembolsoRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReembolsoServiceImpl.java:64 |
| ReembolsoServiceImpl | obtener | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReembolsoServiceImpl.java:109 |
| ReembolsoServiceImpl | buscar | UUID sedeId, EstadoReembolso estado, MetodoReembolso metodo, LocalDate desde, LocalDate hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReembolsoServiceImpl.java:116 |
| ReembolsoServiceImpl | procesar | UUID id, ProcesarReembolsoRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReembolsoServiceImpl.java:128 |
| ReembolsoServiceImpl | efectivoDisponible | TurnoCaja turno | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReembolsoServiceImpl.java:177 |
| ReembolsoServiceImpl | datos | Reembolso r, String operacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReembolsoServiceImpl.java:182 |
| ReembolsoServiceImpl | blankANull | String s | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReembolsoServiceImpl.java:192 |
| ReembolsoServiceImpl | cero | BigDecimal v | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReembolsoServiceImpl.java:196 |
| ReembolsoServiceImpl | exigirAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReembolsoServiceImpl.java:200 |
| ReembolsoServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReembolsoServiceImpl.java:206 |
| RegimenRemuneracionServiceImpl | obtenerMio |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:79 |
| RegimenRemuneracionServiceImpl | guardar | RegimenRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:87 |
| RegimenRemuneracionServiceImpl | resumen | UUID sedeId, YearMonth periodo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:130 |
| RegimenRemuneracionServiceImpl | componenteActivo | UUID userId, Componente componente | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:275 |
| RegimenRemuneracionServiceImpl | defaults | User admin | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:288 |
| RegimenRemuneracionServiceImpl | legajoDe | UUID userId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:299 |
| RegimenRemuneracionServiceImpl | baseRepartoDe | UtilidadNetaResponseDTO empresa, BaseRepartoUtilidad base | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:303 |
| RegimenRemuneracionServiceImpl | validar | RegimenRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:311 |
| RegimenRemuneracionServiceImpl | responder | RrhhRegimenRemuneracion r, RrhhLegajoDigital legajo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:331 |
| RegimenRemuneracionServiceImpl | snapshot | RrhhRegimenRemuneracion r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:350 |
| RegimenRemuneracionServiceImpl | exigirAdminAutenticado |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:362 |
| RegimenRemuneracionServiceImpl | dinero | BigDecimal valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:372 |
| RegimenRemuneracionServiceImpl | escalar2 | BigDecimal valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:376 |
| RegimenRemuneracionServiceImpl | normalizar | BigDecimal valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RegimenRemuneracionServiceImpl.java:380 |
| ReporteCsv | fecha | LocalDateTime f | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteCsv.java:87 |
| ReporteCsv | fecha | LocalDate f | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteCsv.java:91 |
| ReporteCsv | nombre | Enum<?> e | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteCsv.java:95 |
| ReporteServiceImpl | resumenVentas | FiltroVentasReporteDTO f, AgrupacionReporte agrupacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:122 |
| ReporteServiceImpl | ventas | FiltroVentasReporteDTO f, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:169 |
| ReporteServiceImpl | exportarVentas | FiltroVentasReporteDTO f | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:179 |
| ReporteServiceImpl | siguientePeriodo | LocalDate inicio, AgrupacionReporte g | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:245 |
| ReporteServiceImpl | metodosPago | List<Venta> ventas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:263 |
| ReporteServiceImpl | estado | FiltroVentasReporteDTO f | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:277 |
| ReporteServiceImpl | rentabilidad | LocalDate desde, LocalDate hasta, UUID sedeId, UUID categoriaId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:284 |
| ReporteServiceImpl | exportarRentabilidad | LocalDate desde, LocalDate hasta, UUID sedeId, UUID categoriaId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:291 |
| ReporteServiceImpl | productosEstrella | LocalDate desde, LocalDate hasta, UUID sedeId, UUID categoriaId, CriterioRankingProducto criterio, Integer top | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:304 |
| ReporteServiceImpl | sinCostos | RentabilidadReporteDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:398 |
| ReporteServiceImpl | Parcial | String tipo, UUID id, String nombre, String sku, String categoria, String unidad, long ventas, BigDecimal cantidadVendida, BigDecimal cantidadDevuelta, BigDecimal ingresoNeto, BigDecimal devolucionesNeto, BigDecimal costoUnitario | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:405 |
| ReporteServiceImpl | clientesFrecuentes | LocalDate desde, LocalDate hasta, UUID sedeId, CriterioRankingCliente criterio, Integer top | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:416 |
| ReporteServiceImpl | exportarClientes | LocalDate desde, LocalDate hasta, UUID sedeId, CriterioRankingCliente criterio | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:428 |
| ReporteServiceImpl | rankingProveedores | LocalDate desde, LocalDate hasta, UUID sedeId, CriterioRankingProveedor criterio, Integer top | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:501 |
| ReporteServiceImpl | exportarProveedores | LocalDate desde, LocalDate hasta, UUID sedeId, CriterioRankingProveedor criterio | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:522 |
| ReporteServiceImpl | arqueos | LocalDate desde, LocalDate hasta, UUID sedeId, UUID usuarioId, EstadoTurno estado, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:582 |
| ReporteServiceImpl | exportarArqueos | LocalDate desde, LocalDate hasta, UUID sedeId, UUID usuarioId, EstadoTurno estado | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:605 |
| ReporteServiceImpl | acceso | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:700 |
| ReporteServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:710 |
| ReporteServiceImpl | exigirAdmin |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:716 |
| ReporteServiceImpl | esAdmin | User u | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:722 |
| ReporteServiceImpl | maxFilas |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:732 |
| ReporteServiceImpl | exigirTope | long filas, int max, String que | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:736 |
| ReporteServiceImpl | datos | String reporte, Rango r, UUID sedeId, long filas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:743 |
| ReporteServiceImpl | archivo | User admin, String nombre, StringBuilder csv, Map<String, Object> datos | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:754 |
| ReporteServiceImpl | sinOrden | Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:762 |
| ReporteServiceImpl | cantidad | BigDecimal v | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:770 |
| ReporteServiceImpl | nvl | BigDecimal v | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:785 |
| ReporteServiceImpl | n | Long v | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:789 |
| ReporteServiceImpl | texto | Object o | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:793 |
| ReporteServiceImpl | max | LocalDate a, LocalDate b | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:797 |
| ReporteServiceImpl | min | LocalDate a, LocalDate b | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:801 |
| ReporteServiceImpl | nombreCompleto | User u | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ReporteServiceImpl.java:814 |
| RetiroSocioServiceImpl | registrar | RetiroSocioRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:68 |
| RetiroSocioServiceImpl | obtener | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:126 |
| RetiroSocioServiceImpl | buscar | UUID adminId, UUID sedeId, EstadoRetiro estado, OrigenFondos origen, LocalDate desde, LocalDate hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:133 |
| RetiroSocioServiceImpl | anular | UUID id, AnularRetiroRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:145 |
| RetiroSocioServiceImpl | dashboard | UUID sedeId, LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:194 |
| RetiroSocioServiceImpl | efectivoDisponible | TurnoCaja turno | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:227 |
| RetiroSocioServiceImpl | resolverSede | UUID sedeId, User admin | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:232 |
| RetiroSocioServiceImpl | buscarRetiro | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:242 |
| RetiroSocioServiceImpl | agregarObservacion | TurnoCaja turno, String linea | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:247 |
| RetiroSocioServiceImpl | validarRango | LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:252 |
| RetiroSocioServiceImpl | inicio | LocalDate desde | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:258 |
| RetiroSocioServiceImpl | finExclusivo | LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:262 |
| RetiroSocioServiceImpl | cero | BigDecimal valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:266 |
| RetiroSocioServiceImpl | nombre | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:270 |
| RetiroSocioServiceImpl | exigirAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:275 |
| RetiroSocioServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RetiroSocioServiceImpl.java:281 |
| RolImpl | createRol | RolRequestDTO rolRequestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RolImpl.java:33 |
| RolImpl | getRoles |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RolImpl.java:44 |
| RolImpl | updateRol | UUID id, RolRequestDTO rolRequestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RolImpl.java:54 |
| RolImpl | deleteRol | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RolImpl.java:69 |
| RolImpl | getRolById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RolImpl.java:77 |
| RolImpl | actualizarPermisos | UUID id, String grupo, Map<String, Boolean> permisos | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RolImpl.java:88 |
| RrhhAsistenciaImpl | procesarMarcacionQr | AsistenciaQrDTO qrRequest | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:73 |
| RrhhAsistenciaImpl | procesarMarcacionManual | RrhhAsistenciaRequestDTO manualRequest | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:152 |
| RrhhAsistenciaImpl | determinarTipoMarcacion | UUID empleadoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:182 |
| RrhhAsistenciaImpl | validarMarcacion | UUID empleadoId, TipoMarcacion tipo, LocalDateTime fechaHora | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:199 |
| RrhhAsistenciaImpl | calcularEstado | TipoMarcacion tipo, LocalDateTime fechaHora, TurnoDelDiaDTO turno | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:224 |
| RrhhAsistenciaImpl | crearAsistencia | User usuario, TipoMarcacion tipo, LocalDateTime fechaHora, String dispositivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:238 |
| RrhhAsistenciaImpl | listarTodas | Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:279 |
| RrhhAsistenciaImpl | buscarPorEmpleado | UUID empleadoId, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:285 |
| RrhhAsistenciaImpl | buscarPorId | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:291 |
| RrhhAsistenciaImpl | actualizarMarcacionManual | UUID id, RrhhAsistenciaRequestDTO updateRequest | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:299 |
| RrhhAsistenciaImpl | eliminarMarcacion | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:312 |
| RrhhAsistenciaImpl | listarAsistencias |  UUID empleadoId, LocalDateTime fechaInicio, LocalDateTime fechaFin, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:320 |
| RrhhAsistenciaImpl | misAsistencias |  UUID empleadoId, LocalDateTime fechaInicio, LocalDateTime fechaFin, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:343 |
| RrhhAsistenciaImpl | obtenerDashboard | UUID empleadoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:369 |
| RrhhAsistenciaImpl | obtenerUltimaMarcacion | UUID empleadoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:401 |
| RrhhAsistenciaImpl | obtenerEstadoDelDia | UUID empleadoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:410 |
| RrhhAsistenciaImpl | qrPersonal |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:432 |
| RrhhAsistenciaImpl | marcarPorQrEscaneado | String payload | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:455 |
| RrhhAsistenciaImpl | roster | LocalDate fecha, UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:514 |
| RrhhAsistenciaImpl | marcarLote | MarcarLoteRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:558 |
| RrhhAsistenciaImpl | secretoPersonalDe | User usuario | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:627 |
| RrhhAsistenciaImpl | ultimaDeTipo | List<RrhhAsistencia> marcas, TipoMarcacion tipo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:639 |
| RrhhAsistenciaImpl | calcularHorasEnCurso | RrhhAsistencia entrada, RrhhAsistencia salida | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:651 |
| RrhhAsistenciaImpl | origen | List<RrhhAsistencia> marcas | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:659 |
| RrhhAsistenciaImpl | turnoDe | UUID empleadoId, LocalDateTime inicioDia | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:668 |
| RrhhAsistenciaImpl | nombre | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:673 |
| RrhhAsistenciaImpl | exigirAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:677 |
| RrhhAsistenciaImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/RrhhAsistenciaImpl.java:683 |
| SedeServiceImpl | crearSede | SedeRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:40 |
| SedeServiceImpl | listarTodas | Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:56 |
| SedeServiceImpl | listarPorEstado | Boolean activa, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:63 |
| SedeServiceImpl | buscarPorId | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:69 |
| SedeServiceImpl | actualizarSede | UUID id, SedeRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:78 |
| SedeServiceImpl | validarPoliticaDeSede | SedeRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:99 |
| SedeServiceImpl | mapa |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:109 |
| SedeServiceImpl | guardarImagen | UUID id, MultipartFile archivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:118 |
| SedeServiceImpl | eliminarSede | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:137 |
| SedeServiceImpl | completarUbicacion | Sede sede | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:151 |
| SedeServiceImpl | aMapa | Sede sede | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SedeServiceImpl.java:159 |
| ServicioImportacionServiceImpl | plantilla |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioImportacionServiceImpl.java:31 |
| ServicioImportacionServiceImpl | importar | MultipartFile archivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioImportacionServiceImpl.java:42 |
| ServicioImportacionServiceImpl | parseActivo | String valor, int numeroFila | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioImportacionServiceImpl.java:76 |
| ServicioImportacionServiceImpl | leerCsv | MultipartFile archivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioImportacionServiceImpl.java:82 |
| ServicioImportacionServiceImpl | detectarSeparador | String contenido | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioImportacionServiceImpl.java:138 |
| ServicioImportacionServiceImpl | leerExcel | MultipartFile archivo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioImportacionServiceImpl.java:159 |
| ServicioServiceImpl | create | ServicioRequestDTO dto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:41 |
| ServicioServiceImpl | update | UUID id, ServicioRequestDTO dto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:54 |
| ServicioServiceImpl | findById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:74 |
| ServicioServiceImpl | search | String searchTerm, Boolean activo, BigDecimal precioMin, BigDecimal precioMax, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:84 |
| ServicioServiceImpl | delete | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:91 |
| ServicioServiceImpl | isNombreDisponible | String nombre, UUID excludeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:102 |
| ServicioServiceImpl | getDashboardStatistics |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:113 |
| ServicioServiceImpl | aplicarColaboradores | Servicio servicio, List<ServicioColaboradorRequestDTO> pedidos | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:124 |
| ServicioServiceImpl | normalizarParticipacion | String participacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:172 |
| ServicioServiceImpl | responder | Servicio servicio | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/ServicioServiceImpl.java:180 |
| StockOperacionServiceImpl | registrarAjuste | AjusteStockRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:89 |
| StockOperacionServiceImpl | buscarAjustes | UUID productoId, UUID almacenId, UUID sedeId, UUID userId, TipoMovimiento tipo, LocalDate desde, LocalDate hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:154 |
| StockOperacionServiceImpl | transferir | TransferenciaStockRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:166 |
| StockOperacionServiceImpl | buscarTransferencias | UUID productoId, UUID almacenId, UUID sedeId, boolean soloEntreSedes, LocalDate desde, LocalDate hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:221 |
| StockOperacionServiceImpl | obtenerTransferencia | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:232 |
| StockOperacionServiceImpl | bajoStock | UUID sedeId, UUID almacenId, String busqueda, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:249 |
| StockOperacionServiceImpl | consolidado | UUID sedeId, String busqueda, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:262 |
| StockOperacionServiceImpl | dashboard | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:271 |
| StockOperacionServiceImpl | exigirAccesoSede | User u, Almacen a | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:310 |
| StockOperacionServiceImpl | visible | AjusteStockResponseDTO d, User u | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:318 |
| StockOperacionServiceImpl | producto | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:326 |
| StockOperacionServiceImpl | almacenActivo | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:330 |
| StockOperacionServiceImpl | codigo | String prefijo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:336 |
| StockOperacionServiceImpl | rango | LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:345 |
| StockOperacionServiceImpl | sinOrden | Pageable p | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:352 |
| StockOperacionServiceImpl | sedeId | Almacen a | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:356 |
| StockOperacionServiceImpl | sedeId | User u | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:360 |
| StockOperacionServiceImpl | texto | String s | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:364 |
| StockOperacionServiceImpl | nvl | String s | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:368 |
| StockOperacionServiceImpl | esAdmin | User u | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:372 |
| StockOperacionServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockOperacionServiceImpl.java:376 |
| StockServiceImpl | findByAlmacenAndProducto | UUID almacenId, UUID productoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockServiceImpl.java:54 |
| StockServiceImpl | findByProducto | UUID productoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockServiceImpl.java:63 |
| StockServiceImpl | searchByAlmacen | UUID almacenId, String searchTerm, boolean soloBajoStock, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockServiceImpl.java:71 |
| StockServiceImpl | saveOrUpdate | StockRequestDTO dto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockServiceImpl.java:87 |
| StockServiceImpl | registrarStockInicial | UUID productoId, UUID almacenId, BigDecimal cantidad, BigDecimal stockMinimo, BigDecimal stockMaximo, BigDecimal puntoReposicion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockServiceImpl.java:140 |
| StockServiceImpl | findResumenPorProducto | UUID productoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockServiceImpl.java:175 |
| StockServiceImpl | almacenConAcceso | UUID almacenId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockServiceImpl.java:199 |
| StockServiceImpl | esAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockServiceImpl.java:216 |
| StockServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/StockServiceImpl.java:220 |
| SunatFacturacionClientPendiente | enlace |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SunatFacturacionClientPendiente.java:13 |
| SunatFacturacionClientPendiente | emitir |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SunatFacturacionClientPendiente.java:18 |
| SunatFacturacionClientPendiente | consultarValidez | String serie, String documentoCliente | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/SunatFacturacionClientPendiente.java:23 |
| TurnoCajaServiceImpl | abrir | AperturaCajaRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:43 |
| TurnoCajaServiceImpl | cerrar | UUID turnoId, CierreCajaRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:54 |
| TurnoCajaServiceImpl | resumen | UUID turnoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:71 |
| TurnoCajaServiceImpl | turnoAbierto | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:78 |
| TurnoCajaServiceImpl | construirResumen | TurnoCaja turno, BigDecimal declarado | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:86 |
| TurnoCajaServiceImpl | obtenerPropioAbierto | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:105 |
| TurnoCajaServiceImpl | cero | BigDecimal valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:112 |
| TurnoCajaServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoCajaServiceImpl.java:116 |
| TurnoTrabajoServiceImpl | crear | TurnoTrabajoRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:69 |
| TurnoTrabajoServiceImpl | obtener | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:89 |
| TurnoTrabajoServiceImpl | actualizar | UUID id, TurnoTrabajoRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:96 |
| TurnoTrabajoServiceImpl | eliminar | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:123 |
| TurnoTrabajoServiceImpl | buscar | UUID sedeId, UUID userId, Boolean activo, String nombreTurno, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:139 |
| TurnoTrabajoServiceImpl | asignar | AsignarTurnoRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:147 |
| TurnoTrabajoServiceImpl | porEmpleado | UUID userId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:184 |
| TurnoTrabajoServiceImpl | dashboard | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:194 |
| TurnoTrabajoServiceImpl | turnoDelDia | UUID userId, LocalDateTime marcacion | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:242 |
| TurnoTrabajoServiceImpl | verificarCruces | User empleado, Horario h, UUID excluirId, List<RrhhTurnoTrabajo> existentes | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:269 |
| TurnoTrabajoServiceImpl | describirCruce | Horario h, UUID excluirId, List<RrhhTurnoTrabajo> existentes | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:275 |
| TurnoTrabajoServiceImpl | aplicar | RrhhTurnoTrabajo turno, Horario h, User empleado, Sede sede | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:286 |
| TurnoTrabajoServiceImpl | empleadoActivo | UUID userId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:298 |
| TurnoTrabajoServiceImpl | resolverSede | UUID sedeId, User empleado | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:307 |
| TurnoTrabajoServiceImpl | sede | UUID sedeId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:314 |
| TurnoTrabajoServiceImpl | buscarTurno | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:319 |
| TurnoTrabajoServiceImpl | primerDia | List<String> dias | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:324 |
| TurnoTrabajoServiceImpl | horas | long minutos | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:330 |
| TurnoTrabajoServiceImpl | snapshot | RrhhTurnoTrabajo t | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:334 |
| TurnoTrabajoServiceImpl | nombre | User u | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:346 |
| TurnoTrabajoServiceImpl | esAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:350 |
| TurnoTrabajoServiceImpl | exigirAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:354 |
| TurnoTrabajoServiceImpl | exigirAdminODueno | User user, UUID duenoId | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:358 |
| TurnoTrabajoServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/TurnoTrabajoServiceImpl.java:364 |
| UserImpl | fijarRelacionesGestionadas | User user, UserRequestDTO dto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UserImpl.java:47 |
| UserImpl | createUser | UserRequestDTO userRequestDTO | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UserImpl.java:65 |
| UserImpl | getUsers |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UserImpl.java:93 |
| UserImpl | findById | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UserImpl.java:104 |
| UserImpl | updateUser | UUID id, UserRequestDTO dto | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UserImpl.java:113 |
| UserImpl | DeleteUser | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UserImpl.java:171 |
| UtilidadNetaServiceImpl | calcular | UUID sedeId, LocalDate desde, LocalDate hasta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UtilidadNetaServiceImpl.java:56 |
| UtilidadNetaServiceImpl | calcularPorPeriodo | UUID sedeId, String periodo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UtilidadNetaServiceImpl.java:120 |
| UtilidadNetaServiceImpl | neto | TotalesFinancierosProjection p | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UtilidadNetaServiceImpl.java:132 |
| UtilidadNetaServiceImpl | cantidad | TotalesFinancierosProjection p | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UtilidadNetaServiceImpl.java:136 |
| UtilidadNetaServiceImpl | cero | BigDecimal valor | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UtilidadNetaServiceImpl.java:140 |
| UtilidadNetaServiceImpl | exigirAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UtilidadNetaServiceImpl.java:144 |
| UtilidadNetaServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/UtilidadNetaServiceImpl.java:150 |
| VentaServiceImpl | registrar | RegistrarVentaRequestDTO r | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:45 |
| VentaServiceImpl | obtener | UUID id | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:95 |
| VentaServiceImpl | buscar | UUID sedeId, UUID userId, UUID clienteId, EstadoVenta estado, CanalVenta canal, LocalDateTime desde, LocalDateTime hasta, Pageable pageable | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:102 |
| VentaServiceImpl | anular | UUID id, AnularVentaRequestDTO request | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:114 |
| VentaServiceImpl | siguienteNumero | UUID sedeId, TipoComprobante tipo | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:140 |
| VentaServiceImpl | detalle | Venta v | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:152 |
| VentaServiceImpl | calcularLinea | LineaVentaCommandDTO l | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:168 |
| VentaServiceImpl | usuarioActual |  | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:182 |
| VentaServiceImpl | esAdmin | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:183 |
| VentaServiceImpl | sedeId | User user | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:184 |
| VentaServiceImpl | sedeIdPermitida | User user, UUID solicitada | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:188 |
| VentaServiceImpl | exigirAccesoSede | Venta venta | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:193 |
| VentaServiceImpl | LineaCalculada | Producto producto, Servicio servicio, CatalogoFraccion fraccion, BigDecimal precio, BigDecimal neto, BigDecimal igv, BigDecimal total | backend/src/main/java/com/policalum/erp/application/service/serviceImpl/VentaServiceImpl.java:199 |
| CalculoCotizacion | porcentaje | BigDecimal base, BigDecimal porcentaje | backend/src/main/java/com/policalum/erp/application/service/support/CalculoCotizacion.java:13 |
| CalculoCotizacion | movilidad | BigDecimal precioBase, int unidadesIncluidas, BigDecimal precioUnidadExtra, BigDecimal cantidad | backend/src/main/java/com/policalum/erp/application/service/support/CalculoCotizacion.java:22 |
| CalculoCotizacion | dinero | BigDecimal valor | backend/src/main/java/com/policalum/erp/application/service/support/CalculoCotizacion.java:32 |
| RangosConsulta | desde | LocalDateTime value | backend/src/main/java/com/policalum/erp/application/service/support/RangosConsulta.java:21 |
| RangosConsulta | hasta | LocalDateTime value | backend/src/main/java/com/policalum/erp/application/service/support/RangosConsulta.java:25 |
| RangosConsulta | desde | LocalDate value | backend/src/main/java/com/policalum/erp/application/service/support/RangosConsulta.java:29 |
| RangosConsulta | hasta | LocalDate value | backend/src/main/java/com/policalum/erp/application/service/support/RangosConsulta.java:33 |
| TotpConfigService | configurarTOTP | UUID empleadoId | backend/src/main/java/com/policalum/erp/application/service/TotpConfigService.java:26 |
| TotpConfigService | tieneTOTPConfigurado | UUID empleadoId | backend/src/main/java/com/policalum/erp/application/service/TotpConfigService.java:43 |
| TotpConfigService | desactivarTOTP | UUID empleadoId | backend/src/main/java/com/policalum/erp/application/service/TotpConfigService.java:53 |
| TotpService | generateSecret |  | backend/src/main/java/com/policalum/erp/application/service/TotpService.java:62 |
| TotpService | currentWindow |  | backend/src/main/java/com/policalum/erp/application/service/TotpService.java:71 |
| TotpService | secondsRemaining |  | backend/src/main/java/com/policalum/erp/application/service/TotpService.java:78 |
| TotpService | expiresAtEpoch |  | backend/src/main/java/com/policalum/erp/application/service/TotpService.java:86 |
| TotpService | code | String secret, long window | backend/src/main/java/com/policalum/erp/application/service/TotpService.java:93 |
| TotpService | verify | String secret, String code | backend/src/main/java/com/policalum/erp/application/service/TotpService.java:117 |
| TotpService | verify | String secret, long window, String code | backend/src/main/java/com/policalum/erp/application/service/TotpService.java:131 |
| TotpService | generarTokenParaEmpleado | UUID empleadoId | backend/src/main/java/com/policalum/erp/application/service/TotpService.java:143 |
| TotpService | validarTokenYObtenerEmpleadoId | String payload | backend/src/main/java/com/policalum/erp/application/service/TotpService.java:170 |
| TotpService | getTiempoRestante |  | backend/src/main/java/com/policalum/erp/application/service/TotpService.java:222 |
| TotpService | hmacSha256 | byte[] data | backend/src/main/java/com/policalum/erp/application/service/TotpService.java:231 |
| TotpService | constantTimeEquals | byte[] a, byte[] b | backend/src/main/java/com/policalum/erp/application/service/TotpService.java:246 |
| TotpService | generarClaveSecreta |  | backend/src/main/java/com/policalum/erp/application/service/TotpService.java:260 |
