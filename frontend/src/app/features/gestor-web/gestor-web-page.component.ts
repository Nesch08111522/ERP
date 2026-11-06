import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ToastService } from '../../shared/services/toast.service';
import { problemText } from '../../shared/utils/feedback';

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

interface CmsPublico {
  primaryColor: string;
  secondaryColor: string;
  baseFontSize: number;
  themeMode: string;
  aviso: string;
  avisoActivo: boolean;
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

interface ProductoOferta {
  id: string;
  nombre: string;
  precioCompra?: number | null;
  precioVentaBase?: number | null;
  precioOferta?: number | null;
  ofertaPorcentaje?: number | null;
  oferta?: boolean;
}

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
        <div class="acordeon">
          <details open>
            <summary>Datos principales</summary>
            <div class="acordeon-cuerpo form-grid">
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
          </details>

          <details>
            <summary>Portada y pie</summary>
            <div class="acordeon-cuerpo form-grid">
              <label class="field">Antetítulo <input class="input" type="text" maxlength="80" formControlName="heroKicker" /></label>
              <label class="field">Título <input class="input" type="text" maxlength="180" formControlName="heroTitulo" /></label>
              <label class="field span-2">Texto de la portada <textarea class="textarea" rows="3" maxlength="400" formControlName="heroTexto"></textarea></label>
              <label class="field span-2">Franja superior <input class="input" type="text" maxlength="180" formControlName="banner" /></label>
              <label class="field span-2">Texto del pie <textarea class="textarea" rows="3" maxlength="500" formControlName="resumen"></textarea></label>
            </div>
          </details>

          <details open>
            <summary>Reels del sitio</summary>
            <div class="acordeon-cuerpo">
              <p class="nota">Cada pieza entra sola al carrusel de la portada. Sube un video para que el cliente lo abra con sonido, o solo una imagen si es un póster o una oferta. La foto, si la hay, es la portada de la tarjeta. También vale una ruta del sitio, como /videos/espesor.mp4.</p>
              <div class="form-grid">
                <label class="field">Antetítulo <input class="input" type="text" maxlength="80" formControlName="materialesKicker" /></label>
                <label class="field">Título <input class="input" type="text" maxlength="180" formControlName="materialesTitulo" /></label>
                <label class="field span-2">Introducción <textarea class="textarea" rows="3" maxlength="400" formControlName="materialesTexto"></textarea></label>
              </div>
              <div formArrayName="materiales">
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
          </details>

          <details open>
            <summary>Horario de atención</summary>
            <div class="acordeon-cuerpo">
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
          </details>

          <details>
            <summary>Redes y contacto</summary>
            <div class="acordeon-cuerpo form-grid">
              <label class="field span-2">Correo de soporte <input class="input" type="email" formControlName="correoSoporte" /></label>
              <label class="field">Facebook <input class="input" type="url" formControlName="facebook" /></label>
              <label class="field">Instagram <input class="input" type="url" formControlName="instagram" /></label>
              <label class="field">LinkedIn <input class="input" type="url" formControlName="linkedin" /></label>
              <label class="field">YouTube <input class="input" type="url" formControlName="youtube" /></label>
            </div>
          </details>

          <details>
            <summary>Textos legales</summary>
            <div class="acordeon-cuerpo">
              <p class="nota">Si los dejas vacíos, el sitio usa el texto explicado de fábrica.</p>
              <label class="field">Privacidad <textarea class="textarea" rows="4" formControlName="textoPrivacidad"></textarea></label>
              <label class="field">Términos <textarea class="textarea" rows="4" formControlName="textoTerminos"></textarea></label>
              <label class="field">Garantía <textarea class="textarea" rows="3" formControlName="textoGarantia"></textarea></label>
              <label class="field">Preguntas frecuentes <textarea class="textarea" rows="4" formControlName="textoFaq"></textarea></label>
            </div>
          </details>

          <details>
            <summary>Aviso, color y vista previa</summary>
            <div class="acordeon-cuerpo form-grid">
              <label class="field span-2">Aviso en la portada <input class="input" type="text" maxlength="180" formControlName="aviso" /></label>
              <label class="check-row span-2"><input class="checkbox" type="checkbox" formControlName="avisoActivo" /> Mostrar el aviso</label>
              <label class="field">Color primario <input class="input-color" type="color" formControlName="primaryColor" /></label>
              <aside class="preview span-2">
                <p class="franja">{{ forma.controls.banner.value || 'Franja del sitio' }}</p>
                <strong>{{ forma.controls.heroTitulo.value || forma.controls.nombreComercial.value || 'POLICALUM' }}</strong>
                <p>{{ forma.controls.heroTexto.value }}</p>
                <p>{{ forma.controls.resumen.value }}</p>
                <p>{{ forma.controls.telefono.value }} · {{ forma.controls.email.value }}</p>
                <p>RUC {{ forma.controls.ruc.value }}</p>
                <p>{{ vistaHoy }}</p>
              </aside>
            </div>
          </details>
        </div>
        <div class="actions">
          <button type="submit" class="btn btn-primary" [disabled]="guardando || !empresaCargada">Guardar sitio</button>
          <button type="button" class="btn btn-outline" (click)="sincronizar()" [disabled]="sincronizando">Marcar ofertas de 90 días</button>
        </div>
      </form>
    </section>
    <section class="card ofertas-margen">
      <h2>Ofertas y margen</h2>
      <p class="nota">El porcentaje baja el precio de venta. La ganancia que ves es el precio de oferta menos el precio de compra. Si compraste a S/ 10 y vendes a S/ 20, un 10% deja la venta en S/ 18 y la ganancia en S/ 8. El costo no sale al sitio público.</p>
      <label class="field corto">Días de vigencia
        <input class="input" type="number" min="1" max="365" [value]="diasOferta" (input)="diasOferta = +$any($event.target).value || 15" />
      </label>
      @if (cargandoProductos) { <p class="nota">Cargando productos…</p> }
      @if (errorProductos) {
        <p class="pierde">{{ errorProductos }}</p>
        <button type="button" class="btn btn-outline" (click)="cargarProductosOferta()">Reintentar</button>
      }
      @if (!cargandoProductos && !errorProductos && !productosOferta.length) {
        <p class="nota">No hay productos activos para publicar en oferta.</p>
      }
      <div class="tabla-ofertas">
        @for (producto of productosOferta; track producto.id) {
          <article>
            <strong>{{ producto.nombre }} @if (producto.oferta) { <em>En oferta</em> }</strong>
            <span>Compra {{ soles(producto.precioCompra) }}</span>
            <span>Venta {{ soles(producto.precioVentaBase) }}</span>
            <label>% descuento
              <input class="input" type="number" min="0" max="99.99" step="0.01" [value]="porcentajeDe(producto)" (input)="fijarPorcentaje(producto.id, $any($event.target).value)" />
            </label>
            <span>Precio oferta {{ soles(precioOfertaDe(producto)) }}</span>
            <span [class.pierde]="gananciaDe(producto) <= 0">Ganancia {{ soles(gananciaDe(producto)) }}</span>
            <button type="button" class="btn btn-primary" (click)="publicarOferta(producto)">Publicar</button>
            <button type="button" class="btn btn-outline" (click)="quitarOferta(producto)" [disabled]="!producto.oferta">Quitar</button>
          </article>
        }
      </div>
    </section>
  `,
  styles: `
    form { display: grid; gap: 12px; }
    .field { display: grid; gap: 6px; color: var(--color-text); font-size: var(--text-sm); font-weight: 600; }
    .nota { margin: 0; color: var(--color-text-muted); font-size: 0.9rem; }
    .input-color { width: 4.5rem; height: 2.25rem; padding: 0; border: 0; background: transparent; }
    .preview { border-radius: 12px; padding: 16px; background: var(--color-bg-subtle); color: var(--color-text); border: 1px solid var(--color-border); display: grid; gap: 6px; }
    .franja { margin: 0; text-align: center; color: var(--color-primary); font-size: 12px; }
    .actions { display: flex; flex-wrap: wrap; gap: 8px; }
    .propuestas { display: grid; gap: 10px; padding: 12px; border: 1px solid var(--color-primary); border-radius: 12px; background: var(--color-bg-subtle); }
    .propuestas article { display: grid; gap: 4px; padding: 10px; border-radius: 10px; background: var(--color-surface); }
    .propuestas p { margin: 0; }
    .material-fila { display: grid; gap: 8px; margin: 12px 0; padding: 12px; border: 1px solid var(--color-border); border-radius: 12px; background: var(--color-surface); }
    .ofertas-margen { display: grid; gap: 12px; margin-top: 16px; }
    .corto { max-width: 10rem; }
    .tabla-ofertas { display: grid; gap: 8px; }
    .tabla-ofertas article { display: grid; grid-template-columns: minmax(12rem, 1.6fr) repeat(4, minmax(8rem, 1fr)) auto auto; gap: 8px; align-items: center; padding: 10px; border: 1px solid var(--color-border); border-radius: 12px; }
    .tabla-ofertas em { font-style: normal; color: var(--color-primary); font-size: 0.8rem; }
    .pierde { color: #b42318; font-weight: 700; }
    @media (max-width: 980px) { .tabla-ofertas article { grid-template-columns: 1fr 1fr; } }
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
  diasOferta = 15;
  propuestas: PropuestaEmpresa[] = [];
  productosOferta: ProductoOferta[] = [];
  private readonly porcentajes: Record<string, number> = {};
  private readonly descartados = new Set<string>();
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
    primaryColor: ['#1FA2D6', Validators.required],
    secondaryColor: ['#FFFFFF', Validators.required],
    baseFontSize: [16, [Validators.required, Validators.min(14), Validators.max(22)]],
    themeMode: ['aether', Validators.required],
    aviso: ['', Validators.maxLength(180)],
    avisoActivo: [false],
  });

  ngOnInit(): void {
    this.cargarProductosOferta();
    this.http.get<CmsPublico>(`${environment.apiUrl}/api/v1/cms/settings`).subscribe({
      next: (paquete) => {
        const { materiales: lista, ...resto } = paquete;
        this.forma.patchValue({
          ...resto,
          primaryColor: this.colorHex(resto.primaryColor, '#1FA2D6'),
          secondaryColor: this.colorHex(resto.secondaryColor, '#FFFFFF'),
          themeMode: resto.themeMode === 'claro' ? 'claro' : 'aether',
          baseFontSize: this.fuente(resto.baseFontSize),
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
      primaryColor: this.colorHex(valor.primaryColor, '#1FA2D6'),
      secondaryColor: this.colorHex(valor.secondaryColor, '#FFFFFF'),
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
          activo: valor.avisoActivo && valor.aviso.trim().length > 0,
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
    this.http.get<{ content?: ProductoOferta[] }>(`${environment.apiUrl}/api/v1/productos`, {
      params: { activo: 'true', size: '200', page: '0' },
    }).subscribe({
      next: (pagina) => this.aplicarProductos(pagina.content ?? []),
      error: (error: unknown) => this.falloProductos(error),
    });
  }

  private aplicarProductos(lista: ProductoOferta[]): void {
    this.productosOferta = lista;
    for (const producto of lista) {
      if (producto.ofertaPorcentaje != null) this.porcentajes[producto.id] = Number(producto.ofertaPorcentaje);
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

  porcentajeDe(producto: ProductoOferta): number {
    return this.porcentajes[producto.id] ?? 0;
  }

  fijarPorcentaje(id: string, valor: string): void {
    const numero = Number(valor);
    this.porcentajes[id] = Number.isFinite(numero) ? Math.min(99.99, Math.max(0, numero)) : 0;
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
    this.http.put(`${environment.apiUrl}/api/v1/cms/productos/${producto.id}/oferta`, {
      oferta: true,
      porcentaje,
      dias: Math.min(365, Math.max(1, this.diasOferta || 15)),
    }).subscribe({
      next: () => {
        producto.oferta = true;
        producto.ofertaPorcentaje = porcentaje;
        producto.precioOferta = this.precioOfertaDe(producto);
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
