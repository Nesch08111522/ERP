# Proceso financiero

Objetivo: flujo empresarial focal. Evidencia: TurnoCajaServiceImpl.java:86-102; mappings financieros. Prefijo de implementaciones: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/. Sin validacion Mermaid renderer.

```mermaid
flowchart LR
 P[Pagos venta efectivo] --> T[Resumen turno]
 I[Ingresos caja chica] --> T
 E[Egresos caja chica retiros reembolsos] --> T
 T --> D[Diferencia contra declarado]
 C[Cuentas financieras y CxP existen] -. conciliacion completa pendiente .-> T
```
