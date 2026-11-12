-- Repara el defecto que detectó EntidadesBuilderDefaultsTest:
-- Producto declaraba `= false / = true / = true` como inicializadores de campo, pero @Builder
-- (y MapStruct, que usa el builder) los ignora y el @PrePersist no cubría estos tres.
-- Resultado: todo producto creado desde el ERP quedó con las tres columnas en NULL.
--
-- Medido en ERPpoli antes de este script: 18 productos, 18 con NULL en las tres columnas.
--
-- El código ya está corregido en Producto.prePersist(); este script arregla los datos existentes.
-- Valores elegidos = los que la propia entidad declara como defecto.
--
-- Idempotente: solo toca las filas que siguen en NULL, no reescribe decisiones ya tomadas.
-- No destructivo: no borra ni modifica otras columnas.

UPDATE productos
   SET permite_stock_negativo = false
 WHERE permite_stock_negativo IS NULL;

UPDATE productos
   SET visible_catalogo = true
 WHERE visible_catalogo IS NULL;

UPDATE productos
   SET disponible_venta = true
 WHERE disponible_venta IS NULL;

-- Comprobación: las tres consultas deben devolver 0.
-- select count(*) from productos where permite_stock_negativo is null;
-- select count(*) from productos where visible_catalogo is null;
-- select count(*) from productos where disponible_venta is null;
