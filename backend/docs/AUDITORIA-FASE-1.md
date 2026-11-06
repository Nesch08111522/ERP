# Auditoría técnica — Fase 1: Backend

Fecha de revisión: 2026-11-05/06

## Alcance revisado

Se inspeccionaron la estructura de paquetes, configuración Spring, POM, seguridad JWT/CORS, manejo global de excepciones, almacenamiento de archivos, controladores REST, documentación de roles y artefactos de pruebas existentes.

La arquitectura está separada en `application` (DTO, mappers y servicios), `domain` (modelos y enums), `infrastructure` (controladores, repositorios, seguridad, configuración y exportación) y `exception`. Se identificaron 85 reportes Surefire existentes, con 904 casos acumulados y cero fallos/errores en la última ejecución registrada.

## Hallazgos corregidos

### F1 — Defaults inseguros en configuración compartida

`application.properties` podía arrancar sin perfil con `ddl-auto=update` y secretos JWT/TOTP de desarrollo. Esto permitía una configuración accidentalmente insegura fuera de `dev`.

Corrección aplicada:

- El default de `spring.jpa.hibernate.ddl-auto` cambió a `validate`.
- `jwt.secret` y `totp.secret-key-publico` ya no tienen secretos fallback en la configuración compartida; deben llegar por variables de entorno.
- Se añadió `src/test/resources/application.properties` con secretos sintéticos exclusivos de la suite y `ddl-auto=none`.
- El perfil `application-dev.properties` conserva explícitamente sus valores de desarrollo.

### F2 — Evidencia de prueba no repetible en esta sesión

El Maven Wrapper requiere descargar Maven 3.9.16 desde Maven Central. El entorno local no tiene Maven global ni acceso de red disponible, por lo que `mvnw.cmd -B test` no pudo iniciar. Los 904 casos sin fallos corresponden a reportes existentes y se consideran evidencia histórica, no una ejecución nueva.

## Hallazgos críticos pendientes

### F3 — Cobertura de autorización insuficiente

La documentación `API-ROLES.md` declara 273 endpoints: 130 no tienen `@PreAuthorize` y quedan protegidos únicamente por `authenticated()`. Para operaciones sensibles esto es una deuda de seguridad: ventas, caja, compras, clientes, proveedores, cuentas por pagar y otros módulos dependen de validaciones internas o no tienen una restricción declarativa uniforme.

La corrección debe hacerse por módulo, con una matriz explícita de roles y pruebas 401/403 por endpoint. No se aplicó un parche masivo automático porque podría cambiar procesos existentes sin validar cada regla de negocio.

### F4 — Pruebas de base de datos y rendimiento bloqueadas

No se pudo ejecutar la integración PostgreSQL ni pruebas de carga porque `docker`, `psql` y un servidor PostgreSQL verificable no están disponibles en el PATH de este equipo. Debe ejecutarse `FlujoComercialIT` contra una base aislada y una prueba de carga con datos representativos antes de declarar el backend listo para producción.

## Observaciones de diseño

- El filtro JWT valida expiración, denylist, versión de sesión y estado del usuario antes de crear la autenticación.
- CORS usa una lista explícita de orígenes y credenciales habilitadas; debe mantenerse sin comodines en producción.
- El almacenamiento de archivos normaliza rutas, bloquea traversal y limita extensión/tamaño, pero la validación por extensión no sustituye una inspección de contenido/magic bytes en un entorno de alto riesgo.
- El manejador global evita exponer detalles en producción y devuelve errores estructurados; debe mantenerse una matriz de respuestas 400/401/403/404/409/500 en pruebas de controladores.
- OpenAPI/Swagger se deshabilita en el perfil `prod`, conforme a la configuración existente.

## Próximos pasos obligatorios de la Fase 1

1. Restaurar disponibilidad de Maven y PostgreSQL aislado.
2. Ejecutar nuevamente toda la suite y registrar logs de fallos reales.
3. Generar una matriz endpoint–rol desde el código y `API-ROLES.md`.
4. Añadir restricciones declarativas por módulo, empezando por operaciones destructivas y financieras.
5. Añadir pruebas de 401/403 y pruebas transaccionales para anulación, devoluciones, reembolsos, caja y archivos.
6. Ejecutar una prueba de carga con paginación, filtros por sede y consultas consolidadas.
7. Solo después de cerrar esta fase avanzar a la auditoría integral del frontend.


## Evidencia adicional de esta iteración

### Entorno

- Maven 3.9.16 se descargó correctamente dentro de `.work/tools` usando Java: HTTP 200, 9,395,475 bytes, SHA-256 `5AF3B743DD8B876B5C45DA33B676251E5F1687712644ABB4EE519CA56E1D89CE`.
- El wrapper original falla en PowerShell durante `DownloadFile` con una interrupción de recepción TLS. El proyecto puede compilarse con el Maven 3.9.16 local restaurado.
- PostgreSQL 17 está instalado como servicio `postgresql-x64-17` y escucha en `localhost:5432`, pero el cliente `psql` recibe `WSAEACCES 10013` antes de autenticarse. No se consultó ni modificó ninguna base.
- Docker Desktop no está instalado ni disponible en PATH. No se pudo levantar Testcontainers/Docker.

### Pruebas reproducidas

- `mvn -B -DskipTests compile`: **PASS**, 925 clases principales generadas.
- `mvn -B test-compile`: **PASS**.
- `mvn -B test`: ejecutó 901 pruebas, con 0 fallos y 22 errores de contexto. Los unitarios reportados individualmente pasaron; los errores se concentran en `@SpringBootTest` y controladores que cargan contexto.
- Causa raíz del primer error de contexto: `ConfigDataMissingEnvironmentPostProcessor$ImportException: No spring.config.import set`.
- Se añadió `spring.config.import=optional:configserver:` únicamente a `src/test/resources/application.properties`.
- Una prueba unitaria mínima (`AtencionHorarioTest`) se ejecutó nuevamente: **1/1 PASS**, sin fallos ni errores.
- La suite completa posterior a ese cambio quedó pendiente porque el revisor bloqueó su ejecución al no estar confirmada una base aislada; no se marca como aprobada.

### Matriz de autorización

- `MATRIZ-AUTORIZACION-273.csv` contiene 273 endpoints.
- El código solo define `ROLE_ADMIN` y `ROLE_MULTIFUNCIONAL`; `SUPERVISOR` y `TRABAJADOR` no existen.
- Se identificaron 130 endpoints sin `@PreAuthorize`, 140 con protección declarativa/regla de servicio documentada y 3 públicos o con regla específica en el parser de la matriz.
- No se aplicaron cambios masivos de autorización. Falta revisión por módulo y pruebas 401/403 con una base aislada confirmada.
