ALTER TABLE cms_ajustes ADD COLUMN IF NOT EXISTS materiales_kicker varchar(80);
ALTER TABLE cms_ajustes ADD COLUMN IF NOT EXISTS materiales_titulo varchar(180);
ALTER TABLE cms_ajustes ADD COLUMN IF NOT EXISTS materiales_texto varchar(400);
ALTER TABLE cms_ajustes ADD COLUMN IF NOT EXISTS materiales_json text;
