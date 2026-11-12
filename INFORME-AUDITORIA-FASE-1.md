# Informe de auditoría — Fase 1
## Policalum ERP · 2026-11-06

Documento entregable según §7 del plan: *inventario de entidades, tablas, servicios, endpoints,
permisos, errores y pruebas existentes*, más el plan de corrección.

Todo lo afirmado aquí se verificó ejecutando comandos contra el repositorio, la base `ERPpoli` y
una instancia del backend. No hay suposiciones sin evidencia.

---

## 1. Conexión efectiva a base de datos (§6, requisito previo)

Verificado consultando el servidor y el proceso en ejecución, no el valor por defecto del archivo:

| Parámetro | Valor real | Cómo se comprobó |
|---|---|---|
| Motor | **PostgreSQL 17.10** nativo en Windows | `SELECT version()` |
| Servidor:puerto | `localhost:5432` | `inet_server_port()` |
| Base de datos | **`ERPpoli`** | `current_database()` |
| Usuario | `postgres` | `current_user` |
| Esquema | `public` (único) | `pg_namespace` |
| Tablas | 67 antes → **68** ahora | `pg_tables` |
| Origen real | Servicio de Windows, **no Docker** | `docker` no está instalado en la máquina |

**Hallazgo:** `docker-compose.yml` describe un Postgres en contenedor que **no es el que se usa**.
El README instruye `docker compose up -d postgres`, que en esta máquina fallaría. La base efectiva
es la instancia local de PostgreSQL 17.

Otras bases en el mismo servidor, ajenas a esta auditoría: `SaaSRRHH`, `erppoli_ddl_gen`,
`erppoli_it_audit`, `restaurant_db`, `schema`, `winsan_db`.

Contenido de `ERPpoli`: 2 usuarios (`admin@policalum.com` con nombre "Nancy", rol ADMIN;
`empleado@policalum.com`, rol MULTIFUNCIONAL), 2 sedes activas, y las tablas de RRHH **vacías**.

---

## 2. Inventario del backend

| Capa | Cantidad |
|---|---|
| Entidades JPA (`domain/model`) | 66 |
| Enums (`domain/enums`) | 48 |
| Repositorios (+38 proyecciones) | 65 |
| Interfaces de servicio | 50 |
| Implementaciones de servicio | 70 |
| Controladores | 50 |
| DTO de solicitud / respuesta | 116 / 188 |
| Mappers MapStruct | 47 |
| Clases de seguridad | 9 |
| Clases de test | 86 |
| **Endpoints expuestos** | **305 rutas** |

Frontend: 71 componentes, 23 servicios. Sitio público: 16 componentes.

### Roles (§2.2: "no asumir que solo hay ADMIN y MULTIFUNCIONAL")

Se comprobó en los tres niveles, y coinciden:

- `RolNombre.java`: `ROLE_ADMIN`, `ROLE_MULTIFUNCIONAL` — **no hay más roles en el código**.
- Tabla `roles` en BD: exactamente esas dos filas, con `permisos_json`.
- No existe un tercer rol creado por migración ni usado en algún controller.

Conclusión: el sistema tiene **dos roles**, no más. La instrucción de preservar "los demás roles"
no aplica porque no existen.

---

## 3. Coherencia endpoints ↔ Angular (§2.1)

Se normalizaron las 214 rutas del catálogo generado de Angular (`api-endpoints.generated.ts`) contra
las 305 rutas derivadas de los `@RequestMapping`/`@*Mapping` de los controllers.

**Resultado: 0 endpoints fantasma.** Ninguna ruta que Angular invoca está ausente en el backend.

91 rutas del backend no aparecen en el catálogo *generado*. Eso **no** significa que sean código
muerto: varias las consumen servicios escritos a mano (`asistencia.service.ts`, `mi-dia.api.ts`,
`mi-regimen.api.ts`, `qr-publico`). La lectura correcta es que **el catálogo generado está
desactualizado respecto del backend**.

---

## 4. Divergencia entidades ↔ esquema (bloqueante para `ddl-auto=validate`)

§1 exige `validate`. Se midió comparando las columnas derivadas de las 66 entidades contra
`information_schema.columns`.

### 4.1 Estructura ausente en la base (2 casos)

| Elemento | Causa | Estado |
|---|---|---|
| Tabla `rrhh_regimen_remuneracion` | Entidad nueva de este trabajo, creada antes solo por `ddl-auto=update` | **Corregido** con `backend/sql/20261106_rrhh_regimen_remuneracion.sql` |
| Columna `servicio_colaboradores.tipo_colaborador` | **Desfase preexistente**: la entidad la declara `NOT NULL` y la base no la tenía | **Corregido** con `backend/sql/20261106_servicio_colaborador_tipo.sql` |

El segundo caso es el que realmente impedía arrancar con `validate`: Hibernate abortaba con
`missing column [tipo_colaborador] in table [servicio_colaboradores]`. Existía desde antes de
estos cambios y solo se tapaba porque el perfil `dev` usaba `update`.

### 4.2 Tablas en la base sin entidad (falsos positivos y un caso real)

| Tabla | Veredicto |
|---|---|
| `finanzas_cuenta_metodos` | **No es huérfana.** Es la `@CollectionTable` de `CuentaFinanciera.metodosPago`. Correcta. |
| `rrhh_asistencias` (plural) | **Tabla muerta real.** No tiene entidad, no es colección de nadie, 0 filas. La activa es `rrhh_asistencia` (singular). **No se eliminó**: borrar estructura durante una auditoría impide atribuir una regresión. Queda como pendiente decidido. |

### 4.3 Falsos positivos del método de comparación

5 columnas (`clientes.ventas_id`, `compras.detalles_id`, `compras.adjuntos_id`,
`productos.fracciones_id`, `servicios.colaboradores_id`) se reportaron como ausentes. Son el
lado inverso de relaciones `@OneToMany`, que **no** generan columna. Descartadas una por una
leyendo la anotación.

### 4.4 Verificación final

Con los dos scripts aplicados, la aplicación **arranca con `ddl-auto=validate`**:

```
Tomcat started on port 8099 (http)
Started ErpApplication in 23.613 seconds
```

Se repitió arrancando con la configuración del repositorio, sin variables de entorno de
sobrescritura: `Started ErpApplication in 22.x s`. Sin errores de validación de esquema.

---

## 5. Cambios estructurales aplicados a `ERPpoli`

Solo dos, ambos aditivos, ambos probados antes dentro de una transacción con `ROLLBACK`:

1. `rrhh_regimen_remuneracion` — tabla nueva, 10 columnas, PK, FK a `users`, UNIQUE
   (`user_id`), CHECK sobre `base_reparto`. **0 filas.**
2. `servicio_colaboradores.tipo_colaborador` — `varchar(20) NOT NULL`, rellenado con la **misma
   regla de negocio** que `ServicioColaborador.prePersist()` (`user_id IS NOT NULL → REGISTRADO`,
   si no `EXTERNO`), no con un valor por defecto arbitrario. La única fila existente quedó en
   `REGISTRADO` / `NO_APLICA`, coherente con la entidad.

No se modificó ni eliminó ninguna otra estructura ni dato.

---

## 6. Permisos: lo que la documentación decía mal

`backend/docs/API-ROLES.md` se generó el 2026-10-09 y estaba **obsoleto en 2 secciones**.

| Afirmación del documento | Realidad verificada en código |
|---|---|
| 🔴 `POST/PUT/DELETE /roles`, `/sedes`, `/users` sin `@PreAuthorize` → "MULTIFUNCIONAL puede escalar privilegios" | **FALSO.** Los tres controllers llevan `@PreAuthorize("hasRole('ADMIN')")` a nivel de clase y por método |
| ⚠️ `POST /rrhh/asistencias/manual` "sin @PreAuthorize, cualquier autenticado" | **FALSO.** Tiene `hasRole('ADMIN')` |
| Público: `GET /rrhh/asistencias/empleados` | **FALSO.** `SecurityConfig` lo limita a `hasRole("ADMIN")` |
| Público: `POST /rrhh/asistencias/marcar-qr-real` | **FALSO.** Requiere sesión; solo `qr-publico` es anónimo |

Esto es importante: **el agujero de seguridad que reporté en la conversación anterior no existe.**
Me equivoqué al citar la tabla sin abrir los controllers. El documento, no el código, era el defecto.

Se corrigieron en `API-ROLES.md`: las filas de Asistencia y Administración, el resumen de conteos,
y se documentaron los 7 endpoints nuevos.

---

## 7. Reglas de QR y asistencia (§2.3) — implementación y prueba

### Matriz exigida vs. comportamiento medido

Se creó un usuario MULTIFUNCIONAL de prueba y se ejecutó la matriz contra HTTP real.

| Acción | ADMIN | MULTIFUNCIONAL | Exigido | Cumple |
|---|---|---|---|---|
| Ver su propio QR (`GET /mi-qr`) | 200 | 200 | Sí / Sí | ✅ |
| Escanear QR de empleados (`POST /escanear-qr`) | 201 | **403** | Sí / No | ✅ |
| Registrar entrada por QR (`POST /marcar-qr-real`) | 400/201 | **403** | Sí / No | ✅ |
| Registro manual (`POST /manual`) | 201 | **403** | Sí / No | ✅ |
| Lista de asistentes (`GET /roster`) | 200 | **403** | Sí / No | ✅ |
| Marcación en lote (`POST /marcar-lote`) | 201 | **403** | Sí / No | ✅ |
| Su legajo (`GET /legajos/me`) | 200 | 200 | Sí / Sí | ✅ |
| Legajos de otros (`GET /legajos`) | 200 | **403** | Sí / No | ✅ |
| Su régimen (`GET /mi-regimen`) | 200 | **403** | Sí / No | ✅ |
| Ganancia de la empresa (`/mi-regimen/resumen`) | 200 | **403** | Sí / No | ✅ |
| Utilidad neta (`/finanzas/utilidad-neta`) | 200 | **403** | No ver | ✅ |

### Flujo QR de extremo a extremo (§2.3 pasos 1-7)

```
QR del empleado : POLICALUM|EMPLEADO|28cdc6eb-…|29900349|633175
escaneo 1       : HTTP 201  tipo=ENTRADA  dispositivo="QR escaneado por Admin"
escaneo 2 (replay del mismo QR) : HTTP 409  "Ese QR ya se usó…"
QR nuevo, mismo empleado, mismo día : HTTP 409  "El empleado ya marcó ENTRADA hoy"
```

- El QR **no contiene información salarial ni privada**: solo `userId`, ventana TOTP y código de
  6 dígitos. Firmado con el secreto TOTP personal, que se provisiona en la primera llamada.
- Ventana de validez de 60 s con tolerancia a la anterior.

### Defecto encontrado en mi propia implementación y corregido

La primera prueba de reutilización reveló que **reenviar el mismo QR generaba una SALIDA 0,1 s
después de la ENTRADA**. La tolerancia de TOTP acepta la ventana anterior, y no había control de
replay. Eso viola §2.3 paso 7.

Se agregó `infrastructure/security/MarcacionQrUnica.java`: caché Caffeine atómica por
(empleado, ventana) con TTL de 5 minutos, siguiendo el patrón ya existente de `TokenDenylist`.
El rechazo por regla de negocio libera el QR para no castigar un reintento legítimo.
**Verificado:** el segundo escaneo ahora devuelve 409.

Alcance honesto: es por proceso. Si el ERP llegara a correr en varias instancias, debe migrar a
base o almacén común. Está documentado en la clase.

### Registro manual y en lote (§2.3 último párrafo)

```
lote sobre 2 pendientes      : 2 registrados
lote repetido                : 0 registrados, 2 omitidos (no falla)
lote con fecha futura        : HTTP 400 "No se puede marcar en una fecha futura: 2026-11-09"
lote con empleado inexistente: rechazado, listado en el detalle, sin abortar el resto
```

Manual y lote usan **el mismo** `validarMarcacion()` y `crearAsistencia()`, así que no pueden
generar criterios divergentes de duplicado o tardanza.

---

## 8. Separación económica (§2.4 y §8)

### Error contable que encontré en mi propio cálculo y corregí

La primera versión calculaba `saldo de la empresa = utilidad − ganancia personal total`. Es
**incorrecto**: la utilidad neta de `UtilidadNetaServiceImpl` ya descuenta las nóminas pagadas,
y la nómina del administrador está dentro de ese gasto. Restar también sueldo y comisión los
contabilizaba dos veces, exactamente lo que §2.4 prohíbe.

Corregido a `utilidad − solo el reparto`, con el razonamiento escrito en el DTO y en el servicio.
Además se emiten advertencias cuando la nómina del admin aún no está generada o no está pagada,
porque en ese caso el sueldo todavía no redujo la utilidad.

### Prueba con datos reales

```
EMPRESA   utilidad neta 59.33 · ventas 59.33 · compras 0 · nóminas 0 · margen 100%
PERSONAL  sueldo 3500.00 + comisión 0.00 + reparto 11.87 (20% de 59.33, tope 5000) = 3511.87
CRUCE     saldo empresa tras reparto = 47.46  (= 59.33 − 11.87, correcto)
```

Validaciones del régimen, todas medidas con HTTP 400 y su mensaje:

- los tres componentes apagados → *"Active al menos un componente"*
- reparto activo con 0 % → *"Active un porcentaje mayor a 0, o desactive el reparto"*
- 150 % → rechazo por `@DecimalMax`

### Modalidades (§2.4)

| Modalidad | Dónde vive la cifra | Quién la fija |
|---|---|---|
| Sueldo fijo | `rrhh_legajo_digital.sueldo_base` | ADMIN en RRHH → Legajos |
| Comisión sobre ventas propias | `rrhh_legajo_digital.porcentaje_comision` | ADMIN en RRHH → Legajos |
| % de utilidad de la empresa | `rrhh_regimen_remuneracion` (base, %, tope) | solo el propio ADMIN |

La base del porcentaje se especifica expresamente, como exige §2.4: `UTILIDAD_NETA`,
`VENTAS_NETAS` o `MARGEN_BRUTO`. No se confunde facturación con ganancia: son tres opciones
distintas y el usuario debe elegir una.

### §8 punto 1: división mensual — PENDIENTE, no resuelto

`NominaServiceImpl.DIAS_MES = 30` está hardcodeado, y mi servicio del régimen reusa esa misma
constante a propósito para no crear una segunda definición. §8 pide una **política configurable**
de días del mes, días laborables y tratamiento de ausencias. **No está implementado.** Queda en el
plan de corrección como trabajo real, no como detalle menor.

---

## 9. Estado de las pruebas (§5 y §10) — RESUELTO

### Corrección a un dato que reporté mal

Escribí "72 pruebas fallando". Son **36** (21 fallos + 15 errores). Mi script contaba cada método
dos veces, con nombre completo y con nombre simple. Corregido también en la memoria del proyecto.

### Estado actual

| | Total | Fallas |
|---|---|---|
| Backend, antes | 905 | **36** (21 fallos + 15 errores) |
| Backend, ahora | **907** | **0** |
| Frontend | 15 | 0 |

```
[INFO] Tests run: 907, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

Cero líneas `[ERROR]` en el log completo. Los +2 tests son casos nuevos que añadí al reescribir
Finanzas y Usuarios (véase abajo): en lugar de tirar el assertion, agregué el caso que sí importa.

### No se ocultó ninguna falla

Ningún test se desactivó, se saltó ni se le relajó la aserción. Lo que se hizo, grupo por grupo:

**1. Bug real de producción — `POST /api/v1/stock` devolvía 500 siempre.**
`StockServiceImpl.saveOrUpdate()` lanzaba `UnsupportedOperationException("No implementado en este
snippet")`. Estaba expuesto en `StockController:71`. Implementado según el contrato que los tests
ya especificaban: mueve solo la diferencia por kardex (ENTRADA/SALIDA, referencia AJUSTE),
conserva el mínimo si no viene, sin movimiento si la cantidad no cambia. Además se añadió el
control de sede que faltaba: un MULTIFUNCIONAL recibe 403 al leer stock de otra sede, comprobado
**antes** de consultar la tabla. → 9/9.

**2. Bug real de producción — banderas NULL en los 18 productos.**
`Producto` declaraba los defaults en el campo, pero `@Builder` y MapStruct los ignoran y el
`@PrePersist` (que ya cubría otros 10 campos) omitía estos tres. `EntidadesBuilderDefaultsTest`
tenía razón: es un guard válido, no un test molesto. Corregida la entidad y aplicada la migración
`backend/sql/20261106_producto_banderas_nulas.sql`. Verificado: 0 NULL.

**3. Fixture mal apuntado — `UserImplTest` (11).**
Stubbeaban `findById`/`findAll` mientras la producción llama a `findByIdWithRelations`/
`findAllWithRelations`. Alineados los stubs.

**4. Fixture incompleto — `RolePermissionGuardTest` (4).**
El `Authentication` simulado no stubbeaba `isAuthenticated()`; Mockito devuelve `false` por defecto
y el guard rechazaba **todo**, incluso ADMIN. No era un problema de permisos.
Además el test se contradecía a sí mismo: `administradorSinGrupoDePermisos…` pedía `assertFalse`
para un permiso de ADMIN, mientras `administradorSiempreTieneAccesoCompleto` pedía lo contrario.
Resuelto según la decisión de política (punto 6).

**5. Bean y config de test — `ProductoPermissionControllerTest` y `ErpApplicationTests`.**
Faltaba `@MockitoBean StockService` (parámetro 3 del constructor). `contextLoads` heredaba la
barrera deliberada de `src/test/resources/application.properties` (URL a `ERPpoli_it_unconfigured`
con contraseña vacía), pensada para tests que **recrean** esquema; este test no recrea nada. Ahora
usa la base continua con `ddl-auto=validate` y `app.seed.enabled=false`. **Comprobado tras
ejecutarlo: 68 tablas, 18 productos, 2 usuarios, 21 auditoría — sin cambios.** Efecto lateral
deseado: ahora detecta solo la deriva de esquema.

**6. Decisión de política — los 13 tests de permisos.**
Evidencia: los que usaban MULTIFUNCIONAL pasaban todos; los que ponían ADMIN con un permiso en
`false` fallaban todos. El mecanismo funciona; lo disputado era si un `false` recorta al ADMIN.

Decisión tomada por la propietaria: **ADMIN irrestricto**, coherente con `RolePermissionGuard`
paso 4, con `DataLoader` ("dios: todo true") y con §2.2 de la especificación.

Aplicado sin destruir ninguna aserción:
- 11 tests migrados a MULTIFUNCIONAL, donde el mapa **sí** gobierna. Siguen probando lo que
  decían probar ("tener `leer` no concede `recibir`").
- `Finanzas` y `Users` son módulos cerrados por rol a nivel de clase, así que allí un
  MULTIFUNCIONAL no puede ni leer. Se reescribieron en dos casos cada uno: uno que documenta que
  el `false` no recorta al ADMIN, y otro nuevo que prueba la frontera real (el no-admin no entra).
  Por eso la suite pasó de 905 a 907.
- La UI de Roles ya **no** permite editar los permisos de `ROLE_ADMIN`: muestra por qué, con un
  badge "Acceso completo" en la tarjeta y las casillas deshabilitadas con la explicación dentro
  del modal. Antes ofrecía un control que no hacía nada.

### Verificación final

- Backend: 907/907 en verde.
- Frontend: build OK, 15/15 en verde.
- `ERPpoli` intacta salvo las tres migraciones autorizadas.
- La instancia del usuario en el puerto 8080 nunca se detuvo.

---

## 10. Funcionalidad verificada como terminada

No "visualmente": con HTTP contra la app y filas consultadas en PostgreSQL.

- ✅ `diaCobro` y `porcentajeComision` se ven y se guardan desde RRHH → Legajos (antes el admin no
  podía fijar el día de paga desde ahí, aunque el backend y el dashboard del empleado lo usaban).
- ✅ Escáner QR con cámara real cableado con `html5-qrcode` (antes el paquete estaba instalado y
  cargado por CDN pero **no se importaba en ningún archivo**).
- ✅ `Permissions-Policy: camera=()` → `camera=(self)`. Sin ese cambio el navegador denegaba la
  cámara aunque el lector existiera.
- ✅ QR personal dinámico + escaneo por el administrador + control de reutilización.
- ✅ Roster "quiénes asistieron hoy" + marcación en lote.
- ✅ Régimen del administrador con tres componentes configurables.
- ✅ Separación ganancia de empresa / ganancia personal, sin doble contabilización.
- ✅ El MULTIFUNCIONAL no ve datos salariales ajenos ni puede registrar asistencia.
- ✅ Arranque con `ddl-auto=validate`.

---

## 11. Datos de prueba creados y revertidos (§6)

Se crearon 2 usuarios `@policalum.test`, sus marcaciones, un legajo y un régimen de prueba.
Antes de limpiar se verificó que las tablas de RRHH estaban **vacías**, así que revertir a vacío
restaura el estado previo exacto.

Limpieza en una sola transacción. Estado final comprobado:

| Tabla | Filas | Esperado |
|---|---|---|
| `rrhh_asistencia` | 0 | 0 |
| `rrhh_legajo_digital` | 0 | 0 |
| `rrhh_regimen_remuneracion` | 0 | 0 |
| `users` | 2 | 2 |
| `audit_log` | 21 | 21 |

Recomprobado vía API: el roster devuelve solo a los 2 empleados reales y `/mi-regimen` reporta
`id` vacío y `tieneLegajo: false`, es decir, comportamiento por defecto sin datos residuales.

La instancia del usuario en el puerto 8080 **no se detuvo ni se tocó** en ningún momento. Las
pruebas se hicieron en el 8099, y solo se mató el proceso propio verificado por línea de comando.

---

## 12. Pendientes reales, sin maquillar

### Bloqueantes para cerrar la Fase 2

1. ~~**Historial de cambios salariales (§2.4)**~~ **RESUELTO el 2026-11-07** — ver §15. Queda
   documentado el defecto original: las instantáneas antes/después de `audit_log` seguían sin
   ser un historial laboral.
2. **Política de días del mes configurable (§8.1)** — sigue hardcodeado en 30.
3. **El administrador no tiene legajo propio todavía (§2.4)** — el mecanismo funciona (se probó
   creándolo), pero en la base real no hay ninguno. Es un dato que debe entrar el usuario con sus
   cifras reales, no yo con valores inventados.

### Fase 3 (frontend), sin empezar en lo sustancial

4. El catálogo generado de API (`api-endpoints.generated.ts`, `openapi.types.ts`, `rrhh.api.ts`) no
   incluye los 9 endpoints nuevos de RRHH (los 7 de la Fase 1 + los 2 del historial salarial de
   §15); se consumen desde servicios escritos a mano. Hay que regenerar contra `/v3/api-docs`.
   Excepción: `openapi.types.ts` sí fue editado a mano para `fechaVigenciaCambio` y `motivoCambio`,
   porque el formulario de legajos consume ese tipo; al regenerar debe dar el mismo resultado.
5. **Rediseño visual con la paleta de §3.5** (`#1A1C2B`, `#232538`, `#1fa2d6`): el proyecto usa
   otras variables (`--color-cream: #f3f6fb`, `--color-ink: #122033`). No se tocó. Es un cambio de
   tema completo, no un ajuste.
6. **Formulario de productos por secciones (§3.3)** y matriz de filtros (§3.4): sin revisar.
7. **Costos de servicios con ayudantes externos (§2.5, §8.3)**: existe `ServicioColaborador` con
   `tipo_colaborador` y `costo`, pero no se auditaró si la rentabilidad duplica la nómina.
8. **Inventario multi-sede/multi-almacén (§2.5)**: no se verificó que "la existencia de un producto
   en una sede no dependa de tener stock positivo".
9. **Notificaciones (§3.6)** y **sitio público (Fase 4)**: sin auditar en esta pasada.

### Correcciones de documentación

10. `README.md` dice `docker compose up -d postgres`, pero en esta máquina el Postgres es un
    servicio de Windows y Docker no está instalado.
11. `API-ROLES.md` sigue generado parcialmente desde el 2026-10-09: corregí Asistencia,
    Administración y los endpoints nuevos; las otras secciones no se revalidaron.

### Resuelto desde la primera versión de este informe

- ~~Historial de cambios salariales~~ **RESUELTO el 2026-11-07** con tabla, endpoints y pantalla
  propios (§15).
- ✅ Las 36 pruebas fallidas del backend: ahora 0 (§9).
- ✅ `POST /api/v1/stock` devolvía 500 siempre: implementado (§9.1).
- ✅ Banderas NULL en los 18 productos: entidad corregida y datos migrados (§9.2).
- ✅ Contradicción de política de permisos del ADMIN: resuelta a favor de "ADMIN irrestricto" y
  la UI dejó de ofrecer un control inoperante (§9.6).

---

## 14. Corrección de política de permisos (decisión del 2026-11-06)

Queda explícito porque afecta cómo se lee cualquier auditoría futura de este sistema:

> Un `false` en el mapa `permisos_json` del rol `ROLE_ADMIN` **no recorta** al administrador.

No es un descuido: `RolePermissionGuard.permite()` evalúa el rol antes que el mapa (paso 4),
`DataLoader` siembra a ADMIN con todo `true`, y §2.2 de la especificación define "Acceso
administrativo global". La UI de Roles ahora lo dice en lugar de permitir editar casillas que no
producen efecto.

**Consecuencia de seguridad a conocer:** si se necesita que un administrador *no* pueda ver datos
salariales ajenos, eso **no** se logra desmarcando `ver_legajos` en Roles. Hoy no existe ese
mecanismo. Si se requiere, hay que pedirlo como trabajo expreso: implicaría cambiar el guard,
revisar los `exigirAdmin()` de los servicios (que solo miran el rol) y evaluar el riesgo de
auto-bloqueo.

---

## 13. Plan de corrección propuesto, en orden

| # | Trabajo | Fase | Criterio de cierre |
|---|---|---|---|
| 1 | ~~Entidad + migración + endpoint + UI de historial salarial~~ **HECHO 2026-11-07** (§15) | 2 | Criterio cumplido: sueldo cambiado 3 veces + 1 guardado sin cambio remunerativo, historial consultado con fechas y montos verificados |
| 2 | Política de días laborables configurable en `ConfiguracionEmpresa` | 2 | Nómina de un mes con ingreso a mitad de periodo, contra valor esperado calculado a mano |
| 3 | Regenerar catálogo de API desde `/v3/api-docs` | 3 | Los 7 endpoints nuevos aparecen en `rrhh.api.ts` y dejan de usarse servicios a mano |
| 4 | Auditoría de costos de servicios vs nómina | 2 | Un servicio con 1 registrado y 1 externo: la nómina no aparece dos veces en la rentabilidad |
| 5 | Verificar existencia de producto por sede con stock 0 | 2/3 | Producto en sede con 0 unidades sigue visible al filtrar por esa sede |
| 6 | ~~Arreglar `Producto` (`@Builder.Default`) y los fixtures de test~~ **HECHO** | 2 | Suite en verde: 907/907, 0 fallas |
| 7 | Tema visual de §3.5 y responsividad | 3 | Comparar en 375 px y 1536 px sin desbordes |
| 8 | Sitio público contra el ERP | 4 | Un producto no publicado no aparece; ningún costo sale del payload |

Sugerencia de secuencia: 1-2-6 son backend puro y medibles hoy; 3 desbloquea dejar de escribir
servicios a mano; 4-5 son la lógica económica que §8 exige correcta antes de mostrar reportes;
7-8 son presentation y pueden ir al final.

---

## 15. Historial salarial (§2.4) — trabajo del 2026-11-07

Cierra el pendiente §12.1 y la fila 1 del plan §13.

### Qué se construyó

| Capa | Artefacto |
|---|---|
| Esquema | `backend/sql/20261107_rrhh_historial_salarial.sql` — tabla `rrhh_historial_salarial` (14 columnas), PK, 2 FK, índice `(legajo_id, vigencia_desde)` y backfill del sueldo inicial |
| Dominio | `RrhhHistorialSalarial` |
| Repositorio | `RrhhHistorialSalarialRepository` (`findTimelineByLegajo`, `findFirstBy…VigenciaDesdeDescCreatedAtDesc`) |
| Aplicación | `HistorialSalarialService` / `HistorialSalarialServiceImpl`, `HistorialSalarialResponseDTO` |
| Contratos | `LegajoRequestDTO` gana `fechaVigenciaCambio` y `motivoCambio` (opcionales) |
| HTTP | `GET /rrhh/legajos/{empleadoId}/historial-salarial` · `GET /rrhh/legajos/me/historial-salarial` |
| UI | Modal "Historial" en RRHH → Legajos; bloque "Cómo evolucionó lo que cobra" en Mi régimen; servicio a mano `historial-salarial.api.ts` |
| Pruebas | 18 unitarias del servicio + 2 de delegación en `LegajoServiceImplTest` + 3 de permisos |

### Decisiones de diseño, y por qué

1. **Append-only.** No hay PUT ni DELETE del historial. Un registro salarial que se puede
   reescribir deja de servir como prueba; si algo quedó mal, se corrige con una fila nueva.
2. **Solo los cuatro campos remunerativos del legajo**: `sueldo_base`, `porcentaje_comision`,
   `dia_cobro`, `tipo_contrato`. El **% de reparto del régimen no entra**: es ganancia de socio,
   vive en otra tabla y clavar el historial al usuario en vez de al legajo habría mezclado dos
   orígenes. Decisión tomada con la usuario antes de escribir código.
3. **No escribe si no cambió nada remunerativo.** Un guardado que solo mueve la tasa de pensión
   no genera fila: para eso está `audit_log`. Evita un historial lleno de ruido.
4. **`vigencia_desde` no es la fecha de guardado.** Es desde cuándo rige el dinero, y puede
   retrodatarse (un aumento decidido en junio que rige desde el 1). Se valida contra tres
   fronteras: hoy, la fecha de ingreso y la última vigencia registrada. El historial no retrocede.
5. **Los periodos se derivan, no se almacenan.** La fila *i* rige hasta la vigencia de la *i+1*;
   la última queda abierta (`vigenteHasta = null`). Se descartó el modelo SCD-2 con
   `vigencia_hasta` persistido porque exige cerrar la fila anterior en cada escritura y abre la
   puerta a dos filas "abiertas" simultáneas.
6. **Se guardan el valor anterior y el nuevo.** Redundancia deliberada: un historial que solo
   guarda el monto nuevo obliga a cruzar filas vecinas para decir "de cuánto a cuánto".
7. **`registrado_por` es nullable.** Las filas sembradas por la migración no tienen autor:
   atribuirlas a un usuario que nunca las ingresó sería inventar responsabilidad.
8. **El `INSERT` del historial no se audita aparte.** El legajo ya quedó auditado con su
   instantánea antes/después; duplicar el evento crearía dos versiones de la misma verdad.

### Evidencia

- **Suite completa: 930 pruebas, 0 fallos, 0 errores, `BUILD SUCCESS`.** Antes de la migración,
  la misma suite daba 930 con **1 error**: `ErpApplicationTests.contextLoads` rechazó el contexto
  con `missing table [rrhh_historial_salarial]`. Es decir, el guard de deriva de esquema hizo
  exactamente su trabajo.
- **Criterio de cierre (§13 fila 1), ejecutado por HTTP contra una instancia propia en 8099:**

  ```
  ALTA legajo 16bc4b09… sueldo 1500
    PUT sueldo=1800 vigencia=2025-01-15  motivo "Aumento por desempeno"
    PUT sueldo=2100 vigencia=2026-06-01  motivo "Ajuste de planilla"
    PUT AFP solo pensión       -> NO creó fila (no es campo remunerativo)  ✔
    PUT comision 3->5          -> creó fila con delta 0.00                 ✔
    PUT sueldo=1950 sin fecha  -> vigencia = hoy                           ✔

  2026-11-07 hasta VIGENTE     | 2100.00 -> 1950.00  delta -150.00
  2026-11-07 hasta 2026-11-07  | 2100.00 -> 2100.00  delta 0.00   com 5.00%
  2026-06-01 hasta 2026-11-07  | 1800.00 -> 2100.00  delta 300.00
  2025-01-15 hasta 2026-06-01  | 1500.00 -> 1800.00  delta 300.00
  2024-03-01 hasta 2025-01-15  | (null)  -> 1500.00  delta null   "Sueldo inicial…"
  ```

  Fechas, montos, signos y periodos coinciden con lo esperado. La primera fila no inventa un
  "+1500.00": `sueldoAnterior` y `sueldoDelta` son `null`.
- `/me/historial-salarial` como admin sin legajo devolvió **404**, coherente con el aviso que ya
  muestra Mi régimen.
- **Frontend:** `npx ng test` → 15/15. `ng build --configuration development` → sin errores,
  incluye las plantillas nuevas.
- **Datos revertidos** en una transacción (misma convención de §11): `rrhh_legajo_digital` 0,
  `rrhh_historial_salarial` 0, `rrhh_legajo_documentos` 0. `audit_log` quedó en 27 y **no se
  tocó**: los registros de auditoría de la prueba son parte del rastro forense, no datos de
  prueba a borrar. La instancia del usuario en 8080 nunca se detuvo; se mató solo el proceso
  propio verificado como dueño del puerto 8099.

### Defecto preexistente encontrado de paso

Diez archivos de `src/test/.../infrastructure/controller/*PermissionControllerTest.java` tenían
**BOM UTF-8** en el árbol de trabajo (`HEAD` está limpio; lo introdujeron ediciones anteriores
hechas con PowerShell). Con el BOM, `javac` aborta con *illegal character* y **la suite entera no
compilaba**. Se eliminó el BOM byte a byte, sin tocar una sola línea de código. Nada de esto
tenía que ver con el historial salarial: sin ese arreglo era imposible verificar nada.

### Límites que quedan, sin maquillar

1. **No se verificó en vivo el caso MULTIFUNCIONAL** leyendo su propio historial: no conozco la
   contraseña de `empleado@policalum.com` y no la resetei. Está cubierto por
   `LegajoPermissionControllerTest` (403 en la ruta de otro empleado sin `ver_legajos`, 200 en
   `/me`) y por la prueba unitaria de `listarMio`, pero no por una llamada real autenticada.
2. **Cambiar `fechaIngreso` no reescribe la fila inicial** del historial. Es coherente con
   "append-only", pero si alguien corrige una fecha de ingreso equivocada, la primera vigencia
   seguirá mostrando la antigua. Si eso resulta molesto en la práctica, se resuelve con un
   ajuste explícito, no reescribiendo silenciosamente.
3. **Dos cambios el mismo día** producen un periodo "hasta la misma fecha". Es truthful pero se
   ve raro en la UI; el orden lo desempata `created_at`.
4. El catálogo generado de API sigue sin estos endpoints (§12.4, ahora 9).
5. **El build de producción del frontend sigue fallando**, por presupuestos `anyComponentStyle`
   superados en 5 archivos ajenos a este cambio (`pos.component.css` 22.81 kB,
   `productos-page` 22.47 kB, `mensajes-web-page` 17.03 kB, `ventas-page` 14.98 kB,
   `portafolio-web-page` 14.03 kB). Preexistente; se documenta en vez de parchear el budget.
