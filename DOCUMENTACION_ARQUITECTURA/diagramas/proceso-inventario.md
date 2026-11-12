# Proceso inventario

Objetivo: flujo empresarial focal. Evidencia: Stock.java:39-45; StockOperacionServiceImpl.java:89-297. Prefijo de implementaciones: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/. Sin validacion Mermaid renderer.

```mermaid
flowchart LR
 P[Producto] --> S[Stock por almacen]
 A[Almacen ligado sede] --> S
 S --> M[Ajustes y Kardex]
 S --> T[Transferencia]
 T --> E[Salida origen entrada destino]
 M --> R[Consolidado y alertas]
```
