# Auditoria arquitectura Policalum

## Lista de trabajo por fases

- [x] Fase 0: brief completo 558 lineas; ENGINEERING_STANDARDS 551 lineas; git inicial.
- [x] Fase 1: inventario mecanico de fuentes y evidencias.
- [x] Fase 2: revision semantica focal de seguridad productos ventas compras stock caja nomina y portal.
- [ ] Revision semantica de todos los metodos, consumers y DTO.
- [ ] Catalogo fisico BD bajo transaccion read-only verificada.
- [x] Fase 3: fuentes diagramas con alcance parcial explicito.
- [x] Parser y render local de las 91 fuentes PlantUML previas y 1 flujo general nuevo.
- [ ] Parser/render Mermaid (fuentes complementarias; no incluido en el conteo PNG).
- [x] Fase 4: completar 23 secciones con alcance y limitaciones.
- [ ] Completar alcance semantico y UML detallado del brief; esta entrega NO lo satisface exhaustivamente.

## Entrega visual principal

- [Flujo general empresarial y arquitectura (PNG)](FLUJO_GENERAL_POLICALUM.png)
- [Carpeta de imagenes](imagenes/) | [Validacion de 92 renders](imagenes/validacion-render.json)
- [Catalogo con enlaces PNG individuales](diagramas/catalogo.md)

91 diagramas previos renderizados y 1 flujo general nuevo. Fuentes editables complementarias; revision semantica aun focal.

## Secciones

- [01. Resumen ejecutivo](secciones/01.md)
- [02. Descripcion general del ERP](secciones/02.md)
- [03. Arquitectura del sistema](secciones/03.md)
- [04. Inventario de modulos](secciones/04.md)
- [05. Actores y roles](secciones/05.md)
- [06. Casos de uso](secciones/06.md)
- [07. Procesos empresariales](secciones/07.md)
- [08. Diagramas de actividades](secciones/08.md)
- [09. Diagramas de secuencia](secciones/09.md)
- [10. Diagramas de clases](secciones/10.md)
- [11. Modelo entidad relacion](secciones/11.md)
- [12. Diagramas de componentes](secciones/12.md)
- [13. Diagramas de despliegue](secciones/13.md)
- [14. Diagramas de paquetes](secciones/14.md)
- [15. Diagramas de estados](secciones/15.md)
- [16. Integracion frontend backend](secciones/16.md)
- [17. Seguridad y permisos](secciones/17.md)
- [18. Integracion con sitio web](secciones/18.md)
- [19. Reglas de negocio](secciones/19.md)
- [20. Calidad y deuda tecnica](secciones/20.md)
- [21. Funcionalidades pendientes](secciones/21.md)
- [22. Recomendaciones de arquitectura](secciones/22.md)
- [23. Glosario tecnico y funcional](secciones/23.md)

## Inventarios

[Resumen](inventarios/resumen.md) | [Endpoints](inventarios/endpoints.md) | [Entidades](inventarios/entidades-tablas.md) | [Campos](inventarios/campos-jpa.md) | [Diagramas](diagramas/catalogo.md)

## Limites

Entrega documental parcial, no certificacion de funcionamiento. No cambios de codigo, no migraciones, no procesos ERP, no pruebas ni HTTP. Sin acceso BD seguro disponible; ningun catalogo fisico simulado. No subagentes disponibles. Cambios ajenos existentes preservados. Todos los valores de configuracion se omiten.


