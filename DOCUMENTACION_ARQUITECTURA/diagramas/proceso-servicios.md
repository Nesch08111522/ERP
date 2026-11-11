# Proceso servicios

Objetivo: flujo empresarial focal. Evidencia: ServicioServiceImpl.java:124-205; VentaServiceImpl.java:168-180. Prefijo de implementaciones: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/. Sin validacion Mermaid renderer.

```mermaid
flowchart LR
 S[Catalogo servicio] --> C[Colaboradores registrados o externos]
 C --> K[Costo y liquidacion declarados]
 S --> V[Linea de venta servicio]
 E[Ejecucion por cliente no demostrada] -.-> S
 K -. rentabilidad por ejecucion pendiente .-> R[Reportes]
```
