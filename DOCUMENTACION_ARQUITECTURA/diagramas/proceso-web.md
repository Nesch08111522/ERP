# Proceso web

Objetivo: flujo empresarial focal. Evidencia: PortalPublicoService.java:57-70,143-197; cms.store.ts:65-103. Prefijo de implementaciones: backend/src/main/java/com/policalum/erp/application/service/serviceImpl/. Sin validacion Mermaid renderer.

```mermaid
flowchart LR
 E[ERP producto activo / proyecto publicado / CMS] --> API[API publica y SSE]
 API --> W[Sitio Angular]
 W --> V[Visitante]
 API --> S[Saldo exacto intencional]
 API --> C[Colores dia noche CMS]
```
