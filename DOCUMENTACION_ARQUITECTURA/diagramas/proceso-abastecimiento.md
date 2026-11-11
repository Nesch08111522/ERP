# Proceso abastecimiento

Objetivo: flujo empresarial focal. Evidencia: CompraServiceImpl.java:60-115,284-343. Prefijo de implementaciones: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/. Sin validacion Mermaid renderer.

```mermaid
flowchart LR
 P[Proveedor activo] --> C[Crear compra]
 C --> I[Ingresar misma transaccion]
 I --> K[Kardex entrada y stock]
 I --> X[CxP pendiente]
 K --> A[Costo promedio global]
 N[Reposicion automatica no demostrada] -.-> C
```
