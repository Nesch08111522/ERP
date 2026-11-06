# Matriz de autorización del backend

Fecha: 2026-11-05/06

## Resultado

Se generó `MATRIZ-AUTORIZACION-273.csv` a partir de `docs/API-ROLES.md`. La matriz contiene exactamente 273 endpoints y estas columnas:

- Número, módulo, método HTTP y ruta.
- Permiso documentado para `ROLE_ADMIN` y `ROLE_MULTIFUNCIONAL`.
- Estado para `SUPERVISOR` y `TRABAJADOR`.
- Protección efectiva observada.
- Nivel de riesgo.
- Notas de negocio y restricciones pendientes.

## Roles reales del código

El enum `com.policalum.erp.domain.enums.RolNombre` solo define:

- `ROLE_ADMIN`
- `ROLE_MULTIFUNCIONAL`

No existen `ROLE_SUPERVISOR` ni `ROLE_TRABAJADOR` en el backend actual. La matriz los marca como `NO_DEFINIDO`; no se asignaron permisos ficticios. Si Supervisor y Trabajador son roles requeridos por negocio, primero debe definirse su modelo, persistencia, creación de usuarios, claims JWT, reglas de sede y pruebas antes de usarlos en `@PreAuthorize`.

## Protección observada

| Estado | Endpoints |
|---|---:|
| Públicos o con regla específica de endpoint | 3 |
| Protección declarativa o regla de servicio identificada | 140 |
| Solo `authenticated()` / sin `@PreAuthorize` | 130 |
| **Total** | **273** |

Los 130 endpoints sin `@PreAuthorize` no deben considerarse restringidos por rol aunque la tabla de documentación indique ADMIN/MULTIFUNCIONAL. La columna `ProteccionReal` conserva esa diferencia.

## Riesgo clasificado

| Nivel | Endpoints |
|---|---:|
| CRITICO | 0 en esta clasificación automática; requiere revisión manual porque existen operaciones sensibles dentro de endpoints sin `@PreAuthorize` |
| ALTO | 133 |
| MEDIO | 48 |
| BAJO | 92 |

La clasificación es una priorización, no una aprobación de seguridad. En particular, cualquier escritura financiera, de caja, inventario, compras, devoluciones, usuarios, roles, sedes, archivos o importación/exportación debe revisarse manualmente.

## Corrección pendiente por módulos

No se aplicaron anotaciones masivas. El orden de cierre propuesto es:

1. Usuarios, roles y sedes: solo ADMIN; impedir escalamiento de privilegios.
2. Inventario, kardex y stock: ADMIN para ajustes/transferencias sensibles; MULTIFUNCIONAL solo para operaciones autorizadas por sede.
3. Caja, ventas, devoluciones y reembolsos: distinguir dueño del turno, vendedor, aprobación administrativa y sede.
4. Compras, recepción, cuentas por pagar y finanzas: separar consulta, alta, recepción, pago y anulación.
5. Clientes, proveedores, catálogo y archivos: aplicar permisos por operación sin romper los listados de trabajo.
6. Añadir pruebas `401` sin token y `403` por rol para cada grupo.

Cada modificación deberá hacerse por controlador o método, acompañada por una prueba de autorización y validarse primero contra una base de pruebas aislada. Esta matriz no constituye una aprobación de seguridad; es el inventario verificable para ejecutar la corrección de forma controlada.
