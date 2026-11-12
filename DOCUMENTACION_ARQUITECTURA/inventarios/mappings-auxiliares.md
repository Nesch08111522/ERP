# mappings-auxiliares

Tablas intermedias y colecciones declaradas. Su existencia fisica y FK requieren catalogo PostgreSQL.

| Entidad | Mapping | Definicion | Evidencia |
| --- | --- | --- | --- |
| CuentaFinanciera | ElementCollection | fetch = FetchType.LAZY | backend/src/main/java/com/policalum/erp/domain/model/CuentaFinanciera.java:72 |
| CuentaFinanciera | CollectionTable | name = "finanzas_cuenta_metodos", joinColumns = @JoinColumn(name = "cuenta_id" | backend/src/main/java/com/policalum/erp/domain/model/CuentaFinanciera.java:73 |
