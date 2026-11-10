# Entrega del sitio publico POLICALUM

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

## Nota de herramientas

El comando apply_patch se intento antes de editar, pero no esta instalado en este host. Se utilizaron herramientas dedicadas Read/Write/Edit, leyendo archivos existentes antes de modificarlos y construyendo archivos nuevos por skeleton y secciones.
