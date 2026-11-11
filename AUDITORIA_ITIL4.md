# Auditoria ITIL 4: ERP Policalum

Fecha: 2026-11-11. Alcance autorizado: repositorio local, revision estatica y pruebas aisladas. Responsable de aprobacion operativa: propietario del servicio, por designar nominalmente.

## 1. Alcance y evidencia

Se leyeron ENGINEERING_STANDARDS.md, README.md y backend/docs/API-ROLES.md. No se encontraron AGENTS.md ni QWEN.md mediante busqueda por nombre dentro del proyecto. Se inspeccionaron git status/diff y se preservaron cambios previos en .work/roof-evidence.json, QWEN_REPORTE.md, end.md y dos componentes/pruebas del sitio. No hubo commits.

Estados: I = implementado observado en fuente; T = probado en esta tanda; P = propuesto, no desplegado; NE = no evidenciado en el alcance. NE no significa inexistente fuera del repositorio. Prioridades: P1 riesgo alto, antes de despliegue; P2 siguiente ciclo; P3 madurez organizativa. LAS se usa aqui como matriz local de aplicabilidad del servicio, no como metodo oficial ITIL ni certificacion.

| ID | Evidencia local | Estado y limite |
| --- | --- | --- |
| E1 | backend/pom.xml, README.md | I: Spring Boot 4.0.6, Java 17, JPA/PostgreSQL, dos aplicaciones Angular; no inventario productivo verificado |
| E2 | backend/src/main/java/com/policalum/erp/infrastructure/security/SecurityConfig.java | I: JWT stateless, BCrypt, CORS de origen exacto, headers, seguridad por metodo; no MFA de login evidenciado |
| E3 | mismo directorio: RateLimitFilter.java, RateLimitService.java | I/T: buckets login/QR, cache limitada 200000 entradas; Retry-After ahora redondea hacia arriba |
| E4 | mismo directorio: RolePermissionGuard.java; backend/docs/API-ROLES.md | I/T parcial: ADMIN completo intencional; otros roles por permisos. Tabla declara obsolescencia y no acredita cobertura actual de todos los endpoints |
| E5 | backend/src/main/resources/application-prod.properties y application.properties | I: prod validate y documentacion apagada; base default update, sin confirmar perfil activo. No se reproducen valores sensibles |
| E6 | .github/workflows/ci.yml; backend/src/test/resources/application.properties; ErpApplicationTests.java | I: CI configurada, no corrida remota acreditada. Context smoke tiene default a DB real; se excluyo de pruebas de esta tanda |
| E7 | busqueda **/*backup*, **/*restore*, scripts ps1/sh/bat/py y pg_dump/pg_restore | NE: no scripts de backup/restauracion encontrados. backend/ERP*.sql son archivos existentes, no backups recientes/validos acreditados; no se leyeron datos de esos volcados |
| E8 | busqueda @Transactional/@Lock en servicios/repositorios | I parcial: transacciones y locks pesimistas; no prueba de integridad concurrente productiva |
| E9 | EnvioPushService.java | I: send externo por suscripcion, sin timeout explicito en este codigo; SDK no inspeccionado, no afirmar ausencia de limites internos |

No se consulto DB activa, no se iniciaron servidores, no se reiniciaron 8080/4200/4201, no se ejecuto postman/barrido.py, pentest, carga ni restauracion. No se instalaron infraestructura/dependencias. Las cifras historicas de QWEN_REPORTE.md no son nuevas mediciones de esta auditoria.

## 2. Matriz de las 34 practicas

Practicas son capacidades organizativas (personas, informacion, tecnologia y socios), no simplemente modulos ERP. Aplicabilidad A = directa; C = contextual/organizativa. Las traducciones y alcances breves son interpretaciones locales; nombres ingleses identifican ITIL 4. Ninguna fila acredita conformidad integral.

### Gestion general: 14

| # | Practica / alcance | Aplic. | Evidencia / estado | Brecha y accion | Prioridad |
| --- | --- | --- | --- | --- | --- |
| 1 | Architecture management: relaciones y evolucion | A | E1 I | ADR, mapa dependencias y puntos unicos de fallo | P2 |
| 2 | Continual improvement: adaptar valor a necesidades | A | reporte e informe I | backlog con responsable, costo, resultado y revision mensual | P2 |
| 3 | Information security management: proteger informacion | A | E2-E4 I/T parcial | CIA, MFA decidido, XFF confiable, seguridad completa por rol | P1 |
| 4 | Knowledge management: conocimiento util y accesible | A | README/estandar I; KEDB P | validar runbooks con operadores y controlar versiones | P2 |
| 5 | Measurement and reporting: decisiones con datos | A | resultados tests T | telemetria operativa/series historicas NE | P1 |
| 6 | Organizational change management: personas y adopcion | C | NE | capacitacion, comunicacion e impacto de MFA/SOD | P2 |
| 7 | Portfolio management: mix de servicios e inversiones | C | modulos E1 I, no cartera ITSM | cartera con valor, riesgo, presupuesto y retiro | P3 |
| 8 | Project management: controlar entrega | C | estandar/reporte I parcial | hitos, responsables, criterios y dependencias | P2 |
| 9 | Relationship management: vinculos con interesados | C | NE | acuerdos con ventas, caja, RRHH y propietario | P2 |
| 10 | Risk management: identificar/tratar riesgos | A | estandar I, registro aqui P | asignar duenos y aceptacion explicita residual | P1 |
| 11 | Service financial management: recursos del servicio | C | finanzas ERP no evidencia costos TI | TCO de backups, operacion y redundancia | P3 |
| 12 | Strategy management: metas y recursos | C | NE | aprobar criticidad, SLA y roadmap financiado | P2 |
| 13 | Supplier management: desempeno de proveedores | C | dependencias E1 I | contratos de hosting/ISP/SDK, soporte y salida | P2 |
| 14 | Workforce and talent management: habilidades/roles | C | RRHH ERP no evidencia operacion TI | responsable y suplente, entrenamiento DRP | P2 |

### Gestion de servicios: 17

| # | Practica / alcance | Aplic. | Evidencia / estado | Brecha y accion | Prioridad |
| --- | --- | --- | --- | --- | --- |
| 15 | Availability management: disponibilidad acordada | A | instancia unica segun alcance, sin medida | medir extremo a extremo; evaluar redundancia | P1 |
| 16 | Business analysis: necesidades y valor | A | README flujo comercial I | BIA caja/ventas/stock y UAT firmada | P1 |
| 17 | Capacity and performance management: demanda futura | A | E3 limites I; baseline NE | CPU, latencia, DB/pool, concurrencia y forecast | P1 |
| 18 | Change enablement: autorizar cambios por riesgo | A | estandar y diff I | cambio con gate, horario, rollback y aprobador | P1 |
| 19 | Incident management: restaurar servicio | A | reporte historico I; DRP P | canal, severidades, tiempos y escalamiento | P1 |
| 20 | IT asset management: ciclo de activos TI | A | manifiestos E1 I | inventario host/licencias/datos y disposicion segura | P2 |
| 21 | Monitoring and event management: observar estados | A | healthcheck DB en CI I | health/metrics servicio, alertas y receptor NE | P1 |
| 22 | Problem management: causas y errores conocidos | A | KEDB P | RCA, frecuencia, workaround seguro y prueba de cierre | P1 |
| 23 | Release management: poner funciones a disposicion | A | CI fuente I | version artefacto, notas y aprobacion UAT | P2 |
| 24 | Service catalogue management: ofertas consistentes | A | README I parcial; catalogo productos no ITSM | catalogo ERP/web, horarios, dueños y soporte | P2 |
| 25 | Service configuration management: CIs/relaciones | A | propiedades/manifiestos E1/E5 I | baseline ambiente sin secretos y mapa CI | P1 |
| 26 | Service continuity management: resiliencia desastre | A | E7 NE; DRP P | backups externos verificados y simulacro aislado | P1 |
| 27 | Service design: utilidad y garantia | A | E1/estandar I parcial | NFR, amenazas, recuperacion y accesibilidad | P2 |
| 28 | Service desk: punto unico de contacto | C | chat comercial no prueba mesa TI | canal soporte y suplente, registro tickets | P2 |
| 29 | Service level management: objetivos del negocio | A | SLA aqui P | aprobar y medir; no SLA historico acreditado | P1 |
| 30 | Service request management: solicitudes predefinidas | C | NE | altas/bajas, permisos y solicitudes de backup autorizadas | P2 |
| 31 | Service validation and testing: valor/requisitos | A | unitarias T, CI E6 I | filtros completos, carga, seguridad, UAT, DRP | P1 |

### Gestion tecnica: 3

| # | Practica / alcance | Aplic. | Evidencia / estado | Brecha y accion | Prioridad |
| --- | --- | --- | --- | --- | --- |
| 32 | Deployment management: mover componentes a ambientes | A | comandos README I | blue-green y cambio de trafico ensayados NE | P1 |
| 33 | Infrastructure and platform management: plataforma | A | E1/CI I parcial | inventario, parches, aislamiento y HA financiada | P1 |
| 34 | Software development and management: software util/confiable | A | E1/E8 I; cambio minimo T | migraciones versionadas, calidad y pruebas ampliadas | P1 |

## 3. Seguridad CIA y decisiones

Confidencialidad: E2 autentica, BCrypt protege hashes y E4 restringe permisos no ADMIN. Verificar DTOs/logs/exportaciones por rol y por propietario; cifrado TLS, discos y backups no comprobado. No registrar tokens, passwords, URLs con credenciales, nomina ni payloads completos en telemetria.

Integridad: E8 aporta transacciones/locks, no demuestra todas las invariantes. Ensayar en DB aislada doble venta del ultimo stock, correlativos, anulacion/reembolso, recepcion y rollback ante excepciones. No introducir reintentos de escritura sin idempotencia.

Disponibilidad: limites E3 y cache acotada mitigan abuso localizado, no son proteccion DDoS ni distribuida. RateLimitFilter.ipDe acepta X-Forwarded-For enviado por cliente: riesgo alto de evasion de bucket IP si acceso directo o proxy no sobrescribe. No cambiado sin conocer topologia; proponer lista de proxies confiables y bloquear acceso directo al origen, con pruebas de cabecera falsa. Bucket por usuario es defensa adicional, no cierre del riesgo.

ADMIN intencional irrestricto se conserva (RolePermissionGuard 61-64). Minimo privilegio aplica al resto de roles, cuentas DB, backup y operacion, no modifica esta excepcion de negocio. Revisar accesos trimestralmente y baja inmediata al desvincularse. Cuenta nominativa, no compartida, y acceso de emergencia con registro son propuestas.

MFA: QR/TOTP de asistencia NO prueba segundo factor de login. Proponer MFA para ADMIN, recovery codes y recuperacion verificada, previa aprobacion por impacto en acceso y soporte; no activado. SOD (segregacion de funciones): proponer aprobacion independiente de pagos, cambios y restauraciones como control organizativo/auditoria, sin recortar ADMIN. SOD forzosa en codigo alteraria flujo y requiere decision expresa; no implementada. Rotacion de secretos y evaluacion de defaults dev antes de produccion requieren plan, no cambio automatico.

## 4. Capacidad, disponibilidad y SLA propuestos

Todos los numeros siguientes son objetivos P sujetos a BIA, costo y aprobacion, no desempeno actual. Propietario acepta horario y exclusiones; responsable operativo mide; desarrollo diagnostica. ERP critico: ventas/caja/stock; web: catalogo/contacto. SUNAT/PSE no se presume implementado por existir comprobantes locales.

| Objetivo inicial propuesto | Valor / definicion | Condicion |
| --- | --- | --- |
| Disponibilidad ERP/web | 99.5% mensual, provisional 24x7 | definir horario real y excluir mantenimiento solo por acuerdo explicito; 30 dias permite 216 min de indisponibilidad |
| Latencia ERP lectura / escritura | p95 <= 1 s / <= 2 s | transporte extremo a extremo, ventanas 5 min; informes/exportaciones medidos aparte |
| Errores servidor | < 1% solicitudes validas mensuales | separar 4xx/429 esperados, timeouts cuentan como fallo |
| P1 incidente | acuse <= 15 min, actualizacion cada 30 min | cobertura humana por financiar; objetivo restauracion <= 4 h, no garantia |
| P2 degradacion | acuse <= 4 h laborales, plan <= 1 dia laboral | calendario laboral por aprobar |
| RPO inicial / RTO inicial | <= 24 h / <= 4 h ERP y adjuntos | solo viable tras backup diario exitoso y restauracion aislada cronometrada; hoy no acreditado |
| RPO evolucion criticos | <= 15 min | requiere WAL/PITR y copia externa monitorizada, no implementado |

RPO = perdida temporal maxima de datos tolerada; medir entre ultimo punto recuperable verificado y incidente. RTO = tiempo desde declaracion de desastre hasta servicio aceptado por negocio, incluye decision, provision, restauracion y validacion, no solo arranque. Capturar cronologia UTC con zona local declarada.

Servicio: sondas sinteticas de login/catalogo y flujo de negocio no destructivo, disponibilidad por resultados y duracion, throughput, errores, p50/p95/p99, usuarios concurrentes. Componentes: CPU host/proceso, heap/GC, disco/IOPS/espacio, threads/cola, conexiones activas/pending DB, locks, consultas lentas y latencia dependencias. Health futuro: liveness sin DB; readiness dependencias con timeout y respuesta minima UP/DOWN/503, sin detalles publicos. Metrics autenticadas/red privada, etiquetas rutas normalizadas (no email/IP/IDs), nunca env/config/heapdump publicos. No se agrego endpoint duplicado ni dependencia Actuator sin validar contrato/topologia.

Disponibilidad = (tiempo acordado - indisponible)/tiempo acordado; uptime del proceso no equivale a servicio util. MTBF = tiempo operativo total / numero fallos; MTTR = duracion total de restauraciones / incidentes restaurados. Sin fallos/muestras suficientes reportar no estimable, no infinito. Actualmente no hay serie nueva de CPU, uptime, MTBF, MTTR o capacidad certificada.

Forecast P: recopilar 30 dias de baseline, picos de cierre de caja y fin de mes; proyectar demanda 3 meses con tendencia semanal y escenario +30%, revisar semanalmente. Umbrales iniciales a calibrar: CPU >70% 15 min, pool >80% 5 min, disco <20% libre y breach latencia sostenido. Relacionar demanda RPS y concurrencia con tiempo respuesta (L=lambda*W, en estado estable). Probar escalones 5/10/25/50 usuarios en staging, detener con errores >1%, p95 doble objetivo o saturacion; no ejecutados. No dimensionar produccion por esos valores hipoteticos. Una sola instancia/host es punto unico de fallo: no garantiza continuidad ni failover instantaneo.

## 5. DRP, backups y recuperacion

Runbook P, no ejecutado ni autorizado para DB real en esta tanda. E7: no script backup/restore encontrado en repo; README referencia scripts/empaquetar_proyecto.py que no se encontro, y un ZIP de codigo no sustituye backup de DB. Volcados SQL sin fecha, checksum, origen ni restauracion validada no acreditan RPO. No se inspeccionaron registros sensibles de dumps.

Politica propuesta: 3 copias, 2 soportes, 1 externa y una copia inmutable/offline; dump PostgreSQL diario formato custom, copia de adjuntos/media/config sin secretos en claro; cifrado y claves custodiadas fuera del host. Retencion 7 diarios/4 semanales/12 mensuales, revisar privacidad/costos. Capturar inicio/fin/punto consistente, version DB, schema/artefacto, tamaño, checksum y resultado sin secretos. Alertar backup fallido o antiguedad >24 h; checksum solo prueba transferencia, no recuperabilidad. Probar mensual restauracion y trimestral desastre con operador suplente. PITR exige base backup + WAL continuo y cadena completa, no se obtiene con dump diario.

1. Declarar P1, registrar incidente/impacto y hora; propietario autoriza DRP, operador y suplente asignados. No improvisar restauracion sobre activo.
2. Preservar evidencias y copias; identificar ultimo punto recuperable, posible corrupcion y transacciones posteriores. Decidir recuperacion vs reparacion con negocio.
3. Seleccionar backup por procedencia, checksum, cifrado, compatibilidad PostgreSQL y adjuntos asociados. Si no hay copia valida, escalar y reportar perdida potencial sin inventar RPO.
4. Provisionar SOLO con autorizacion entorno independiente sin DNS/trafico productivo ni salida push/SUNAT/email. Nombre DB ERPpoli_it_drp_<fecha>, credenciales aisladas, seeds y schedulers deshabilitados; verificar destino y bloquear cualquier URL a ERPpoli real antes de operar.
5. Operador autorizado ensaya restauracion en ese destino (pg_restore para custom, psql para SQL solo tras revisar formato). No usar --clean/drop sobre real. Validar roles/esquema, filas, FK, balances caja, stock/kardex, correlativos y archivos; no limitarse a que DB arranque.
6. Ejecutar smoke/seguridad/UAT en aislado y cronometrar recuperacion completa. Comparar RPO/RTO medidos con objetivos. Responsable negocio acepta conciliacion y lista de transacciones a reingresar sin duplicar.
7. Cutover productivo es cambio SEPARADO con aprobacion, ventana y fencing del escritor viejo para evitar split-brain. No realizado aqui. Recuperacion de failover requiere destino, replicacion, routing y pruebas, inexistencia no se suple con healthcheck.
8. Tras estabilizacion conciliar datos, observar errores y documentar RCA/KEDB. Failback requiere resincronizacion y nueva aprobacion; no cambiar trafico automaticamente.

Backups consistentes de DB y archivos requieren coordinar adjuntos en curso y registrar manifiesto; dump no captura archivos del disco ni usuarios globales. Restore puede perder transacciones recientes: no equivale a rollback de aplicacion. Propuesta de presupuesto de 4 h: 30 min decision, 60 provision, 90 restauracion, 60 validacion/cutover; estimacion a reemplazar por simulacro, no promesa.

## 6. Cambios, blue-green y rollback

Implementado en esta tanda: correccion minima de Retry-After en RateLimitFilter, antes truncaba 1.5 s a 1 s; ahora techo matematico sin suma potencialmente desbordante sobre nanosegundos. Mantiene 429, JSON minimo, capacidades y politica ADMIN. Dos pruebas adicionales cubren 1.5 s, ventana exacta, cero y 1 ns. No nuevos endpoints, dependencias ni cambios DB.

Rollback de este cambio P: aplicar parche inverso SOLO a las lineas modificadas en RateLimitFilter y los dos tests nuevos, conservando cambios ajenos; ejecutar suite seleccionada, empaquetar artefacto y desplegar en ventana aprobada. No git reset/checkout ni restauracion DB. No se desplego nada en esta tanda; procesos actuales pueden seguir ejecutando version anterior.

Blue-green P: producir artefacto versionado con checksum, manifest de config sin secretos y backup verificado; green en entorno aprobado separado, sin seeds ni schedulers duplicados. Ensayar health/readiness con limites, autorizacion y UAT; direccionamiento de trafico por proxy requiere infraestructura y aprobacion, no instalada. Green/blue en mismo host no resuelven fallo de host; ambos contra misma DB no son DR. Limitar escritura a un ejecutor de tareas; drenar solicitudes y SSE, verificar sesiones/JWT y recursos estaticos cacheados. Retener blue hasta cerrar observacion.

Expand-contract P: primero migracion aditiva versionada (columna nullable/tabla/indice compatible), probar N y N-1 con mismo esquema; despues backfill acotado/idempotente y conciliado, luego activar lectura/escritura nueva, y SOLO en release posterior retirar columna/codigo viejo. DDL con lock debe medirse en copia representativa. prod validate ya existe (E5), pero no se encontro Flyway/Liquibase; no cambiar schema activo ni usar ddl-auto=update como estrategia de migracion.

Rollback gate propuesto: error >1% o p95 fuera de objetivo 10 min, integridad afectada o autorizacion incorrecta implica detener avance y evaluar regreso de trafico. No automatizar rollback de DB destructivo. Volver a blue solo si schema y escrituras nuevas siguen compatibles; tras contract incompatible elegir forward-fix o restauracion aprobada con perdida/conciliacion explicita. Registrar aprobador, version anterior/nueva, pruebas, ventana, verificacion posterior y criterio de cierre. Ningun deploy/cutover/rollback operativo ejecutado.

## 7. KEDB y prioridades

Registro compacto inicial; riesgo potencial no se presenta como incidente historico probado. Responsables son roles propuestos, nombres por aprobar.

| ID / tipo | Evidencia, causa o limite | Workaround seguro / solucion | Dueño / cierre | Prioridad |
| --- | --- | --- | --- | --- |
| KE-01 defecto corregido | Retry-After truncaba espera fraccional | techo a segundos; 5 tests filtro verdes | desarrollo; cerrado en fuente, deploy pendiente | P2 |
| KE-02 riesgo seguridad | E3 XFF sin frontera de confianza | verificar proxy y acceso directo; no confiar cabecera arbitraria; cuenta por usuario no basta | seguridad/operacion; test spoof aislado y config aprobada | P1 |
| KE-03 riesgo continuidad | E7 backup/restore automatizado NE | no sobrescribir real; inventariar copias y probar aislado | operacion; restore + manifiesto + RPO medido | P1 |
| KE-04 riesgo drift | E5 base update, prod validate; migrador NE | exigir perfil prod y migracion revisada, no alterar activo | desarrollo/DBA; N/N-1 probado | P1 |
| KE-05 riesgo pruebas | ErpApplicationTests default DB real | seleccionar unitarias/slices; contexto completo solo tras barrera de DB aislada aprobada | QA; eliminar default real en cambio separado probado | P1 |
| KE-06 brecha CI | workflow usa DB_*; recursos test usan POLICALUM_TEST/IT_* | no asumir CI de integracion ejecutada; configurar DB aislada y gates | QA/operacion; run CI y contratos evidenciados | P1 |
| KE-07 dependencia externa | E9 push send sin timeout explicito y operaciones por endpoint sin ownership evidente | no ejecutar peticiones externas; revisar SDK, SSRF/propiedad/timeout antes de editar | seguridad/desarrollo; pruebas mocks y contrato | P1 |
| KE-08 incertidumbre documental | API-ROLES reconoce tabla obsoleta; informes con resultados antiguos | regenerar contrato contra instancia aislada y contrastar cada permiso | desarrollo; matriz por metodo/rol/propietario | P2 |
| KE-09 limitacion test actual | primer Maven timeout 120 s en compilacion | repeticion serial acotada 300 s pasa unitarias | QA; no ocultar timeout inicial | P2 |

Cada nuevo incidente debe enlazar ID problema, sintoma, fecha, impacto, causa validada/hipotesis, workaround, riesgo, responsable, version afectada, prueba de cierre y revision. Prioridad no es severidad CVSS certificada. P1 no significa parche ciego: seguridad XFF/push y continuidad necesitan inspeccion de despliegue/contratos y aprobacion antes de cambios que alteren flujo.

## 8. Validaciones y resultado A-F

### A. Diagnostico

Auditoria por evidencia, no certificacion: principales brechas E7 recuperacion no acreditada, E3 confianza XFF, E5 migraciones, E6 aislamiento pruebas/CI y E9 contratos push. Falta medicion operativa y aprobacion del servicio. Cambio concreto justificado: Retry-After prematuro por division entera.

### B. Solucion implementada

Solo RateLimitFilter.java y RateLimitFilterTest.java modificados en codigo; AUDITORIA_ITIL4.md nuevo autorizado y resumen añadido a QWEN_REPORTE.md preservando historial. Se corrigio redondeo y añadieron dos tests; no politica ADMIN ni datos ni infraestructura.

### C. Calidad y arquitectura

Cambio local reutiliza metodo existente, sin abstracciones/dependencias nuevas. JSON conserva forma minima y no expone internos. Cache, capacidades y autenticacion existentes no cambiadas. No constituye endurecimiento total de seguridad ni mejora cuantificada de throughput.

### D. Validaciones reales

Ejecutadas en backend, offline, sin iniciar servidor ni contexto completo/DB real:

| Comando exacto | Resultado |
| --- | --- |
| `.\mvnw.cmd -o "-Dtest=RateLimitFilterTest,RolePermissionGuardTest,JwtAuthenticationFilterTest,*PermissionControllerTest" test` | timeout 120000 ms durante compilacion; sin resultado de tests; no se afirma aprobado |
| `.\mvnw.cmd -o "-Dtest=RateLimitFilterTest,RolePermissionGuardTest,JwtAuthenticationFilterTest" test` | BUILD SUCCESS, 11 tests, 0 fallos/errores/omitidos; filtro 5, guard 5, JWT 1 |
| `.\mvnw.cmd -o "-Dtest=RateLimitFilterTest,RolePermissionGuardTest,JwtAuthenticationFilterTest,*ServiceImplTest" test` | BUILD SUCCESS, 794 tests, 0 fallos/errores/omitidos; incluye los 11 anteriores, no sumar como 805 distintos |
| `git diff --check` | sin errores whitespace; avisos LF/CRLF |
| `git diff -- backend/src/main/java/com/policalum/erp/infrastructure/security/RateLimitFilter.java backend/src/test/java/com/policalum/erp/infrastructure/security/RateLimitFilterTest.java` | revision del cambio minimo |

Compilacion main/test Maven completada en estas ejecuciones. Warnings heredados Lombok Builder/MapStruct y unchecked no corregidos en esta tanda. No paquete de produccion, coverage, analisis estatico dedicado, build Angular ni integracion PostgreSQL ejecutados. Guard/filter tests unitarios NO demuestran cadena HTTP completa con JWT real. Suites controller no se ejecutaron por timeout inicial; algunos slices deshabilitan filtros y no son prueba end-to-end.

Plan de validacion P: DB aislada con barrera de nombre/URL, contexto y migraciones N/N-1; cadena SecurityFilterChain real con anonimo/token expirado/rol/ownership y cabecera XFF falsa; carga escalonada/soak en staging y métricas baseline; escaneo de dependencias/SAST sin enviar secretos, DAST no invasivo solo staging autorizado; UAT compra-recepcion-cotizacion-venta-caja-anulacion/RRHH con negocio y casos concurrentes. DRP restaura y concilia en aislado. Cada gate requiere evidencia, responsable y aceptacion; nada de esto se marca probado hoy.

### E. Pendientes y riesgos

Aprobar propietarios, horario/SLA/RPO/RTO, presupuesto/copies, MFA y SOD. Verificar topologia proxy, perfil productivo y origen de backups; no hay garantia de failover con instancia unica. Ampliar contratos push, integracion aislada, seguridad HTTP y telemetria. Ningun objetivo SLA se considera vigente solo por este documento.

### F. Resultado final

APROBADO CON OBSERVACIONES para correccion minima de Retry-After en fuente y pruebas seleccionadas. NO APROBADO para afirmar preparacion integral de continuidad/seguridad, SLA operativo o conformidad total ITIL. Auditoria documental entregada; decisiones e infraestructura permanecen propuestas, despliegue pendiente.

## 9. Fuentes y limites de verificacion ITIL

Consulta web realizada 2026-11-11 mediante busqueda administrada dirigida al sitio oficial PeopleCert; URLs devueltas preservadas. El buscador entrego titulos/URLs pero no cuerpo. Fetch de anuncio 2023 y FAQ oficial devolvio HTTP 403: no afirmar lectura completa de guias oficiales ni validacion oficial de cada alcance. Se triangulo lista completa y propositos con fuente secundaria accesible. Debe contrastarse con guias oficiales licenciadas vigentes antes de auditoria formal.

- PeopleCert, ITIL 4 Foundation: https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1/itil-4-foundation-2565
- PeopleCert, actualizacion de practicas 2023: https://www.peoplecert.org/news-and-announcements/2023/itil-4-management-practices-2023
- PeopleCert, Change Enablement (nombre actual en catalogo ITIL 4): https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1/itil-4-practitioner-change-enablement-3794
- PeopleCert, FAQ: https://www.peoplecert.org/help-and-support/faq-itil
- PeopleCert, evolucion Version 5: https://www.peoplecert.org/news-and-announcements/itil-version-5-explained
- PeopleCert, Foundation Version 5: https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1/itil-5-foundation-version-50-4154
- Fuente secundaria leida completa, listado 14 generales +17 servicio +3 tecnicas y propositos ITIL 4, actualizada 2026: https://itsm.tools/34-itil-4-management-practices/

La busqueda oficial tambien devuelve Version 5; ITIL 4 es la referencia explicitamente solicitada, no se anuncia como ultima version universal ni se mezcla su matriz con Version 5. Change enablement no se confunde con organizational change management; release no es deployment. Aplicar controles de codigo no implementa por si solo una practica organizativa completa. Esta auditoria no certifica ERP, organizacion ni personas, no asigna porcentaje de cumplimiento y no promete 100%.
