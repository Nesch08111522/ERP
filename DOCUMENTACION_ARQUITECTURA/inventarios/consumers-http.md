# consumers-http

Inventario de llamadas candidatas, no prueba de alcanzabilidad desde pantalla ni correspondencia endpoint-consumer completa. Se excluyen especificaciones y catalogos generados para evitar falsos consumidores.

| Operacion | ID o expresion | Evidencia |
| --- | --- | --- |
| get | this.http.get<T>(url, { params });  | frontend/src/app/core/api/backend-api.service.ts:47 |
| post | this.http.post<T>(url, body ?? {}, { params });  | frontend/src/app/core/api/backend-api.service.ts:48 |
| put | this.http.put<T>(url, body ?? {}, { params });  | frontend/src/app/core/api/backend-api.service.ts:49 |
| patch | this.http.patch<T>(url, body ?? {}, { params });  | frontend/src/app/core/api/backend-api.service.ts:50 |
| delete | this.http.delete<T>(url, { params });  | frontend/src/app/core/api/backend-api.service.ts:51 |
| post | http.post<LoginResponse>(`${environment.apiUrl}/api/v1/auth/refresh`, { refreshToken: refresh }).pipe(  | frontend/src/app/core/interceptors/api-error.interceptor.ts:79 |
| execute | this.api.execute<Api.PageAlmacenResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_almacenes"], params, params); }  | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_almacenes | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:12 |
| execute | this.api.execute<Api.AlmacenResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_almacenes"], params, params, body); }  | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_almacenes | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:13 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_almacenes_estadisticas_dashboard"], params, params); }  | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_almacenes_estadisticas_dashboard | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:14 |
| execute | this.api.execute<Array<Api.AlmacenResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_almacenes_sede_sedeId"], params, params); }  | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_almacenes_sede_sedeId | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:15 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_almacenes_validar_nombre"], params, params); }  | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_almacenes_validar_nombre | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:16 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_almacenes_id"], params, params); }  | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:17 |
| endpoint-id/SSE | DELETE_api_v1_almacenes_id | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:17 |
| execute | this.api.execute<Api.AlmacenResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_almacenes_id"], params, params); }  | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:18 |
| endpoint-id/SSE | GET_api_v1_almacenes_id | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:18 |
| execute | this.api.execute<Api.AlmacenResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_almacenes_id"], params, params, body); }  | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:19 |
| endpoint-id/SSE | PUT_api_v1_almacenes_id | frontend/src/app/features/almacenes/data-access/almacenes.api.ts:19 |
| execute | this.api.execute<Api.AuditoriaDashboardDTO>(ENDPOINT_BY_ID["GET_api_v1_auditoria_dashboard"], params, params); }  | frontend/src/app/features/auditoria/data-access/auditoria.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_auditoria_dashboard | frontend/src/app/features/auditoria/data-access/auditoria.api.ts:12 |
| execute | this.api.execute<Api.PageLogAuditoriaResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_auditoria_logs"], params, params); }  | frontend/src/app/features/auditoria/data-access/auditoria.api.ts:13 |
| endpoint-id/SSE | GET_api_v1_auditoria_logs | frontend/src/app/features/auditoria/data-access/auditoria.api.ts:13 |
| execute | this.api.execute<Array<Api.LogAuditoriaResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_auditoria_logs_entidad_tabla_registroId"], params, params); }  | frontend/src/app/features/auditoria/data-access/auditoria.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_auditoria_logs_entidad_tabla_registroId | frontend/src/app/features/auditoria/data-access/auditoria.api.ts:14 |
| execute | this.api.execute<string>(ENDPOINT_BY_ID["GET_api_v1_auditoria_logs_exportar"], params, params); }  | frontend/src/app/features/auditoria/data-access/auditoria.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_auditoria_logs_exportar | frontend/src/app/features/auditoria/data-access/auditoria.api.ts:15 |
| execute | this.api.execute<Api.PageLogAuditoriaResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_auditoria_logs_usuario_userId"], params, params); }  | frontend/src/app/features/auditoria/data-access/auditoria.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_auditoria_logs_usuario_userId | frontend/src/app/features/auditoria/data-access/auditoria.api.ts:16 |
| execute | this.api.execute<Api.LogAuditoriaResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_auditoria_logs_id"], params, params); }  | frontend/src/app/features/auditoria/data-access/auditoria.api.ts:17 |
| endpoint-id/SSE | GET_api_v1_auditoria_logs_id | frontend/src/app/features/auditoria/data-access/auditoria.api.ts:17 |
| execute | this.api.execute<Api.PageCatalogoFraccionResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_catalogo_fracciones"], params, params); }  | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_catalogo_fracciones | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:12 |
| execute | this.api.execute<Api.CatalogoFraccionResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_catalogo_fracciones"], params, params, body); }  | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_catalogo_fracciones | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:13 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_catalogo_fracciones_estadisticas_dashboard"], params, params); }  | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_catalogo_fracciones_estadisticas_dashboard | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:14 |
| execute | this.api.execute<Array<Api.CatalogoFraccionResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_catalogo_fracciones_producto_productoId_disponibles"], params, params); }  | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_catalogo_fracciones_producto_productoId_disponibles | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:15 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_catalogo_fracciones_validar_factor"], params, params); }  | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_catalogo_fracciones_validar_factor | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:16 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_catalogo_fracciones_id"], params, params); }  | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:17 |
| endpoint-id/SSE | DELETE_api_v1_catalogo_fracciones_id | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:17 |
| execute | this.api.execute<Api.CatalogoFraccionResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_catalogo_fracciones_id"], params, params); }  | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:18 |
| endpoint-id/SSE | GET_api_v1_catalogo_fracciones_id | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:18 |
| execute | this.api.execute<Api.CatalogoFraccionResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_catalogo_fracciones_id"], params, params, body); }  | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:19 |
| endpoint-id/SSE | PUT_api_v1_catalogo_fracciones_id | frontend/src/app/features/catalogo-fracciones/data-access/catalogo-fracciones.api.ts:19 |
| execute | this.api.execute<Api.PageCategoriaResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_categorias"], params, params); }  | frontend/src/app/features/categorias/data-access/categorias.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_categorias | frontend/src/app/features/categorias/data-access/categorias.api.ts:12 |
| execute | this.api.execute<Api.CategoriaResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_categorias"], params, params, body); }  | frontend/src/app/features/categorias/data-access/categorias.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_categorias | frontend/src/app/features/categorias/data-access/categorias.api.ts:13 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_categorias_estadisticas_dashboard"], params, params); }  | frontend/src/app/features/categorias/data-access/categorias.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_categorias_estadisticas_dashboard | frontend/src/app/features/categorias/data-access/categorias.api.ts:14 |
| execute | this.api.execute<Array<Api.CategoriaResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_categorias_raices"], params, params); }  | frontend/src/app/features/categorias/data-access/categorias.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_categorias_raices | frontend/src/app/features/categorias/data-access/categorias.api.ts:15 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_categorias_validar_slug"], params, params); }  | frontend/src/app/features/categorias/data-access/categorias.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_categorias_validar_slug | frontend/src/app/features/categorias/data-access/categorias.api.ts:16 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_categorias_id"], params, params); }  | frontend/src/app/features/categorias/data-access/categorias.api.ts:17 |
| endpoint-id/SSE | DELETE_api_v1_categorias_id | frontend/src/app/features/categorias/data-access/categorias.api.ts:17 |
| execute | this.api.execute<Api.CategoriaResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_categorias_id"], params, params); }  | frontend/src/app/features/categorias/data-access/categorias.api.ts:18 |
| endpoint-id/SSE | GET_api_v1_categorias_id | frontend/src/app/features/categorias/data-access/categorias.api.ts:18 |
| execute | this.api.execute<Api.CategoriaResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_categorias_id"], params, params, body); }  | frontend/src/app/features/categorias/data-access/categorias.api.ts:19 |
| endpoint-id/SSE | PUT_api_v1_categorias_id | frontend/src/app/features/categorias/data-access/categorias.api.ts:19 |
| execute | this.api.execute<Array<Api.CategoriaResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_categorias_parentId_hijas"], params, params); }  | frontend/src/app/features/categorias/data-access/categorias.api.ts:20 |
| endpoint-id/SSE | GET_api_v1_categorias_parentId_hijas | frontend/src/app/features/categorias/data-access/categorias.api.ts:20 |
| execute | this.api.execute<Api.PageClienteResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_clientes"], params, params); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_clientes | frontend/src/app/features/clientes/data-access/clientes.api.ts:12 |
| execute | this.api.execute<Api.ClienteResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_clientes"], params, params, body); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_clientes | frontend/src/app/features/clientes/data-access/clientes.api.ts:13 |
| execute | this.api.execute<Array<Api.ClienteResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_clientes_compras_activos"], params, params); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_clientes_compras_activos | frontend/src/app/features/clientes/data-access/clientes.api.ts:14 |
| execute | this.api.execute<Array<Api.ClienteResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_clientes_compras_inactivos"], params, params); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_clientes_compras_inactivos | frontend/src/app/features/clientes/data-access/clientes.api.ts:15 |
| execute | this.api.execute<Api.ClienteResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_clientes_documento_numeroDocumento"], params, params); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_clientes_documento_numeroDocumento | frontend/src/app/features/clientes/data-access/clientes.api.ts:16 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_clientes_estadisticas_count"], params, params); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:17 |
| endpoint-id/SSE | GET_api_v1_clientes_estadisticas_count | frontend/src/app/features/clientes/data-access/clientes.api.ts:17 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_clientes_estadisticas_dashboard"], params, params); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:18 |
| endpoint-id/SSE | GET_api_v1_clientes_estadisticas_dashboard | frontend/src/app/features/clientes/data-access/clientes.api.ts:18 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_clientes_estadisticas_hoy"], params, params); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:19 |
| endpoint-id/SSE | GET_api_v1_clientes_estadisticas_hoy | frontend/src/app/features/clientes/data-access/clientes.api.ts:19 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_clientes_estadisticas_tipo_documento"], params, params); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:20 |
| endpoint-id/SSE | GET_api_v1_clientes_estadisticas_tipo_documento | frontend/src/app/features/clientes/data-access/clientes.api.ts:20 |
| execute | this.api.execute<Array<Api.ClienteResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_clientes_incompletos"], params, params); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:21 |
| endpoint-id/SSE | GET_api_v1_clientes_incompletos | frontend/src/app/features/clientes/data-access/clientes.api.ts:21 |
| execute | this.api.execute<Array<Api.ClienteResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_clientes_recientes"], params, params); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:22 |
| endpoint-id/SSE | GET_api_v1_clientes_recientes | frontend/src/app/features/clientes/data-access/clientes.api.ts:22 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_clientes_validar_documento"], params, params); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:23 |
| endpoint-id/SSE | GET_api_v1_clientes_validar_documento | frontend/src/app/features/clientes/data-access/clientes.api.ts:23 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_clientes_validar_email"], params, params); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:24 |
| endpoint-id/SSE | GET_api_v1_clientes_validar_email | frontend/src/app/features/clientes/data-access/clientes.api.ts:24 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_clientes_id"], params, params); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:25 |
| endpoint-id/SSE | DELETE_api_v1_clientes_id | frontend/src/app/features/clientes/data-access/clientes.api.ts:25 |
| execute | this.api.execute<Api.ClienteResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_clientes_id"], params, params); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:26 |
| endpoint-id/SSE | GET_api_v1_clientes_id | frontend/src/app/features/clientes/data-access/clientes.api.ts:26 |
| execute | this.api.execute<Api.ClienteResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_clientes_id"], params, params, body); }  | frontend/src/app/features/clientes/data-access/clientes.api.ts:27 |
| endpoint-id/SSE | PUT_api_v1_clientes_id | frontend/src/app/features/clientes/data-access/clientes.api.ts:27 |
| execute | this.api.execute<Api.PageCompraListadoDTO>(ENDPOINT_BY_ID["GET_api_v1_compras"], params, params); }  | frontend/src/app/features/compras/data-access/compras.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_compras | frontend/src/app/features/compras/data-access/compras.api.ts:12 |
| execute | this.api.execute<Api.CompraResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_compras"], params, params, body); }  | frontend/src/app/features/compras/data-access/compras.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_compras | frontend/src/app/features/compras/data-access/compras.api.ts:13 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_compras_dashboard"], params, params); }  | frontend/src/app/features/compras/data-access/compras.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_compras_dashboard | frontend/src/app/features/compras/data-access/compras.api.ts:14 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_compras_id"], params, params); }  | frontend/src/app/features/compras/data-access/compras.api.ts:15 |
| endpoint-id/SSE | DELETE_api_v1_compras_id | frontend/src/app/features/compras/data-access/compras.api.ts:15 |
| execute | this.api.execute<Api.CompraResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_compras_id"], params, params); }  | frontend/src/app/features/compras/data-access/compras.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_compras_id | frontend/src/app/features/compras/data-access/compras.api.ts:16 |
| execute | this.api.execute<Api.CompraResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_compras_id"], params, params, body); }  | frontend/src/app/features/compras/data-access/compras.api.ts:17 |
| endpoint-id/SSE | PUT_api_v1_compras_id | frontend/src/app/features/compras/data-access/compras.api.ts:17 |
| execute | this.api.execute<Array<Api.CompraAdjuntoResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_compras_id_adjuntos"], params, params); }  | frontend/src/app/features/compras/data-access/compras.api.ts:18 |
| endpoint-id/SSE | GET_api_v1_compras_id_adjuntos | frontend/src/app/features/compras/data-access/compras.api.ts:18 |
| execute | this.api.execute<Api.CompraAdjuntoResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_compras_id_adjuntos"], params, params); }  | frontend/src/app/features/compras/data-access/compras.api.ts:19 |
| endpoint-id/SSE | POST_api_v1_compras_id_adjuntos | frontend/src/app/features/compras/data-access/compras.api.ts:19 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_compras_id_adjuntos_adjuntoId"], params, params); }  | frontend/src/app/features/compras/data-access/compras.api.ts:20 |
| endpoint-id/SSE | DELETE_api_v1_compras_id_adjuntos_adjuntoId | frontend/src/app/features/compras/data-access/compras.api.ts:20 |
| execute | this.api.execute<string>(ENDPOINT_BY_ID["GET_api_v1_compras_id_adjuntos_adjuntoId"], params, params); }  | frontend/src/app/features/compras/data-access/compras.api.ts:21 |
| endpoint-id/SSE | GET_api_v1_compras_id_adjuntos_adjuntoId | frontend/src/app/features/compras/data-access/compras.api.ts:21 |
| execute | this.api.execute<Api.CompraResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_compras_id_anulacion"], params, params, body); }  | frontend/src/app/features/compras/data-access/compras.api.ts:22 |
| endpoint-id/SSE | POST_api_v1_compras_id_anulacion | frontend/src/app/features/compras/data-access/compras.api.ts:22 |
| execute | this.api.execute<Api.CompraResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_compras_id_recepcion"], params, params, body); }  | frontend/src/app/features/compras/data-access/compras.api.ts:23 |
| endpoint-id/SSE | POST_api_v1_compras_id_recepcion | frontend/src/app/features/compras/data-access/compras.api.ts:23 |
| execute | this.api.execute<Api.EmpresaResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_configuracion_empresa"], params, params); }  | frontend/src/app/features/configuracion/data-access/configuracion.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_configuracion_empresa | frontend/src/app/features/configuracion/data-access/configuracion.api.ts:12 |
| execute | this.api.execute<Api.EmpresaResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_configuracion_empresa"], params, params, body); }  | frontend/src/app/features/configuracion/data-access/configuracion.api.ts:13 |
| endpoint-id/SSE | PUT_api_v1_configuracion_empresa | frontend/src/app/features/configuracion/data-access/configuracion.api.ts:13 |
| execute | this.api.execute<Api.ParametrosResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_configuracion_parametros"], params, params); }  | frontend/src/app/features/configuracion/data-access/configuracion.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_configuracion_parametros | frontend/src/app/features/configuracion/data-access/configuracion.api.ts:14 |
| execute | this.api.execute<Api.ParametrosResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_configuracion_parametros"], params, params, body); }  | frontend/src/app/features/configuracion/data-access/configuracion.api.ts:15 |
| endpoint-id/SSE | PUT_api_v1_configuracion_parametros | frontend/src/app/features/configuracion/data-access/configuracion.api.ts:15 |
| execute | this.api.execute<Api.ConfiguracionPublicaDTO>(ENDPOINT_BY_ID["GET_api_v1_configuracion_publica"], params, params); }  | frontend/src/app/features/configuracion/data-access/configuracion.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_configuracion_publica | frontend/src/app/features/configuracion/data-access/configuracion.api.ts:16 |
| execute | this.api.execute<Array<Api.SerieComprobanteResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_configuracion_series"], params, params); }  | frontend/src/app/features/configuracion/data-access/configuracion.api.ts:17 |
| endpoint-id/SSE | GET_api_v1_configuracion_series | frontend/src/app/features/configuracion/data-access/configuracion.api.ts:17 |
| execute | this.api.execute<Array<Api.SerieComprobanteResponseDTO>>(ENDPOINT_BY_ID["PUT_api_v1_configuracion_series"], params, params, body); }  | frontend/src/app/features/configuracion/data-access/configuracion.api.ts:18 |
| endpoint-id/SSE | PUT_api_v1_configuracion_series | frontend/src/app/features/configuracion/data-access/configuracion.api.ts:18 |
| get | this.http.get<Formato>(`${environment.apiUrl}/api/v1/configuracion/cotizacion`).pipe(takeUntil(this.destroy$)).subscribe({  | frontend/src/app/features/configuracion/pages/formato-cotizacion.component.ts:59 |
| put | this.http.put<Formato>(`${environment.apiUrl}/api/v1/configuracion/cotizacion`, {  | frontend/src/app/features/configuracion/pages/formato-cotizacion.component.ts:81 |
| execute | this.api.execute<Api.PageCotizacionListadoDTO>(ENDPOINT_BY_ID["GET_api_v1_cotizaciones"], params, params); }  | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_cotizaciones | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:12 |
| execute | this.api.execute<Api.CotizacionResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_cotizaciones"], params, params, body); }  | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_cotizaciones | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:13 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_cotizaciones_dashboard"], params, params); }  | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_cotizaciones_dashboard | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:14 |
| execute | this.api.execute<Array<Api.CotizacionListadoDTO>>(ENDPOINT_BY_ID["GET_api_v1_cotizaciones_vencidas"], params, params); }  | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_cotizaciones_vencidas | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:15 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_cotizaciones_id"], params, params); }  | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:16 |
| endpoint-id/SSE | DELETE_api_v1_cotizaciones_id | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:16 |
| execute | this.api.execute<Api.CotizacionResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_cotizaciones_id"], params, params); }  | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:17 |
| endpoint-id/SSE | GET_api_v1_cotizaciones_id | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:17 |
| execute | this.api.execute<Api.CotizacionResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_cotizaciones_id"], params, params, body); }  | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:18 |
| endpoint-id/SSE | PUT_api_v1_cotizaciones_id | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:18 |
| execute | this.api.execute<Api.CotizacionResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_cotizaciones_id_aceptar"], params, params); }  | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:19 |
| endpoint-id/SSE | POST_api_v1_cotizaciones_id_aceptar | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:19 |
| execute | this.api.execute<Api.VentaProcesadaResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_cotizaciones_id_convertir"], params, params, body); }  | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:20 |
| endpoint-id/SSE | POST_api_v1_cotizaciones_id_convertir | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:20 |
| execute | this.api.execute<Api.CotizacionResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_cotizaciones_id_rechazar"], params, params, body); }  | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:21 |
| endpoint-id/SSE | POST_api_v1_cotizaciones_id_rechazar | frontend/src/app/features/cotizaciones/data-access/cotizaciones.api.ts:21 |
| post | this.http.post(`${environment.apiUrl}/api/v1/cotizaciones/${item.id}/no-comprada`, {}).pipe(takeUntil(this.destroy$)).subscribe({  | frontend/src/app/features/cotizaciones/pages/cotizaciones-page.component.ts:301 |
| put | this.http.put<Api.CotizacionResponseDTO>(`${environment.apiUrl}/api/v1/cotizaciones/${this.detalle.id}/cargos`, {  | frontend/src/app/features/cotizaciones/pages/cotizaciones-page.component.ts:313 |
| execute | this.api.execute<Api.PageCuentaPorPagarResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_cuentas_por_pagar"], params, params); }  | frontend/src/app/features/cuentas-por-pagar/data-access/cuentas-por-pagar.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_cuentas_por_pagar | frontend/src/app/features/cuentas-por-pagar/data-access/cuentas-por-pagar.api.ts:12 |
| execute | this.api.execute<Api.CuentaPorPagarResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_cuentas_por_pagar_compra_compraId"], params, params); }  | frontend/src/app/features/cuentas-por-pagar/data-access/cuentas-por-pagar.api.ts:13 |
| endpoint-id/SSE | GET_api_v1_cuentas_por_pagar_compra_compraId | frontend/src/app/features/cuentas-por-pagar/data-access/cuentas-por-pagar.api.ts:13 |
| execute | this.api.execute<Api.ResumenCxPDashboardDTO>(ENDPOINT_BY_ID["GET_api_v1_cuentas_por_pagar_dashboard"], params, params); }  | frontend/src/app/features/cuentas-por-pagar/data-access/cuentas-por-pagar.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_cuentas_por_pagar_dashboard | frontend/src/app/features/cuentas-por-pagar/data-access/cuentas-por-pagar.api.ts:14 |
| execute | this.api.execute<Array<Api.CuentaPorPagarResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_cuentas_por_pagar_proximas_vencer"], params, params); }  | frontend/src/app/features/cuentas-por-pagar/data-access/cuentas-por-pagar.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_cuentas_por_pagar_proximas_vencer | frontend/src/app/features/cuentas-por-pagar/data-access/cuentas-por-pagar.api.ts:15 |
| execute | this.api.execute<Array<Api.CuentaPorPagarResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_cuentas_por_pagar_vencidas"], params, params); }  | frontend/src/app/features/cuentas-por-pagar/data-access/cuentas-por-pagar.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_cuentas_por_pagar_vencidas | frontend/src/app/features/cuentas-por-pagar/data-access/cuentas-por-pagar.api.ts:16 |
| execute | this.api.execute<Api.CuentaPorPagarResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_cuentas_por_pagar_id"], params, params); }  | frontend/src/app/features/cuentas-por-pagar/data-access/cuentas-por-pagar.api.ts:17 |
| endpoint-id/SSE | GET_api_v1_cuentas_por_pagar_id | frontend/src/app/features/cuentas-por-pagar/data-access/cuentas-por-pagar.api.ts:17 |
| execute | this.api.execute<Api.CuentaPorPagarResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_cuentas_por_pagar_id_pago"], params, params, body); }  | frontend/src/app/features/cuentas-por-pagar/data-access/cuentas-por-pagar.api.ts:18 |
| endpoint-id/SSE | POST_api_v1_cuentas_por_pagar_id_pago | frontend/src/app/features/cuentas-por-pagar/data-access/cuentas-por-pagar.api.ts:18 |
| get | this.http.get<Array<{ vendedor: string; ventas: number; total: number }>>(`${environment.apiUrl}/api/v1/reportes/ventas/vendedores`, { params: { desde: iso(desde), hasta: hoy, top: 5 } }).pipe(catchError(() => of([]))),  | frontend/src/app/features/dashboard/pages/dashboard-admin-page.component.ts:161 |
| get | this.http.get(`${this.base}/api/v1/rrhh/asistencias/estado-dia`);  | frontend/src/app/features/dashboard/pages/data-access/mi-dia.api.ts:16 |
| get | this.http.get(`${this.base}/api/v1/rrhh/asistencias/ultima-marcacion`);  | frontend/src/app/features/dashboard/pages/data-access/mi-dia.api.ts:20 |
| get | this.http.get(`${this.base}/api/v1/rrhh/asistencias/mis-asistencias`, {  | frontend/src/app/features/dashboard/pages/data-access/mi-dia.api.ts:24 |
| get | this.http.get(`${this.base}/api/v1/ventas`, {  | frontend/src/app/features/dashboard/pages/data-access/mi-dia.api.ts:30 |
| get | this.http.get(`${this.base}/api/v1/turnos-caja/abierto`, {  | frontend/src/app/features/dashboard/pages/data-access/mi-dia.api.ts:36 |
| get | this.http.get<any[]>(`${this.base}/api/v1/rrhh/comisiones/empleado/${userId}`);  | frontend/src/app/features/dashboard/pages/data-access/mi-dia.api.ts:42 |
| get | this.http.get(`${this.base}/api/v1/rrhh/legajos/me`);  | frontend/src/app/features/dashboard/pages/data-access/mi-dia.api.ts:46 |
| get | this.http.get(`${this.base}/api/v1/preformas/abiertas`);  | frontend/src/app/features/dashboard/pages/data-access/mi-dia.api.ts:50 |
| get | this.http.get(`${this.base}/api/v1/cotizaciones`, {  | frontend/src/app/features/dashboard/pages/data-access/mi-dia.api.ts:54 |
| get | this.http.get<any[]>(`${this.base}/api/v1/despachos/repartidor/${userId}`);  | frontend/src/app/features/dashboard/pages/data-access/mi-dia.api.ts:60 |
| get | this.http.get<any>(`${environment.apiUrl}/api/v1/rrhh/asistencias/estado-dia`).pipe(catchError(() => of(null))),  | frontend/src/app/features/dashboard/pages/multifuncional-dashboard.component.ts:170 |
| get | this.http.get<any>(`${environment.apiUrl}/api/v1/rrhh/asistencias/ultima-marcacion`).pipe(catchError(() => of(null))),  | frontend/src/app/features/dashboard/pages/multifuncional-dashboard.component.ts:171 |
| get | this.http.get<any>(`${environment.apiUrl}/api/v1/rrhh/asistencias/mis-asistencias`, {  | frontend/src/app/features/dashboard/pages/multifuncional-dashboard.component.ts:172 |
| get | this.http.get<any>(`${environment.apiUrl}/api/v1/rrhh/asistencias/mis-asistencias`, {  | frontend/src/app/features/dashboard/pages/multifuncional-dashboard.component.ts:175 |
| get | this.http.get<any>(`${environment.apiUrl}/api/v1/ventas`, {  | frontend/src/app/features/dashboard/pages/multifuncional-dashboard.component.ts:178 |
| get | this.http.get<any>(`${environment.apiUrl}/api/v1/ventas`, {  | frontend/src/app/features/dashboard/pages/multifuncional-dashboard.component.ts:181 |
| get | this.http.get<any>(`${environment.apiUrl}/api/v1/turnos-caja/abierto`, {  | frontend/src/app/features/dashboard/pages/multifuncional-dashboard.component.ts:184 |
| get | this.http.get<any>(`${environment.apiUrl}/api/v1/rrhh/comisiones/empleado/${userId}`).pipe(catchError(() => of([]))),  | frontend/src/app/features/dashboard/pages/multifuncional-dashboard.component.ts:188 |
| get | this.http.get<any>(`${environment.apiUrl}/api/v1/rrhh/legajos/me`).pipe(catchError(() => of(null))),  | frontend/src/app/features/dashboard/pages/multifuncional-dashboard.component.ts:190 |
| get | this.http.get<any>(`${environment.apiUrl}/api/v1/preformas/abiertas`).pipe(catchError(() => of(null))),  | frontend/src/app/features/dashboard/pages/multifuncional-dashboard.component.ts:191 |
| get | this.http.get<any>(`${environment.apiUrl}/api/v1/cotizaciones`, {  | frontend/src/app/features/dashboard/pages/multifuncional-dashboard.component.ts:192 |
| get | this.http.get<any>(`${environment.apiUrl}/api/v1/despachos/repartidor/${userId}`).pipe(catchError(() => of([]))),  | frontend/src/app/features/dashboard/pages/multifuncional-dashboard.component.ts:195 |
| post | this.http.post<OrdenDespachoResponseDTO>(`${this.base}/api/v1/despachos/${id}/evidencia`, cuerpo);  | frontend/src/app/features/despachos/data-access/despacho-evidencia.api.ts:19 |
| get | this.http.get(`${this.base}/api/v1/despachos/${id}/evidencia`, { responseType: 'blob' });  | frontend/src/app/features/despachos/data-access/despacho-evidencia.api.ts:23 |
| execute | this.api.execute<Api.PageOrdenDespachoResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_despachos"], params, params); }  | frontend/src/app/features/despachos/data-access/despachos.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_despachos | frontend/src/app/features/despachos/data-access/despachos.api.ts:12 |
| execute | this.api.execute<Api.OrdenDespachoResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_despachos"], params, params, body); }  | frontend/src/app/features/despachos/data-access/despachos.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_despachos | frontend/src/app/features/despachos/data-access/despachos.api.ts:13 |
| execute | this.api.execute<Api.DespachoDashboardDTO>(ENDPOINT_BY_ID["GET_api_v1_despachos_dashboard"], params, params); }  | frontend/src/app/features/despachos/data-access/despachos.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_despachos_dashboard | frontend/src/app/features/despachos/data-access/despachos.api.ts:14 |
| execute | this.api.execute<Array<Api.OrdenDespachoResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_despachos_repartidor_userId"], params, params); }  | frontend/src/app/features/despachos/data-access/despachos.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_despachos_repartidor_userId | frontend/src/app/features/despachos/data-access/despachos.api.ts:15 |
| execute | this.api.execute<Api.OrdenDespachoResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_despachos_seguimiento_codigo"], params, params); }  | frontend/src/app/features/despachos/data-access/despachos.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_despachos_seguimiento_codigo | frontend/src/app/features/despachos/data-access/despachos.api.ts:16 |
| execute | this.api.execute<Api.OrdenDespachoResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_despachos_id"], params, params); }  | frontend/src/app/features/despachos/data-access/despachos.api.ts:17 |
| endpoint-id/SSE | GET_api_v1_despachos_id | frontend/src/app/features/despachos/data-access/despachos.api.ts:17 |
| execute | this.api.execute<Api.OrdenDespachoResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_despachos_id_asignar_repartidor"], params, params, body); }  | frontend/src/app/features/despachos/data-access/despachos.api.ts:18 |
| endpoint-id/SSE | POST_api_v1_despachos_id_asignar_repartidor | frontend/src/app/features/despachos/data-access/despachos.api.ts:18 |
| execute | this.api.execute<Api.OrdenDespachoResponseDTO>(ENDPOINT_BY_ID["PATCH_api_v1_despachos_id_estado"], params, params, body); }  | frontend/src/app/features/despachos/data-access/despachos.api.ts:19 |
| endpoint-id/SSE | PATCH_api_v1_despachos_id_estado | frontend/src/app/features/despachos/data-access/despachos.api.ts:19 |
| execute | this.api.execute<string>(ENDPOINT_BY_ID["GET_api_v1_despachos_id_evidencia"], params, params); }  | frontend/src/app/features/despachos/data-access/despachos.api.ts:20 |
| endpoint-id/SSE | GET_api_v1_despachos_id_evidencia | frontend/src/app/features/despachos/data-access/despachos.api.ts:20 |
| execute | this.api.execute<Api.OrdenDespachoResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_despachos_id_evidencia"], params, params); }  | frontend/src/app/features/despachos/data-access/despachos.api.ts:21 |
| endpoint-id/SSE | POST_api_v1_despachos_id_evidencia | frontend/src/app/features/despachos/data-access/despachos.api.ts:21 |
| execute | this.api.execute<Api.PageDevolucionListadoDTO>(ENDPOINT_BY_ID['GET_api_v1_devoluciones'], params, params);  | frontend/src/app/features/devoluciones/data-access/devoluciones.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_devoluciones | frontend/src/app/features/devoluciones/data-access/devoluciones.api.ts:12 |
| execute | this.api.execute<Api.DevolucionResponseDTO>(ENDPOINT_BY_ID['POST_api_v1_devoluciones'], params, params, body);  | frontend/src/app/features/devoluciones/data-access/devoluciones.api.ts:16 |
| endpoint-id/SSE | POST_api_v1_devoluciones | frontend/src/app/features/devoluciones/data-access/devoluciones.api.ts:16 |
| execute | this.api.execute<Api.DevolucionDashboardDTO>(ENDPOINT_BY_ID['GET_api_v1_devoluciones_dashboard'], params, params);  | frontend/src/app/features/devoluciones/data-access/devoluciones.api.ts:20 |
| endpoint-id/SSE | GET_api_v1_devoluciones_dashboard | frontend/src/app/features/devoluciones/data-access/devoluciones.api.ts:20 |
| execute | this.api.execute<Api.DevolucionResponseDTO>(ENDPOINT_BY_ID['GET_api_v1_devoluciones_id'], params, params);  | frontend/src/app/features/devoluciones/data-access/devoluciones.api.ts:24 |
| endpoint-id/SSE | GET_api_v1_devoluciones_id | frontend/src/app/features/devoluciones/data-access/devoluciones.api.ts:24 |
| execute | this.api.execute<Api.DevolucionResponseDTO>(ENDPOINT_BY_ID['POST_api_v1_devoluciones_id_aprobar'], params, params, body);  | frontend/src/app/features/devoluciones/data-access/devoluciones.api.ts:28 |
| endpoint-id/SSE | POST_api_v1_devoluciones_id_aprobar | frontend/src/app/features/devoluciones/data-access/devoluciones.api.ts:28 |
| execute | this.api.execute<Api.DevolucionResponseDTO>(ENDPOINT_BY_ID['POST_api_v1_devoluciones_id_rechazar'], params, params, body);  | frontend/src/app/features/devoluciones/data-access/devoluciones.api.ts:32 |
| endpoint-id/SSE | POST_api_v1_devoluciones_id_rechazar | frontend/src/app/features/devoluciones/data-access/devoluciones.api.ts:32 |
| execute | this.api.execute<FacturacionElectronicaPanel>(ENDPOINT_BY_ID['GET_api_v1_facturacion_electronica_panel'], params, params);  | frontend/src/app/features/facturacion-electronica/data-access/facturacion-electronica.api.ts:33 |
| endpoint-id/SSE | GET_api_v1_facturacion_electronica_panel | frontend/src/app/features/facturacion-electronica/data-access/facturacion-electronica.api.ts:33 |
| execute | this.api.execute<Array<Api.CuentaFinancieraResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_finanzas_cuentas"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_finanzas_cuentas | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:12 |
| execute | this.api.execute<Api.CuentaFinancieraResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_finanzas_cuentas"], params, params, body); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_finanzas_cuentas | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:13 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_finanzas_cuentas_id"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:14 |
| endpoint-id/SSE | DELETE_api_v1_finanzas_cuentas_id | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:14 |
| execute | this.api.execute<Api.CuentaFinancieraResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_finanzas_cuentas_id"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_finanzas_cuentas_id | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:15 |
| execute | this.api.execute<Api.CuentaFinancieraResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_finanzas_cuentas_id"], params, params, body); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:16 |
| endpoint-id/SSE | PUT_api_v1_finanzas_cuentas_id | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:16 |
| execute | this.api.execute<Api.PageSaldoCuentaResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_finanzas_cuentas_id_saldos"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:17 |
| endpoint-id/SSE | GET_api_v1_finanzas_cuentas_id_saldos | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:17 |
| execute | this.api.execute<Api.SaldoCuentaResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_finanzas_cuentas_id_saldos"], params, params, body); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:18 |
| endpoint-id/SSE | POST_api_v1_finanzas_cuentas_id_saldos | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:18 |
| execute | this.api.execute<Api.EvolucionMensualResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_finanzas_dashboard_evolucion_mensual"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:19 |
| endpoint-id/SSE | GET_api_v1_finanzas_dashboard_evolucion_mensual | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:19 |
| execute | this.api.execute<Api.KpisFinancierosResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_finanzas_dashboard_kpis"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:20 |
| endpoint-id/SSE | GET_api_v1_finanzas_dashboard_kpis | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:20 |
| execute | this.api.execute<Api.PatrimonioResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_finanzas_dashboard_patrimonio"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:21 |
| endpoint-id/SSE | GET_api_v1_finanzas_dashboard_patrimonio | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:21 |
| execute | this.api.execute<Api.FlujoCajaRealResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_finanzas_flujo_caja"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:22 |
| endpoint-id/SSE | GET_api_v1_finanzas_flujo_caja | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:22 |
| execute | this.api.execute<Api.FlujoDevengadoResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_finanzas_flujo_caja_devengado"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:23 |
| endpoint-id/SSE | GET_api_v1_finanzas_flujo_caja_devengado | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:23 |
| execute | this.api.execute<Api.ProyeccionFlujoResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_finanzas_flujo_caja_proyeccion"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:24 |
| endpoint-id/SSE | GET_api_v1_finanzas_flujo_caja_proyeccion | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:24 |
| execute | this.api.execute<Api.PageRetiroSocioListadoDTO>(ENDPOINT_BY_ID["GET_api_v1_finanzas_retiros_socios"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:25 |
| endpoint-id/SSE | GET_api_v1_finanzas_retiros_socios | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:25 |
| execute | this.api.execute<Api.RetiroSocioResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_finanzas_retiros_socios"], params, params, body); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:26 |
| endpoint-id/SSE | POST_api_v1_finanzas_retiros_socios | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:26 |
| execute | this.api.execute<Api.RetiroSocioDashboardDTO>(ENDPOINT_BY_ID["GET_api_v1_finanzas_retiros_socios_dashboard"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:27 |
| endpoint-id/SSE | GET_api_v1_finanzas_retiros_socios_dashboard | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:27 |
| execute | this.api.execute<Api.RetiroSocioResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_finanzas_retiros_socios_id"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:28 |
| endpoint-id/SSE | GET_api_v1_finanzas_retiros_socios_id | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:28 |
| execute | this.api.execute<Api.RetiroSocioResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_finanzas_retiros_socios_id_anular"], params, params, body); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:29 |
| endpoint-id/SSE | POST_api_v1_finanzas_retiros_socios_id_anular | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:29 |
| execute | this.api.execute<Api.UtilidadNetaResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_finanzas_utilidad_neta"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:30 |
| endpoint-id/SSE | GET_api_v1_finanzas_utilidad_neta | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:30 |
| execute | this.api.execute<Api.UtilidadNetaResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_finanzas_utilidad_neta_periodo"], params, params); }  | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:31 |
| endpoint-id/SSE | GET_api_v1_finanzas_utilidad_neta_periodo | frontend/src/app/features/finanzas/data-access/finanzas.api.ts:31 |
| get | this.http.get<{ content?: GastoEmpresarialFila[]; totalElements?: number; totalPages?: number; number?: number }>(`${environment.apiUrl}/api/v1/finanzas/gastos`, { params }).pipe(takeUntil(this.destroy$)).subscribe({  | frontend/src/app/features/finanzas/pages/finanzas-page.component.ts:304 |
| post | this.http.post(`${environment.apiUrl}/api/v1/finanzas/gastos`, {  | frontend/src/app/features/finanzas/pages/finanzas-page.component.ts:322 |
| delete | this.http.delete(`${environment.apiUrl}/api/v1/finanzas/gastos/${gasto.id}`).pipe(takeUntil(this.destroy$)).subscribe({  | frontend/src/app/features/finanzas/pages/finanzas-page.component.ts:337 |
| get | this.http.get<CmsPublico>(`${environment.apiUrl}/api/v1/cms/settings`).subscribe({  | frontend/src/app/features/gestor-web/gestor-web-page.component.ts:716 |
| get | this.http.get<EmpresaSitio>(`${environment.apiUrl}/api/v1/cms/empresa`).subscribe({  | frontend/src/app/features/gestor-web/gestor-web-page.component.ts:742 |
| put | this.http.put<CmsPublico>(`${environment.apiUrl}/api/v1/cms/settings`, {  | frontend/src/app/features/gestor-web/gestor-web-page.component.ts:813 |
| put | this.http.put(`${environment.apiUrl}/api/v1/cms/horario`, {  | frontend/src/app/features/gestor-web/gestor-web-page.component.ts:851 |
| get | this.http.get<EmpresaSitio>(`${environment.apiUrl}/api/v1/cms/empresa`).subscribe({  | frontend/src/app/features/gestor-web/gestor-web-page.component.ts:858 |
| get | this.http.get<{ content?: ProductoOferta[]; totalElements?: number }>(`${environment.apiUrl}/api/v1/productos`, {  | frontend/src/app/features/gestor-web/gestor-web-page.component.ts:893 |
| put | this.http.put(`${environment.apiUrl}/api/v1/cms/productos/${producto.id}/oferta`, {  | frontend/src/app/features/gestor-web/gestor-web-page.component.ts:1123 |
| put | this.http.put(`${environment.apiUrl}/api/v1/cms/productos/${producto.id}/oferta`, { oferta: false }).subscribe({  | frontend/src/app/features/gestor-web/gestor-web-page.component.ts:1143 |
| post | this.http.post<{ marcados: number }>(`${environment.apiUrl}/api/v1/cms/ofertas/sincronizar`, {}).subscribe({  | frontend/src/app/features/gestor-web/gestor-web-page.component.ts:1159 |
| post | this.http.post<{ ruta: string }>(`${environment.apiUrl}/api/v1/cms/medios`, datos).subscribe({  | frontend/src/app/features/gestor-web/gestor-web-page.component.ts:1219 |
| post | this.http.post<{ ruta: string }>(`${environment.apiUrl}/api/v1/cms/medios`, datos).subscribe({  | frontend/src/app/features/gestor-web/gestor-web-page.component.ts:1242 |
| execute | this.api.execute<Api.PageKardexMovimientoResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_kardex"], params, params); }  | frontend/src/app/features/kardex/data-access/kardex.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_kardex | frontend/src/app/features/kardex/data-access/kardex.api.ts:12 |
| execute | this.api.execute<string>(ENDPOINT_BY_ID["GET_api_v1_kardex_exportar"], params, params); }  | frontend/src/app/features/kardex/data-access/kardex.api.ts:13 |
| endpoint-id/SSE | GET_api_v1_kardex_exportar | frontend/src/app/features/kardex/data-access/kardex.api.ts:13 |
| execute | this.api.execute<Api.ReporteMermasDTO>(ENDPOINT_BY_ID["GET_api_v1_kardex_mermas"], params, params); }  | frontend/src/app/features/kardex/data-access/kardex.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_kardex_mermas | frontend/src/app/features/kardex/data-access/kardex.api.ts:14 |
| execute | this.api.execute<Api.PageKardexMovimientoDetalleDTO>(ENDPOINT_BY_ID["GET_api_v1_kardex_movimientos"], params, params); }  | frontend/src/app/features/kardex/data-access/kardex.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_kardex_movimientos | frontend/src/app/features/kardex/data-access/kardex.api.ts:15 |
| execute | this.api.execute<Api.KardexMovimientoResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_kardex_movimientos"], params, params, body); }  | frontend/src/app/features/kardex/data-access/kardex.api.ts:16 |
| endpoint-id/SSE | POST_api_v1_kardex_movimientos | frontend/src/app/features/kardex/data-access/kardex.api.ts:16 |
| execute | this.api.execute<Api.KardexMovimientoDetalleDTO>(ENDPOINT_BY_ID["GET_api_v1_kardex_movimientos_id"], params, params); }  | frontend/src/app/features/kardex/data-access/kardex.api.ts:17 |
| endpoint-id/SSE | GET_api_v1_kardex_movimientos_id | frontend/src/app/features/kardex/data-access/kardex.api.ts:17 |
| execute | this.api.execute<Api.HistorialProductoDTO>(ENDPOINT_BY_ID["GET_api_v1_kardex_producto_productoId_historial"], params, params); }  | frontend/src/app/features/kardex/data-access/kardex.api.ts:18 |
| endpoint-id/SSE | GET_api_v1_kardex_producto_productoId_historial | frontend/src/app/features/kardex/data-access/kardex.api.ts:18 |
| execute | this.api.execute<Api.PageSaldoKardexDTO>(ENDPOINT_BY_ID["GET_api_v1_kardex_saldos"], params, params); }  | frontend/src/app/features/kardex/data-access/kardex.api.ts:19 |
| endpoint-id/SSE | GET_api_v1_kardex_saldos | frontend/src/app/features/kardex/data-access/kardex.api.ts:19 |
| execute | this.api.execute<Api.PageSaldoKardexDTO>(ENDPOINT_BY_ID["GET_api_v1_kardex_saldos_almacen_almacenId"], params, params); }  | frontend/src/app/features/kardex/data-access/kardex.api.ts:20 |
| endpoint-id/SSE | GET_api_v1_kardex_saldos_almacen_almacenId | frontend/src/app/features/kardex/data-access/kardex.api.ts:20 |
| execute | this.api.execute<Api.SaldosProductoDTO>(ENDPOINT_BY_ID["GET_api_v1_kardex_saldos_producto_productoId"], params, params); }  | frontend/src/app/features/kardex/data-access/kardex.api.ts:21 |
| endpoint-id/SSE | GET_api_v1_kardex_saldos_producto_productoId | frontend/src/app/features/kardex/data-access/kardex.api.ts:21 |
| execute | this.api.execute<Array<Api.KardexMovimientoResponseDTO>>(ENDPOINT_BY_ID["POST_api_v1_kardex_transferencias"], params, params, body); }  | frontend/src/app/features/kardex/data-access/kardex.api.ts:22 |
| endpoint-id/SSE | POST_api_v1_kardex_transferencias | frontend/src/app/features/kardex/data-access/kardex.api.ts:22 |
| execute | this.api.execute<Api.ValorizacionKardexDTO>(ENDPOINT_BY_ID["GET_api_v1_kardex_valorizacion"], params, params); }  | frontend/src/app/features/kardex/data-access/kardex.api.ts:23 |
| endpoint-id/SSE | GET_api_v1_kardex_valorizacion | frontend/src/app/features/kardex/data-access/kardex.api.ts:23 |
| execute | this.api.execute<Api.ValorizacionKardexDTO>(ENDPOINT_BY_ID["GET_api_v1_kardex_valorizacion_almacen_almacenId"], params, params); }  | frontend/src/app/features/kardex/data-access/kardex.api.ts:24 |
| endpoint-id/SSE | GET_api_v1_kardex_valorizacion_almacen_almacenId | frontend/src/app/features/kardex/data-access/kardex.api.ts:24 |
| get | this.http.get<ResumenChat[]>(`${environment.apiUrl}/api/v1/chats`).subscribe({  | frontend/src/app/features/mensajes-web/mensajes-web-page.component.ts:174 |
| get | this.http.get<Pagina>(`${environment.apiUrl}/api/v1/mensajes-web`, { params }).subscribe({  | frontend/src/app/features/mensajes-web/mensajes-web-page.component.ts:176 |
| post | this.http.post(this.rutaDe(item, 'no-leido'), {}, { responseType: 'text' }).subscribe({  | frontend/src/app/features/mensajes-web/mensajes-web-page.component.ts:232 |
| post | this.http.post(this.rutaDe(item, 'archivo'), { archivado }, { responseType: 'text' }).subscribe({  | frontend/src/app/features/mensajes-web/mensajes-web-page.component.ts:249 |
| post | this.http.post<HiloEquipo>(`${environment.apiUrl}/api/v1/chats/${this.abierto.id}/mensajes`, { texto, autorNombre }).subscribe({  | frontend/src/app/features/mensajes-web/mensajes-web-page.component.ts:280 |
| post | this.http.post(`${environment.apiUrl}/api/v1/chats/${this.abierto.id}/escribiendo`, { activo }, { responseType: 'text' }).subscribe({ error: () => undefined });  | frontend/src/app/features/mensajes-web/mensajes-web-page.component.ts:302 |
| post | this.http.post(`${environment.apiUrl}/api/v1/chats/${this.abierto.id}/estado`, { estado }, { responseType: 'text' }).subscribe({  | frontend/src/app/features/mensajes-web/mensajes-web-page.component.ts:314 |
| delete | this.http.delete(url, { responseType: 'text' }).subscribe({  | frontend/src/app/features/mensajes-web/mensajes-web-page.component.ts:333 |
| put | this.http.put<HiloEquipo>(`${environment.apiUrl}/api/v1/chats/${this.abierto.id}`, {  | frontend/src/app/features/mensajes-web/mensajes-web-page.component.ts:371 |
| post | this.http.post<HiloEquipo>(`${environment.apiUrl}/api/v1/chats/${this.abierto.id}/cliente`, {  | frontend/src/app/features/mensajes-web/mensajes-web-page.component.ts:405 |
| get | this.http.get<HiloEquipo>(`${environment.apiUrl}/api/v1/chats/${id}`).subscribe({  | frontend/src/app/features/mensajes-web/mensajes-web-page.component.ts:443 |
| post | this.http.post(this.rutaDe(item, 'leido'), {}, { responseType: 'text' }).subscribe({  | frontend/src/app/features/mensajes-web/mensajes-web-page.component.ts:503 |
| execute | this.api.execute<Api.PageMovilidadListadoDTO>(ENDPOINT_BY_ID["GET_api_v1_movilidades"], params, params); }  | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_movilidades | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:12 |
| execute | this.api.execute<Api.MovilidadResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_movilidades"], params, params, body); }  | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_movilidades | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:13 |
| execute | this.api.execute<Api.MovilidadDashboardDTO>(ENDPOINT_BY_ID["GET_api_v1_movilidades_dashboard"], params, params); }  | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_movilidades_dashboard | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:14 |
| execute | this.api.execute<Api.ReporteUsoMovilidadDTO>(ENDPOINT_BY_ID["GET_api_v1_movilidades_reportes_uso"], params, params); }  | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_movilidades_reportes_uso | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:15 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_movilidades_id"], params, params); }  | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:16 |
| endpoint-id/SSE | DELETE_api_v1_movilidades_id | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:16 |
| execute | this.api.execute<Api.MovilidadResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_movilidades_id"], params, params); }  | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:17 |
| endpoint-id/SSE | GET_api_v1_movilidades_id | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:17 |
| execute | this.api.execute<Api.MovilidadResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_movilidades_id"], params, params, body); }  | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:18 |
| endpoint-id/SSE | PUT_api_v1_movilidades_id | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:18 |
| execute | this.api.execute<Api.MovilidadResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_movilidades_id_asignar_conductor"], params, params, body); }  | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:19 |
| endpoint-id/SSE | POST_api_v1_movilidades_id_asignar_conductor | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:19 |
| execute | this.api.execute<Api.PageOrdenDespachoResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_movilidades_id_historial"], params, params); }  | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:20 |
| endpoint-id/SSE | GET_api_v1_movilidades_id_historial | frontend/src/app/features/movilidades/data-access/movilidades.api.ts:20 |
| get | this.http.get<Notificacion[]>(this.base); }  | frontend/src/app/features/notificaciones/notificaciones.api.ts:21 |
| post | this.http.post<Notificacion>(`${this.base}/${id}/leida`, {}); }  | frontend/src/app/features/notificaciones/notificaciones.api.ts:22 |
| post | this.http.post<{ marcadas: number }>(`${this.base}/leer-todas`, {}); }  | frontend/src/app/features/notificaciones/notificaciones.api.ts:23 |
| delete | this.http.delete<Notificacion>(`${this.base}/${id}`); }  | frontend/src/app/features/notificaciones/notificaciones.api.ts:24 |
| post | this.http.post<Api.PerfilResponseDTO>(`${this.base}/api/v1/perfil/foto`, cuerpo);  | frontend/src/app/features/perfil/data-access/perfil.api.ts:19 |
| get | this.http.get(`${this.base}/api/v1/perfil/foto`, {  | frontend/src/app/features/perfil/data-access/perfil.api.ts:23 |
| delete | this.http.delete<Api.PerfilResponseDTO>(`${this.base}/api/v1/perfil/foto`);  | frontend/src/app/features/perfil/data-access/perfil.api.ts:30 |
| execute | this.api.execute<Api.PerfilResponseDTO>(ENDPOINT_BY_ID['GET_api_v1_perfil'], params, params);  | frontend/src/app/features/perfil/data-access/perfil.api.ts:34 |
| endpoint-id/SSE | GET_api_v1_perfil | frontend/src/app/features/perfil/data-access/perfil.api.ts:34 |
| execute | this.api.execute<Api.PerfilResponseDTO>(ENDPOINT_BY_ID['PUT_api_v1_perfil'], {}, {}, body);  | frontend/src/app/features/perfil/data-access/perfil.api.ts:38 |
| endpoint-id/SSE | PUT_api_v1_perfil | frontend/src/app/features/perfil/data-access/perfil.api.ts:38 |
| execute | this.api.execute<Api.PerfilResponseDTO>(ENDPOINT_BY_ID['POST_api_v1_perfil_contrasena'], {}, {}, body);  | frontend/src/app/features/perfil/data-access/perfil.api.ts:42 |
| endpoint-id/SSE | POST_api_v1_perfil_contrasena | frontend/src/app/features/perfil/data-access/perfil.api.ts:42 |
| execute | this.api.execute<Api.PerfilResponseDTO>(ENDPOINT_BY_ID['POST_api_v1_perfil_totp'], {}, {}, body);  | frontend/src/app/features/perfil/data-access/perfil.api.ts:46 |
| endpoint-id/SSE | POST_api_v1_perfil_totp | frontend/src/app/features/perfil/data-access/perfil.api.ts:46 |
| execute | this.api.execute<Api.PerfilResponseDTO>(ENDPOINT_BY_ID['POST_api_v1_perfil_cerrar_sesiones']);  | frontend/src/app/features/perfil/data-access/perfil.api.ts:50 |
| endpoint-id/SSE | POST_api_v1_perfil_cerrar_sesiones | frontend/src/app/features/perfil/data-access/perfil.api.ts:50 |
| get | this.http.get<ProyectoWeb[]>(`${environment.apiUrl}/api/v1/portafolio`).subscribe({  | frontend/src/app/features/portafolio-web/portafolio-web-page.component.ts:120 |
| post | this.http.post<{ ruta: string }>(`${environment.apiUrl}/api/v1/cms/medios`, datos).subscribe({  | frontend/src/app/features/portafolio-web/portafolio-web-page.component.ts:201 |
| put | this.http.put<ProyectoWeb>(`${environment.apiUrl}/api/v1/portafolio/${this.editando}`, cuerpo)  | frontend/src/app/features/portafolio-web/portafolio-web-page.component.ts:223 |
| post | this.http.post<ProyectoWeb>(`${environment.apiUrl}/api/v1/portafolio`, cuerpo);  | frontend/src/app/features/portafolio-web/portafolio-web-page.component.ts:224 |
| delete | this.http.delete(`${environment.apiUrl}/api/v1/portafolio/${proyecto.id}`).subscribe({  | frontend/src/app/features/portafolio-web/portafolio-web-page.component.ts:243 |
| execute | this.api.execute<Api.PreformaVentaResponseDTO>(ENDPOINT_BY_ID['POST_api_v1_preformas'], params, params, body);  | frontend/src/app/features/preformas/data-access/preformas.api.ts:12 |
| endpoint-id/SSE | POST_api_v1_preformas | frontend/src/app/features/preformas/data-access/preformas.api.ts:12 |
| execute | this.api.execute<Array<Api.PreformaListadoDTO>>(ENDPOINT_BY_ID['GET_api_v1_preformas_abiertas'], params, params);  | frontend/src/app/features/preformas/data-access/preformas.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_preformas_abiertas | frontend/src/app/features/preformas/data-access/preformas.api.ts:16 |
| execute | this.api.execute<Api.PreformaDashboardDTO>(ENDPOINT_BY_ID['GET_api_v1_preformas_dashboard'], params, params);  | frontend/src/app/features/preformas/data-access/preformas.api.ts:20 |
| endpoint-id/SSE | GET_api_v1_preformas_dashboard | frontend/src/app/features/preformas/data-access/preformas.api.ts:20 |
| execute | this.api.execute<Api.PagePreformaListadoDTO>(ENDPOINT_BY_ID['GET_api_v1_preformas_vencidas'], params, params);  | frontend/src/app/features/preformas/data-access/preformas.api.ts:24 |
| endpoint-id/SSE | GET_api_v1_preformas_vencidas | frontend/src/app/features/preformas/data-access/preformas.api.ts:24 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID['DELETE_api_v1_preformas_id'], params, params);  | frontend/src/app/features/preformas/data-access/preformas.api.ts:28 |
| endpoint-id/SSE | DELETE_api_v1_preformas_id | frontend/src/app/features/preformas/data-access/preformas.api.ts:28 |
| execute | this.api.execute<Api.PreformaVentaResponseDTO>(ENDPOINT_BY_ID['GET_api_v1_preformas_id'], params, params);  | frontend/src/app/features/preformas/data-access/preformas.api.ts:32 |
| endpoint-id/SSE | GET_api_v1_preformas_id | frontend/src/app/features/preformas/data-access/preformas.api.ts:32 |
| execute | this.api.execute<Api.PreformaVentaResponseDTO>(ENDPOINT_BY_ID['PUT_api_v1_preformas_id'], params, params, body);  | frontend/src/app/features/preformas/data-access/preformas.api.ts:36 |
| endpoint-id/SSE | PUT_api_v1_preformas_id | frontend/src/app/features/preformas/data-access/preformas.api.ts:36 |
| execute | this.api.execute<Api.PreformaVentaResponseDTO>(ENDPOINT_BY_ID['POST_api_v1_preformas_id_cancelar'], params, params, body);  | frontend/src/app/features/preformas/data-access/preformas.api.ts:40 |
| endpoint-id/SSE | POST_api_v1_preformas_id_cancelar | frontend/src/app/features/preformas/data-access/preformas.api.ts:40 |
| execute | this.api.execute<Api.ConfirmacionPreformaDTO>(ENDPOINT_BY_ID['POST_api_v1_preformas_id_confirmar'], params, params, body);  | frontend/src/app/features/preformas/data-access/preformas.api.ts:44 |
| endpoint-id/SSE | POST_api_v1_preformas_id_confirmar | frontend/src/app/features/preformas/data-access/preformas.api.ts:44 |
| get | this.http.get<ProductoImportacionFila[]>(`${this.base}/api/v1/productos/exportacion`, {  | frontend/src/app/features/productos/data-access/productos-masivo.api.ts:57 |
| post | this.http.post<ProductoImportacionResultado>(`${this.base}/api/v1/productos/importacion-masiva`, { filas });  | frontend/src/app/features/productos/data-access/productos-masivo.api.ts:63 |
| post | this.http.post<{ ruta: string }>(`${this.base}/api/v1/productos/imagenes`, cuerpo);  | frontend/src/app/features/productos/data-access/productos-masivo.api.ts:69 |
| put | this.http.put<ProductoResponseDTO>(`${this.base}/api/v1/productos/${id}`, cuerpo);  | frontend/src/app/features/productos/data-access/productos-masivo.api.ts:76 |
| get | this.http.get(`${this.base}/api/v1/productos/imagenes`, { params: { ruta }, responseType: 'blob' });  | frontend/src/app/features/productos/data-access/productos-masivo.api.ts:80 |
| execute | this.api.execute<Api.PageProductoResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_productos"], params, params);  | frontend/src/app/features/productos/data-access/productos.api.ts:13 |
| endpoint-id/SSE | GET_api_v1_productos | frontend/src/app/features/productos/data-access/productos.api.ts:13 |
| execute | this.api.execute<Api.ProductoResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_productos"], params, params, body);  | frontend/src/app/features/productos/data-access/productos.api.ts:17 |
| endpoint-id/SSE | POST_api_v1_productos | frontend/src/app/features/productos/data-access/productos.api.ts:17 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_productos_check_sku"], params, params);  | frontend/src/app/features/productos/data-access/productos.api.ts:21 |
| endpoint-id/SSE | GET_api_v1_productos_check_sku | frontend/src/app/features/productos/data-access/productos.api.ts:21 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_productos_dashboard_statistics"], params, params);  | frontend/src/app/features/productos/data-access/productos.api.ts:25 |
| endpoint-id/SSE | GET_api_v1_productos_dashboard_statistics | frontend/src/app/features/productos/data-access/productos.api.ts:25 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_productos_id"], params, params);  | frontend/src/app/features/productos/data-access/productos.api.ts:29 |
| endpoint-id/SSE | DELETE_api_v1_productos_id | frontend/src/app/features/productos/data-access/productos.api.ts:29 |
| execute | this.api.execute<Api.ProductoResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_productos_id"], params, params);  | frontend/src/app/features/productos/data-access/productos.api.ts:33 |
| endpoint-id/SSE | GET_api_v1_productos_id | frontend/src/app/features/productos/data-access/productos.api.ts:33 |
| execute | this.api.execute<Api.ProductoResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_productos_id"], params, params, body);  | frontend/src/app/features/productos/data-access/productos.api.ts:37 |
| endpoint-id/SSE | PUT_api_v1_productos_id | frontend/src/app/features/productos/data-access/productos.api.ts:37 |
| execute | this.api.execute<Api.ProductoStockResumenDTO[]>(  | frontend/src/app/features/productos/data-access/productos.api.ts:44 |
| endpoint-id/SSE | GET_api_v1_productos_id_stock | frontend/src/app/features/productos/data-access/productos.api.ts:45 |
| execute | this.api.execute<Api.PageProveedorResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_proveedores"], params, params); }  | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_proveedores | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:12 |
| execute | this.api.execute<Api.ProveedorResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_proveedores"], params, params, body); }  | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_proveedores | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:13 |
| execute | this.api.execute<Api.ProveedorResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_proveedores_documento"], params, params); }  | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_proveedores_documento | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:14 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_proveedores_estadisticas_dashboard"], params, params); }  | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_proveedores_estadisticas_dashboard | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:15 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_proveedores_estadisticas_tipo_documento"], params, params); }  | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_proveedores_estadisticas_tipo_documento | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:16 |
| execute | this.api.execute<Array<Api.ProveedorResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_proveedores_incompletos"], params, params); }  | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:17 |
| endpoint-id/SSE | GET_api_v1_proveedores_incompletos | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:17 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_proveedores_validar_documento"], params, params); }  | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:18 |
| endpoint-id/SSE | GET_api_v1_proveedores_validar_documento | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:18 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_proveedores_id"], params, params); }  | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:19 |
| endpoint-id/SSE | DELETE_api_v1_proveedores_id | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:19 |
| execute | this.api.execute<Api.ProveedorResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_proveedores_id"], params, params); }  | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:20 |
| endpoint-id/SSE | GET_api_v1_proveedores_id | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:20 |
| execute | this.api.execute<Api.ProveedorResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_proveedores_id"], params, params, body); }  | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:21 |
| endpoint-id/SSE | PUT_api_v1_proveedores_id | frontend/src/app/features/proveedores/data-access/proveedores.api.ts:21 |
| execute | this.api.execute<Api.PageReembolsoResponseDTO>(ENDPOINT_BY_ID['GET_api_v1_reembolsos'], params, params);  | frontend/src/app/features/reembolsos/data-access/reembolsos.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_reembolsos | frontend/src/app/features/reembolsos/data-access/reembolsos.api.ts:12 |
| execute | this.api.execute<Api.ReembolsoResponseDTO>(ENDPOINT_BY_ID['POST_api_v1_reembolsos'], params, params, body);  | frontend/src/app/features/reembolsos/data-access/reembolsos.api.ts:16 |
| endpoint-id/SSE | POST_api_v1_reembolsos | frontend/src/app/features/reembolsos/data-access/reembolsos.api.ts:16 |
| execute | this.api.execute<Api.ReembolsoResponseDTO>(ENDPOINT_BY_ID['GET_api_v1_reembolsos_id'], params, params);  | frontend/src/app/features/reembolsos/data-access/reembolsos.api.ts:20 |
| endpoint-id/SSE | GET_api_v1_reembolsos_id | frontend/src/app/features/reembolsos/data-access/reembolsos.api.ts:20 |
| execute | this.api.execute<Api.ReembolsoResponseDTO>(ENDPOINT_BY_ID['POST_api_v1_reembolsos_id_procesar'], params, params, body);  | frontend/src/app/features/reembolsos/data-access/reembolsos.api.ts:24 |
| endpoint-id/SSE | POST_api_v1_reembolsos_id_procesar | frontend/src/app/features/reembolsos/data-access/reembolsos.api.ts:24 |
| execute | this.api.execute<Api.ArqueosReporteDTO>(ENDPOINT_BY_ID["GET_api_v1_reportes_caja_arqueos"], params, params); }  | frontend/src/app/features/reportes/data-access/reportes.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_reportes_caja_arqueos | frontend/src/app/features/reportes/data-access/reportes.api.ts:12 |
| execute | this.api.execute<string>(ENDPOINT_BY_ID["GET_api_v1_reportes_caja_arqueos_exportar"], params, params); }  | frontend/src/app/features/reportes/data-access/reportes.api.ts:13 |
| endpoint-id/SSE | GET_api_v1_reportes_caja_arqueos_exportar | frontend/src/app/features/reportes/data-access/reportes.api.ts:13 |
| execute | this.api.execute<Api.ClientesFrecuentesDTO>(ENDPOINT_BY_ID["GET_api_v1_reportes_clientes_frecuentes"], params, params); }  | frontend/src/app/features/reportes/data-access/reportes.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_reportes_clientes_frecuentes | frontend/src/app/features/reportes/data-access/reportes.api.ts:14 |
| execute | this.api.execute<string>(ENDPOINT_BY_ID["GET_api_v1_reportes_clientes_frecuentes_exportar"], params, params); }  | frontend/src/app/features/reportes/data-access/reportes.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_reportes_clientes_frecuentes_exportar | frontend/src/app/features/reportes/data-access/reportes.api.ts:15 |
| execute | this.api.execute<Api.ProductosEstrellaDTO>(ENDPOINT_BY_ID["GET_api_v1_reportes_productos_estrella"], params, params); }  | frontend/src/app/features/reportes/data-access/reportes.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_reportes_productos_estrella | frontend/src/app/features/reportes/data-access/reportes.api.ts:16 |
| execute | this.api.execute<Api.RentabilidadReporteDTO>(ENDPOINT_BY_ID["GET_api_v1_reportes_productos_rentabilidad"], params, params); }  | frontend/src/app/features/reportes/data-access/reportes.api.ts:17 |
| endpoint-id/SSE | GET_api_v1_reportes_productos_rentabilidad | frontend/src/app/features/reportes/data-access/reportes.api.ts:17 |
| execute | this.api.execute<string>(ENDPOINT_BY_ID["GET_api_v1_reportes_productos_rentabilidad_exportar"], params, params); }  | frontend/src/app/features/reportes/data-access/reportes.api.ts:18 |
| endpoint-id/SSE | GET_api_v1_reportes_productos_rentabilidad_exportar | frontend/src/app/features/reportes/data-access/reportes.api.ts:18 |
| execute | this.api.execute<Api.ProveedoresRankingDTO>(ENDPOINT_BY_ID["GET_api_v1_reportes_proveedores_ranking"], params, params); }  | frontend/src/app/features/reportes/data-access/reportes.api.ts:19 |
| endpoint-id/SSE | GET_api_v1_reportes_proveedores_ranking | frontend/src/app/features/reportes/data-access/reportes.api.ts:19 |
| execute | this.api.execute<string>(ENDPOINT_BY_ID["GET_api_v1_reportes_proveedores_ranking_exportar"], params, params); }  | frontend/src/app/features/reportes/data-access/reportes.api.ts:20 |
| endpoint-id/SSE | GET_api_v1_reportes_proveedores_ranking_exportar | frontend/src/app/features/reportes/data-access/reportes.api.ts:20 |
| execute | this.api.execute<Api.PageVentaReporteDTO>(ENDPOINT_BY_ID["GET_api_v1_reportes_ventas"], params, params); }  | frontend/src/app/features/reportes/data-access/reportes.api.ts:21 |
| endpoint-id/SSE | GET_api_v1_reportes_ventas | frontend/src/app/features/reportes/data-access/reportes.api.ts:21 |
| execute | this.api.execute<string>(ENDPOINT_BY_ID["GET_api_v1_reportes_ventas_exportar"], params, params); }  | frontend/src/app/features/reportes/data-access/reportes.api.ts:22 |
| endpoint-id/SSE | GET_api_v1_reportes_ventas_exportar | frontend/src/app/features/reportes/data-access/reportes.api.ts:22 |
| execute | this.api.execute<Api.VentasResumenDTO>(ENDPOINT_BY_ID["GET_api_v1_reportes_ventas_resumen"], params, params); }  | frontend/src/app/features/reportes/data-access/reportes.api.ts:23 |
| endpoint-id/SSE | GET_api_v1_reportes_ventas_resumen | frontend/src/app/features/reportes/data-access/reportes.api.ts:23 |
| execute | this.api.execute<Array<Api.RolResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_roles"], params, params); }  | frontend/src/app/features/roles/data-access/roles.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_roles | frontend/src/app/features/roles/data-access/roles.api.ts:12 |
| execute | this.api.execute<Api.RolResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_roles"], params, params, body); }  | frontend/src/app/features/roles/data-access/roles.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_roles | frontend/src/app/features/roles/data-access/roles.api.ts:13 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_roles_id"], params, params); }  | frontend/src/app/features/roles/data-access/roles.api.ts:14 |
| endpoint-id/SSE | DELETE_api_v1_roles_id | frontend/src/app/features/roles/data-access/roles.api.ts:14 |
| execute | this.api.execute<Api.RolResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_roles_id"], params, params); }  | frontend/src/app/features/roles/data-access/roles.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_roles_id | frontend/src/app/features/roles/data-access/roles.api.ts:15 |
| execute | this.api.execute<Api.RolResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_roles_id"], params, params, body); }  | frontend/src/app/features/roles/data-access/roles.api.ts:16 |
| endpoint-id/SSE | PUT_api_v1_roles_id | frontend/src/app/features/roles/data-access/roles.api.ts:16 |
| get | this.http.get<HistorialSalarialResponseDTO[]>(`${this.base}/${empleadoId}/historial-salarial`); | frontend/src/app/features/rrhh/data-access/historial-salarial.api.ts:47 |
| get | this.http.get<HistorialSalarialResponseDTO[]>(`${this.base}/me/historial-salarial`); | frontend/src/app/features/rrhh/data-access/historial-salarial.api.ts:52 |
| get | this.http.get<RegimenResponseDTO>(this.base);  | frontend/src/app/features/rrhh/data-access/mi-regimen.api.ts:101 |
| put | this.http.put<RegimenResponseDTO>(this.base, body);  | frontend/src/app/features/rrhh/data-access/mi-regimen.api.ts:105 |
| get | this.http.get<GananciaPersonalResponseDTO>(`${this.base}/resumen`, { params });  | frontend/src/app/features/rrhh/data-access/mi-regimen.api.ts:112 |
| get | this.http.get<PoliticaRemuneracionDTO>(`${this.base}/${empleadoId}/politica-remuneracion`); | frontend/src/app/features/rrhh/data-access/politica-remuneracion.api.ts:44 |
| get | this.http.get<PoliticaRemuneracionDTO>(`${this.base}/me/politica-remuneracion`); | frontend/src/app/features/rrhh/data-access/politica-remuneracion.api.ts:48 |
| execute | this.api.execute<Api.TotpConfigDTO>(ENDPOINT_BY_ID["POST_api_v1_rrhh_asistencias_configurar_totp_empleadoId"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:12 |
| endpoint-id/SSE | POST_api_v1_rrhh_asistencias_configurar_totp_empleadoId | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:12 |
| execute | this.api.execute<Api.DashboardAsistenciaDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_asistencias_dashboard"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:13 |
| endpoint-id/SSE | GET_api_v1_rrhh_asistencias_dashboard | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:13 |
| execute | this.api.execute<Array<Api.UserInfoDTO>>(ENDPOINT_BY_ID["GET_api_v1_rrhh_asistencias_empleados"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_rrhh_asistencias_empleados | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:14 |
| execute | this.api.execute<Api.AsistenciaEstadoDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_asistencias_estado_dia"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_rrhh_asistencias_estado_dia | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:15 |
| execute | this.api.execute<Api.PageRrhhAsistenciaResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_asistencias_listar"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_rrhh_asistencias_listar | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:16 |
| execute | this.api.execute<Api.RrhhAsistenciaResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_rrhh_asistencias_manual"], params, params, body); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:17 |
| endpoint-id/SSE | POST_api_v1_rrhh_asistencias_manual | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:17 |
| execute | this.api.execute<Api.RrhhAsistenciaResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_rrhh_asistencias_marcar_qr"], params, params, body); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:18 |
| endpoint-id/SSE | POST_api_v1_rrhh_asistencias_marcar_qr | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:18 |
| execute | this.api.execute<Api.RrhhAsistenciaResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_rrhh_asistencias_marcar_qr_real"], params, params, body); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:19 |
| endpoint-id/SSE | POST_api_v1_rrhh_asistencias_marcar_qr_real | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:19 |
| execute | this.api.execute<Api.PageRrhhAsistenciaResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_asistencias_mis_asistencias"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:20 |
| endpoint-id/SSE | GET_api_v1_rrhh_asistencias_mis_asistencias | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:20 |
| execute | this.api.execute<Api.QrPublicoDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_asistencias_qr_config_empleadoId"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:21 |
| endpoint-id/SSE | GET_api_v1_rrhh_asistencias_qr_config_empleadoId | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:21 |
| execute | this.api.execute<Api.QrPublicoDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_asistencias_qr_publico"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:22 |
| endpoint-id/SSE | GET_api_v1_rrhh_asistencias_qr_publico | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:22 |
| execute | this.api.execute<Api.RrhhAsistenciaResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_asistencias_ultima_marcacion"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:23 |
| endpoint-id/SSE | GET_api_v1_rrhh_asistencias_ultima_marcacion | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:23 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_rrhh_asistencias_id"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:24 |
| endpoint-id/SSE | DELETE_api_v1_rrhh_asistencias_id | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:24 |
| execute | this.api.execute<Api.RrhhAsistenciaResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_asistencias_id"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:25 |
| endpoint-id/SSE | GET_api_v1_rrhh_asistencias_id | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:25 |
| execute | this.api.execute<Api.RrhhAsistenciaResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_rrhh_asistencias_id"], params, params, body); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:26 |
| endpoint-id/SSE | PUT_api_v1_rrhh_asistencias_id | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:26 |
| execute | this.api.execute<Api.PageComisionResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_comisiones"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:27 |
| endpoint-id/SSE | GET_api_v1_rrhh_comisiones | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:27 |
| execute | this.api.execute<Api.CalculoComisionesResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_rrhh_comisiones_calcular"], params, params, body); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:28 |
| endpoint-id/SSE | POST_api_v1_rrhh_comisiones_calcular | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:28 |
| execute | this.api.execute<Api.PageComisionResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_comisiones_empleado_userId"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:29 |
| endpoint-id/SSE | GET_api_v1_rrhh_comisiones_empleado_userId | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:29 |
| execute | this.api.execute<Array<Api.ComisionResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_rrhh_comisiones_periodo"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:30 |
| endpoint-id/SSE | GET_api_v1_rrhh_comisiones_periodo | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:30 |
| execute | this.api.execute<Api.ComisionResponseDTO>(ENDPOINT_BY_ID["PATCH_api_v1_rrhh_comisiones_id_aprobar"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:31 |
| endpoint-id/SSE | PATCH_api_v1_rrhh_comisiones_id_aprobar | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:31 |
| execute | this.api.execute<Api.PageLegajoListadoDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_legajos"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:32 |
| endpoint-id/SSE | GET_api_v1_rrhh_legajos | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:32 |
| execute | this.api.execute<Api.LegajoResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_rrhh_legajos"], params, params, body); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:33 |
| endpoint-id/SSE | POST_api_v1_rrhh_legajos | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:33 |
| execute | this.api.execute<Api.LegajoDashboardDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_legajos_dashboard"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:34 |
| endpoint-id/SSE | GET_api_v1_rrhh_legajos_dashboard | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:34 |
| execute | this.api.execute<Api.LegajoResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_legajos_me"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:35 |
| endpoint-id/SSE | GET_api_v1_rrhh_legajos_me | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:35 |
| execute | this.api.execute<Api.LegajoResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_legajos_empleadoId"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:36 |
| endpoint-id/SSE | GET_api_v1_rrhh_legajos_empleadoId | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:36 |
| execute | this.api.execute<Api.LegajoResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_rrhh_legajos_empleadoId"], params, params, body); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:37 |
| endpoint-id/SSE | PUT_api_v1_rrhh_legajos_empleadoId | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:37 |
| execute | this.api.execute<Array<Api.LegajoDocumentoResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_rrhh_legajos_id_documentos"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:38 |
| endpoint-id/SSE | GET_api_v1_rrhh_legajos_id_documentos | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:38 |
| execute | this.api.execute<Api.LegajoDocumentoResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_rrhh_legajos_id_documentos"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:39 |
| endpoint-id/SSE | POST_api_v1_rrhh_legajos_id_documentos | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:39 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_rrhh_legajos_id_documentos_docId"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:40 |
| endpoint-id/SSE | DELETE_api_v1_rrhh_legajos_id_documentos_docId | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:40 |
| execute | this.api.execute<string>(ENDPOINT_BY_ID["GET_api_v1_rrhh_legajos_id_documentos_docId"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:41 |
| endpoint-id/SSE | GET_api_v1_rrhh_legajos_id_documentos_docId | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:41 |
| execute | this.api.execute<Api.PageNominaListadoDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_nominas"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:42 |
| endpoint-id/SSE | GET_api_v1_rrhh_nominas | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:42 |
| execute | this.api.execute<Api.NominaDashboardDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_nominas_dashboard"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:43 |
| endpoint-id/SSE | GET_api_v1_rrhh_nominas_dashboard | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:43 |
| execute | this.api.execute<Api.GeneracionNominaResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_rrhh_nominas_generar"], params, params, body); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:44 |
| endpoint-id/SSE | POST_api_v1_rrhh_nominas_generar | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:44 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_rrhh_nominas_id"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:45 |
| endpoint-id/SSE | DELETE_api_v1_rrhh_nominas_id | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:45 |
| execute | this.api.execute<Api.NominaResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_nominas_id"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:46 |
| endpoint-id/SSE | GET_api_v1_rrhh_nominas_id | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:46 |
| execute | this.api.execute<Api.NominaResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_rrhh_nominas_id_aprobar"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:47 |
| endpoint-id/SSE | POST_api_v1_rrhh_nominas_id_aprobar | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:47 |
| execute | this.api.execute<Api.BoletaPagoDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_nominas_id_boleta"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:48 |
| endpoint-id/SSE | GET_api_v1_rrhh_nominas_id_boleta | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:48 |
| execute | this.api.execute<Api.NominaResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_rrhh_nominas_id_pagar"], params, params, body); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:49 |
| endpoint-id/SSE | POST_api_v1_rrhh_nominas_id_pagar | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:49 |
| execute | this.api.execute<Api.PageTurnoTrabajoResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_turnos"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:50 |
| endpoint-id/SSE | GET_api_v1_rrhh_turnos | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:50 |
| execute | this.api.execute<Api.TurnoTrabajoResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_rrhh_turnos"], params, params, body); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:51 |
| endpoint-id/SSE | POST_api_v1_rrhh_turnos | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:51 |
| execute | this.api.execute<Api.AsignacionTurnoResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_rrhh_turnos_asignar"], params, params, body); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:52 |
| endpoint-id/SSE | POST_api_v1_rrhh_turnos_asignar | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:52 |
| execute | this.api.execute<Api.TurnoDashboardDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_turnos_dashboard"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:53 |
| endpoint-id/SSE | GET_api_v1_rrhh_turnos_dashboard | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:53 |
| execute | this.api.execute<Array<Api.TurnoTrabajoResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_rrhh_turnos_empleado_userId"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:54 |
| endpoint-id/SSE | GET_api_v1_rrhh_turnos_empleado_userId | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:54 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_rrhh_turnos_id"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:55 |
| endpoint-id/SSE | DELETE_api_v1_rrhh_turnos_id | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:55 |
| execute | this.api.execute<Api.TurnoTrabajoResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_rrhh_turnos_id"], params, params); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:56 |
| endpoint-id/SSE | GET_api_v1_rrhh_turnos_id | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:56 |
| execute | this.api.execute<Api.TurnoTrabajoResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_rrhh_turnos_id"], params, params, body); }  | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:57 |
| endpoint-id/SSE | PUT_api_v1_rrhh_turnos_id | frontend/src/app/features/rrhh/data-access/rrhh.api.ts:57 |
| get | this.http.get<SedeMapa[]>(`${this.base}/api/v1/sedes/mapa`);  | frontend/src/app/features/sedes/data-access/sede-ubicacion.api.ts:25 |
| post | this.http.post<Api.SedeResponseDTO>(`${this.base}/api/v1/sedes/${id}/imagen`, cuerpo);  | frontend/src/app/features/sedes/data-access/sede-ubicacion.api.ts:31 |
| get | this.http.get(`${this.base}/api/v1/sedes/imagenes`, { params: { ruta }, responseType: 'blob' });  | frontend/src/app/features/sedes/data-access/sede-ubicacion.api.ts:35 |
| execute | this.api.execute<Api.PageSedeResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_sedes"], params, params); }  | frontend/src/app/features/sedes/data-access/sedes.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_sedes | frontend/src/app/features/sedes/data-access/sedes.api.ts:12 |
| execute | this.api.execute<Api.SedeResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_sedes"], params, params, body); }  | frontend/src/app/features/sedes/data-access/sedes.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_sedes | frontend/src/app/features/sedes/data-access/sedes.api.ts:13 |
| execute | this.api.execute<Api.PageSedeResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_sedes_estado"], params, params); }  | frontend/src/app/features/sedes/data-access/sedes.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_sedes_estado | frontend/src/app/features/sedes/data-access/sedes.api.ts:14 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_sedes_id"], params, params); }  | frontend/src/app/features/sedes/data-access/sedes.api.ts:15 |
| endpoint-id/SSE | DELETE_api_v1_sedes_id | frontend/src/app/features/sedes/data-access/sedes.api.ts:15 |
| execute | this.api.execute<Api.SedeResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_sedes_id"], params, params); }  | frontend/src/app/features/sedes/data-access/sedes.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_sedes_id | frontend/src/app/features/sedes/data-access/sedes.api.ts:16 |
| execute | this.api.execute<Api.SedeResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_sedes_id"], params, params, body); }  | frontend/src/app/features/sedes/data-access/sedes.api.ts:17 |
| endpoint-id/SSE | PUT_api_v1_sedes_id | frontend/src/app/features/sedes/data-access/sedes.api.ts:17 |
| execute | this.api.execute<Api.PageServicioResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_servicios"], params, params); }  | frontend/src/app/features/servicios/data-access/servicios.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_servicios | frontend/src/app/features/servicios/data-access/servicios.api.ts:12 |
| execute | this.api.execute<Api.ServicioResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_servicios"], params, params, body); }  | frontend/src/app/features/servicios/data-access/servicios.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_servicios | frontend/src/app/features/servicios/data-access/servicios.api.ts:13 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_servicios_check_nombre"], params, params); }  | frontend/src/app/features/servicios/data-access/servicios.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_servicios_check_nombre | frontend/src/app/features/servicios/data-access/servicios.api.ts:14 |
| execute | this.api.execute<Record<string, unknown>>(ENDPOINT_BY_ID["GET_api_v1_servicios_dashboard_statistics"], params, params); }  | frontend/src/app/features/servicios/data-access/servicios.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_servicios_dashboard_statistics | frontend/src/app/features/servicios/data-access/servicios.api.ts:15 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_servicios_id"], params, params); }  | frontend/src/app/features/servicios/data-access/servicios.api.ts:16 |
| endpoint-id/SSE | DELETE_api_v1_servicios_id | frontend/src/app/features/servicios/data-access/servicios.api.ts:16 |
| execute | this.api.execute<Api.ServicioResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_servicios_id"], params, params); }  | frontend/src/app/features/servicios/data-access/servicios.api.ts:17 |
| endpoint-id/SSE | GET_api_v1_servicios_id | frontend/src/app/features/servicios/data-access/servicios.api.ts:17 |
| execute | this.api.execute<Api.ServicioResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_servicios_id"], params, params, body); }  | frontend/src/app/features/servicios/data-access/servicios.api.ts:18 |
| endpoint-id/SSE | PUT_api_v1_servicios_id | frontend/src/app/features/servicios/data-access/servicios.api.ts:18 |
| get | this.http.get(`${environment.apiUrl}/api/v1/servicios/importar/plantilla`, { responseType: 'blob' }).pipe(takeUntil(this.destroy$)).subscribe({  | frontend/src/app/features/servicios/pages/servicios-page.component.ts:286 |
| post | this.http.post<{ creados: number; actualizados: number }>(`${environment.apiUrl}/api/v1/servicios/importar`, cuerpo).pipe(takeUntil(this.destroy$)).subscribe({  | frontend/src/app/features/servicios/pages/servicios-page.component.ts:299 |
| execute | this.api.execute<Api.StockResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_stock"], params, params, body); }  | frontend/src/app/features/stock/data-access/stock.api.ts:12 |
| endpoint-id/SSE | POST_api_v1_stock | frontend/src/app/features/stock/data-access/stock.api.ts:12 |
| execute | this.api.execute<Api.AjusteStockResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_stock_ajuste"], params, params, body); }  | frontend/src/app/features/stock/data-access/stock.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_stock_ajuste | frontend/src/app/features/stock/data-access/stock.api.ts:13 |
| execute | this.api.execute<Api.PageAjusteStockResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_stock_ajustes"], params, params); }  | frontend/src/app/features/stock/data-access/stock.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_stock_ajustes | frontend/src/app/features/stock/data-access/stock.api.ts:14 |
| execute | this.api.execute<Api.PageStockResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_stock_almacen_almacenId"], params, params); }  | frontend/src/app/features/stock/data-access/stock.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_stock_almacen_almacenId | frontend/src/app/features/stock/data-access/stock.api.ts:15 |
| execute | this.api.execute<Api.StockResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_stock_almacen_almacenId_producto_productoId"], params, params); }  | frontend/src/app/features/stock/data-access/stock.api.ts:16 |
| endpoint-id/SSE | GET_api_v1_stock_almacen_almacenId_producto_productoId | frontend/src/app/features/stock/data-access/stock.api.ts:16 |
| execute | this.api.execute<Api.PageSaldoKardexDTO>(ENDPOINT_BY_ID["GET_api_v1_stock_bajo_stock"], params, params); }  | frontend/src/app/features/stock/data-access/stock.api.ts:17 |
| endpoint-id/SSE | GET_api_v1_stock_bajo_stock | frontend/src/app/features/stock/data-access/stock.api.ts:17 |
| execute | this.api.execute<Api.PageStockConsolidadoDTO>(ENDPOINT_BY_ID["GET_api_v1_stock_consolidado"], params, params); }  | frontend/src/app/features/stock/data-access/stock.api.ts:18 |
| endpoint-id/SSE | GET_api_v1_stock_consolidado | frontend/src/app/features/stock/data-access/stock.api.ts:18 |
| execute | this.api.execute<Api.StockDashboardDTO>(ENDPOINT_BY_ID["GET_api_v1_stock_dashboard"], params, params); }  | frontend/src/app/features/stock/data-access/stock.api.ts:19 |
| endpoint-id/SSE | GET_api_v1_stock_dashboard | frontend/src/app/features/stock/data-access/stock.api.ts:19 |
| execute | this.api.execute<Array<Api.StockResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_stock_producto_productoId"], params, params); }  | frontend/src/app/features/stock/data-access/stock.api.ts:20 |
| endpoint-id/SSE | GET_api_v1_stock_producto_productoId | frontend/src/app/features/stock/data-access/stock.api.ts:20 |
| execute | this.api.execute<Api.TransferenciaStockResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_stock_transferencia"], params, params, body); }  | frontend/src/app/features/stock/data-access/stock.api.ts:21 |
| endpoint-id/SSE | POST_api_v1_stock_transferencia | frontend/src/app/features/stock/data-access/stock.api.ts:21 |
| execute | this.api.execute<Api.PageTransferenciaStockResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_stock_transferencias"], params, params); }  | frontend/src/app/features/stock/data-access/stock.api.ts:22 |
| endpoint-id/SSE | GET_api_v1_stock_transferencias | frontend/src/app/features/stock/data-access/stock.api.ts:22 |
| execute | this.api.execute<Api.TransferenciaStockResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_stock_transferencias_id"], params, params); }  | frontend/src/app/features/stock/data-access/stock.api.ts:23 |
| endpoint-id/SSE | GET_api_v1_stock_transferencias_id | frontend/src/app/features/stock/data-access/stock.api.ts:23 |
| execute | this.api.execute<Api.TurnoCajaResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_turnos_caja"], params, params, body); }  | frontend/src/app/features/turnos-caja/data-access/turnos-caja.api.ts:12 |
| endpoint-id/SSE | POST_api_v1_turnos_caja | frontend/src/app/features/turnos-caja/data-access/turnos-caja.api.ts:12 |
| execute | this.api.execute<Api.ResumenCierreCajaDTO>(ENDPOINT_BY_ID["POST_api_v1_turnos_caja_id_cierre"], params, params, body); }  | frontend/src/app/features/turnos-caja/data-access/turnos-caja.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_turnos_caja_id_cierre | frontend/src/app/features/turnos-caja/data-access/turnos-caja.api.ts:13 |
| execute | this.api.execute<Api.ResumenCierreCajaDTO>(ENDPOINT_BY_ID["GET_api_v1_turnos_caja_id_resumen"], params, params); }  | frontend/src/app/features/turnos-caja/data-access/turnos-caja.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_turnos_caja_id_resumen | frontend/src/app/features/turnos-caja/data-access/turnos-caja.api.ts:14 |
| get | this.http.get<{ abierto?: boolean; turno?: Api.TurnoCajaResponseDTO \| null }>(`${environment.apiUrl}/api/v1/turnos-caja/abierto`, { params: sedeId ? { sedeId } : {}, context: silencio }).pipe(takeUntil(this.destroy$)).subscribe({  | frontend/src/app/features/turnos-caja/pages/turnos-caja-page.component.ts:75 |
| get | this.http.get<CajaChicaFila[]>(`${environment.apiUrl}/api/v1/turnos-caja/${id}/caja-chica`, { context: new HttpContext().set(HTTP_SILENCIOSO, true) }).pipe(takeUntil(this.destroy$)).subscribe({  | frontend/src/app/features/turnos-caja/pages/turnos-caja-page.component.ts:162 |
| post | this.http.post(`${environment.apiUrl}/api/v1/turnos-caja/${id}/caja-chica`, {  | frontend/src/app/features/turnos-caja/pages/turnos-caja-page.component.ts:175 |
| execute | this.api.execute<Array<Api.UserResponseDTO>>(ENDPOINT_BY_ID["GET_api_v1_users"], params, params); }  | frontend/src/app/features/users/data-access/users.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_users | frontend/src/app/features/users/data-access/users.api.ts:12 |
| execute | this.api.execute<Api.UserResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_users"], params, params, body); }  | frontend/src/app/features/users/data-access/users.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_users | frontend/src/app/features/users/data-access/users.api.ts:13 |
| execute | this.api.execute<unknown>(ENDPOINT_BY_ID["DELETE_api_v1_users_id"], params, params); }  | frontend/src/app/features/users/data-access/users.api.ts:14 |
| endpoint-id/SSE | DELETE_api_v1_users_id | frontend/src/app/features/users/data-access/users.api.ts:14 |
| execute | this.api.execute<Api.UserResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_users_id"], params, params); }  | frontend/src/app/features/users/data-access/users.api.ts:15 |
| endpoint-id/SSE | GET_api_v1_users_id | frontend/src/app/features/users/data-access/users.api.ts:15 |
| execute | this.api.execute<Api.UserResponseDTO>(ENDPOINT_BY_ID["PUT_api_v1_users_id"], params, params, body); }  | frontend/src/app/features/users/data-access/users.api.ts:16 |
| endpoint-id/SSE | PUT_api_v1_users_id | frontend/src/app/features/users/data-access/users.api.ts:16 |
| execute | this.api.execute<Api.PageVentaListadoResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_ventas"], params, params); }  | frontend/src/app/features/ventas/data-access/ventas.api.ts:12 |
| endpoint-id/SSE | GET_api_v1_ventas | frontend/src/app/features/ventas/data-access/ventas.api.ts:12 |
| execute | this.api.execute<Api.VentaProcesadaResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_ventas"], params, params, body); }  | frontend/src/app/features/ventas/data-access/ventas.api.ts:13 |
| endpoint-id/SSE | POST_api_v1_ventas | frontend/src/app/features/ventas/data-access/ventas.api.ts:13 |
| execute | this.api.execute<Api.VentaDetalleResponseDTO>(ENDPOINT_BY_ID["GET_api_v1_ventas_id"], params, params); }  | frontend/src/app/features/ventas/data-access/ventas.api.ts:14 |
| endpoint-id/SSE | GET_api_v1_ventas_id | frontend/src/app/features/ventas/data-access/ventas.api.ts:14 |
| execute | this.api.execute<Api.VentaProcesadaResponseDTO>(ENDPOINT_BY_ID["POST_api_v1_ventas_id_anulacion"], params, params, body); }  | frontend/src/app/features/ventas/data-access/ventas.api.ts:15 |
| endpoint-id/SSE | POST_api_v1_ventas_id_anulacion | frontend/src/app/features/ventas/data-access/ventas.api.ts:15 |
| get | this.http.get<Page<Producto>>(`${this.api}/productos`, { params: { activo: true, searchTerm, size: 100, page } }); }  | frontend/src/app/features/ventas/ventas-api.service.ts:34 |
| get | this.http.get<Fraccion[]>(`${this.api}/catalogo-fracciones/producto/${productoId}/disponibles`); }  | frontend/src/app/features/ventas/ventas-api.service.ts:35 |
| get | this.http.get<Page<Servicio>>(`${this.api}/servicios`, { params: { activo: true, searchTerm, size: 100 } }); }  | frontend/src/app/features/ventas/ventas-api.service.ts:36 |
| get | this.http.get<Page<StockFila>>(`${this.api}/stock/almacen/${almacenId}`, { params: { size: 200, page } }); }  | frontend/src/app/features/ventas/ventas-api.service.ts:37 |
| get | this.http.get<Page<SaldoAlmacen>>(`${this.api}/kardex/saldos/almacen/${almacenId}`, { params: { size: 200, page } }); }  | frontend/src/app/features/ventas/ventas-api.service.ts:38 |
| get | this.http.get(`${this.api}/productos/imagenes`, { params: { ruta }, responseType: 'blob' }); }  | frontend/src/app/features/ventas/ventas-api.service.ts:39 |
| get | this.http.get<Page<Cliente>>(`${this.api}/clientes`, { params: { searchTerm, size: 30 } }); }  | frontend/src/app/features/ventas/ventas-api.service.ts:40 |
| get | this.http.get<Page<Sede>>(`${this.api}/sedes`, { params: { size: 50 } }); }  | frontend/src/app/features/ventas/ventas-api.service.ts:41 |
| get | this.http.get<Almacen[]>(`${this.api}/almacenes/sede/${sedeId}`); }  | frontend/src/app/features/ventas/ventas-api.service.ts:42 |
| endpoint-id/SSE | new EventSource(url);  | frontend/src/app/layout/components/header/header.ts:115 |
| get | this.http.get<AsistenciaQrDTO>(`${this.apiUrl}/qr-publico`, {  | frontend/src/app/services/asistencia.service.ts:44 |
| post | this.http.post<RrhhAsistenciaResponseDTO>(`${this.apiUrl}/marcar-qr-real`, body, {  | frontend/src/app/services/asistencia.service.ts:62 |
| get | this.http.get(`${this.apiUrl}/listar`, {  | frontend/src/app/services/asistencia.service.ts:84 |
| get | this.http.get(`${this.apiUrl}/mis-asistencias`, {  | frontend/src/app/services/asistencia.service.ts:102 |
| get | this.http.get<RrhhAsistenciaResponseDTO>(`${this.apiUrl}/${id}`, {  | frontend/src/app/services/asistencia.service.ts:113 |
| post | this.http.post<RrhhAsistenciaResponseDTO>(`${this.apiUrl}/manual`, data, {  | frontend/src/app/services/asistencia.service.ts:119 |
| put | this.http.put<RrhhAsistenciaResponseDTO>(`${this.apiUrl}/${id}`, data, {  | frontend/src/app/services/asistencia.service.ts:128 |
| delete | this.http.delete<void>(`${this.apiUrl}/${id}`, {  | frontend/src/app/services/asistencia.service.ts:134 |
| get | this.http.get<DashboardAsistenciaDTO>(`${this.apiUrl}/dashboard`, {  | frontend/src/app/services/asistencia.service.ts:144 |
| get | this.http.get<RrhhAsistenciaResponseDTO>(`${this.apiUrl}/ultima-marcacion`, {  | frontend/src/app/services/asistencia.service.ts:150 |
| get | this.http.get<AsistenciaEstadoDTO>(`${this.apiUrl}/estado-dia`, {  | frontend/src/app/services/asistencia.service.ts:156 |
| get | this.http.get<UserInfoDTO[]>(`${this.apiUrl}/empleados`, {  | frontend/src/app/services/asistencia.service.ts:165 |
| get | this.http.get<QrPersonalDTO>(`${this.apiUrl}/mi-qr`, { headers: this.getHeaders() });  | frontend/src/app/services/asistencia.service.ts:176 |
| post | this.http.post<RrhhAsistenciaResponseDTO>(  | frontend/src/app/services/asistencia.service.ts:181 |
| get | this.http.get<AsistenciaRosterDTO[]>(`${this.apiUrl}/roster`, {  | frontend/src/app/services/asistencia.service.ts:190 |
| post | this.http.post<MarcarLoteResponseDTO>(`${this.apiUrl}/marcar-lote`, body, {  | frontend/src/app/services/asistencia.service.ts:197 |
| post | this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(  | frontend/src/app/services/auth.service.ts:24 |
| post | this.http.post(`${this.apiUrl}/logout`, { refreshToken: this.tokenService.getRefresh() }).subscribe({  | frontend/src/app/services/auth.service.ts:48 |
| delete | this.http.delete(`${environment.apiUrl}/api/v1/notificaciones/push`, { params: { endpoint }, responseType: 'text' }));  | frontend/src/app/shared/services/avisos-sistema.service.ts:103 |
| get | this.http.get<{ publica: string }>(`${environment.apiUrl}/api/v1/notificaciones/push/clave`));  | frontend/src/app/shared/services/avisos-sistema.service.ts:121 |
| post | this.http.post(`${environment.apiUrl}/api/v1/notificaciones/push`, {  | frontend/src/app/shared/services/avisos-sistema.service.ts:128 |
| get | this.http.get<TurnoAbierto>(`${environment.apiUrl}/api/v1/turnos-caja/abierto`, { params, context: new HttpContext().set(HTTP_SILENCIOSO, true) }).subscribe({  | frontend/src/app/shared/services/caja-gate.service.ts:43 |
| get | this.http.get<ConfiguracionPublicaDTO>(`${environment.apiUrl}/api/v1/configuracion/publica`).subscribe({  | frontend/src/app/shared/services/marca.service.ts:19 |
| post | this.http.post<{ ruta: string }>(`${environment.apiUrl}/api/v1/configuracion/logo`, cuerpo);  | frontend/src/app/shared/services/marca.service.ts:65 |
| put | this.http.put<ConfiguracionPublicaDTO>(`${environment.apiUrl}/api/v1/configuracion/marca`, {  | frontend/src/app/shared/services/marca.service.ts:69 |
| get | this.http.get<{ sinLeer: number }>(`${environment.apiUrl}/api/v1/mensajes-web/sin-leer`).subscribe({  | frontend/src/app/shared/services/mensajes-sin-leer.service.ts:13 |
| get | this.http.get(`${environment.apiUrl}/api/v1/exportacion`, { params, responseType: 'blob' }).pipe(  | frontend/src/app/shared/services/report.service.ts:14 |
| get | this.http.get(`${environment.apiUrl}/api/v1/cotizaciones/${id}/documento`, {  | frontend/src/app/shared/services/report.service.ts:20 |
| get | this.http.get<CmsPublico>(`${environment.apiUrl}/api/v1/public/cms`).subscribe({  | sitio_web/src/app/core/cms.store.ts:66 |
| endpoint-id/SSE | new EventSource(`${environment.apiUrl}/api/v1/public/cms/eventos`);  | sitio_web/src/app/core/cms.store.ts:78 |
| get | this.http.get<EmpresaPublica>(`${this.base}/empresa`);  | sitio_web/src/app/core/portal.api.ts:15 |
| get | this.http.get<SedePublica[]>(`${this.base}/sedes`);  | sitio_web/src/app/core/portal.api.ts:19 |
| get | this.http.get<CategoriaPublica[]>(`${this.base}/catalogo/categorias`).pipe(  | sitio_web/src/app/core/portal.api.ts:25 |
| get | this.http.get<ProductoPublico[]>(`${this.base}/catalogo/ofertas`);  | sitio_web/src/app/core/portal.api.ts:31 |
| get | this.http.get<ServicioPublico[]>(`${this.base}/servicios`);  | sitio_web/src/app/core/portal.api.ts:35 |
| get | this.http.get<ProductoPublico[]>(`${this.base}/catalogo/destacados`);  | sitio_web/src/app/core/portal.api.ts:39 |
| get | this.http.get<PaginaPublica<ProductoPublico>>(`${this.base}/catalogo/productos`, { params }).pipe(  | sitio_web/src/app/core/portal.api.ts:48 |
| get | this.http.get(`${this.base}/catalogo/productos/pdf`, { responseType: 'blob' });  | sitio_web/src/app/core/portal.api.ts:67 |
| get | this.http.get<ProductoPublico>(`${this.base}/catalogo/productos/${id}`);  | sitio_web/src/app/core/portal.api.ts:71 |
| get | this.http.get<ProyectoPublico[]>(`${this.base}/portafolio`);  | sitio_web/src/app/core/portal.api.ts:75 |
| get | this.http.get<FormatoCotizacion>(`${this.base}/cotizaciones/formato`);  | sitio_web/src/app/core/portal.api.ts:79 |
| post | this.http.post<VistaCotizacion>(`${this.base}/cotizaciones/vista`, cuerpo);  | sitio_web/src/app/core/portal.api.ts:83 |
| post | this.http.post<CotizacionCreada>(`${this.base}/cotizaciones`, cuerpo);  | sitio_web/src/app/core/portal.api.ts:87 |
| post | this.http.post(`${this.base}/pedidos-whatsapp`, cuerpo, { responseType: 'text' });  | sitio_web/src/app/core/portal.api.ts:95 |
| post | this.http.post<ContactoCreado>(`${this.base}/contacto`, cuerpo);  | sitio_web/src/app/core/portal.api.ts:99 |
| get | this.http.get<HiloPublico>(`${this.base}/chat/${clave}`);  | sitio_web/src/app/core/portal.api.ts:103 |
| post | this.http.post<HiloPublico>(`${this.base}/chat`, cuerpo);  | sitio_web/src/app/core/portal.api.ts:107 |
| get | this.http.get<{ encontrada: boolean; mismoDispositivo: boolean; nombre?: string; referencia?: string }>(`${this.base}/chat-coincidencias`, { params });  | sitio_web/src/app/core/portal.api.ts:112 |
| post | this.http.post<{ clave: string }>(`${this.base}/chat-continuar`, cuerpo);  | sitio_web/src/app/core/portal.api.ts:116 |
| post | this.http.post(`${this.base}/chat/${clave}/leido`, {}, { responseType: 'text' });  | sitio_web/src/app/core/portal.api.ts:120 |
| post | this.http.post(`${this.base}/chat/${clave}/escribiendo`, { activo }, { responseType: 'text' });  | sitio_web/src/app/core/portal.api.ts:124 |
