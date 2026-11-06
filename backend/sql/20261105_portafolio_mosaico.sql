ALTER TABLE proyectos_portafolio ADD COLUMN IF NOT EXISTS lugar varchar(80);
ALTER TABLE proyectos_portafolio ADD COLUMN IF NOT EXISTS anio varchar(4);
ALTER TABLE proyectos_portafolio ADD COLUMN IF NOT EXISTS servicio varchar(60);
ALTER TABLE proyectos_portafolio ADD COLUMN IF NOT EXISTS referencia varchar(160);
ALTER TABLE proyectos_portafolio ADD COLUMN IF NOT EXISTS etiquetas_json text;
ALTER TABLE proyectos_portafolio ADD COLUMN IF NOT EXISTS imagenes_json text;
