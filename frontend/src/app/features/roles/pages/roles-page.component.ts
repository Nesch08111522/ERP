import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Routes } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import * as Api from '../../../core/api/openapi.types';
import { RoleGuard } from '../../../guards/role.guard';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { LookupService } from '../../../shared/services/lookup.service';
import { ToastService } from '../../../shared/services/toast.service';
import { applyServerErrors, problemText } from '../../../shared/utils/feedback';
import { ignoreStale, PageState } from '../../../shared/utils/page-state';
import { RolesApiService } from '../data-access/roles.api';

interface AccionCatalogo {
  id: string;
  label: string;
}

interface ModuloCatalogo {
  id: string;
  label: string;
  acciones: AccionCatalogo[];
}

interface AccionEditor {
  id: string;
  label: string;
  activo: boolean;
  forma: 'bool' | 'mapa';
}

interface GrupoEditor {
  id: string;
  label: string;
  venia: boolean;
  acciones: AccionEditor[];
}

interface GrupoVisible {
  label: string;
  acciones: string[];
}

const MODULOS: Record<string, string> = {
  sedes: 'Sedes',
  finanzas: 'Finanzas',
  usuarios: 'Usuarios',
  rrhh: 'Recursos Humanos',
  asistencia: 'Asistencia',
  ventas: 'Ventas',
  cotizaciones: 'Cotizaciones',
  preformas: 'Preformas',
  devoluciones: 'Devoluciones y reembolsos',
  mensajes_web: 'Mensajes del sitio web',
  notificaciones: 'Notificaciones',
  sitio_web: 'Sitio web y portafolio',
  despachos: 'Despachos',
  movilidades: 'Movilidades',
  caja: 'Caja',
  productos: 'Productos',
  servicios: 'Servicios',
  categorias: 'Categorías',
  fracciones: 'Fracciones',
  almacenes: 'Almacenes',
  inventario: 'Inventario',
  clientes: 'Clientes',
  proveedores: 'Proveedores',
  compras: 'Compras',
};

const ACCIONES: Record<string, string> = {
  crear: 'Crear',
  leer: 'Consultar',
  eliminar: 'Eliminar',
  editar: 'Editar',
  ajustar: 'Ajustar stock',
  transferir: 'Transferir entre almacenes',
  recibir: 'Recibir',
  anular: 'Anular',
  abrir: 'Abrir caja',
  cerrar: 'Cerrar caja',
  registrar_movimiento: 'Registrar movimiento',
  ver_reportes: 'Ver reportes',
  aprobar_pagos: 'Aprobar pagos',
  marcar: 'Marcar ingreso y salida',
  ver_mis_marcaciones: 'Ver sus marcaciones',
  lectura: 'Lectura',
  ver_legajos: 'Ver legajos',
  gestionar_legajos: 'Gestionar legajos y documentos',
  convertir: 'Convertir en venta',
  confirmar: 'Confirmar y convertir en venta',
  cancelar: 'Cancelar',
  aprobar: 'Aprobar devolución',
  rechazar: 'Rechazar devolución',
  procesar_reembolso: 'Procesar reembolso',
  responder: 'Responder',
  gestionar: 'Gestionar',
  configurar: 'Configurar',
  gestionar_catalogo: 'Gestionar catálogo web',
  gestionar_portafolio: 'Gestionar portafolio',
  asignar: 'Asignar repartidor',
  cambiar_estado: 'Cambiar estado',
  registrar_entrega: 'Registrar entrega',
  asignar_conductor: 'Asignar conductor',
};

const CATALOGO: ModuloCatalogo[] = [
  {
    id: 'sedes',
    label: 'Sedes',
    acciones: [
      { id: 'leer', label: 'Consultar sedes' },
      { id: 'crear', label: 'Crear sedes' },
      { id: 'editar', label: 'Editar sedes' },
      { id: 'eliminar', label: 'Eliminar sedes' },
    ],
  },
  {
    id: 'finanzas',
    label: 'Finanzas',
    acciones: [
      { id: 'ver_reportes', label: 'Ver reportes' },
      { id: 'aprobar_pagos', label: 'Aprobar pagos' },
    ],
  },
  {
    id: 'usuarios',
    label: 'Usuarios',
    acciones: [
      { id: 'leer', label: 'Consultar usuarios' },
      { id: 'crear', label: 'Crear y editar usuarios' },
      { id: 'eliminar', label: 'Eliminar usuarios' },
    ],
  },
  {
    id: 'rrhh',
    label: 'Recursos Humanos',
    acciones: [
      { id: 'ver_legajos', label: 'Consultar legajos' },
      { id: 'gestionar_legajos', label: 'Crear, editar y gestionar documentos' },
      { id: 'ver_nominas', label: 'Consultar nóminas y comisiones' },
      { id: 'gestionar_nominas', label: 'Generar, aprobar y pagar nóminas' },
      { id: 'ver_turnos', label: 'Consultar turnos de trabajo' },
      { id: 'gestionar_turnos', label: 'Crear y administrar turnos' },
      { id: 'ver_mi_rrhh', label: 'Consultar información personal de RR. HH.' },
    ],
  },
  {
    id: 'asistencia',
    label: 'Asistencia',
    acciones: [
      { id: 'marcar', label: 'Marcar ingreso y salida' },
      { id: 'ver_mis_marcaciones', label: 'Ver sus marcaciones' },
      { id: 'editar', label: 'Editar marcaciones' },
      { id: 'eliminar', label: 'Eliminar marcaciones' },
    ],
  },
  {
    id: 'productos',
    label: 'Productos',
    acciones: [
      { id: 'leer', label: 'Consultar productos' },
      { id: 'crear', label: 'Crear e importar productos' },
      { id: 'editar', label: 'Editar productos e imágenes' },
      { id: 'eliminar', label: 'Eliminar productos' },
    ],
  },
  {
    id: 'servicios',
    label: 'Servicios',
    acciones: [
      { id: 'leer', label: 'Consultar servicios' },
      { id: 'crear', label: 'Crear servicios' },
      { id: 'editar', label: 'Editar servicios' },
      { id: 'eliminar', label: 'Eliminar servicios' },
    ],
  },
  {
    id: 'categorias',
    label: 'Categorías',
    acciones: [
      { id: 'leer', label: 'Consultar categorías' },
      { id: 'crear', label: 'Crear categorías' },
      { id: 'editar', label: 'Editar categorías' },
      { id: 'eliminar', label: 'Eliminar categorías' },
    ],
  },
  {
    id: 'fracciones',
    label: 'Fracciones',
    acciones: [
      { id: 'leer', label: 'Consultar fracciones' },
      { id: 'crear', label: 'Crear fracciones' },
      { id: 'editar', label: 'Editar fracciones' },
      { id: 'eliminar', label: 'Eliminar fracciones' },
    ],
  },
  {
    id: 'almacenes',
    label: 'Almacenes',
    acciones: [
      { id: 'leer', label: 'Consultar almacenes' },
      { id: 'crear', label: 'Crear almacenes' },
      { id: 'editar', label: 'Editar almacenes' },
      { id: 'eliminar', label: 'Eliminar almacenes' },
    ],
  },
  {
    id: 'inventario',
    label: 'Inventario',
    acciones: [
      { id: 'leer', label: 'Consultar stock y movimientos' },
      { id: 'ajustar', label: 'Ajustar stock' },
      { id: 'transferir', label: 'Transferir entre almacenes' },
    ],
  },
  {
    id: 'clientes',
    label: 'Clientes',
    acciones: [
      { id: 'leer', label: 'Consultar clientes' },
      { id: 'crear', label: 'Crear clientes' },
      { id: 'editar', label: 'Editar clientes' },
      { id: 'eliminar', label: 'Eliminar clientes' },
    ],
  },
  {
    id: 'proveedores',
    label: 'Proveedores',
    acciones: [
      { id: 'leer', label: 'Consultar proveedores' },
      { id: 'crear', label: 'Crear proveedores' },
      { id: 'editar', label: 'Editar proveedores' },
      { id: 'eliminar', label: 'Eliminar proveedores' },
    ],
  },
  {
    id: 'compras',
    label: 'Compras',
    acciones: [
      { id: 'leer', label: 'Consultar compras y adjuntos' },
      { id: 'crear', label: 'Registrar compras' },
      { id: 'editar', label: 'Editar compras y adjuntos' },
      { id: 'recibir', label: 'Recibir compras' },
      { id: 'anular', label: 'Anular compras' },
      { id: 'eliminar', label: 'Eliminar compras y adjuntos' },
    ],
  },
  {
    id: 'ventas',
    label: 'Ventas',
    acciones: [
      { id: 'leer', label: 'Consultar historial de ventas' },
      { id: 'crear', label: 'Registrar ventas' },
      { id: 'anular', label: 'Anular ventas' },
    ],
  },
  {
    id: 'cotizaciones',
    label: 'Cotizaciones',
    acciones: [
      { id: 'leer', label: 'Consultar y exportar cotizaciones' },
      { id: 'crear', label: 'Crear cotizaciones' },
      { id: 'editar', label: 'Editar y actualizar estado' },
      { id: 'eliminar', label: 'Eliminar cotizaciones' },
      { id: 'convertir', label: 'Convertir cotización en venta' },
    ],
  },
  {
    id: 'preformas',
    label: 'Preformas',
    acciones: [
      { id: 'leer', label: 'Consultar preformas' },
      { id: 'crear', label: 'Crear preformas' },
      { id: 'editar', label: 'Editar preformas' },
      { id: 'eliminar', label: 'Eliminar preformas' },
      { id: 'confirmar', label: 'Confirmar y registrar venta' },
      { id: 'cancelar', label: 'Cancelar preformas' },
    ],
  },
  {
    id: 'devoluciones',
    label: 'Devoluciones y reembolsos',
    acciones: [
      { id: 'leer', label: 'Consultar devoluciones y reembolsos' },
      { id: 'crear', label: 'Registrar solicitudes' },
      { id: 'aprobar', label: 'Aprobar devoluciones' },
      { id: 'rechazar', label: 'Rechazar devoluciones' },
      { id: 'procesar_reembolso', label: 'Procesar reembolsos' },
    ],
  },
  {
    id: 'mensajes_web',
    label: 'Mensajes del sitio web',
    acciones: [
      { id: 'leer', label: 'Consultar mensajes y chats' },
      { id: 'responder', label: 'Responder y actualizar presencia' },
      { id: 'gestionar', label: 'Gestionar conversaciones y contactos' },
    ],
  },
  {
    id: 'notificaciones',
    label: 'Notificaciones',
    acciones: [
      { id: 'leer', label: 'Consultar notificaciones' },
      { id: 'gestionar', label: 'Marcar como leídas y archivar' },
    ],
  },
  {
    id: 'sitio_web',
    label: 'Sitio web y portafolio',
    acciones: [
      { id: 'leer', label: 'Consultar configuración y proyectos' },
      { id: 'configurar', label: 'Editar configuración y horario' },
      { id: 'gestionar_catalogo', label: 'Gestionar ofertas y catálogo público' },
      { id: 'gestionar_portafolio', label: 'Crear, editar y eliminar proyectos' },
    ],
  },
  {
    id: 'despachos',
    label: 'Despachos',
    acciones: [
      { id: 'leer', label: 'Consultar despachos y reportes' },
      { id: 'crear', label: 'Crear órdenes de despacho' },
      { id: 'asignar', label: 'Asignar repartidor y movilidad' },
      { id: 'cambiar_estado', label: 'Actualizar estado del despacho' },
      { id: 'registrar_entrega', label: 'Registrar entrega y evidencia' },
    ],
  },
  {
    id: 'movilidades',
    label: 'Movilidades',
    acciones: [
      { id: 'leer', label: 'Consultar vehículos, historial y uso' },
      { id: 'crear', label: 'Registrar vehículo' },
      { id: 'editar', label: 'Editar vehículo' },
      { id: 'eliminar', label: 'Desactivar vehículo' },
      { id: 'asignar_conductor', label: 'Asignar conductor' },
    ],
  },
  {
    id: 'caja',
    label: 'Caja',
    acciones: [
      { id: 'leer', label: 'Consultar caja y movimientos' },
      { id: 'abrir', label: 'Abrir caja' },
      { id: 'registrar_movimiento', label: 'Registrar movimientos de caja chica' },
      { id: 'cerrar', label: 'Cerrar caja' },
    ],
  },
];

function etiqueta(clave: string, diccionario: Record<string, string>): string {
  const conocida = diccionario[clave];
  if (conocida) return conocida;
  const limpio = clave.replace(/[_-]+/g, ' ').trim();
  if (!limpio) return clave;
  return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

function esMapa(valor: unknown): valor is Record<string, unknown> {
  return !!valor && typeof valor === 'object' && !Array.isArray(valor);
}

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-roles-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, ModalComponent, FormFieldComponent, LoaderComponent, EmptyStateComponent],
  templateUrl: './roles-page.component.html',
  styleUrls: ['./roles-page.component.css'],
})
export class RolesPageComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  readonly state = new PageState<Api.RolResponseDTO>();
  readonly form = this.fb.nonNullable.group({
    id: [''],
    nombre: ['ROLE_MULTIFUNCIONAL' as Api.RolRequestDTO['nombre'], Validators.required],
  });
  editor: GrupoEditor[] = [];
  modal = false;
  guardando = false;
  errorFormulario: string | null = null;
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly api: RolesApiService, private readonly lookup: LookupService, private readonly toast: ToastService) {}

  ngOnInit(): void { this.cargar(); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  cargar(): void {
    this.api.GetApiV1Roles().pipe(ignoreStale(this.state), takeUntil(this.destroy$)).subscribe({
      next: (rows) => {
        this.state.loading = false;
        this.state.rows = rows ?? [];
        this.state.totalElements = this.state.rows.length;
        this.state.totalPages = this.state.rows.length ? 1 : 0;
        this.state.error = null;
      },
      error: (error: unknown) => this.state.fail(problemText(error), null),
    });
  }

  nombreVisible(nombre: string | undefined): string {
    if (nombre === 'ROLE_ADMIN') return 'Administrador';
    if (nombre === 'ROLE_MULTIFUNCIONAL') return 'Multifuncional';
    return nombre ? etiqueta(nombre.replace(/^ROLE_/, ''), {}) : 'Rol';
  }

  descripcion(nombre: string | undefined): string {
    if (nombre === 'ROLE_ADMIN') return 'Administra usuarios, sedes y finanzas.';
    if (nombre === 'ROLE_MULTIFUNCIONAL') return 'Opera el día a día y marca su asistencia.';
    return 'Permisos asignados a este rol.';
  }

  gruposDe(rol: Api.RolResponseDTO): GrupoVisible[] {
    const permisos = rol.permisosJson;
    if (!esMapa(permisos)) return [];
    const grupos: GrupoVisible[] = [];
    for (const [modulo, valor] of Object.entries(permisos)) {
      const acciones = this.accionesActivas(valor);
      if (acciones.length) grupos.push({ label: etiqueta(modulo, MODULOS), acciones });
    }
    return grupos;
  }

  /**
   * El ADMIN no se recorta con un `false` en el mapa: RolePermissionGuard resuelve el rol antes
   * (paso 4) y DataLoader lo siembra con todo true. Editar sus casillas sería un control que
   * no hace nada, así que se muestra cerrado y con la razón escrita en pantalla.
   */
  get esRolAdmin(): boolean {
    return this.form.controls.nombre.value === 'ROLE_ADMIN';
  }

  abrirEditar(row: Api.RolResponseDTO): void {
    this.errorFormulario = null;
    const nombre = row.nombre === 'ROLE_ADMIN' ? 'ROLE_ADMIN' : 'ROLE_MULTIFUNCIONAL';
    this.form.reset({ id: row.id ?? '', nombre });
    this.editor = this.armarEditor(esMapa(row.permisosJson) ? row.permisosJson : {});
    this.modal = true;
  }

  alternar(accion: AccionEditor, marcado: boolean): void {
    accion.activo = marcado;
  }

  casillaMarcada(event: Event): boolean {
    return event.target instanceof HTMLInputElement && event.target.checked;
  }

  guardar(): void {
    if (this.guardando) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const permisosJson = this.permisosParaGuardar();
    if (!permisosJson) {
      this.errorFormulario = 'Activa al menos un permiso.';
      return;
    }
    const value = this.form.getRawValue();
    const body: Api.RolRequestDTO = { nombre: value.nombre, permisosJson };
    this.guardando = true;
    if (!value.id) {
      this.guardando = false;
      this.errorFormulario = 'No se encontró el rol que se desea actualizar.';
      return;
    }
    this.api.PutApiV1RolesId({ id: value.id }, body).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => { this.guardando = false; this.modal = false; this.lookup.invalidate('roles'); this.toast.success('Permisos del rol actualizados.'); this.cargar(); },
      error: (error: unknown) => { this.guardando = false; applyServerErrors(this.form, error); this.errorFormulario = problemText(error); },
    });
  }

  private accionesActivas(valor: unknown): string[] {
    if (valor === true) return ['Acceso permitido'];
    if (Array.isArray(valor)) return valor.filter((item) => typeof item === 'string' && item.trim()).map((item) => etiqueta(String(item), ACCIONES));
    if (!esMapa(valor)) return [];
    return Object.entries(valor)
      .filter(([, activo]) => activo === true)
      .map(([accion]) => etiqueta(accion, ACCIONES));
  }

  private armarEditor(permisos: Record<string, unknown>): GrupoEditor[] {
    const extras = Object.keys(permisos).filter((id) => !CATALOGO.some((modulo) => modulo.id === id));
    const orden = [...CATALOGO.map((modulo) => modulo.id), ...extras];
    return orden.map((id) => this.grupoEditor(id, permisos));
  }

  private grupoEditor(id: string, permisos: Record<string, unknown>): GrupoEditor {
    const catalogo = CATALOGO.find((modulo) => modulo.id === id);
    const valor = permisos[id];
    const venia = Object.prototype.hasOwnProperty.call(permisos, id);
    const acciones: AccionEditor[] = [];
    if (typeof valor === 'boolean') {
      acciones.push({ id: '__acceso', label: 'Acceso permitido', activo: valor, forma: 'bool' });
      return { id, label: catalogo?.label ?? etiqueta(id, MODULOS), venia, acciones };
    }
    const mapa = esMapa(valor) ? valor : {};
    const lista = Array.isArray(valor) ? valor.filter((item): item is string => typeof item === 'string') : [];
    const vistos = new Set<string>();
    for (const accion of catalogo?.acciones ?? []) {
      vistos.add(accion.id);
      acciones.push({
        id: accion.id,
        label: accion.label,
        activo: mapa[accion.id] === true || lista.includes(accion.id),
        forma: 'mapa',
      });
    }
    for (const [accion, activo] of Object.entries(mapa)) {
      if (vistos.has(accion) || typeof activo !== 'boolean') continue;
      acciones.push({ id: accion, label: etiqueta(accion, ACCIONES), activo, forma: 'mapa' });
    }
    for (const accion of lista) {
      if (vistos.has(accion)) continue;
      acciones.push({ id: accion, label: etiqueta(accion, ACCIONES), activo: true, forma: 'mapa' });
    }
    return { id, label: catalogo?.label ?? etiqueta(id, MODULOS), venia, acciones };
  }

  private permisosParaGuardar(): Record<string, unknown> | null {
    const salida: Record<string, unknown> = {};
    let alguno = false;
    for (const grupo of this.editor) {
      if (grupo.acciones.length === 1 && grupo.acciones[0].forma === 'bool') {
        if (grupo.acciones[0].activo) {
          salida[grupo.id] = true;
          alguno = true;
        }
        continue;
      }
      const mapa: Record<string, boolean> = {};
      let activo = false;
      for (const accion of grupo.acciones) {
        if (accion.forma === 'bool') continue;
        mapa[accion.id] = accion.activo;
        if (accion.activo) activo = true;
      }
      if (activo || grupo.venia) {
        salida[grupo.id] = mapa;
        if (activo) alguno = true;
      }
    }
    return alguno ? salida : null;
  }
}

export const ROLES_ROUTES: Routes = [{
  path: '', component: RolesPageComponent, canActivate: [RoleGuard], title: 'Roles',
  data: { expectedRoles: ['ROLE_ADMIN'], section: 'Configuración', breadcrumb: 'Roles' },
}];
