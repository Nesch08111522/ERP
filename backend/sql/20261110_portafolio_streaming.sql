-- Media adaptativa opcional para proyectos públicos.
-- No cambia el comportamiento de registros existentes: todas las columnas aceptan NULL.
ALTER TABLE proyectos_portafolio ADD COLUMN IF NOT EXISTS video_url varchar(500);
ALTER TABLE proyectos_portafolio ADD COLUMN IF NOT EXISTS hls_url varchar(500);
ALTER TABLE proyectos_portafolio ADD COLUMN IF NOT EXISTS dash_url varchar(500);
