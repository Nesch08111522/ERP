import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ToastService } from '../../shared/services/toast.service';
import { problemText } from '../../shared/utils/feedback';
import { coincideBusqueda } from '../../shared/utils/search-text';

interface DiaHorario {
  dia: string;
  abierto: boolean;
  desde?: string;
  hasta?: string;
}

interface Atencion {
  configurado: boolean;
  abiertoAhora: boolean;
  texto: string;
}

interface PaletaColor {
  acento: string;
  fondo: string;
  tarjeta: string;
  texto: string;
  textoSuave: string;
  oferta: string;
  franja: string;
}

interface ColoresSitio {
  dia: PaletaColor;
  noche: PaletaColor;
}

const PALETA_SITIO: ColoresSitio = {
  dia: {
    acento: '#0d47a1',
    fondo: '#f3f6fb',
    tarjeta: '#ffffff',
    texto: '#0c1724',
    textoSuave: '#3c4d5c',
    oferta: '#c62828',
    franja: '#0c1724',
  },
  noche: {
    acento: '#90caf9',
    fondo: '#070d14',
    tarjeta: '#101820',
    texto: '#f3f7fb',
    textoSuave: '#b7c6d3',
    oferta: '#ff8a80',
    franja: '#041018',
  },
};

function grupoPaleta(fb: FormBuilder, base: PaletaColor) {
  const hex = [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)];
  return fb.nonNullable.group({
    acento: [base.acento, hex],
    fondo: [base.fondo, hex],
    tarjeta: [base.tarjeta, hex],
    texto: [base.texto, hex],
    textoSuave: [base.textoSuave, hex],
    oferta: [base.oferta, hex],
    franja: [base.franja, hex],
  });
}

const TONOS: Array<{ id: keyof PaletaColor; label: string }> = [
  { id: 'acento', label: 'Acento' },
  { id: 'fondo', label: 'Fondo' },
  { id: 'tarjeta', label: 'Tarjetas' },
  { id: 'texto', label: 'Texto' },
  { id: 'textoSuave', label: 'Texto suave' },
  { id: 'oferta', label: 'Ofertas' },
  { id: 'franja', label: 'Franja superior' },
];

interface CmsPublico {
  primaryColor: string;
  secondaryColor: string;
  baseFontSize: number;
  themeMode: string;
  aviso: string;
  avisoActivo: boolean;
  avisoImagen?: string | null;
  colores?: ColoresSitio | null;
  banner?: string;
  resumen?: string;
  horarioSemana?: string;
  horarioSabado?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  correoSoporte?: string;
  textoPrivacidad?: string;
  textoTerminos?: string;
  textoGarantia?: string;
  textoFaq?: string;
  heroKicker?: string;
  heroTitulo?: string;
  heroTexto?: string;
  materialesKicker?: string;
  materialesTitulo?: string;
  materialesTexto?: string;
  materiales?: MaterialCms[];
  atencion?: Atencion;
  dias?: DiaHorario[];
}

interface MaterialCms {
  id?: string;
  nombre: string;
  resumen?: string;
  imagenUrl?: string;
  videoUrl?: string;
  activo?: boolean;
}

interface FraccionOferta {
  id: string;
  nombreFraccion?: string;
  precioVenta?: number | null;
  factorDescuentoKardex?: number | null;
  activo?: boolean;
  enOferta?: boolean | null;
  ofertaPorcentaje?: number | null;
  precioOferta?: number | null;
}

interface ProductoOferta {
  id: string;
  nombre: string;
  codigoSku?: string;
  descripcion?: string;
  unidad?: string;
  destacado?: boolean;
  createdAt?: string;
  categoria?: { id?: string; nombre?: string };
  precioCompra?: number | null;
  precioVentaBase?: number | null;
  precioOferta?: number | null;
  ofertaPorcentaje?: number | null;
  oferta?: boolean;
  esFraccionable?: boolean;
  fracciones?: FraccionOferta[];
}

const COLORES_PRODUCTO: ReadonlyArray<readonly [string, string]> = [
  ['transparente', 'Transparente'],
  ['cristal', 'Cristal'],
  ['bronce', 'Bronce'],
  ['ahumado', 'Ahumado'],
  ['humo', 'Humo'],
  ['opalino', 'Opalino'],
  ['ópalo', 'Ópalo'],
  ['opal', 'Opal'],
  ['lechoso', 'Lechoso'],
  ['blanco', 'Blanco'],
  ['azul', 'Azul'],
  ['verde', 'Verde'],
  ['rojo', 'Rojo'],
  ['gris', 'Gris'],
  ['negro', 'Negro'],
  ['amarillo', 'Amarillo'],
  ['naranja', 'Naranja'],
];

function textoProducto(producto: ProductoOferta): string {
  return `${producto.nombre} ${producto.descripcion ?? ''}`.toLocaleLowerCase('es');
}

function tipoDe(producto: ProductoOferta): string {
  const nombre = producto.nombre.toLocaleLowerCase('es');
  if (nombre.includes('alveolar')) return 'Alveolar';
  if (nombre.includes('sólido') || nombre.includes('solido')) return 'Sólido';
  if (nombre.includes('perfil')) return 'Perfil';
  return 'Accesorio';
}

function materialDe(producto: ProductoOferta): string {
  const nombre = producto.nombre.toLocaleLowerCase('es');
  const texto = textoProducto(producto);
  if (nombre.includes('neopreno') || texto.includes('neopreno')) return 'Neopreno';
  if (nombre.includes('silicona') || texto.includes('silicona')) return 'Silicona';
  if (nombre.includes('aluminio') || nombre.includes('perfil')) return 'Aluminio';
  if (nombre.includes('policarbonato') || texto.includes('policarbonato')) return 'Policarbonato';
  return '';
}

function presentacionDe(producto: ProductoOferta): string {
  const unidad = (producto.unidad ?? '').toUpperCase();
  if (unidad.startsWith('PLANCHA')) return 'Plancha';
  if (unidad.startsWith('BARRA')) return 'Barra';
  if (unidad === 'UNID' || unidad === 'UNIDAD' || unidad === 'UND') return 'Unidad';
  if (!unidad) return '';
  return unidad.charAt(0) + unidad.slice(1).toLowerCase();
}

function colorDe(producto: ProductoOferta): string {
  const texto = textoProducto(producto);
  return COLORES_PRODUCTO.find(([clave]) => texto.includes(clave))?.[1] ?? '';
}

function espesorDe(producto: ProductoOferta): string {
  const coincide = `${producto.nombre} ${producto.descripcion ?? ''}`.match(/(\d+(?:[.,]\d+)?)\s*mm/i);
  return coincide ? coincide[1].replace(',', '.') : '';
}

function unicos(valores: string[]): string[] {
  return [...new Set(valores.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
}

type AlcanceFraccion = 'TODAS' | 'ALGUNAS' | 'NINGUNA';

interface DatoEmpresa {
  nombreComercial?: string;
  razonSocial?: string;
  ruc?: string;
  telefono?: string;
  email?: string;
  direccionFiscal?: string;
  ubigeo?: string;
}

interface PropuestaEmpresa {
  campo: keyof DatoEmpresa;
  etiqueta: string;
  actual: string;
  nuevo: string;
}

interface EmpresaSitio {
  personalizado: boolean;
  sitio: DatoEmpresa;
  global: DatoEmpresa;
  propuestas: PropuestaEmpresa[];
}

const SEMANA = [
  { dia: 'LUNES', etiqueta: 'Lunes', abierto: true, desde: '08:00', hasta: '18:00' },
  { dia: 'MARTES', etiqueta: 'Martes', abierto: true, desde: '08:00', hasta: '18:00' },
  { dia: 'MIERCOLES', etiqueta: 'Miércoles', abierto: true, desde: '08:00', hasta: '18:00' },
  { dia: 'JUEVES', etiqueta: 'Jueves', abierto: true, desde: '08:00', hasta: '18:00' },
  { dia: 'VIERNES', etiqueta: 'Viernes', abierto: true, desde: '08:00', hasta: '18:00' },
  { dia: 'SABADO', etiqueta: 'Sábado', abierto: true, desde: '08:00', hasta: '13:00' },
  { dia: 'DOMINGO', etiqueta: 'Domingo', abierto: false, desde: '08:00', hasta: '13:00' },
];

@Component({
  selector: 'app-gestor-web-page',
  standalone: true,
  imports: [ReactiveFormsModule, PageHeaderComponent, RouterLink],
  template: `
    <section class="stack">
      <app-page-header title="Sitio web" subtitle="El nombre, el RUC, el teléfono y la dirección se copian de Parámetros globales. Si los cambias aquí, solo cambia el sitio web." />
      <form [formGroup]="forma" (ngSubmit)="guardar()">
        <div class="tabs" role="tablist" aria-label="Secciones del sitio">
          @for (item of secciones; track item.id) {
            <button type="button" class="tab" role="tab" [class.active]="seccion === item.id" [attr.aria-selected]="seccion === item.id" (click)="seccion = item.id">{{ item.label }}</button>
          }
        </div>
        @if (seccion === 'datos') {
            <div class="panel form-grid">
              <p class="nota span-2">Estos campos salen de <a routerLink="/modules/configuracion">Parámetros globales</a>. Guardar el sitio no modifica el ERP. Si allá cambia un dato, aquí te pregunta si quieres usarlo.</p>
              @if (propuestas.length) {
                <div class="propuestas span-2">
                  <strong>Hay datos nuevos en la configuración global</strong>
                  <p class="nota">El sitio sigue con lo que ya guardaste. Acepta el dato que quieras mostrar y luego pulsa Guardar sitio.</p>
                  @for (dato of propuestas; track dato.campo) {
                    <article>
                      <p><b>{{ dato.etiqueta }}</b></p>
                      <p>En el sitio: {{ dato.actual || 'vacío' }}</p>
                      <p>Nuevo en el ERP: {{ dato.nuevo || 'vacío' }}</p>
                      <div class="actions">
                        <button type="button" class="btn btn-primary" (click)="usarDato(dato)">Usar en el sitio</button>
                        <button type="button" class="btn btn-outline" (click)="dejarDato(dato)">Dejar el del sitio</button>
                      </div>
                    </article>
                  }
                </div>
              }
              <label class="field">Nombre comercial <input class="input" type="text" formControlName="nombreComercial" maxlength="150" /></label>
              <label class="field">Razón social <input class="input" type="text" formControlName="razonSocial" maxlength="200" /></label>
              <label class="field">RUC <input class="input" type="text" formControlName="ruc" maxlength="11" inputmode="numeric" /></label>
              <label class="field">Teléfono <input class="input" type="text" formControlName="telefono" maxlength="20" /></label>
              <label class="field">Correo <input class="input" type="email" formControlName="email" maxlength="150" /></label>
              <label class="field">Ubigeo <input class="input" type="text" formControlName="ubigeo" maxlength="6" inputmode="numeric" /></label>
              <label class="field span-2">Dirección <input class="input" type="text" formControlName="direccionFiscal" maxlength="300" /></label>
              <p class="nota span-2">Las sedes y su dirección se cambian en <a routerLink="/modules/sedes">Sedes</a>. La utilidad y la movilidad de la cotización se cambian en <a routerLink="/modules/configuracion">Configuración → Cotización</a>.</p>
            </div>
        }

        @if (seccion === 'portada') {
            <div class="panel form-grid">
              <label class="field">Antetítulo <input class="input" type="text" maxlength="80" formControlName="heroKicker" /></label>
              <label class="field">Título <input class="input" type="text" maxlength="180" formControlName="heroTitulo" /></label>
              <label class="field span-2">Texto de la portada <textarea class="textarea" rows="3" maxlength="400" formControlName="heroTexto"></textarea></label>
              <label class="field span-2">Franja superior <input class="input" type="text" maxlength="180" formControlName="banner" /></label>
              <label class="field span-2">Texto del pie <textarea class="textarea" rows="3" maxlength="500" formControlName="resumen"></textarea></label>
            </div>
        }

        @if (seccion === 'reels') {
            <div class="panel">
              <p class="nota">Cada pieza entra sola al carrusel de la portada. Sube un video para que el cliente lo abra con sonido, o solo una imagen si es un póster o una oferta. La foto, si la hay, es la portada de la tarjeta. También vale una ruta del sitio, como /videos/espesor.mp4.</p>
              <div class="form-grid">
                <label class="field">Antetítulo <input class="input" type="text" maxlength="80" formControlName="materialesKicker" /></label>
                <label class="field">Título <input class="input" type="text" maxlength="180" formControlName="materialesTitulo" /></label>
                <label class="field span-2">Introducción <textarea class="textarea" rows="3" maxlength="400" formControlName="materialesTexto"></textarea></label>
              </div>
              <div class="reels" formArrayName="materiales">
                @for (fila of materiales.controls; track $index) {
                  <div class="material-fila" [formGroupName]="$index">
                    <label class="field">Título <input class="input" type="text" maxlength="80" formControlName="nombre" /></label>
                    <label class="field">Resumen <textarea class="textarea" rows="2" maxlength="240" formControlName="resumen"></textarea></label>
                    <label class="field">Portada o póster
                      <input class="input" type="file" accept="image/jpeg,image/png,image/webp" (change)="subirMedio($index, 'imagenUrl', $event)" />
                      <input class="input" type="text" maxlength="300" formControlName="imagenUrl" placeholder="Se llena al subir la imagen" />
                    </label>
                    <label class="field">Video
                      <input class="input" type="file" accept="video/mp4,video/webm" (change)="subirMedio($index, 'videoUrl', $event)" />
                      <input class="input" type="text" maxlength="300" formControlName="videoUrl" placeholder="Se llena al subir el video" />
                    </label>
                    @if (subiendoMedio === $index) { <p class="nota">Subiendo archivo…</p> }
                    <label class="check-row"><input class="checkbox" type="checkbox" formControlName="activo" /> Publicado</label>
                    <button type="button" class="btn btn-outline" (click)="quitarMaterial($index)">Quitar</button>
                  </div>
                }
              </div>
              <button type="button" class="btn btn-outline" (click)="agregarMaterial()">Agregar pieza</button>
            </div>
        }

        @if (seccion === 'horario') {
            <div class="panel">
              <p class="nota">Marca los días que no se trabaja y la hora de cierre. El sitio dice solo si hoy atienden, de qué hora a qué hora, o si ya cerraron.</p>
              @for (dia of dias.controls; track dia.controls.dia.value) {
                <div class="horario-fila">
                  <strong>{{ dia.controls.etiqueta.value }}</strong>
                  <label class="check-row"><input class="checkbox" type="checkbox" [formControl]="dia.controls.abierto" /> Abierto</label>
                  @if (dia.controls.abierto.value) {
                    <input class="input" type="time" [formControl]="dia.controls.desde" />
                    <input class="input" type="time" [formControl]="dia.controls.hasta" />
                  }
                </div>
              }
              <p class="ganancia">{{ vistaHoy }}</p>
            </div>
        }

        @if (seccion === 'redes') {
            <div class="panel form-grid">
              <label class="field span-2">Correo de soporte <input class="input" type="email" formControlName="correoSoporte" /></label>
              <label class="field">Facebook <input class="input" type="url" formControlName="facebook" /></label>
              <label class="field">Instagram <input class="input" type="url" formControlName="instagram" /></label>
              <label class="field">LinkedIn <input class="input" type="url" formControlName="linkedin" /></label>
              <label class="field">YouTube <input class="input" type="url" formControlName="youtube" /></label>
            </div>
        }

        @if (seccion === 'legales') {
            <div class="panel">
              <p class="nota">Si los dejas vacíos, el sitio usa el texto explicado de fábrica.</p>
              <label class="field">Privacidad <textarea class="textarea" rows="4" formControlName="textoPrivacidad"></textarea></label>
              <label class="field">Términos <textarea class="textarea" rows="4" formControlName="textoTerminos"></textarea></label>
              <label class="field">Garantía <textarea class="textarea" rows="3" formControlName="textoGarantia"></textarea></label>
              <label class="field">Preguntas frecuentes <textarea class="textarea" rows="4" formControlName="textoFaq"></textarea></label>
            </div>
        }

        @if (seccion === 'aviso') {
            <div class="panel">
              <p class="nota">El texto sale en una franja. Si subes una foto, entra como ventana al abrir el sitio y solo la primera vez. Si cambias la foto, vuelve a salir una vez.</p>
              <label class="field">Texto del aviso <input class="input" type="text" maxlength="180" formControlName="aviso" /></label>
              <label class="check-row"><input class="checkbox" type="checkbox" formControlName="avisoActivo" /> Publicar el aviso</label>
              <label class="field">Foto del aviso
                <input class="input" type="file" accept="image/jpeg,image/png,image/webp" (change)="subirAviso($event)" />
              </label>
              @if (subiendoAviso) { <p class="nota">Subiendo foto…</p> }
              @if (forma.controls.avisoImagen.value) {
                <img class="aviso-foto" [src]="medio(forma.controls.avisoImagen.value)" alt="Foto del aviso" />
                <button type="button" class="btn btn-outline" (click)="forma.controls.avisoImagen.setValue('')">Quitar foto</button>
              }
              <div class="paleta-cabeza">
                <h3>Colores del sitio</h3>
                <button type="button" class="btn btn-outline" (click)="restablecerColores()">Restablecer colores de ahora</button>
              </div>
              <div class="paleta" formGroupName="colores">
                <section formGroupName="dia">
                  <h3>Día</h3>
                  <div class="tonos">
                    @for (tono of tonos; track tono.id) {
                      <label class="tono">{{ tono.label }}
                        <input type="color" [formControlName]="tono.id" />
                      </label>
                    }
                  </div>
                </section>
                <section formGroupName="noche">
                  <h3>Noche</h3>
                  <div class="tonos">
                    @for (tono of tonos; track tono.id) {
                      <label class="tono">{{ tono.label }}
                        <input type="color" [formControlName]="tono.id" />
                      </label>
                    }
                  </div>
                </section>
              </div>
              <aside class="muestra" [style.background]="colorDe('dia', 'fondo')" [style.color]="colorDe('dia', 'texto')">
                <p [style.background]="colorDe('dia', 'franja')" [style.color]="tinta(colorDe('dia', 'franja'))">{{ forma.controls.banner.value || 'Franja del sitio' }}</p>
                <strong [style.color]="colorDe('dia', 'acento')">{{ forma.controls.nombreComercial.value || 'POLICALUM' }}</strong>
                <p>{{ forma.controls.heroTexto.value || 'Así se ve el texto sobre el fondo.' }}</p>
                <span class="muestra-btn" [style.background]="colorDe('dia', 'acento')" [style.color]="tinta(colorDe('dia', 'acento'))">Cotizar</span>
                <span [style.color]="colorDe('dia', 'oferta')">Oferta</span>
              </aside>
            </div>
        }
        @if (seccion !== 'ofertas') {
          <div class="actions">
            <button type="submit" class="btn btn-primary" [disabled]="guardando || !empresaCargada">Guardar sitio</button>
          </div>
        }
        @if (seccion === 'ofertas') {
        <div class="panel ofertas-margen">
          <div class="actions">
            <button type="button" class="btn btn-outline" (click)="sincronizar()" [disabled]="sincronizando">Marcar ofertas de 90 días</button>
          </div>
      <p class="nota">El porcentaje baja el precio de venta. La ganancia que ves es el precio de oferta menos el precio de compra. Si compraste a S/ 10 y vendes a S/ 20, un 10% deja la venta en S/ 18 y la ganancia en S/ 8. El costo no sale al sitio público.</p>
      <div class="filtros-oferta">
        <label class="field crecer">Buscar
          <input class="input" type="search" placeholder="Nombre, código o categoría" [value]="busqueda" (input)="busqueda = $any($event.target).value" />
        </label>
        <label class="field">Categoría
          <select class="input" [value]="filtroCategoria" (change)="filtroCategoria = $any($event.target).value">
            <option value="">Todas</option>
            @for (categoria of categoriasOferta(); track categoria.id) {
              <option [value]="categoria.id">{{ categoria.nombre }}</option>
            }
          </select>
        </label>
        <label class="field">Orden
          <select class="input" [value]="ordenOferta" (change)="ordenOferta = $any($event.target).value">
            <option value="reciente">Más recientes</option>
            <option value="nombre">Nombre</option>
            <option value="precio">Precio de venta</option>
            <option value="margen">Ganancia</option>
          </select>
        </label>
        <label class="field corto">Días de vigencia
          <input class="input" type="number" min="1" max="365" [value]="diasOferta" (input)="diasOferta = +$any($event.target).value || 15" />
        </label>
      </div>
      <div class="chips">
        <label class="check-row"><input class="checkbox" type="checkbox" [checked]="filtroOferta" (change)="filtroOferta = $any($event.target).checked" /> En oferta</label>
        @if (hayDestacados()) {
          <label class="check-row"><input class="checkbox" type="checkbox" [checked]="filtroDestacado" (change)="filtroDestacado = $any($event.target).checked" /> Destacados</label>
        }
        @if (hayCortes()) {
          <label class="check-row"><input class="checkbox" type="checkbox" [checked]="filtroCorte" (change)="filtroCorte = $any($event.target).checked" /> Se vende por corte</label>
        }
        @if (opcionesTipo().length > 1) {
          <label class="field chip-field">Tipo
            <select class="input" [value]="filtroTipo" (change)="filtroTipo = $any($event.target).value">
              <option value="">Todos</option>
              @for (opcion of opcionesTipo(); track opcion) { <option [value]="opcion">{{ opcion }}</option> }
            </select>
          </label>
        }
        @if (opcionesMaterial().length > 1) {
          <label class="field chip-field">Material
            <select class="input" [value]="filtroMaterial" (change)="filtroMaterial = $any($event.target).value">
              <option value="">Todos</option>
              @for (opcion of opcionesMaterial(); track opcion) { <option [value]="opcion">{{ opcion }}</option> }
            </select>
          </label>
        }
        @if (opcionesPresentacion().length > 1) {
          <label class="field chip-field">Presentación
            <select class="input" [value]="filtroPresentacion" (change)="filtroPresentacion = $any($event.target).value">
              <option value="">Todas</option>
              @for (opcion of opcionesPresentacion(); track opcion) { <option [value]="opcion">{{ opcion }}</option> }
            </select>
          </label>
        }
        @if (opcionesColor().length) {
          <label class="field chip-field">Color
            <select class="input" [value]="filtroColor" (change)="filtroColor = $any($event.target).value">
              <option value="">Todos</option>
              @for (opcion of opcionesColor(); track opcion) { <option [value]="opcion">{{ opcion }}</option> }
            </select>
          </label>
        }
        @if (opcionesEspesor().length) {
          <label class="field chip-field">Espesor
            <select class="input" [value]="filtroEspesor" (change)="filtroEspesor = $any($event.target).value">
              <option value="">Todos</option>
              @for (opcion of opcionesEspesor(); track opcion) { <option [value]="opcion">{{ opcion }} mm</option> }
            </select>
          </label>
        }
        @if (hayFiltroOferta()) {
          <button type="button" class="btn btn-outline" (click)="limpiarFiltros()">Limpiar filtros</button>
        }
      </div>
      @if (!cargandoProductos && !errorProductos && productosOferta.length) {
        <p class="nota">{{ productosVisibles().length }} de {{ productosOferta.length }} productos{{ productosRecortados ? '. El buscador recorre los primeros 1000 activos.' : '' }}</p>
      }
      @if (cargandoProductos) { <p class="nota">Cargando productos…</p> }
      @if (errorProductos) {
        <p class="pierde">{{ errorProductos }}</p>
        <button type="button" class="btn btn-outline" (click)="cargarProductosOferta()">Reintentar</button>
      }
      @if (!cargandoProductos && !errorProductos && !productosOferta.length) {
        <p class="nota">No hay productos activos para publicar en oferta.</p>
      }
      @if (!cargandoProductos && !errorProductos && productosOferta.length && !productosVisibles().length) {
        <p class="nota">Ningún producto coincide con la búsqueda o los filtros.</p>
      }
      <div class="cuadricula">
        @for (producto of productosVisibles(); track producto.id) {
          <article class="tarjeta">
            <header>
              <strong>{{ producto.nombre }}</strong>
              @if (producto.oferta) { <em>En oferta</em> }
            </header>
            <p>Compra {{ soles(producto.precioCompra) }} · Venta {{ soles(producto.precioVentaBase) }}</p>
            <label class="field">% descuento
              <input class="input" type="number" min="0" max="99.99" step="0.01" [value]="porcentajeDe(producto)" (input)="fijarPorcentaje(producto.id, $any($event.target).value)" />
            </label>
            <p>Precio oferta {{ soles(precioOfertaDe(producto)) }}</p>
            <p [class.pierde]="gananciaDe(producto) <= 0">Ganancia {{ soles(gananciaDe(producto)) }}</p>
            @if (fraccionesDe(producto).length) {
              <button type="button" class="btn btn-outline" (click)="alternarFracciones(producto.id)">{{ abierto(producto.id) ? 'Ver menos' : 'Ver más' }}</button>
              @if (abierto(producto.id)) {
                <div class="fracciones">
                  <p>El porcentaje de arriba puede bajar todas las fracciones o solo las que marques.</p>
                  <div class="actions">
                    <button type="button" class="btn btn-outline" [class.btn-primary]="alcanceDe(producto) === 'TODAS'" (click)="fijarAlcance(producto, 'TODAS')">Todas</button>
                    <button type="button" class="btn btn-outline" [class.btn-primary]="alcanceDe(producto) === 'ALGUNAS'" (click)="fijarAlcance(producto, 'ALGUNAS')">Algunas</button>
                    <button type="button" class="btn btn-outline" [class.btn-primary]="alcanceDe(producto) === 'NINGUNA'" (click)="fijarAlcance(producto, 'NINGUNA')">Ninguna</button>
                  </div>
                  @for (fraccion of fraccionesDe(producto); track fraccion.id) {
                    <label class="check-row">
                      <input type="checkbox" [checked]="fraccionMarcada(producto, fraccion)" [disabled]="alcanceDe(producto) !== 'ALGUNAS'" (change)="marcarFraccion(producto, fraccion, $any($event.target).checked)" />
                      <span>{{ fraccion.nombreFraccion }} · lista {{ soles(fraccion.precioVenta) }} · oferta {{ soles(precioFraccion(producto, fraccion)) }} · ganancia {{ soles(gananciaFraccion(producto, fraccion)) }}</span>
                    </label>
                  }
                </div>
              }
            }
            <div class="actions">
              <button type="button" class="btn btn-primary" (click)="publicarOferta(producto)">Publicar</button>
              <button type="button" class="btn btn-outline" (click)="quitarOferta(producto)" [disabled]="!producto.oferta">Quitar</button>
            </div>
          </article>
        }
      </div>
        </div>
        }
      </form>
    </section>
  `,
  styles: `
    form { display: grid; gap: 12px; }
    .panel { display: grid; gap: 12px; padding: 16px; border: 1px solid var(--color-border); border-radius: 16px; background: var(--color-surface); }
    .reels { display: grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: 12px; align-items: start; }
    .field { display: grid; gap: 6px; color: var(--color-text); font-size: var(--text-sm); font-weight: 600; }
    .nota { margin: 0; color: var(--color-text-muted); font-size: 0.9rem; }
    .input-color { width: 4.5rem; height: 2.25rem; padding: 0; border: 0; background: transparent; }
    .preview { border-radius: 12px; padding: 16px; background: var(--color-bg-subtle); color: var(--color-text); border: 1px solid var(--color-border); display: grid; gap: 6px; }
    .franja { margin: 0; text-align: center; color: var(--color-primary); font-size: 12px; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; }
    .propuestas { display: grid; gap: 10px; padding: 12px; border: 1px solid var(--color-primary); border-radius: 12px; background: var(--color-bg-subtle); }
    .propuestas article { display: grid; gap: 4px; padding: 10px; border-radius: 10px; background: var(--color-surface); }
    .propuestas p { margin: 0; }
    .material-fila { display: grid; gap: 8px; margin: 0; padding: 12px; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-bg-subtle); }
    .ofertas-margen { display: grid; gap: 12px; }
    .filtros-oferta, .chips {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
      gap: 10px 12px;
      align-items: end;
    }
    .filtros-oferta .field, .chips .field { width: auto; }
    .crecer { grid-column: span 2; }
    .chips .check-row { min-height: 2.4rem; }
    @media (max-width: 640px) {
      .crecer { grid-column: auto; }
      .filtros-oferta, .chips { grid-template-columns: 1fr 1fr; }
    }
    .cuadricula { display: grid; grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr)); gap: 12px; }
    .tarjeta { display: grid; gap: 8px; align-content: start; padding: 14px; border: 1px solid var(--color-border); border-radius: 16px; background: var(--color-surface); }
    .tarjeta header { display: flex; justify-content: space-between; gap: 8px; align-items: start; }
    .tarjeta header strong { min-width: 0; }
    .tarjeta p, .fracciones p { margin: 0; }
    .tarjeta em { font-style: normal; color: var(--color-primary); font-size: 0.8rem; white-space: nowrap; }
    .fracciones { display: grid; gap: 8px; padding: 10px; border-radius: 12px; background: var(--color-bg-subtle); }
    .fracciones .check-row { align-items: start; }
    .pierde { color: #b42318; font-weight: 700; }
    .paleta-cabeza, .paleta-cabeza h3 { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 0; }
    .paleta { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .paleta h3 { margin: 0 0 8px; }
    .tonos { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; }
    .tono { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 0.85rem; font-weight: 600; }
    .tono input { width: 2.8rem; height: 2rem; padding: 0; border: 0; background: transparent; }
    .aviso-foto { width: min(100%, 22rem); border-radius: 12px; }
    .muestra { display: grid; gap: 8px; padding: 0 0 14px; border-radius: 12px; overflow: hidden; border: 1px solid var(--color-border); }
    .muestra p { margin: 0; }
    .muestra > p:first-child { margin: 0; padding: 8px 14px; text-align: center; font-size: 12px; }
    .muestra strong, .muestra > p:nth-child(3), .muestra-btn, .muestra > span:last-child { margin-left: 14px; margin-right: 14px; }
    .muestra-btn { justify-self: start; padding: 8px 14px; border-radius: 999px; font-weight: 700; }
    @media (max-width: 720px) { .paleta, .tonos { grid-template-columns: 1fr; } }
  `,
})
export class GestorWebPageComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  guardando = false;
  sincronizando = false;
  cargandoProductos = false;
  empresaCargada = false;
  errorProductos = '';
  subiendoMedio = -1;
  subiendoAviso = false;
  readonly tonos = TONOS;
  diasOferta = 15;
  seccion = 'datos';
  readonly secciones = [
    { id: 'datos', label: 'Datos principales' },
    { id: 'portada', label: 'Portada y pie' },
    { id: 'reels', label: 'Reels' },
    { id: 'horario', label: 'Horario de atención' },
    { id: 'redes', label: 'Redes y contacto' },
    { id: 'legales', label: 'Textos legales' },
    { id: 'aviso', label: 'Aviso y color' },
    { id: 'ofertas', label: 'Ofertas y margen' },
  ];
  busqueda = '';
  filtroCategoria = '';
  filtroOferta = false;
  filtroDestacado = false;
  filtroCorte = false;
  filtroTipo = '';
  filtroMaterial = '';
  filtroPresentacion = '';
  filtroColor = '';
  filtroEspesor = '';
  ordenOferta: 'reciente' | 'nombre' | 'precio' | 'margen' = 'reciente';
  productosRecortados = false;
  propuestas: PropuestaEmpresa[] = [];
  productosOferta: ProductoOferta[] = [];
  private readonly porcentajes: Record<string, number> = {};
  private readonly descartados = new Set<string>();
  private readonly fraccionesAbiertas = new Set<string>();
  private readonly alcances: Record<string, AlcanceFraccion> = {};
  private readonly fraccionesMarcadas = new Set<string>();
  readonly materiales = this.fb.array([this.filaMaterial()]);
  readonly dias = this.fb.array(SEMANA.map((dia) => this.fb.nonNullable.group({
    dia: [dia.dia],
    etiqueta: [dia.etiqueta],
    abierto: [dia.abierto],
    desde: [dia.desde],
    hasta: [dia.hasta],
  })));
  readonly forma = this.fb.nonNullable.group({
    nombreComercial: ['', Validators.maxLength(150)],
    razonSocial: ['', Validators.maxLength(200)],
    ruc: ['', Validators.pattern(/^$|^\d{11}$/)],
    telefono: [''],
    email: ['', Validators.email],
    direccionFiscal: [''],
    ubigeo: ['', Validators.pattern(/^$|^\d{6}$/)],
    banner: ['', Validators.maxLength(180)],
    resumen: ['', Validators.maxLength(500)],
    correoSoporte: ['', Validators.email],
    facebook: [''],
    instagram: [''],
    linkedin: [''],
    youtube: [''],
    textoPrivacidad: [''],
    textoTerminos: [''],
    textoGarantia: [''],
    textoFaq: [''],
    heroKicker: ['', Validators.maxLength(80)],
    heroTitulo: ['', Validators.maxLength(180)],
    heroTexto: ['', Validators.maxLength(400)],
    materialesKicker: ['', Validators.maxLength(80)],
    materialesTitulo: ['', Validators.maxLength(180)],
    materialesTexto: ['', Validators.maxLength(400)],
    materiales: this.materiales,
    primaryColor: ['#0d47a1', Validators.required],
    secondaryColor: ['#ffffff', Validators.required],
    baseFontSize: [16, [Validators.required, Validators.min(14), Validators.max(22)]],
    themeMode: ['aether', Validators.required],
    aviso: ['', Validators.maxLength(180)],
    avisoActivo: [false],
    avisoImagen: ['', Validators.maxLength(300)],
    colores: this.fb.nonNullable.group({
      dia: grupoPaleta(this.fb, PALETA_SITIO.dia),
      noche: grupoPaleta(this.fb, PALETA_SITIO.noche),
    }),
  });

  ngOnInit(): void {
    this.cargarProductosOferta();
    this.http.get<CmsPublico>(`${environment.apiUrl}/api/v1/cms/settings`).subscribe({
      next: (paquete) => {
        const { materiales: lista, colores, avisoImagen, ...resto } = paquete;
        this.forma.patchValue({
          ...resto,
          primaryColor: this.colorHex(resto.primaryColor, PALETA_SITIO.dia.acento),
          secondaryColor: this.colorHex(resto.secondaryColor, PALETA_SITIO.dia.tarjeta),
          themeMode: resto.themeMode === 'claro' ? 'claro' : 'aether',
          baseFontSize: this.fuente(resto.baseFontSize),
          avisoImagen: avisoImagen ?? '',
          colores: this.paletaGuardada(colores),
        });
        this.materiales.clear();
        for (const item of lista ?? []) this.materiales.push(this.filaMaterial(item));
        if (!this.materiales.length) this.materiales.push(this.filaMaterial());
        for (const dia of paquete.dias ?? []) {
          const fila = this.dias.controls.find((control) => control.controls.dia.value === dia.dia);
          fila?.patchValue({
            abierto: dia.abierto,
            desde: dia.desde || '08:00',
            hasta: dia.hasta || '18:00',
          });
        }
      },
      error: (error: unknown) => this.toast.error(problemText(error)),
    });
    this.http.get<EmpresaSitio>(`${environment.apiUrl}/api/v1/cms/empresa`).subscribe({
      next: (empresa) => {
        this.aplicarEmpresa(empresa);
        this.empresaCargada = true;
      },
      error: (error: unknown) => this.toast.error(problemText(error)),
    });
  }

  usarDato(dato: PropuestaEmpresa): void {
    this.descartados.delete(dato.campo);
    this.forma.patchValue({ [dato.campo]: dato.nuevo });
    this.propuestas = this.propuestas.filter((item) => item.campo !== dato.campo);
    this.pintar();
  }

  dejarDato(dato: PropuestaEmpresa): void {
    this.descartados.add(dato.campo);
    this.propuestas = this.propuestas.filter((item) => item.campo !== dato.campo);
    this.pintar();
  }

  get vistaHoy(): string {
    const ahora = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Lima' }));
    const clave = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'][ahora.getDay()];
    const nombres: Record<string, string> = { LUNES: 'lunes', MARTES: 'martes', MIERCOLES: 'miércoles', JUEVES: 'jueves', VIERNES: 'viernes', SABADO: 'sábado', DOMINGO: 'domingo' };
    const fila = this.dias.getRawValue().find((dia) => dia.dia === clave);
    if (!fila?.abierto) return `Hoy, ${nombres[clave]}, no atendemos.`;
    const rango = `de ${this.hora(fila.desde)} a ${this.hora(fila.hasta)}`;
    const minutos = ahora.getHours() * 60 + ahora.getMinutes();
    const abre = this.minutos(fila.desde);
    const cierra = this.minutos(fila.hasta);
    if (minutos < abre) return this.frase(nombres[clave], 'atendemos', rango, 'Aún no abrimos.');
    if (minutos >= cierra) return this.frase(nombres[clave], 'atendimos', rango, 'Ya cerramos.');
    return this.frase(nombres[clave], 'atendemos', rango, 'Estamos abiertos.');
  }

  private frase(dia: string, verbo: string, rango: string, cierre: string): string {
    return `Hoy, ${dia}, ${verbo} ${rango}. ${cierre}`.replace('p. m..', 'p. m.').replace('a. m..', 'a. m.');
  }

  guardar(): void {
    if (!this.empresaCargada || this.guardando) return;
    if (this.forma.invalid) {
      this.forma.markAllAsTouched();
      this.toast.error('Revisa los campos del sitio antes de guardar.');
      return;
    }
    this.guardando = true;
    this.pintar();
    this.guardarCms(this.forma.getRawValue());
  }

  private aplicarEmpresa(empresa: EmpresaSitio): void {
    const sitio = empresa.sitio ?? {};
    this.forma.patchValue({
      nombreComercial: sitio.nombreComercial ?? '',
      razonSocial: sitio.razonSocial ?? '',
      ruc: sitio.ruc ?? '',
      telefono: sitio.telefono ?? '',
      email: sitio.email ?? '',
      direccionFiscal: sitio.direccionFiscal ?? '',
      ubigeo: sitio.ubigeo ?? '',
    });
    this.propuestas = empresa.propuestas ?? [];
    this.descartados.clear();
    this.empresaCargada = true;
    this.pintar();
  }

  private guardarCms(valor: ReturnType<GestorWebPageComponent['forma']['getRawValue']>): void {
    this.http.put<CmsPublico>(`${environment.apiUrl}/api/v1/cms/settings`, {
      primaryColor: this.colorHex(valor.colores.dia.acento, PALETA_SITIO.dia.acento),
      secondaryColor: this.colorHex(valor.colores.dia.tarjeta, PALETA_SITIO.dia.tarjeta),
      colores: valor.colores,
      baseFontSize: this.fuente(valor.baseFontSize),
      themeMode: valor.themeMode === 'claro' ? 'claro' : 'aether',
      banner: valor.banner,
      resumen: valor.resumen,
      horarioSemana: this.textoHorario(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES']),
      horarioSabado: this.textoHorario(['SABADO']),
      facebook: valor.facebook,
      instagram: valor.instagram,
      linkedin: valor.linkedin,
      youtube: valor.youtube,
      correoSoporte: valor.correoSoporte,
      textoPrivacidad: valor.textoPrivacidad,
      textoTerminos: valor.textoTerminos,
      textoGarantia: valor.textoGarantia,
      textoFaq: valor.textoFaq,
      heroKicker: valor.heroKicker,
      heroTitulo: valor.heroTitulo,
      heroTexto: valor.heroTexto,
      materialesKicker: valor.materialesKicker,
      materialesTitulo: valor.materialesTitulo,
      materialesTexto: valor.materialesTexto,
      materiales: this.materiales.getRawValue()
        .filter((item) => item.nombre.trim())
        .map((item) => ({ ...item, nombre: item.nombre.trim(), activo: item.activo })),
      nombreComercial: valor.nombreComercial,
      razonSocial: valor.razonSocial,
      ruc: valor.ruc,
      telefono: valor.telefono,
      email: valor.email,
      direccionFiscal: valor.direccionFiscal,
      ubigeo: valor.ubigeo,
      descartados: [...this.descartados],
    }).subscribe({
      next: () => {
        this.http.put(`${environment.apiUrl}/api/v1/cms/horario`, {
          mensaje: valor.aviso,
          activo: valor.avisoActivo && (valor.aviso.trim().length > 0 || valor.avisoImagen.trim().length > 0),
          avisoImagen: valor.avisoImagen,
          dias: this.dias.getRawValue().map((dia) => ({ dia: dia.dia, abierto: dia.abierto, desde: dia.desde, hasta: dia.hasta })),
        }).subscribe({
          next: () => {
            this.http.get<EmpresaSitio>(`${environment.apiUrl}/api/v1/cms/empresa`).subscribe({
              next: (empresa) => {
                this.propuestas = empresa.propuestas ?? [];
                this.descartados.clear();
                this.guardando = false;
                this.toast.success('Sitio guardado. La configuración global sigue igual.');
                this.pintar();
              },
              error: () => {
                this.guardando = false;
                this.descartados.clear();
                this.toast.success('Sitio guardado. La configuración global sigue igual.');
                this.pintar();
              },
            });
          },
          error: (error: unknown) => {
            this.guardando = false;
            this.toast.error(problemText(error));
            this.pintar();
          },
        });
      },
      error: (error: unknown) => {
        this.guardando = false;
        this.toast.error(problemText(error));
        this.pintar();
      },
    });
  }

  cargarProductosOferta(): void {
    this.cargandoProductos = true;
    this.errorProductos = '';
    this.pintar();
    this.http.get<{ content?: ProductoOferta[]; totalElements?: number }>(`${environment.apiUrl}/api/v1/productos`, {
      params: { activo: 'true', size: '1000', page: '0' },
    }).subscribe({
      next: (pagina) => {
        const lista = pagina.content ?? [];
        this.productosRecortados = (pagina.totalElements ?? lista.length) > lista.length;
        this.aplicarProductos(lista);
      },
      error: (error: unknown) => this.falloProductos(error),
    });
  }

  private aplicarProductos(lista: ProductoOferta[]): void {
    this.productosOferta = lista;
    for (const producto of lista) {
      if (producto.ofertaPorcentaje != null) this.porcentajes[producto.id] = Number(producto.ofertaPorcentaje);
      this.prepararFracciones(producto);
    }
    this.cargandoProductos = false;
    this.pintar();
  }

  private falloProductos(error: unknown): void {
    this.cargandoProductos = false;
    this.errorProductos = problemText(error);
    this.toast.error(this.errorProductos);
    this.pintar();
  }

  private pintar(): void {
    this.cdr.detectChanges();
  }

  categoriasOferta(): { id: string; nombre: string }[] {
    const mapa = new Map<string, string>();
    for (const producto of this.productosOferta) {
      const id = producto.categoria?.id;
      const nombre = producto.categoria?.nombre;
      if (id && nombre) mapa.set(id, nombre);
    }
    return [...mapa.entries()]
      .map(([id, nombre]) => ({ id, nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  }

  opcionesTipo(): string[] {
    return unicos(this.productosOferta.map(tipoDe));
  }

  opcionesMaterial(): string[] {
    return unicos(this.productosOferta.map(materialDe));
  }

  opcionesPresentacion(): string[] {
    return unicos(this.productosOferta.map(presentacionDe));
  }

  opcionesColor(): string[] {
    return unicos(this.productosOferta.map(colorDe));
  }

  opcionesEspesor(): string[] {
    return [...new Set(this.productosOferta.map(espesorDe).filter(Boolean))].sort((a, b) => Number(a) - Number(b));
  }

  hayDestacados(): boolean {
    return this.productosOferta.some((producto) => producto.destacado);
  }

  hayCortes(): boolean {
    return this.productosOferta.some((producto) => producto.esFraccionable);
  }

  hayFiltroOferta(): boolean {
    return Boolean(
      this.busqueda.trim()
      || this.filtroCategoria
      || this.filtroOferta
      || this.filtroDestacado
      || this.filtroCorte
      || this.filtroTipo
      || this.filtroMaterial
      || this.filtroPresentacion
      || this.filtroColor
      || this.filtroEspesor
      || this.ordenOferta !== 'reciente',
    );
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroCategoria = '';
    this.filtroOferta = false;
    this.filtroDestacado = false;
    this.filtroCorte = false;
    this.filtroTipo = '';
    this.filtroMaterial = '';
    this.filtroPresentacion = '';
    this.filtroColor = '';
    this.filtroEspesor = '';
    this.ordenOferta = 'reciente';
  }

  productosVisibles(): ProductoOferta[] {
    const lista = this.productosOferta.filter((producto) => {
      const texto = `${producto.nombre} ${producto.codigoSku ?? ''} ${producto.descripcion ?? ''} ${producto.categoria?.nombre ?? ''}`;
      if (!coincideBusqueda(texto, this.busqueda)) return false;
      if (this.filtroCategoria && producto.categoria?.id !== this.filtroCategoria) return false;
      if (this.filtroOferta && !producto.oferta) return false;
      if (this.filtroDestacado && !producto.destacado) return false;
      if (this.filtroCorte && !producto.esFraccionable) return false;
      if (this.filtroTipo && tipoDe(producto) !== this.filtroTipo) return false;
      if (this.filtroMaterial && materialDe(producto) !== this.filtroMaterial) return false;
      if (this.filtroPresentacion && presentacionDe(producto) !== this.filtroPresentacion) return false;
      if (this.filtroColor && colorDe(producto) !== this.filtroColor) return false;
      if (this.filtroEspesor && espesorDe(producto) !== this.filtroEspesor) return false;
      return true;
    });
    const ordenados = [...lista];
    if (this.ordenOferta === 'precio') ordenados.sort((a, b) => Number(a.precioVentaBase ?? 0) - Number(b.precioVentaBase ?? 0));
    else if (this.ordenOferta === 'margen') ordenados.sort((a, b) => this.gananciaDe(b) - this.gananciaDe(a));
    else if (this.ordenOferta === 'nombre') ordenados.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    else ordenados.sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')));
    return ordenados;
  }

  porcentajeDe(producto: ProductoOferta): number {
    return this.porcentajes[producto.id] ?? 0;
  }

  fijarPorcentaje(id: string, valor: string): void {
    const numero = Number(valor);
    this.porcentajes[id] = Number.isFinite(numero) ? Math.min(99.99, Math.max(0, numero)) : 0;
    this.pintar();
  }

  fraccionesDe(producto: ProductoOferta): FraccionOferta[] {
    return (producto.fracciones ?? []).filter((fraccion) => fraccion.activo !== false && fraccion.id);
  }

  abierto(id: string): boolean {
    return this.fraccionesAbiertas.has(id);
  }

  alternarFracciones(id: string): void {
    if (this.fraccionesAbiertas.has(id)) this.fraccionesAbiertas.delete(id);
    else this.fraccionesAbiertas.add(id);
    this.pintar();
  }

  alcanceDe(producto: ProductoOferta): AlcanceFraccion {
    return this.alcances[producto.id] ?? 'TODAS';
  }

  fijarAlcance(producto: ProductoOferta, alcance: AlcanceFraccion): void {
    this.alcances[producto.id] = alcance;
    const fracciones = this.fraccionesDe(producto);
    for (const fraccion of fracciones) {
      const clave = this.claveFraccion(producto.id, fraccion.id);
      if (alcance === 'TODAS') this.fraccionesMarcadas.add(clave);
      if (alcance === 'NINGUNA') this.fraccionesMarcadas.delete(clave);
    }
    if (alcance === 'ALGUNAS' && !fracciones.some((fraccion) => this.fraccionesMarcadas.has(this.claveFraccion(producto.id, fraccion.id)))) {
      const primera = fracciones[0];
      if (primera) this.fraccionesMarcadas.add(this.claveFraccion(producto.id, primera.id));
    }
    this.pintar();
  }

  fraccionMarcada(producto: ProductoOferta, fraccion: FraccionOferta): boolean {
    const alcance = this.alcanceDe(producto);
    if (alcance === 'TODAS') return true;
    if (alcance === 'NINGUNA') return false;
    return this.fraccionesMarcadas.has(this.claveFraccion(producto.id, fraccion.id));
  }

  marcarFraccion(producto: ProductoOferta, fraccion: FraccionOferta, marcada: boolean): void {
    this.alcances[producto.id] = 'ALGUNAS';
    const clave = this.claveFraccion(producto.id, fraccion.id);
    if (marcada) this.fraccionesMarcadas.add(clave);
    else this.fraccionesMarcadas.delete(clave);
    this.pintar();
  }

  precioFraccion(producto: ProductoOferta, fraccion: FraccionOferta): number {
    const lista = Number(fraccion.precioVenta ?? 0);
    if (!this.fraccionMarcada(producto, fraccion)) return lista;
    return Math.round(lista * (1 - this.porcentajeDe(producto) / 100) * 100) / 100;
  }

  gananciaFraccion(producto: ProductoOferta, fraccion: FraccionOferta): number {
    const factor = Number(fraccion.factorDescuentoKardex ?? 1);
    const costo = Number(producto.precioCompra ?? 0) * factor;
    return Math.round((this.precioFraccion(producto, fraccion) - costo) * 100) / 100;
  }

  precioOfertaDe(producto: ProductoOferta): number {
    const venta = Number(producto.precioVentaBase ?? 0);
    return Math.round(venta * (1 - this.porcentajeDe(producto) / 100) * 100) / 100;
  }

  gananciaDe(producto: ProductoOferta): number {
    return Math.round((this.precioOfertaDe(producto) - Number(producto.precioCompra ?? 0)) * 100) / 100;
  }

  soles(valor?: number | null): string {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(Number(valor ?? 0));
  }

  publicarOferta(producto: ProductoOferta): void {
    const porcentaje = this.porcentajeDe(producto);
    if (porcentaje <= 0) {
      this.toast.error('Indica un porcentaje mayor a cero.');
      return;
    }
    if (this.gananciaDe(producto) <= 0) {
      this.toast.error('Con ese descuento la ganancia queda en cero o negativa.');
      return;
    }
    const fracciones = this.fraccionesDe(producto);
    const alcance = fracciones.length ? this.alcanceDe(producto) : 'NINGUNA';
    if (alcance === 'ALGUNAS' && !fracciones.some((fraccion) => this.fraccionMarcada(producto, fraccion))) {
      this.toast.error('Marca al menos una fracción o elige Todas o Ninguna.');
      return;
    }
    const perdida = fracciones.find((fraccion) => this.fraccionMarcada(producto, fraccion) && this.gananciaFraccion(producto, fraccion) <= 0);
    if (perdida) {
      this.toast.error(`${perdida.nombreFraccion || 'Una fracción'} quedaría sin ganancia.`);
      return;
    }
    this.http.put(`${environment.apiUrl}/api/v1/cms/productos/${producto.id}/oferta`, {
      oferta: true,
      porcentaje,
      dias: Math.min(365, Math.max(1, this.diasOferta || 15)),
      alcanceFracciones: alcance,
      fraccionIds: alcance === 'ALGUNAS' ? fracciones.filter((fraccion) => this.fraccionMarcada(producto, fraccion)).map((fraccion) => fraccion.id) : [],
    }).subscribe({
      next: () => {
        producto.oferta = true;
        producto.ofertaPorcentaje = porcentaje;
        producto.precioOferta = this.precioOfertaDe(producto);
        this.recordarFracciones(producto);
        this.toast.success(`${producto.nombre} queda en oferta. Ganancia ${this.soles(this.gananciaDe(producto))}.`);
        this.pintar();
      },
      error: (error: unknown) => this.toast.error(problemText(error)),
    });
  }

  quitarOferta(producto: ProductoOferta): void {
    this.http.put(`${environment.apiUrl}/api/v1/cms/productos/${producto.id}/oferta`, { oferta: false }).subscribe({
      next: () => {
        producto.oferta = false;
        producto.ofertaPorcentaje = null;
        producto.precioOferta = null;
        this.porcentajes[producto.id] = 0;
        this.fijarAlcance(producto, 'NINGUNA');
        this.toast.success('Oferta retirada. El precio vuelve al de venta.');
        this.pintar();
      },
      error: (error: unknown) => this.toast.error(problemText(error)),
    });
  }

  sincronizar(): void {
    this.sincronizando = true;
    this.http.post<{ marcados: number }>(`${environment.apiUrl}/api/v1/cms/ofertas/sincronizar`, {}).subscribe({
      next: (respuesta) => {
        this.sincronizando = false;
        this.toast.success(`Ofertas actualizadas. Productos sin rotación: ${respuesta.marcados}.`);
      },
      error: (error: unknown) => {
        this.sincronizando = false;
        this.toast.error(problemText(error));
      },
    });
  }

  private paletaGuardada(colores: ColoresSitio | null | undefined): ColoresSitio {
    return {
      dia: this.tonoGuardado(colores?.dia, PALETA_SITIO.dia),
      noche: this.tonoGuardado(colores?.noche, PALETA_SITIO.noche),
    };
  }

  private tonoGuardado(valor: Partial<PaletaColor> | undefined, respaldo: PaletaColor): PaletaColor {
    const salida = { ...respaldo };
    (Object.keys(respaldo) as Array<keyof PaletaColor>).forEach((clave) => {
      const color = valor?.[clave];
      salida[clave] = color && /^#[0-9A-Fa-f]{6}$/.test(color) ? color.toLowerCase() : respaldo[clave];
    });
    return salida;
  }

  colorDe(modo: 'dia' | 'noche', tono: keyof PaletaColor): string {
    return this.forma.controls.colores.controls[modo].controls[tono].value;
  }

  tinta(hex: string): string {
    const limpio = hex.replace('#', '');
    if (limpio.length !== 6) return '#ffffff';
    const r = parseInt(limpio.slice(0, 2), 16);
    const g = parseInt(limpio.slice(2, 4), 16);
    const b = parseInt(limpio.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 160 ? '#050505' : '#ffffff';
  }

  medio(ruta: string): string {
    if (!ruta) return '';
    if (ruta.startsWith('http://') || ruta.startsWith('https://')) return ruta;
    return `${environment.apiUrl}${ruta}`;
  }

  restablecerColores(): void {
    this.forma.controls.colores.setValue(PALETA_SITIO);
    this.toast.success('Colores de fábrica listos. Pulsa Guardar sitio para publicarlos.');
  }

  subirAviso(evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    const archivo = entrada.files?.[0];
    entrada.value = '';
    if (!archivo) return;
    const datos = new FormData();
    datos.append('archivo', archivo);
    this.subiendoAviso = true;
    this.http.post<{ ruta: string }>(`${environment.apiUrl}/api/v1/cms/medios`, datos).subscribe({
      next: (respuesta) => {
        this.forma.controls.avisoImagen.setValue(respuesta.ruta);
        this.subiendoAviso = false;
        this.toast.success('Foto lista. Guarda el sitio y publica el aviso.');
        this.pintar();
      },
      error: (error: unknown) => {
        this.subiendoAviso = false;
        this.toast.error(problemText(error));
        this.pintar();
      },
    });
  }

  subirMedio(indice: number, campo: 'imagenUrl' | 'videoUrl', evento: Event): void {
    const entrada = evento.target as HTMLInputElement;
    const archivo = entrada.files?.[0];
    entrada.value = '';
    if (!archivo) return;
    const datos = new FormData();
    datos.append('archivo', archivo);
    this.subiendoMedio = indice;
    this.http.post<{ ruta: string }>(`${environment.apiUrl}/api/v1/cms/medios`, datos).subscribe({
      next: (respuesta) => {
        this.materiales.at(indice).patchValue({ [campo]: respuesta.ruta });
        this.subiendoMedio = -1;
        this.toast.success(campo === 'videoUrl' ? 'Video listo. Guarda el sitio para publicarlo.' : 'Imagen lista. Guarda el sitio para publicarla.');
      },
      error: (error: unknown) => {
        this.subiendoMedio = -1;
        this.toast.error(problemText(error));
      },
    });
  }

  agregarMaterial(): void {
    if (this.materiales.length >= 24) {
      this.toast.error('Puedes publicar hasta 24 piezas.');
      return;
    }
    this.materiales.push(this.filaMaterial());
  }

  quitarMaterial(indice: number): void {
    this.materiales.removeAt(indice);
    if (!this.materiales.length) this.materiales.push(this.filaMaterial());
  }

  private filaMaterial(item?: MaterialCms) {
    return this.fb.nonNullable.group({
      id: [item?.id ?? ''],
      nombre: [item?.nombre ?? '', Validators.maxLength(80)],
      resumen: [item?.resumen ?? '', Validators.maxLength(240)],
      imagenUrl: [item?.imagenUrl ?? '', Validators.maxLength(300)],
      videoUrl: [item?.videoUrl ?? '', Validators.maxLength(300)],
      activo: [item?.activo !== false],
    });
  }

  private prepararFracciones(producto: ProductoOferta): void {
    const fracciones = this.fraccionesDe(producto);
    const incluidas = fracciones.filter((fraccion) => fraccion.enOferta === true);
    const excluidas = fracciones.filter((fraccion) => fraccion.enOferta === false);
    if (incluidas.length && excluidas.length) this.alcances[producto.id] = 'ALGUNAS';
    else if (fracciones.length && excluidas.length === fracciones.length) this.alcances[producto.id] = 'NINGUNA';
    else this.alcances[producto.id] = 'TODAS';
    for (const fraccion of fracciones) {
      const clave = this.claveFraccion(producto.id, fraccion.id);
      if (fraccion.enOferta === true || (fraccion.enOferta == null && this.alcances[producto.id] === 'TODAS')) this.fraccionesMarcadas.add(clave);
      else this.fraccionesMarcadas.delete(clave);
    }
  }

  private recordarFracciones(producto: ProductoOferta): void {
    const alcance = this.alcanceDe(producto);
    for (const fraccion of this.fraccionesDe(producto)) {
      const marcada = this.fraccionMarcada(producto, fraccion);
      fraccion.enOferta = alcance === 'NINGUNA' ? false : marcada;
      fraccion.ofertaPorcentaje = marcada ? this.porcentajeDe(producto) : null;
      fraccion.precioOferta = marcada ? this.precioFraccion(producto, fraccion) : null;
    }
  }

  private claveFraccion(productoId: string, fraccionId: string): string {
    return `${productoId}:${fraccionId}`;
  }

  private colorHex(valor: string | null | undefined, respaldo: string): string {
    const limpio = (valor ?? '').trim();
    const conNumero = limpio.startsWith('#') ? limpio : `#${limpio}`;
    return /^#[0-9A-Fa-f]{6}$/.test(conNumero) ? conNumero.toUpperCase() : respaldo;
  }

  private fuente(valor: number | null | undefined): number {
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return 16;
    return Math.min(22, Math.max(14, Math.round(numero)));
  }

  private textoHorario(claves: string[]): string {
    const partes = this.dias.getRawValue()
      .filter((dia) => claves.includes(dia.dia))
      .map((dia) => dia.abierto ? `${dia.desde} a ${dia.hasta}` : 'Cerrado');
    if (!partes.length) return '';
    return (partes.every((parte) => parte === partes[0]) ? partes[0] : partes.join(' · ')).slice(0, 80);
  }

  private minutos(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  private hora(valor: string): string {
    const [h, m] = valor.split(':').map(Number);
    const sufijo = h < 12 ? 'a. m.' : 'p. m.';
    const doce = h % 12 || 12;
    return `${doce}:${String(m).padStart(2, '0')} ${sufijo}`;
  }
}

export const GESTOR_WEB_ROUTES: Routes = [
  { path: '', component: GestorWebPageComponent, canActivate: [RoleGuard], title: 'Sitio web', data: { section: 'Configuración', breadcrumb: 'Sitio web', expectedRoles: ['ROLE_ADMIN'] } },
];
