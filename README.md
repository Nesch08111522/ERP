# ErpPoliCalum — ERP Full Stack

ERP para ventas de policarbonato por fracciones, servicios, compras, inventario/Kardex, caja, RRHH, despachos, finanzas y reportes.

## Arquitectura

- `backend/`: Spring Boot 4, Java 17, PostgreSQL, JPA, JWT, validación y OpenAPI.
- `frontend/`: Angular standalone, TypeScript, RxJS y diseño responsive.
- `backend/docs/openapi.json`: contrato REST generado/documentado.
- `scripts/empaquetar_proyecto.py`: crea un ZIP limpio y reproducible.

## Requisitos

- Java 17 o superior compatible con el `pom.xml`.
- Node.js compatible con Angular 22 (`22.22.3+` o una versión LTS compatible).
- PostgreSQL 15+.
- Python 3.10+ para empaquetar.

## Ejecución local

### 1. Base de datos

```bash
docker compose up -d postgres
```

Si no usas Docker, crea una base PostgreSQL llamada `ERPpoli` y configura las variables del backend. En una base vacía, el arranque crea la sede principal y los usuarios de demostración; no hace falta cargar un volcado SQL antes del primer inicio.

### 2. Backend

```bash
cd backend
cp .env.example .env 2>/dev/null || true
export SPRING_PROFILES_ACTIVE=dev
bash mvnw spring-boot:run
```

API: `http://localhost:8080`  
OpenAPI: `http://localhost:8080/v3/api-docs`  
Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Frontend

```bash
cd frontend
npm ci
npm start
```

Aplicación: `http://localhost:4200`

## Pruebas

```bash
cd backend && bash mvnw -B test
cd frontend && npm ci && npx ng test --watch=false
cd frontend && npx ng build --configuration development
cd ../sitio_web && npm ci && npx ng test --watch=false && npx ng build
```

Los listados de ventas, cotizaciones, kardex, compras y auditoría comparan las fechas contra límites concretos. Un filtro vacío abarca todo el historial; PostgreSQL no acepta un parámetro de fecha usado en `IS NULL`.

La prueba comercial de compra, recepción, fracciones, cotización, venta y caja se habilita solo si `POLICALUM_IT_DB_URL` apunta a una base PostgreSQL aislada cuyo nombre empieza por `ERPpoli_it_`. La prueba recrea el esquema de esa base; nunca apuntes esta variable a `ERPpoli` ni a una base con datos que deban conservarse.

## Flujo comercial y comprobantes

- La cotización es la oferta comercial para el cliente; al aceptarla se convierte en una venta y se elige boleta o factura.
- El borrador POS (preforma) es solo temporal e interno: no reserva stock, no reemplaza la cotización y no es un comprobante fiscal.
- Cada venta registra en el ERP una serie local de boleta/factura y un ticket interno asociado. El ticket no reemplaza al comprobante electrónico.
- La integración de emisión y consulta con SUNAT/PSE/OSE aún no está configurada. Los registros locales quedan con estado SUNAT pendiente; para emitir comprobantes electrónicos válidos hay que seleccionar un proveedor e instalar su integración y credenciales seguras en el servidor.

## Seguridad y configuración

No se deben commitear secretos reales. Usa variables de entorno para `DB_PASSWORD`, `JWT_SECRET`, `TOTP_PUBLIC_SECRET` y CORS. El perfil `prod` desactiva SQL visible, `ddl-auto=update` y documentación pública.

## Empaquetado

Desde la raíz:

```bash
python3 scripts/empaquetar_proyecto.py
```

El ZIP se crea en `dist/ErpPoliCalum-reconstruido.zip` excluyendo `.git`, `node_modules`, `target`, caches, credenciales locales y archivos compilados.

## Alcance de la reconstrucción

Se conserva la lógica de negocio existente y se añaden convenciones de ejecución, configuración y empaquetado. La fuente de verdad de permisos es `backend/docs/API-ROLES.md`; el contrato de integración es OpenAPI. Antes de producción deben ejecutarse los tests del backend con JDK 17 y el build Angular con una versión de Node compatible.
