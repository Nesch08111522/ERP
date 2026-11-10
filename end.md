# Entrega del sitio publico POLICALUM

## Prioridad visual: cubierta arquitectonica (2026-11-10)

Estado vigente: NO APROBADO para cierre visual integral. Las capturas del usuario contradicen la aprobacion conceptual previa: dos alas alrededor de un H no comunicaban una cubierta y la superficie persistia hasta footer. Las aprobaciones anteriores quedan como historial, no como aceptacion vigente.

- Referencia NUEVA idea.mp4 copiada a .work/idea-reference-20261110-roof-01.mp4 y analizada realmente con media-read. Video aproximado 12s: monitor con scroll, transicion de latas a residencia/exterior/interiores y retorno. No muestra un despiece de cubierta; se adopta su narrativa espacial, no se afirma clon ni referencia constructiva.
- Geometria reemplazada: cuatro vanos contiguos con dos pieles, 76 paredes alveolares instanciadas, perfiles H entre juntas, U perimetral/cierres extremos, marco/correas, cuatro columnas con bases y 15 cabezas hexagonales instanciadas. Proporciones conceptuales, no medidas ni certificacion de producto comercial. Aluminio neutral y iluminacion/tinte ligados a tokens CMS/tema, sin escrituras de paleta.
- Poses montado -> capas elevadas verticalmente -> ensamblado. Eliminada oscilacion dependiente del reloj que impedia frames reversibles. Footer provoca fade previo y visibility hidden cuando entra al viewport. Se reservan bandas de lectura para despiece/arquitectura sin quitar contenido existente. La visibilidad de bandas es condicional y falta suavizar/verificar sus fronteras: continuidad global no aprobada.
- Transparencia alpha sin transmission para evitar pases refractivos costosos: primer ensayo CDP timeout con transmission. Posterior ensayo encontro serializacion circular del cache GSAP en diagnostico pose, corregida proyectando solo campos numericos.
- Capturas NUEVAS internas .work/roof-{1440,390}-{producto,ensamblaje,aplicaciones,contacto,footer}.png; no entregadas al usuario. Media-read reconoce cubierta con cuatro columnas/planchas y despiece ordenado en ambos tamanos. Primera interpretacion confundio hero con footer; segunda lectura exclusiva de contacto/footer confirma ausencia de cubierta. Arquitectura ensamblada fue descrita demasiado oscura/pequena en movil: luz neutral ajustada despues, recaptura final pendiente por timeout CDP.
- Ensayos completos localhost4201 y LAN192.168.100.11:4201 sin excepciones Runtime ni writes interceptadas; overflow=false en diez posiciones. Contacto/footer opacity0/hidden. Muestreo pares +/-12px y reverso: movil matching en todas las poses; escritorio tuvo mismatches en producto/ensamblaje en ultima ejecucion completa, posiblemente refresh/layout asincrono, causa aun no acreditada. NO se considera continuidad perceptual aprobada.
- Ultimos dos reintentos CDP timeout Runtime.evaluate y Fetch.disable. .work/roof-evidence.json contiene el intento mas reciente incompleto, no usarlo como evidencia de ejecucion completa anterior. Capturas conservan ultimo ensayo completo anterior al ajuste de luz; resultados completos estuvieron en salida de herramienta. No se detuvo navegador ni servidores para forzar resultado.
- Build final OK15.008s, inicial268.96kB/transferencia66.89kB. Suite threads existente9 archivos/23 tests OK7.58s antes de nueva prueba de fases; repetir para total vigente. Runner default forks timeout sin tests; no aprobado. Warning NODE_TLS_REJECT_UNAUTHORIZED=0 heredado, no alterado. Diff check sin errores, solo avisos CRLF.
- Sin dependencias nuevas, commits, eliminaciones, cambios backend/frontend ERP ni DB writes; procesos8080/4200/4201 no detenidos. apply_patch no disponible confirmado Get-Command; se usaron Read/Edit/Write dedicados.
- Ultima verificacion serial: suite9 archivos/24 pruebas OK8.63s incluye fases montado/despiece/cierre y mapeo reversible. Fallback CSS H sustituido por cuatro paños y apoyos; no verificado visualmente sin GPU. Build posterior OK13.467s inicial269.87kB/transferencia67.07kB.
- Pendiente obligatorio: continuidad de bandas sin saltos, matching desktop estable con CMS/layout cargado, recapturas del ajuste luminoso, prueba topologia automatizada real y footer forward/reverse, verificacion visual fallback, rendimiento prolongado. Etapa DB imagenes solo preview posterior con salvaguardas; ninguna imagen comercial ficticia agregada.

## Alcance y estructura

- `backend/`: ERP Java existente, no modificado por esta implementacion.
- `frontend/`: interfaz ERP existente, no modificada por esta implementacion.
- `sitio_web/`: Angular 22.1, TypeScript 6, rutas lazy, API publica y carrito existentes.
- `sitio_web/src/app/components/hero-cinematic.component.ts`: escena procedural y fallback.
- `sitio_web/src/app/core/seo.service.ts`: metadatos por ruta y JSON-LD.
- `sitio_web/src/styles.css`: lenguaje cinematic y adaptacion responsive.

## Checklist

- [x] Fondo oscuro purpura/marino, variables del tema existente, titulos oversize, navegacion y cotizacion glassmorphism; modo dia existente conservado.
- [x] Hero parcialmente sticky, perfil H metalico y plancha translucida procedurales, particulas sutiles, rotacion/acercamiento/desensamble GSAP ScrollTrigger y revelado de texto.
- [x] Imports dinamicos Three/GSAP; liberacion geometria/materiales/renderer/contexto/tweens/observers/listeners; pausa render fuera de pantalla y pestana oculta; DPR limitado y movil ajustado.
- [x] Fallback CSS sin WebGL o con reduced motion; cambio a reduced motion durante ejecucion libera escena.
- [x] Catalogo sin bordes, datos de API sin productos/precios ficticios; cortes solo cuando ERP los publica, etiquetas 1/4, 1/2, 3/4, 1 por factor, precio exacto de cada corte sin multiplicacion proporcional.
- [x] Sede Elvira Garcia y Garcia 711 Trujillo frente Colegio Manucci; almacen Chicago sin direccion inventada.
- [x] WhatsApp 954668279 fijo con pulso morado y accesible, sin animacion bajo reduced motion.
- [x] Metadatos y OG por ruta, LocalBusiness sin horarios/coordenadas/dominio inventados; Product solamente desde respuesta publica, Offer omitido si stock desconocido o producto fraccionable para evitar precio ambiguo.
- [x] Cancelacion de solicitud de producto anterior al cambiar ID y al destruir componente; branding asincrono ya no pisa titulo de ruta.
- [x] Cambios ajenos de models/portafolio/backend/frontend conservados. No se encontraron AGENTS.md en repo.
- [ ] Verificacion visual WebGL real, responsive en dispositivos y navegacion completa con API activa pendiente: no se utilizo navegador.
- [ ] Objetivo de carga <2s NO verificado. El tamano de bundle no acredita velocidad real; falta Lighthouse/medicion con hosting, red y hardware reales.
- [ ] No hay modelo GLB suministrado ni texturas reales: la escena es conceptual, no ficha dimensional de un SKU.
- [ ] SEO renderizado en cliente: indexacion/preview de redes depende del crawler; SSR/prerender no incorporado. No se prometen rich results de Google.

## Resultados verificados

- `npm install three gsap` y `npm install -D @types/three`: completados; Three 0.187.0, tipos 0.187.0, GSAP 3.15.1 compatibles con compilacion Angular 22.1/TS 6.0.3.
- `npm ls three gsap @types/three typescript @angular/core`: arbol sin errores de compatibilidad.
- `npm run build`: produccion completada, bundle inicial 266.08 kB / transferencia estimada 66.28 kB; Three lazy 751.13 kB raw. Salida `sitio_web/dist/sitio`.
- `npm test -- --watch=false`: compilacion de pruebas OK, runner forks bloqueo con timeout; no se considera prueba aprobada.
- `npm test -- --watch=false --runner-config=vitest-base.config.ts`: 5 archivos y 11 pruebas aprobadas. Configuracion threads con un worker para superar bloqueo del entorno Windows.
- Pruebas nuevas: precio/stock exactos, corte elegido enviado a carrito, etiquetas sin generar fracciones, Product/Offer honesto, limpieza SEO y LocalBusiness solo con datos conocidos.
- `git diff --check`: incidencia ajena preexistente en KardexRepository.java (linea vacia EOF) y avisos CRLF. No se corrige backend fuera de alcance.
- Pendiente revisar la verificacion TLS del entorno de desarrollo antes del despliegue; no se modifico la configuracion global.

## Archivos de esta implementacion

- `sitio_web/package.json`, `sitio_web/package-lock.json`: dependencias.
- `sitio_web/src/app/components/hero-cinematic.component.ts`: nuevo hero.
- `sitio_web/src/app/components/ficha-producto.component.ts`, `.spec.ts`: selector de fracciones y pruebas.
- `sitio_web/src/app/components/asistente.component.ts`: enlace fijo WhatsApp.
- `sitio_web/src/app/pages/inicio.component.ts`, `.html`: integracion hero y sedes; banner anterior conservado inactivo.
- `sitio_web/src/app/pages/producto.component.ts`: SEO y cancelacion de peticiones obsoletas.
- `sitio_web/src/app/core/seo.service.ts`, `.spec.ts`: SEO y pruebas.
- `sitio_web/src/app/core/empresa.store.ts`, `tema.service.ts`: titulos y default nocturno.
- `sitio_web/src/app/app.ts`, `sitio_web/src/styles.css`: rutas SEO y estilo.
- `sitio_web/vitest-base.config.ts`: alternativa threads de pruebas.
- `end.md`: este informe solicitado.

## Etapa 1: recuperacion y organizacion (2026-11-10)

- Alcance exclusivo: recuperar contenido existente y organizar DOM/anclas en `sitio_web`. Las entradas anteriores de este informe son historicas, no acreditan etapas futuras de este encargo.
- Revision previa: ENGINEERING_STANDARDS.md, git status/diff, inicio, hero cinematic, galeria completa, mapa, shell/CMS, estilos y pruebas/configuracion existentes. Diff inicial vacio; dos recursos ajenos sin seguimiento en `.work/` conservados sin modificacion.
- Copy CMS heroKicker/heroTitulo/heroTexto y todos sus respaldos, acciones y chips recuperados. Se reutiliza el bloque anterior como marca con h2; el unico h1 sigue en hero cinematic. No se mantiene una copia inactiva redundante: la fuente anterior se integra en el mismo bloque, sin descartar contenido.
- Carrusel original conservado y activo: tres clips, videos/posters, anterior/siguiente/puntos, mute, pausa/reanudacion y fallback reducido. Logica TS sin cambios; no se incorpora autoplay del temporizador al inicio que no existia.
- Recorrido DOM: producto -> marca -> ensamblaje (galeria existente completa) -> categorias -> catalogo (ofertas/destacados/novedades separados) -> aplicaciones/proyectos -> servicios/precios -> confianza/beneficios -> sedes/mapa -> contacto/RUC -> footer.
- Galeria sin modificar ni recortar: seis piezas de respaldo, contenido CMS publicado, videos, posters y visor conservados. Se mantiene `materiales` interno y se agrega ancla ensamblaje al host.
- Banner/avisos, carrito, navegacion, footer/shell, enlaces y filtros siguen existentes. Footer solo recibe id. Servicios, precios y productos siguen usando sus fuentes reales; no se agregan formulario, texto comercial, categorias, precios ni stock.
- Archivos modificados: inicio.component.html (integracion y orden), app.html (ancla footer), app.spec.ts (dos regresiones adicionales), end.md (esta seccion). Sin cambios en backend/frontend ERP, dependencias, paleta, timeline ni SEO. Sin commits ni acciones sobre servidor 8080.
- `npm run build` en sitio_web: completado, salida dist/sitio, inicial 266.09 kB / transferencia estimada 66.30 kB; 14.802 s de compilacion (no tiempo de carga).
- `npm test -- --watch=false --runner-config=vitest-base.config.ts`: 5 archivos / 13 pruebas aprobadas. Se usa runner existente threads de un worker, sin cambiar configuracion.
- Regresiones nuevas: CMS reactivo, unico h1, orden DOM/anclas, conjuntos diferenciados, CTA existente sin formulario nuevo; galeria completa de seis piezas, carrusel circular, posters, cambio a video y fuentes originales.
- `git diff --check`: completado sin incidencias. Diff revisado; no archivos eliminados ni cambios ajenos modificados.
- Limites: no se ejecuto navegador/E2E ni verificacion visual WebGL, responsive, reproduccion multimedia real o API activa. La suite usa proveedores mock y reduced motion; no acredita interacciones completas del visor. Warning del entorno NODE_TLS_REJECT_UNAUTHORIZED=0 en build, no alterado por esta etapa.
- Resultado: APROBADO CON OBSERVACIONES por validacion visual/funcional real pendiente. Ninguna etapa posterior marcada cumplida.

## Etapa 2: paleta ERP y estilos contextualizados (2026-11-10)

- Correccion explicita aplicada: el ERP designa los colores; no se exige azul ni morado. Los puntos de color anteriores de este informe son historicos, no requisitos vigentes.
- Fuente confirmada por lectura de CmsService.java (97-105, 286-292) y ColoresSitioDTO.java: cms.colores.dia/noche es autoritativa; primaryColor/secondaryColor se utilizan solo sin paleta por modo. Empresa/Marca gestionan identidad, no la paleta. Backend, frontend ERP y DB no modificados ni consultados mediante escrituras.
- CmsStore conserva cargar/revision/SSE y el selector TemaService sin imponer themeMode sobre la eleccion local. Un solo style cms-colores se reemplaza en cargas posteriores. Entradas hex de seis digitos validadas antes de generar CSS; defaults existentes por modo para campos invalidos/ausentes. Tamano base acepta solo numero finito.
- Tokens existentes accent/bg/paper y derivados cinematic de texto/focus usan la misma fuente. Contraste utiliza luminancia sRGB y ratio WCAG para texto sobre botones; texto cinematic conserva el ERP si cumple 4.5 sobre fondo y tarjeta o elige el neutral compartido con mejor contraste. Paletas con superficies extremas incompatibles no permiten garantizar contraste universal; pendiente verificar en navegador.
- Glass casi opaco deriva de paper/bg, bordes de accent/paper. Hover de primarios mantiene color ERP y agrega borde interior; focus visible contextual. Map-card/CTA conservan sus fondos de confianza para no invertir accidentalmente su texto. Overrides de mast, secciones, tiles, product-grid, paneles y WhatsApp acotados a shell inicio-cinema (ruta /, incluidos query/hash); otras rutas recuperan reglas anteriores cuando disponibles.
- Hero Three.js: efecto reactivo observa CMS y modo; lee tokens CSS validados y actualiza luces, metal, vidrio y particulas existentes. Inicializacion asincrona aplica la ultima paleta; cleanup desactiva callback. No nueva escena, timeline, renderer ni listeners por cambio de color.
- Conservado todo el contenido/DOM de etapa 1, CMS, galeria, carrusel, anclas, servicios y contratos comerciales. Sin dependencias nuevas, commits, archivos eliminados ni acciones sobre 8080. Recursos ajenos .work conservados.
- Archivos etapa 2: src/app/core/cms.store.ts, nuevo cms.store.spec.ts, src/app/components/hero-cinematic.component.ts, src/app/app.html (clase contextual), src/styles.css y este informe. Cambios previos app.spec.ts e inicio.component.html conservados.
- Validacion final: npm run build completado (13.041 s, inicial 267.47 kB; salida dist/sitio). npm test -- --watch=false --runner-config=vitest-base.config.ts: 6 archivos / 16 pruebas aprobadas. Primer intento de pruebas encontro tipo unknown en helper flush; corregido a object y repetido con exito.
- Tres pruebas nuevas: precedencia dia/noche y tokens derivados; configuracion legacy/ausente; carga posterior con reemplazo de tokens, revision, un solo nodo style y rechazo de inyeccion CSS. Las regresiones de etapa 1 siguen aprobadas.
- Limites: no navegador/E2E, API real ni WebGL real; las pruebas no acreditan color renderizado Three.js ni contraste sobre fotos, toda combinacion ERP, zoom o todos los dispositivos. Responsive mejorado con wrap de mast y notas en flujo movil, sin ocultar contenido nuevo ni overflow de contencion. Timeline/escenas posteriores NO implementadas. Warning TLS del entorno preexistente, no modificado.
- Resultado: APROBADO CON OBSERVACIONES; falta validacion visual y funcional real antes de aprobacion final.

## Mejora alveolar verificada (2026-11-10)

- Referencia reanalizada con media-read: referencia-sitio.mp4 coincide SHA256 con IDEA SITIO WEB.mp4 (450567275F98B7CFA9DB9D27211E02E545FBFC046B23ED364AE16E271239622C). Prompt adicional y screenshot gestionado leidos. La captura previa no permitia distinguir canales/transparencia.
- Hero: dos planchas huecas con skins .018 y 21 paredes internas por plancha, extremos abiertos y perfil H de alma .045/alas .035, proporciones conceptuales. Material no metalico con transmission .92/IOR 1.586; paredes Standard translucidas para evitar coste de transmission por cada rib. Metal neutral; acento de CMS solo luz/tinte minimo, no cambia paleta ERP. Timeline continua y cleanup existente conservados; oscilacion suave de planchas sin crear RAF adicional.
- Shell: se filtran exclusivamente las tres etiquetas prohibidas del banner CMS y se elimina su fallback; mensajes adicionales del CMS sobreviven. Stock/RUC y contenido comercial intactos. Responsive conserva canvas visible sin reducir opacidad, separado del texto movil. No dependencias, commits, cambios DB/ERP/backend ni procesos detenidos.
- .work/verify-polycarbonate.cjs: Edge CDP localhost4201, desktop1440x900 y movil390x844, producto y ensamblaje: canvas=1, h1=1, overflow=false y exceptions=[]. Cuatro capturas internas interpretadas por media-read: canales repetidos, translucidez y borde reconocibles como policarbonato; galeria mantiene fotos reales, no se confunde con render. No acredita exactitud dimensional ni continuidad perceptual del video.
- npm run build OK 21.528s, inicial268.78kB/transferencia66.85kB; npm test -- --watch=false --runner-config=vitest-base.config.ts: 9 archivos/23 tests OK. Regresion de timeline ahora verifica posiciones de alas y las dos planchas. git diff --check OK antes del cierre documental. Warning TLS heredado intacto.
- verify-followup: primeros dos intentos timeout Runtime.evaluate, no aprobados; tras reemplazar transmission de ribs por Standard, ejecucion completa: localhost/LAN contenido exacto, botones dia/noche uniformes GPU distintos, filtros/catalogo/producto/fallback/disposal ejecutados, writes=[]. Rendimiento instrumentado mediana56.7ms/p95 210.1ms, no 60fps certificado.
- Browser registro ERR_CACHE_OPERATION_NOT_SUPPORTED en ubicanos.mp4 via LAN. Se agrega fallback a poster en error del carrusel, sin quitar video ni recursos. Sigue pendiente diagnosticar cache/range del servidor/navegador y medir produccion, CMS/SSE vivo, multiples sesiones GPU y movimiento continuo. No se presentan screenshots al usuario. Estado APROBADO CON OBSERVACIONES para esta mejora conceptual, no aprobacion integral ni clon certificado.

## Nota de herramientas

El comando apply_patch se intento antes de editar, pero no esta instalado en este host. Se utilizaron herramientas dedicadas Read/Write/Edit, leyendo archivos existentes antes de modificarlos y construyendo archivos nuevos por skeleton y secciones.

## Continuacion etapa 3 y recorrido 3D (2026-11-10)

- Lectura completa del prompt maestro (635 lineas), estandar, historial y archivos relacionados. Cambios previos conservados. La correccion de Nancy prevalece: paleta CMS dia/noche, no azul/morado obligatorio.
- Nuevo cinematic-sequence.ts separa poses conceptuales y controlador del host Angular. Una timeline pausada, un ScrollTrigger, mismo renderer/camara/objetos del hero hasta footer. Scroll nativo reversible sin pin; medidas por anclas reales y actualizacion agrupada mediante ResizeObserver/MutationObserver, con limpieza al destruir. Secciones opcionales no generan contenido comercial ficticio.
- Superficie decorativa fija, textos en flujo con fondo contextual legible, enlaces internos de recorrido; footer original intacto. Menos particulas en movil y DPR existente conservado. Geometria conceptual H/plancha, sin GLB ni precision certificada.
- Inicio ahora informa carga/error de fuentes publicadas y cache sin conexion; cancela solicitudes al destruir y portafolio anterior al refrescar. Formularios RUC/reclamaciones, precios, cortes y stock no modificados. Backend/ERP/DB/8080 intactos; sin dependencias ni commits.
- npm run build final: OK, 18.471 s, inicial 268.47 kB / transferencia estimada 66.80 kB. Advertencia TLS preexistente no alterada.
- npm test -- --watch=false --runner-config=vitest-base.config.ts: repeticion final OK, 7 archivos / 18 pruebas, 5.92 s. Intento paralelo anterior fallo por timeout al iniciar threads; no ocultado ni configuracion debilitada. Dos regresiones nuevas: mapeo reversible/clamps/anclas y liberacion timeline/trigger/observer/refresh. Suites CMS/tema/contenido/cortes/SEO/cotizacion siguen aprobadas.
- MCP discovery devolvio tools=[]: no herramientas de navegador MCP disponibles. Se uso CDP del Edge local existente via Node sin instalar dependencias. .work/verify-cinema.cjs conserva el ensayo reproducible, sin screenshots entregados.
- CDP real: 1440x900, 768x1024, 390x844 sin overflow horizontal, un h1 y un canvas; nueve anclas presentes; scroll contacto mantiene canvas. /catalogo elimina canvas, regreso / crea uno, reduced motion elimina canvas y muestra fallback. Sin Runtime.exceptionThrown en esos ensayos. Esto no acredita consola completa ni todos enlaces/formularios.
- Contexto WebGL2 real no perdido, buffer con dimensiones por viewport; lectura de pixels fuera del frame devolvio cero (buffer no persistente), por tanto NO acredita dibujo visible. Ensayo de lectura sincronizada RAF se bloqueo/timeout y no produjo evidencia util. Validacion artistica visual, GPU dibujando y continuidad percibida quedan pendientes, no se afirma diseño 3D listo.
- GET read-only contra API existente localhost:8080: empresa, catalogo/productos, categorias, servicios, portafolio, sedes y cotizaciones/formato HTTP 200; 12 productos en primera pagina, 1 categoria, 1 servicio, 3 proyectos, 2 sedes. Sin escrituras ni secretos impresos.
- Servidor de desarrollo iniciado PID 46472, URL http://127.0.0.1:4307/ (puerto libre verificado); no se detuvo ningun servidor ajeno.
- git diff --check OK con avisos CRLF. Pendientes: verificacion visual real/captura interpretada, matrices tema renderizado, fallback WebGL forzado, pausa oculta y fugas GPU medidas, formularios sin escribir DB, todas rutas/filtros, rendimiento Core Web Vitals y sitemap solo con dominio confirmado. No se completan etapas restantes por inferencia.
- Resultado global solicitado: NO APROBADO para entrega integral por evidencia visual obligatoria incompleta. Implementacion y regresiones automatizadas verificadas; no se promete 100%.

## Continuacion LAN y evidencia GPU (2026-11-10)

- Servidores del usuario 4200/4201/8080 y BD no detenidos ni modificados. No se inicio otro servidor. Sitio verificado en http://localhost:4201/ y http://192.168.100.11:4201/. IP obtenida de interfaz activa con gateway, no fijada en codigo de aplicacion.
- environment.ts: API toma protocolo y hostname del origen con puerto backend 8080; consumidores HTTP, SSE y media relativa comparten esta base. Sin proxy nuevo ni cambios CORS. GET CMS en ambos hosts HTTP 200, CORS autoriza origen LAN exacto. Paleta publicada dia #0D47A1, noche #90CAF9: se respeta CMS, no se exige igual acento entre modos.
- catalogo.component.ts: cancela consulta anterior al cambiar filtro/recargar y todas las solicitudes al destruir; evita resultados obsoletos y callbacks posteriores a navegar.
- contacto.component.spec.ts: tres pruebas locales con transporte mock, rechazo de vacios/correo/telefono invalidos, requisitos del libro, envio simulado y retencion de entradas ante fallo. No envios vivos. Validacion HTML checkValidity del browser NO acredita validadores Angular.
- .work/verify-cinema.cjs: Edge CDP existente, captura errores Runtime/Log/consola y bloquea metodos distintos de GET/HEAD/OPTIONS. Sin dependencias nuevas. Ventana normal y focus emulado necesarios: ventana oculta pausaba render correctamente y devolvia draws=0.
- Lectura GPU corregida en el ensayo, no en produccion: material transmission dibuja primero en framebuffer intermedio; readPixels debe ejecutarse tras draw en framebuffer principal (FRAMEBUFFER_BINDING=null). .work/cinema-browser.log contiene ultima ejecucion COMPLETA: ambos origenes alpha=33463, framebuffer 1706x945; escritorio producto alpha=24027, marca=35361, ensamblaje=37411, catalogo=16979, aplicaciones=61734. Hay dibujo real no transparente; no acredita composicion artistica ni precision comercial.
- Ejecucion completa: 1440x900/768x1024/390x844, diez posiciones por viewport sin overflow; anclas intermedias alrededor de top=110px, footer limitado por final de documento. Trece rutas con titulo, un h1 y sin canvas fuera de inicio. Context loss elimina canvas y activa fallback; reduced motion inicia sin canvas ni draws. Errores=[] y escrituras bloqueadas=[] en esa ejecucion. Una repeticion anterior registro ERR_CACHE_OPERATION_NOT_SUPPORTED de conector-blanco.mp4; no se oculta.
- Ultima repeticion despues de cambiar ensayo a botones reales dia/noche: timeout Runtime.evaluate al pasar al segundo origen; NO acredita cambio reactivo 3D por boton. Log completo anterior conservado. Cambios de atributos de tema anteriores solo acreditan CSS, no signal TemaService.
- Tests finales serializados con build: npm test -- --watch=false --runner-config=vitest-base.config.ts OK, 8 archivos / 21 pruebas; npm run build OK, 16.200 s, inicial 268.47 kB / transferencia estimada 66.78 kB. Build no es tiempo de carga; warning TLS preexistente no modificado. Diff check detecto lineas vacias EOF en informes y se corrigieron.
- Pendientes obligatorios: screenshots interpretadas/continuidad visual, comparar contenido completo exacto entre origenes, filtro interactivo y producto individual, prueba reactiva CMS/tema GPU, no-WebGL desde inicializacion, navegacion SPA repetida y medicion disposal GPU/RAF, rendimiento sin instrumentacion readPixels (intrusiva), HTTPS con backend TLS/proxy y media absoluta legacy. La base ahora usa HTTPS si el sitio usa HTTPS: necesita backend TLS 8080 o configuracion de despliegue; no se afirma que el backend actual HTTP soporte HTTPS. CORS existente enumera origenes; otro puerto requerira autorizacion exacta, no wildcard.
- Resultado: NO APROBADO para entrega integral; avance implementado y evidencia GPU objetiva, pero matriz visual/funcional incompleta. No se presentaron archivos ni screenshots.

## Verificacion ejecutable adicional (2026-11-10)

- .work/verify-followup.cjs usa evaluaciones sincronas cortas con timeout Runtime=3s/CDP=8s, alcance local por eval y finally para desactivar interceptacion. Evita promesas RAF y readPixels pesado. Ensayo inicial encontro redeclaracion de const entre evaluaciones CDP: aislado sin modificar aplicacion. Ejecucion final completa sin timeout, errors=[] y writes=[].
- Comparacion exacta de texto principal renderizado, enlaces pathname/query y CSS CMS entre localhost:4201 e IP:4201: iguales, SHA256 16d7ee598b4208afbb5c50c0d1597e165d44b1006421baf706d5d31a5a5d8f52. Excluye host de enlaces; no representa comparacion de todos los recursos binarios ni todo el backend.
- Botones reales dia/noche: dataset y acento cambian #0D47A1/#90CAF9; uniform3f/uniform3fv GPU capturados con valores distintos entre modos y draws activos. Capturar solo uniform3fv daba vacio porque Three usa tambien uniform3f; corregido ensayo. No necesita reiniciar servidor. CMS asincrono sigue cubierto por tests; no se escribio configuracion viva para disparar SSE.
- Capturas internas .work/visual-producto/ensamblaje/catalogo/contacto.png obtenidas CDP e interpretadas juntas mediante media_read: perfil H y plancha visibles en hero y CTA, texto principal legible, en galeria predominan fotos y catalogo tarjetas. No acredita continuidad animada de una imagen estatica. Recorte lateral de ultima tarjeta corresponde carrusel; mezcla foto/representacion conceptual conserva recursos originales. Riesgo de legibilidad CTA sobre zonas claras senalado, no validado universalmente.
- Filtros reales: 18 productos; ordenar por nombre devuelve lista ordenada; soloStock mantiene 18 porque todos disponibles; Ofertas cambia query ?vista=ofertas y muestra 11 tarjetas, todas con etiqueta oferta. Producto a776786f-ebbb-4dd6-9798-63a5b71f89f5 navegado por enlace SPA: Arandela de neopreno, S/0.25, stock 500, datos reales publicados, sin agregar carrito ni enviar formularios.
- WebGL indisponible inicial: override getContext solo webgl antes de navegar, luego retirado; canvas=0/fallback=true/h1=1. Error esperado de Three al crear contexto no se oculta por cambio de produccion.
- Disposal acotado: salida SPA del inicio libera 25 recursos GL; canvas=0 y contador draws estable entre dos muestras separadas 800ms. No demuestra ausencia universal de fugas tras muchas sesiones.
- Rendimiento Edge dev instrumentado sin readPixels: ultima muestra 105 intervalos de draws distintos, mediana 54.9ms/p95 256.1ms; DOMContentLoaded 594.9ms/load 669.1ms (valores exactos en JSON), heap alrededor 34MB. No es FPS de presentacion ni Core Web Vitals; rendimiento observado no permite afirmar 60fps ni carga universal menor 2s.
- Medios legacy: respuesta real usa ruta relativa /api/v1/public/catalogo/imagenes. portal.api.ts normaliza absolutas solo hostname backend/loopback, mismo puerto y prefijo publico; conserva terceros, otros puertos y rutas privadas. Galeria reutiliza media() preservando /videos locales. Dos tests nuevos cubren politica, query/hash y terceros. IP historica desconocida no se reescribe por adivinacion.
- Tests finales 9 archivos/23 pruebas OK tras primer timeout de inicio threads; no configuracion debilitada. Build serial posterior OK 13.634s, inicial 268.46kB / transferencia estimada 66.78kB. Warning TLS heredado intacto.
- Pendiente real: validacion artistica de movimiento continuo/reverso, responsive visual imagen en movil, CMS/SSE GPU con transporte simulado y sesiones repetidas/memoria, rendimiento produccion sin instrumentacion y solucionar cache video si reproducible fuera del ensayo. HTTPS/puertos adicionales siguen requiriendo infraestructura TLS/CORS exacta, no prometidos. Estado integral NO APROBADO; esta tanda cierra pruebas ejecutables descritas, no todos los criterios originales.
