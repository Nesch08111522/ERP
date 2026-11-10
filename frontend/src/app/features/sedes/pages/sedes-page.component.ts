import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { RoleGuard } from '../../../guards/role.guard';
import { Subject, takeUntil } from 'rxjs';
import * as Api from '../../../core/api/openapi.types';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { DataTableComponent } from '../../../shared/components/data-table/data-table.component';
import { FilterBarComponent } from '../../../shared/components/filter-bar/filter-bar.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { ColumnDef } from '../../../shared/models/ui.models';
import { LookupService } from '../../../shared/services/lookup.service';
import { MarcaService } from '../../../shared/services/marca.service';
import { SedeFiltroService } from '../../../shared/services/sede-filtro.service';
import { ToastService } from '../../../shared/services/toast.service';
import { TokenService } from '../../../services/token.service';
import { applyServerErrors, fieldError, mensajeBaja, problemStatus, problemText } from '../../../shared/utils/feedback';
import { ignoreStale, PageState } from '../../../shared/utils/page-state';
import { coincideBusqueda } from '../../../shared/utils/search-text';
import { PeruMapaComponent, PuntoElegido, PuntoSede } from '../components/peru-mapa.component';
import { buscarLugar, geocodificar } from '../data-access/peru-geocoder';
import { SedeMapa, SedeUbicacionApi } from '../data-access/sede-ubicacion.api';
import { SedesApiService } from '../data-access/sedes.api';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-sedes-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, FilterBarComponent, DataTableComponent, ModalComponent, ConfirmDialogComponent, FormFieldComponent, PeruMapaComponent, IconComponent],
  templateUrl: './sedes-page.component.html',
  styleUrls: ['./sedes-page.component.css'],
})
export class SedesPageComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  readonly state = new PageState<Api.SedeResponseDTO>();
  readonly columns: ColumnDef[] = [
    { key: 'nombre', label: 'Sede', sortable: true },
    { key: 'ciudad', label: 'Ciudad' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'celularSede', label: 'Celular' },
    { key: 'moneda', label: 'Moneda' },
    { key: 'activa', label: 'Activa', kind: 'bool' },
  ];
  readonly filtros = this.fb.nonNullable.group({ texto: [''], activa: [''] });
  readonly form = this.fb.nonNullable.group({
    id: [''],
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    pais: ['Perú', Validators.maxLength(100)],
    ciudad: ['', Validators.maxLength(100)],
    direccion: ['', Validators.maxLength(255)],
    celularSede: ['', [Validators.maxLength(20), Validators.pattern(/^[0-9+\-() ]*$/)]],
    moneda: ['PEN', Validators.maxLength(10)],
    activa: [true],
    latitud: [''],
    longitud: [''],
    // Política de remuneración de la sede (§8.1). Vacío = hereda la de la empresa.
    politicaDivision: ['' as '' | Api.SedeRequestDTO['politicaDivision']],
    tratamientoAusencias: ['' as '' | Api.SedeRequestDTO['tratamientoAusencias']],
    diasLaborables: this.fb.array([false, false, false, false, false, false, false]),
  });
  /** Orden canónico LUNES→DOMINGO, el mismo con el que el backend normaliza la máscara. */
  readonly diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
  readonly etiquetaDia: Record<string, string> = {
    LUNES: 'Lunes', MARTES: 'Martes', MIERCOLES: 'Miércoles', JUEVES: 'Jueves',
    VIERNES: 'Viernes', SABADO: 'Sábado', DOMINGO: 'Domingo',
  };
  private todos: Api.SedeResponseDTO[] = [];
  modal = false;
  editando = false;
  guardando = false;
  errorFormulario: string | null = null;
  confirmar = false;
  eliminando = false;
  seleccionado: Api.SedeResponseDTO | null = null;
  mapa: SedeMapa[] = [];
  puntosVista: PuntoSede[] = [];
  otrasSedes: PuntoSede[] = [];
  punto: PuntoElegido | null = null;
  consulta = new FormControl('', { nonNullable: true });
  avisoMapa = 'Busca una ciudad o dirección, o haz clic en el mapa para soltar el logo.';
  buscandoLugar = false;
  private busquedaToken = 0;
  fotos: Record<string, string> = {};
  archivoImagen: File | null = null;
  vistaImagen = '';
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly api: SedesApiService,
    private readonly ubicacion: SedeUbicacionApi,
    private readonly lookup: LookupService,
    readonly marca: MarcaService,
    private readonly toast: ToastService,
    private readonly cdr: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sedeFiltro: SedeFiltroService,
    private readonly tokens: TokenService,
  ) { this.state.sort = 'nombre,asc'; }
  ngOnInit(): void {
    this.cargar();
    this.cargarMapa();
    if (this.route.snapshot.queryParamMap.get('crear') === '1') this.abrirCrear();
  }

  cancelar(): void {
    if (this.guardando) return;
    this.modal = false;
    this.sedeFiltro.entrarAlCrear = false;
  }
  ngOnDestroy(): void {
    this.busquedaToken++;
    this.liberarFotos();
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargar(): void {
    const activa = this.filtros.controls.activa.value;
    const request = activa === ''
      ? this.api.GetApiV1Sedes({ page: 0, size: 200, sort: this.state.sort })
      : this.api.GetApiV1SedesEstado({ activa, page: 0, size: 200, sort: this.state.sort });
    request.pipe(ignoreStale(this.state), takeUntil(this.destroy$)).subscribe({
      next: (page) => { this.todos = page.content ?? []; this.state.loading = false; this.paginar(); },
      error: (error: unknown) => this.state.fail(problemText(error), problemStatus(error)),
    });
  }
  paginar(): void {
    const texto = this.filtros.controls.texto.value;
    const filtradas = this.todos.filter((sede) => coincideBusqueda(`${sede.nombre ?? ''} ${sede.ciudad ?? ''} ${sede.direccion ?? ''}`, texto));
    this.state.totalElements = filtradas.length;
    this.state.totalPages = filtradas.length ? Math.ceil(filtradas.length / this.state.size) : 0;
    if (this.state.totalPages > 0 && this.state.page >= this.state.totalPages) this.state.page = 0;
    this.state.rows = filtradas.slice(this.state.page * this.state.size, (this.state.page + 1) * this.state.size);
    this.state.error = null;
  }
  filtrar(): void { this.state.page = 0; this.cargar(); }
  limpiar(): void { this.filtros.reset({ texto: '', activa: '' }); this.filtrar(); }
  cambiarPagina(page: number): void { this.state.page = page; this.paginar(); }
  cambiarTamano(size: number): void { this.state.size = size; this.state.page = 0; this.paginar(); }
  ordenar(event: { key: string; direction: 'asc' | 'desc' }): void { this.state.sort = `${event.key},${event.direction}`; this.cargar(); }

  abrirCrear(): void {
    this.editando = false;
    this.errorFormulario = null;
    this.archivoImagen = null;
    this.vistaImagen = '';
    this.consulta.setValue('');
    this.punto = null;
    this.avisoMapa = 'Busca una ciudad o dirección, o haz clic en el mapa para soltar el logo.';
    this.otrasSedes = this.puntosVista;
    this.form.reset({ id: '', nombre: '', pais: 'Perú', ciudad: '', direccion: '', celularSede: '', moneda: 'PEN', activa: true, latitud: '', longitud: '', politicaDivision: '', tratamientoAusencias: '' });
    this.marcarDias(undefined);
    this.modal = true;
  }
  abrirEditar(row: unknown): void {
    const sede = row as Api.SedeResponseDTO;
    this.editando = true;
    this.errorFormulario = null;
    this.archivoImagen = null;
    this.vistaImagen = sede.id ? (this.fotos[sede.id] ?? '') : '';
    this.consulta.setValue('');
    this.otrasSedes = this.puntosVista.filter((punto) => punto.id !== sede.id);
    this.form.reset({
      id: sede.id ?? '', nombre: sede.nombre ?? '', pais: sede.pais ?? '', ciudad: sede.ciudad ?? '',
      direccion: sede.direccion ?? '', celularSede: sede.celularSede ?? '', moneda: sede.moneda ?? 'PEN',
      activa: sede.activa ?? true, latitud: sede.latitud == null ? '' : String(sede.latitud), longitud: sede.longitud == null ? '' : String(sede.longitud),
      politicaDivision: sede.politicaDivision ?? '', tratamientoAusencias: sede.tratamientoAusencias ?? '',
    });
    this.marcarDias(sede.diasLaborables);
    if (sede.latitud != null && sede.longitud != null) {
      this.punto = { latitud: sede.latitud, longitud: sede.longitud };
      this.avisoMapa = 'Punto guardado. Arrastra el logo si el local está en otra esquina.';
    } else {
      this.punto = null;
      this.ubicar(false);
    }
    this.modal = true;
  }

  get controlesDias(): FormArray {
    return this.form.controls.diasLaborables as FormArray;
  }

  private marcarDias(dias: string[] | undefined): void {
    const elegidos = new Set((dias ?? []).map((d) => String(d).toUpperCase()));
    this.diasSemana.forEach((dia, i) => this.controlesDias.at(i).setValue(elegidos.has(dia), { emitEvent: false }));
  }

  /**
   * Acá "sin ningún día marcado" sí significa "hereda de la empresa" (en Parámetros RRHH, en
   * cambio, la máscara es obligatoria porque no hay un nivel inferior del cual bajar).
   */
  private diasSeleccionados(): string[] | undefined {
    const elegidos = this.diasSemana.filter((_dia, i) => this.controlesDias.at(i).value === true);
    return elegidos.length ? elegidos : undefined;
  }

  ubicar(avisar = true): Promise<void> {
    const texto = this.textoBusqueda();
    if (!texto) {
      if (avisar) this.avisoMapa = 'Escribe una dirección o una ciudad.';
      this.cdr.markForCheck();
      return Promise.resolve();
    }
    const token = ++this.busquedaToken;
    this.buscandoLugar = true;
    if (avisar) this.avisoMapa = 'Buscando el lugar…';
    this.cdr.markForCheck();
    return geocodificar(texto).then((remoto) => {
      if (token !== this.busquedaToken) return;
      this.buscandoLugar = false;
      const lugar = remoto ?? buscarLugar(texto);
      if (!lugar) {
        if (avisar) this.avisoMapa = 'No encontré esa dirección. Haz clic en el mapa o arrastra el logo hasta el local.';
        this.cdr.markForCheck();
        return;
      }
      this.fijarPunto(lugar.latitud, lugar.longitud);
      this.avisoMapa = `Marcado en ${lugar.nombre}. Arrastra el logo para dejarlo en la puerta.`;
      this.cdr.markForCheck();
    });
  }
  ubicarSiFalta(): void {
    if (this.form.controls.latitud.value.trim()) return;
    this.ubicar(false);
  }
  alMover(punto: PuntoElegido): void {
    this.fijarPunto(punto.latitud, punto.longitud);
    this.avisoMapa = 'Punto colocado. Puedes seguir arrastrando el logo.';
  }
  elegirImagen(event: Event): void {
    const archivo = (event.target as HTMLInputElement).files?.[0];
    if (!archivo) return;
    const permitida = ['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type);
    if (!permitida || archivo.size > 5 * 1024 * 1024) {
      this.toast.error('La foto de la sede debe ser JPG, PNG o WEBP de hasta 5 MB.');
      return;
    }
    this.archivoImagen = archivo;
    const lector = new FileReader();
    lector.onload = () => { this.vistaImagen = String(lector.result ?? ''); };
    lector.readAsDataURL(archivo);
  }
  guardar(): void {
    if (this.guardando) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    if (!value.latitud.trim() || !value.longitud.trim()) {
      void this.ubicar(false).then(() => this.enviar());
      return;
    }
    this.enviar();
  }

  private enviar(): void {
    if (this.guardando) return;
    const value = this.form.getRawValue();
    const actual = value;
    const latitud = this.coordenada(actual.latitud, -90, 90);
    const longitud = this.coordenada(actual.longitud, -180, 180);
    if (latitud === false || longitud === false) {
      this.errorFormulario = 'La latitud va de -90 a 90 y la longitud de -180 a 180.';
      return;
    }
    const body: Api.SedeRequestDTO = {
      nombre: value.nombre.trim(), pais: value.pais.trim() || undefined, ciudad: value.ciudad.trim() || undefined,
      direccion: value.direccion.trim() || undefined, celularSede: value.celularSede.trim() || undefined,
      moneda: value.moneda.trim() || undefined, activa: value.activa,
      latitud: latitud ?? undefined, longitud: longitud ?? undefined,
      politicaDivision: value.politicaDivision || undefined,
      diasLaborables: this.diasSeleccionados(),
      tratamientoAusencias: value.tratamientoAusencias || undefined,
    };
    this.guardando = true;
    const request = this.editando && value.id ? this.api.PutApiV1SedesId({ id: value.id }, body) : this.api.PostApiV1Sedes({}, body);
    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: (sede) => {
        const id = sede?.id || value.id;
        if (this.archivoImagen && id) {
          this.ubicacion.subirImagen(id, this.archivoImagen).pipe(takeUntil(this.destroy$)).subscribe({
            next: (conFoto) => this.cerrarGuardado(conFoto?.id ? conFoto : sede),
            error: (error: unknown) => { this.guardando = false; this.errorFormulario = problemText(error); },
          });
          return;
        }
        this.cerrarGuardado(sede);
      },
      error: (error: unknown) => { this.guardando = false; applyServerErrors(this.form, error); this.errorFormulario = problemText(error); },
    });
  }
  pedirEliminar(row: unknown): void { this.seleccionado = row as Api.SedeResponseDTO; this.confirmar = true; }
  eliminar(): void {
    if (!this.seleccionado?.id) return;
    this.eliminando = true;
    this.api.DeleteApiV1SedesId({ id: this.seleccionado.id }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (respuesta) => { this.eliminando = false; this.confirmar = false; this.lookup.invalidate('sedes'); this.toast.success(mensajeBaja(respuesta, 'Sede eliminada.', 'La sede quedó inactiva porque tiene historial.')); this.cargar(); this.cargarMapa(); },
      error: (error: unknown) => { this.eliminando = false; this.confirmar = false; this.toast.error(problemText(error)); },
    });
  }
  errorDe(nombre: 'nombre' | 'celularSede'): string | null { return fieldError(this.form.controls[nombre], { pattern: 'Usa solo números, espacios y + - ( ).' }); }

  private cargarMapa(): void {
    this.ubicacion.mapa().pipe(takeUntil(this.destroy$)).subscribe({
      next: (puntos) => { this.mapa = puntos ?? []; this.refrescarPuntos(); this.cargarFotos(); },
      error: () => { this.mapa = []; },
    });
  }

  private cargarFotos(): void {
    this.liberarFotos();
    for (const sede of this.mapa) {
      if (!sede.id || !sede.imagen || sede.imagen.startsWith('http')) continue;
      this.ubicacion.foto(sede.imagen).pipe(takeUntil(this.destroy$)).subscribe({
        next: (blob) => { this.fotos = { ...this.fotos, [sede.id as string]: URL.createObjectURL(blob) }; this.refrescarPuntos(); },
        error: () => undefined,
      });
    }
  }

  private liberarFotos(): void {
    Object.values(this.fotos).forEach((url) => URL.revokeObjectURL(url));
    this.fotos = {};
  }

  private cerrarGuardado(sede?: Api.SedeResponseDTO): void {
    const entrar = !this.editando && this.sedeFiltro.entrarAlCrear && !!sede?.id;
    this.guardando = false;
    this.modal = false;
    this.archivoImagen = null;
    this.lookup.invalidate('sedes');
    this.toast.success(this.editando ? 'Sede actualizada.' : 'Sede creada.');
    if (entrar && sede?.id) {
      this.sedeFiltro.entrarAlCrear = false;
      this.sedeFiltro.elegir(sede.id, sede.nombre || this.form.controls.nombre.value || 'Sede');
      void this.router.navigateByUrl(this.tokens.isAdmin() ? '/modules/turnos-caja' : '/inicio');
      return;
    }
    this.cargar();
    this.cargarMapa();
  }

  private textoBusqueda(): string {
    const escrito = this.consulta.value.trim();
    const value = this.form.getRawValue();
    const base = escrito || value.direccion.trim();
    const partes = [base];
    const normal = base.toLowerCase();
    const ciudad = value.ciudad.trim();
    const pais = value.pais.trim();
    if (ciudad && !normal.includes(ciudad.toLowerCase())) partes.push(ciudad);
    if (pais && !normal.includes(pais.toLowerCase())) partes.push(pais);
    return partes.filter(Boolean).join(', ');
  }

  private fijarPunto(latitud: number, longitud: number): void {
    this.punto = { latitud, longitud };
    this.form.patchValue({ latitud: String(latitud), longitud: String(longitud) });
  }

  private refrescarPuntos(): void {
    this.puntosVista = this.mapa.map((sede) => ({ ...sede, foto: sede.id ? this.fotos[sede.id] : undefined }));
    const id = this.form.controls.id.value;
    this.otrasSedes = id ? this.puntosVista.filter((punto) => punto.id !== id) : this.puntosVista;
  }

  private coordenada(valor: string, minimo: number, maximo: number): number | null | false {
    const texto = valor.trim();
    if (!texto) return null;
    const numero = Number(texto);
    if (!Number.isFinite(numero) || numero < minimo || numero > maximo) return false;
    return numero;
  }
}

export const SEDES_ROUTES: Routes = [{
  path: '',
  component: SedesPageComponent,
  canActivate: [RoleGuard],
  title: 'Sedes',
  data: { expectedRoles: ['ROLE_ADMIN'], section: 'Configuración', breadcrumb: 'Sedes' },
}];
