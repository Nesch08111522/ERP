# Proceso rrhh

Objetivo: flujo empresarial focal. Evidencia: NominaServiceImpl.java:81-140,179-207,302-362; PoliticaRemuneracionServiceImpl.java:70-75. Prefijo de implementaciones: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/. Sin validacion Mermaid renderer.

```mermaid
flowchart LR
 U[Usuario trabajador o ADMIN] --> L[Legajo y regimen]
 U --> A[Asistencia QR o manual]
 L --> N[Nomina snapshot]
 C[Comision aprobada] --> N
 N --> P[Pago cambia estado]
 P -. no mueve caja automatico .-> F[Finanzas]
 A -. ausencias no afectan aun .-> N
```
