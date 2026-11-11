# Verificaciones

- Secciones: 23 archivos, contenido no skeleton.
- PlantUML: 92 fuentes (91 previas + FLUJO_GENERAL_POLICALUM.puml); checkonly final sin errores y render PNG local con salida 0.
- Enlaces Markdown inexistentes: 0 (tras reparar enlace inicio).

- Runtime local Java 17; JAR oficial PlantUML 1.2026.2 descargado de GitHub releases al temporal autorizado. Graphviz 2.44.1 detectado por PlantUML. Sin envio de fuentes a renderizadores publicos.
- Render PlantUML: 92/92 PNG en [imagenes](imagenes/); Mermaid sigue sin parser/render.
- 13 fuentes reparadas por errores sintacticos: 10 ERD con etiquetas partidas por salto literal, componentes con etiqueta de BD partida y estados-compra/estados-producto con notas multilínea invalidas. No se alteraron entidades ni estados de la app.
- PNG: firma de 8 bytes, IHDR/dimensiones, IEND e inflado completo de IDAT verificados para 92 archivos; [registro individual](imagenes/validacion-render.json). Dimensiones entre 229 y 4316 px de ancho y 256 y 5427 px de alto; revisar diagramas densos a resolucion original.
- [Flujo general](FLUJO_GENERAL_POLICALUM.png): 2834 x 1297 px, copia identica al PNG en imagenes. Inspeccion con herramienta media: sin texto cortado ni cajas superpuestas; cruces entre ramas y tipografia pequena requieren zoom. La lectura automatica confundio algunas flechas, por lo que prevalece la fuente y las etiquetas verificadas.
- Correccion semantica comercial: conversion de cotizacion ACEPTADA a venta SI existe (CotizacionServiceImpl.convertir:261-282), no debe confundirse con conversion de preforma pendiente. PortalRecepcionController:64-72 y portal.api.ts:86-87 confirman entrada WEB.
- Flujo general trazado contra VentaServiceImpl:45-91,168-180; CompraServiceImpl:60-115,284-343; TurnoCajaServiceImpl:86-102; ServicioServiceImpl:124-205; NominaServiceImpl:81-140,179-207,302-362; ReporteServiceImpl:106-114. No atribuye caja a nomina ni ejecucion a catalogo de servicios.
- Git: DOCUMENTACION_ARQUITECTURA figura sin seguimiento; cambios ajenos versionados preservados. No commits. Edicion manual limitada a documentacion; reparaciones repetitivas automatizadas en scripts temporales.
- BD: NO conectada, catalogo fisico pendiente. No SELECT ejecutado.
- Compilacion/pruebas/HTTP/migraciones/procesos: NO ejecutados por limite de solo lectura.
- Revision semantica: focal, no exhaustiva. Regex produce candidatos, no prueba de conectividad completa.
- Expresiones PreAuthorize se repararon con lectura balanceada de literales; mappings nested/arrays requieren validacion AST pendiente.
- sources de auditoria solo temporales en directorio temp autorizado, no codigo del proyecto.

