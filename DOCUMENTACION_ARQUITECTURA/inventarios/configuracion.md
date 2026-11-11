# configuracion

SOLO NOMBRES. Ningun valor de entorno o credencial se reproduce. No se abrieron .env ni archivos ocultos sensibles. Perfiles declarados no prueban despliegue activo.

| Nombre propiedad | Evidencia | Proposito |
| --- | --- | --- |
| spring.application.name | backend/src/main/resources/application.properties:5 | Configuracion aplicacion |
| server.address | backend/src/main/resources/application.properties:8 | Red/documentacion |
| server.port | backend/src/main/resources/application.properties:9 | Red/documentacion |
| spring.cloud.config.enabled | backend/src/main/resources/application.properties:14 | Configuracion aplicacion |
| spring.cloud.config.import-check.enabled | backend/src/main/resources/application.properties:15 | Configuracion aplicacion |
| spring.datasource.url | backend/src/main/resources/application.properties:20 | Conexion BD |
| spring.datasource.username | backend/src/main/resources/application.properties:21 | Conexion BD |
| spring.datasource.password | backend/src/main/resources/application.properties:22 | Conexion BD |
| spring.datasource.driver-class-name | backend/src/main/resources/application.properties:23 | Conexion BD |
| spring.jpa.hibernate.ddl-auto | backend/src/main/resources/application.properties:31 | Configuracion aplicacion |
| spring.jpa.show-sql | backend/src/main/resources/application.properties:32 | Configuracion aplicacion |
| spring.jpa.properties.hibernate.format_sql | backend/src/main/resources/application.properties:33 | Configuracion aplicacion |
| spring.jpa.open-in-view | backend/src/main/resources/application.properties:34 | Configuracion aplicacion |
| app.cors.allowed-origins | backend/src/main/resources/application.properties:39 | Red/documentacion |
| jwt.secret | backend/src/main/resources/application.properties:44 | Seguridad; valor omitido |
| jwt.expiration | backend/src/main/resources/application.properties:45 | Seguridad; valor omitido |
| jwt.refresh-expiration | backend/src/main/resources/application.properties:46 | Seguridad; valor omitido |
| totp.secret-key-publico | backend/src/main/resources/application.properties:51 | Seguridad; valor omitido |
| app.uploads.base-path | backend/src/main/resources/application.properties:56 | Almacenamiento |
| spring.jpa.properties.hibernate.jdbc.batch_size | backend/src/main/resources/application.properties:59 | Configuracion aplicacion |
| spring.jpa.properties.hibernate.order_inserts | backend/src/main/resources/application.properties:60 | Configuracion aplicacion |
| spring.jpa.properties.hibernate.order_updates | backend/src/main/resources/application.properties:61 | Configuracion aplicacion |
| spring.jpa.properties.hibernate.jdbc.batch_versioned_data | backend/src/main/resources/application.properties:62 | Configuracion aplicacion |
| app.rate-limit.login.capacity | backend/src/main/resources/application.properties:65 | Configuracion aplicacion |
| app.rate-limit.login.window-seconds | backend/src/main/resources/application.properties:66 | Configuracion aplicacion |
| app.rate-limit.qr-publico.capacity | backend/src/main/resources/application.properties:67 | Configuracion aplicacion |
| app.rate-limit.qr-publico.window-seconds | backend/src/main/resources/application.properties:68 | Configuracion aplicacion |
| spring.jpa.hibernate.ddl-auto | backend/src/main/resources/application-dev.properties:11 | Configuracion aplicacion |
| spring.jpa.show-sql | backend/src/main/resources/application-dev.properties:12 | Configuracion aplicacion |
| spring.jpa.properties.hibernate.format_sql | backend/src/main/resources/application-dev.properties:13 | Configuracion aplicacion |
| spring.datasource.password | backend/src/main/resources/application-dev.properties:14 | Conexion BD |
| jwt.secret | backend/src/main/resources/application-dev.properties:15 | Seguridad; valor omitido |
| totp.secret-key-publico | backend/src/main/resources/application-dev.properties:16 | Seguridad; valor omitido |
| springdoc.api-docs.enabled | backend/src/main/resources/application-dev.properties:17 | Red/documentacion |
| springdoc.swagger-ui.enabled | backend/src/main/resources/application-dev.properties:18 | Red/documentacion |
| spring.jpa.hibernate.ddl-auto | backend/src/main/resources/application-prod.properties:2 | Configuracion aplicacion |
| spring.jpa.show-sql | backend/src/main/resources/application-prod.properties:3 | Configuracion aplicacion |
| spring.jpa.properties.hibernate.format_sql | backend/src/main/resources/application-prod.properties:4 | Configuracion aplicacion |
| springdoc.api-docs.enabled | backend/src/main/resources/application-prod.properties:5 | Red/documentacion |
| springdoc.swagger-ui.enabled | backend/src/main/resources/application-prod.properties:6 | Red/documentacion |
| spring.datasource.password | backend/src/main/resources/application-prod.properties:7 | Conexion BD |
| jwt.secret | backend/src/main/resources/application-prod.properties:8 | Seguridad; valor omitido |
| totp.secret-key-publico | backend/src/main/resources/application-prod.properties:9 | Seguridad; valor omitido |
