# Proceso comercial

Objetivo: flujo empresarial focal. Evidencia: VentaServiceImpl.java:45-91; CotizacionServiceImpl.java:261-282; conversion de preforma no revisada. Prefijo de implementaciones: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/. Sin validacion Mermaid renderer.

```mermaid
flowchart LR
 C[Cliente] --> V[Venta con turno abierto]
 V --> P[Pagos igual total]
 V --> K[Kardex salida producto]
 P --> R[Consulta financiera/reportes]
 C --> Q[Cotizacion]
 Q -->|ACEPTADA: convertir llama registrar| V
 PF[Preforma: conversion no revisada]
```
