import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, Routes } from '@angular/router';
import { environment } from '../../../../environments/environment';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  expand,
  forkJoin,
  map,
  of,
  reduce,
  takeUntil,
} from 'rxjs';

import * as Api from '../../../core/api/openapi.types';
import { QueryMap } from '../../../core/api/backend-api.service';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ExportButtonsComponent } from '../../../shared/components/export-buttons/export-buttons.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SelectComponent } from '../../../shared/components/select/select.component';

import { SelectOption } from '../../../shared/models/ui.models';
import { PenPipe } from '../../../shared/pipes/format.pipes';

import { AlmacenService } from '../../../shared/services/almacen.service';
import { InventarioSyncService } from '../../../shared/services/inventario-sync.service';
import { PredictiveBufferService } from '../../../shared/services/predictive-buffer.service';
import { LookupService } from '../../../shared/services/lookup.service';
import { SedeFiltroService } from '../../../shared/services/sede-filtro.service';
import { ToastService } from '../../../shared/services/toast.service';

import { TokenService } from '../../../services/token.service';

import {
  applyServerErrors,
  fieldError,
  isProblem,
  problemStatus,
  problemText,
} from '../../../shared/utils/feedback';

import { ofertaVigente } from '../../../shared/utils/precio-oferta';
import { PageState } from '../../../shared/utils/page-state';
import { coincideBusqueda } from '../../../shared/utils/search-text';

import { KardexApiService } from '../../kardex/data-access/kardex.api';
import { StockApiService } from '../../stock/data-access/stock.api';

import {
  COLUMNAS_PRODUCTO,
  ProductoImportacionFila,
  ProductosMasivoApiService,
} from '../data-access/productos-masivo.api';

import { ProductosApiService } from '../data-access/productos.api';

import * as XLSX from 'xlsx';

/* =========================================================
   INTERFACES
========================================================= */

interface CorteVista {
  nombre: string;
  precio: number;
  factor: number;
  equivalentes: number;
  ancho: number;
}

interface FilaCatalogo {
  producto: Api.ProductoResponseDTO;
  cantidad: number;
  minimo: number;
  bajo: boolean;
  unidad: string;
  almacen: string;
  sede: string;
  otrosAlmacenes: number;
  ancho: number;
  cortes: CorteVista[];
  estado: 'optimo' | 'minimo' | 'agotado' | 'inactivo';
  estadoLabel: string;
}

interface CargaCatalogo {
  productos: Api.ProductoResponseDTO[];
  saldos: Api.SaldoKardexDTO[];
  pagina: Api.PageProductoResponseDTO | null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-productos-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    PageHeaderComponent,
    ExportButtonsComponent,
    ModalComponent,
    ConfirmDialogComponent,
    FormFieldComponent,
    SelectComponent,
    PaginationComponent,
    IconComponent,
    PenPipe,
  ],
  templateUrl: './productos-page.component.html',
  styleUrls: ['./productos-page.component.css', './productos-page.component.part2.css', './productos-page.component.part3.css'],
})
export class ProductosPageComponent implements OnInit, OnDestroy {

  /* =========================================================
     INYECCIÓN DE DEPENDENCIAS
  ========================================================= */

  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  private readonly inventario = inject(InventarioSyncService);
  private readonly sedeFiltro = inject(SedeFiltroService);
  private readonly almacenService = inject(AlmacenService);
  private readonly buffer = inject(PredictiveBufferService);

  readonly state = new PageState<Api.ProductoResponseDTO>();

  private readonly api: ProductosApiService;
  private readonly stockApi: StockApiService;
  private readonly kardex: KardexApiService;
  private readonly lookup: LookupService;
  private readonly toast: ToastService;
  private readonly router: Router;
  private readonly masivo: ProductosMasivoApiService;
  private readonly tokens: TokenService;

  /* =========================================================
     FILTROS
  ========================================================= */

  readonly filtros = this.fb.nonNullable.group({
    searchTerm: [''],
    categoriaId: [''],
    sedeId: [''],
    almacenId: [''],
    tipo: [''],
    activo: [''],
    esFraccionable: [''],
  });

  stockFiltro: '' | 'CON' | 'BAJO' | 'SIN' = '';

  /* =========================================================
     FORMULARIO DE PRODUCTO
  ========================================================= */

  readonly form = this.fb.nonNullable.group({
    id: [''],
    nombre: ['', [Validators.required, Validators.maxLength(200)]],
    codigoSku: [''],
    descripcion: [''],
    categoriaId: [''],
    proveedorId: [''],
    tipo: ['FISICO' as Api.ProductoRequestDTO['tipo'], Validators.required],
    unidad: ['UNIDAD'],
    precioCompra: [0, [Validators.required, Validators.min(0)]],
    precioVentaBase: [0, [Validators.required, Validators.min(0)]],
    activo: [true],
    esFraccionable: [false],
    destacado: [false],
    incluyeIgv: [true],
    imagen: [''],
    enOferta: [false],
    ofertaPorcentaje: [0],
    precioOferta: [0],
    ofertaDias: [7],
    /* ── Ubicación e inventario ── */
    sedeId: [''],
    almacenId: [''],
    stockInicial: [0, [Validators.min(0)]],
    stockMinimo: [0, [Validators.min(0)]],
    stockMaximo: [0, [Validators.min(0)]],
    puntoReposicion: [0, [Validators.min(0)]],
  });

  /* =========================================================
     CATÁLOGOS Y DATOS
  ========================================================= */

  categorias: SelectOption[] = [];
  proveedores: SelectOption[] = [];
  sedes: SelectOption[] = [];
  almacenes: SelectOption[] = [];
  almacenesFiltro: SelectOption[] = [];

  stockUbicaciones: Api.ProductoStockResumenDTO[] = [];
  cargandoStock = false;

  dashboard: Api.StockDashboardDTO | null = null;
  alertas: Api.SaldoKardexDTO[] = [];
  mermas: Api.ReporteMermasDTO | null = null;

  private saldos = new Map<string, Api.SaldoKardexDTO[]>();
  private stockFilas: FilaCatalogo[] | null = null;

  /* =========================================================
     ESTADOS DE INTERFAZ
  ========================================================= */

  modal = false;
  editando = false;
  guardando = false;

  errorFormulario: string | null = null;

  confirmar = false;
  eliminando = false;

  accion: 'eliminar' | 'desactivar' = 'eliminar';

  seleccionado: Api.ProductoResponseDTO | null = null;

  modalImportar = false;
  importando = false;
  sobreArchivo = false;

  archivoNombre = '';

  importErrores: { fila?: number; motivo?: string }[] = [];
  importExito: string | null = null;

  modoImagen: 'archivo' | 'url' = 'archivo';

  archivoPendiente: File | null = null;
  vistaPrevia: string | null = null;

  private readonly vistas = new Map<string, string>();

  /* =========================================================
     CONTROL INTERNO
  ========================================================= */

  private silencioOferta = false;
  private teniaPrecioOferta = false;

  private carga = 0;
  private omitirRevision = 0;

  private fraccionesActuales: Api.CatalogoFraccionResponseDTO[] = [];

  private readonly buscar$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  /* =========================================================
     CONSTRUCTOR
  ========================================================= */

  constructor(
    api: ProductosApiService,
    stockApi: StockApiService,
    kardex: KardexApiService,
    lookup: LookupService,
    toast: ToastService,
    router: Router,
    masivo: ProductosMasivoApiService,
    tokens: TokenService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.api = api;
    this.stockApi = stockApi;
    this.kardex = kardex;
    this.lookup = lookup;
    this.toast = toast;
    this.router = router;
    this.masivo = masivo;
    this.tokens = tokens;

    this.state.sort = 'nombre,asc';

    effect(() => {
      this.lookup.revision();
      untracked(() => this.cargarCombos());
    });

    effect(() => {
      const sede = this.sedeFiltro.sedeId();
      untracked(() => {
        if (this.filtros.controls.sedeId.value === sede) return;
        this.filtros.controls.sedeId.setValue(sede);
      });
    });

    effect(() => {
      const revision = this.inventario.revision();
      untracked(() => {
        if (!revision || revision === this.omitirRevision) return;
        this.cargar();
      });
    });
  }

  /* =========================================================
     CICLO DE VIDA
  ========================================================= */

  ngOnInit(): void {
    this.cargar();

    this.buscar$
      .pipe(
        map((valor) => valor.trim()),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((valor) => {
        if (this.filtros.controls.searchTerm.value === valor) return;
        this.filtros.controls.searchTerm.setValue(valor, { emitEvent: false });
        this.filtrar();
      });

    this.filtros.controls.categoriaId.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.filtrar());

    /* Sede del filtro → recarga almacenes y filtra. */
    this.filtros.controls.sedeId.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((sedeId) => {
        this.filtros.controls.almacenId.setValue('', { emitEvent: false });
        this.cargarAlmacenesFiltro(sedeId);
        this.filtrar();
      });

    /* Almacén del filtro → filtra. */
    this.filtros.controls.almacenId.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.filtrar());

    this.filtros.controls.tipo.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.filtrar());

    this.filtros.controls.activo.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.filtrar());

    this.filtros.controls.esFraccionable.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => this.filtrar());

    /* Sede del form → recarga almacenes del form. */
    this.form.controls.sedeId.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((sedeId) => {
        this.form.controls.almacenId.setValue('', { emitEvent: false });
        this.cargarAlmacenesForm(sedeId);
      });

    this.enlazarOferta();

    const sedeInicial = this.filtros.controls.sedeId.value;
    if (sedeInicial) this.cargarAlmacenesFiltro(sedeInicial);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    for (const url of this.vistas.values()) {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    }

    if (this.vistaPrevia?.startsWith('blob:')) {
      URL.revokeObjectURL(this.vistaPrevia);
    }
  }

  /* =========================================================
     FILAS VISIBLES
  ========================================================= */

  get filas(): FilaCatalogo[] {
    if (this.stockFiltro && this.stockFilas) {
      const inicio = this.state.page * this.state.size;
      return this.filtrarFilasStock(this.stockFilas).slice(
        inicio,
        inicio + this.state.size,
      );
    }
    const filas = this.state.rows.map((producto) => this.fila(producto));
    return this.filtrarFilasStock(filas);
  }

  private filtrarFilasStock(filas: FilaCatalogo[]): FilaCatalogo[] {
    switch (this.stockFiltro) {
      case 'CON':
        return filas.filter((fila) => fila.cantidad > 0);
      case 'BAJO':
        return filas.filter((fila) => fila.cantidad > 0 && fila.bajo);
      case 'SIN':
        return filas.filter((fila) => fila.cantidad <= 0);
      default:
        return filas;
    }
  }

  /* =========================================================
     CARGA COMPLETA DE PRODUCTOS / SALDOS
  ========================================================= */

  private productosCompletos(query: QueryMap): Observable<Api.ProductoResponseDTO[]> {
    const params = { ...query, page: 0, size: 200 };
    return this.api.GetApiV1Productos(params).pipe(
      expand((pagina) => {
        const siguiente = (pagina.number ?? 0) + 1;
        return siguiente < (pagina.totalPages ?? 1)
          ? this.api.GetApiV1Productos({ ...params, page: siguiente })
          : EMPTY;
      }),
      reduce(
        (productos, pagina) => productos.concat(pagina.content ?? []),
        [] as Api.ProductoResponseDTO[],
      ),
    );
  }

  private saldosCompletos(sedeId: string): Observable<Api.SaldoKardexDTO[]> {
    const params = { ...(sedeId ? { sedeId } : {}), page: 0, size: 200 };
    return this.kardex.GetApiV1KardexSaldos(params).pipe(
      expand((pagina) => {
        const siguiente = (pagina.number ?? 0) + 1;
        return siguiente < (pagina.totalPages ?? 1)
          ? this.kardex.GetApiV1KardexSaldos({ ...params, page: siguiente })
          : EMPTY;
      }),
      reduce(
        (saldos, pagina) => saldos.concat(pagina.content ?? []),
        [] as Api.SaldoKardexDTO[],
      ),
    );
  }

  /* =========================================================
     CARGA DE COMBOS
  ========================================================= */

  cargarCombos(): void {
    this.lookup
      .loadCategorias()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rows) => {
        this.categorias = this.lookup.options(
          rows,
          (row) => (row as Api.CategoriaResponseDTO).nombre ?? 'Categoría',
        );
      });

    this.lookup
      .loadProveedores()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rows) => {
        this.proveedores = this.lookup.options(
          rows,
          (row) => (row as Api.ProveedorResponseDTO).nombreRazon ?? 'Proveedor',
        );
      });

    this.lookup
      .loadSedes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((rows) => {
        this.sedes = this.lookup.options(
          rows,
          (row) => (row as Api.SedeResponseDTO).nombre ?? 'Sede',
        );
      });
  }

  /* =========================================================
     ALMACENES (FORM + FILTRO)
  ========================================================= */

  private cargarAlmacenesFiltro(sedeId: string): void {
    if (!sedeId) {
      this.almacenesFiltro = [];
      return;
    }
    this.almacenService
      .findBySede(sedeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rows) => {
          this.almacenesFiltro = this.lookup.options(
            rows,
            (row) => (row as Api.AlmacenResponseDTO).nombre ?? 'Almacén',
          );
          this.pintar();
        },
        error: () => {
          this.almacenesFiltro = [];
        },
      });
  }

  private cargarAlmacenesForm(sedeId: string): void {
    if (!sedeId) {
      this.almacenes = [];
      return;
    }
    this.almacenService
      .findBySede(sedeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rows) => {
          this.almacenes = this.lookup.options(
            rows,
            (row) => (row as Api.AlmacenResponseDTO).nombre ?? 'Almacén',
          );
          this.pintar();
        },
        error: () => {
          this.almacenes = [];
        },
      });
  }

  /* =========================================================
     STOCK UBICACIONES (edición) — HttpClient directo
  ========================================================= */

  private cargarStockUbicaciones(productoId: string): void {
    this.cargandoStock = true;
    this.stockUbicaciones = [];

    this.http
      .get<Api.ProductoStockResumenDTO[]>(
        `${environment.apiUrl}/api/v1/productos/${productoId}/stock`,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rows) => {
          this.stockUbicaciones = rows ?? [];
          this.cargandoStock = false;

          const primera = this.stockUbicaciones[0];
          if (primera?.sedeId) {
            this.form.controls.sedeId.setValue(primera.sedeId, { emitEvent: false });
            this.cargarAlmacenesForm(primera.sedeId);
            if (primera.almacenId) {
              setTimeout(() => {
                this.form.controls.almacenId.setValue(primera.almacenId ?? '', {
                  emitEvent: false,
                });
                this.pintar();
              }, 200);
            }
          }

          this.pintar();
        },
        error: () => {
          this.stockUbicaciones = [];
          this.cargandoStock = false;
          this.pintar();
        },
      });
  }

  /* =========================================================
     CARGA PRINCIPAL
  ========================================================= */

  cargar(): void {
    const extra = this.filtros.getRawValue();

    const query = this.state.query({
      searchTerm: extra.searchTerm.trim(),
      categoriaId: extra.categoriaId,
      tipo: extra.tipo,
      activo: extra.activo,
      esFraccionable: extra.esFraccionable,
      sedeId: extra.sedeId || undefined,
      almacenId: extra.almacenId || undefined,
    });

    if (this.stockFiltro) {
      query['page'] = 0;
      query['size'] = 200;
    }

    const token = ++this.carga;

    this.state.loading = true;
    this.state.error = null;
    this.stockFilas = null;

    const lectura$: Observable<CargaCatalogo> = this.stockFiltro
      ? forkJoin({
          productos: this.productosCompletos(query),
          saldos: this.saldosCompletos(extra.sedeId),
        }).pipe(
          map(({ productos, saldos }) => ({
            productos,
            saldos,
            pagina: null,
          })),
        )
      : forkJoin({
          pagina: this.buffer.obtener(this.claveCatalogo(query), () =>
            this.api.GetApiV1Productos(query),
          ),
          saldos: this.saldosCompletos(extra.sedeId),
        }).pipe(
          map(({ pagina, saldos }) => ({
            productos: pagina.content ?? [],
            saldos,
            pagina,
          })),
        );

    lectura$.pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ productos, saldos, pagina }) => {
        if (token !== this.carga) return;

        if (pagina) {
          this.state.apply(pagina);
        } else {
          this.state.rows = productos;
          this.state.totalElements = productos.length;
          this.state.totalPages = productos.length
            ? Math.ceil(productos.length / this.state.size)
            : 0;
          this.state.loading = false;
          this.state.error = null;
          this.state.status = null;
        }

        this.saldos = new Map();

        for (const row of saldos) {
          const id = row.productoId ?? '';
          if (!id) continue;
          const lista = this.saldos.get(id) ?? [];
          lista.push(row);
          this.saldos.set(id, lista);
        }

        if (this.stockFiltro) {
          const filasStock = productos.map((producto) => this.fila(producto));
          this.stockFilas = filasStock;
          const filtradas = this.filtrarFilasStock(filasStock);
          this.state.totalElements = filtradas.length;
          this.state.totalPages = Math.ceil(filtradas.length / this.state.size);
          const ultimaPagina = Math.max(this.state.totalPages - 1, 0);
          this.state.page = Math.min(this.state.page, ultimaPagina);
        }

        this.prepararVistas();
        if (pagina) this.precargarSiguiente(query, pagina);
      },
      error: (error: unknown) => {
        if (token !== this.carga) return;
        const mensaje = problemText(error);
        this.state.fail(mensaje, problemStatus(error));
        this.toast.error(mensaje);
      },
    });

    this.cargarPanel(extra.sedeId);
  }

  /** Clave estable de caché para una consulta de catálogo (ordena las llaves). */
  private claveCatalogo(query: QueryMap): string {
    const pares = Object.keys(query)
      .sort()
      .map((k) => [k, query[k]]);
    return 'productos:' + JSON.stringify(pares);
  }

  /** Buffer predictivo: precalienta la página siguiente mientras se ve la actual. */
  private precargarSiguiente(query: QueryMap, pagina: Api.PageProductoResponseDTO): void {
    const total = pagina.totalPages ?? 0;
    const actual = pagina.number ?? Number(query['page']) ?? 0;
    if (total <= actual + 1) return;
    const siguiente: QueryMap = { ...query, page: actual + 1 };
    this.buffer.precalentar(this.claveCatalogo(siguiente), () =>
      this.api.GetApiV1Productos(siguiente),
    );
  }

  /* =========================================================
     BÚSQUEDA Y FILTROS
  ========================================================= */

  filtrar(): void {
    this.state.page = 0;
    this.cargar();
  }

  onBuscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.buscar$.next(input.value ?? '');
  }

  elegirStock(valor: 'CON' | 'BAJO' | 'SIN'): void {
    this.stockFiltro = this.stockFiltro === valor ? '' : valor;
    this.state.page = 0;
    this.cargar();
  }

  limpiar(): void {
    this.stockFiltro = '';
    this.buscar$.next('');

    this.filtros.reset(
      {
        searchTerm: '',
        categoriaId: '',
        sedeId: this.sedeFiltro.sedeId(),
        almacenId: '',
        tipo: '',
        activo: '',
        esFraccionable: '',
      },
      { emitEvent: false },
    );

    this.almacenesFiltro = [];
    const sede = this.filtros.controls.sedeId.value;
    if (sede) this.cargarAlmacenesFiltro(sede);

    this.state.page = 0;
    this.cargar();
  }

  /* =========================================================
     PAGINACIÓN
  ========================================================= */

  cambiarPagina(page: number): void {
    const ultimaPagina = Math.max(this.state.totalPages - 1, 0);
    this.state.page = Math.max(0, Math.min(page, ultimaPagina));

    if (this.stockFiltro) {
      this.prepararVistas();
      return;
    }
    this.cargar();
  }

  cambiarTamano(size: number): void {
    if (!Number.isFinite(size) || size < 1) return;
    this.state.size = size;
    this.state.page = 0;

    if (this.stockFiltro && this.stockFilas) {
      this.state.totalPages = Math.ceil(
        this.state.totalElements / this.state.size,
      );
      this.prepararVistas();
      return;
    }
    this.cargar();
  }

  /* =========================================================
     CREAR PRODUCTO
  ========================================================= */

  abrirCrear(): void {
    this.cargarCombos();

    this.editando = false;
    this.fraccionesActuales = [];
    this.errorFormulario = null;
    this.modoImagen = 'archivo';
    this.archivoPendiente = null;
    this.vistaPrevia = null;
    this.teniaPrecioOferta = false;

    this.form.reset({
      id: '',
      nombre: '',
      codigoSku: '',
      descripcion: '',
      categoriaId: '',
      proveedorId: '',
      tipo: 'FISICO',
      unidad: 'UNIDAD',
      precioCompra: 0,
      precioVentaBase: 0,
      activo: true,
      esFraccionable: false,
      destacado: false,
      incluyeIgv: true,
      imagen: '',
      enOferta: false,
      ofertaPorcentaje: 0,
      precioOferta: 0,
      ofertaDias: 7,
      sedeId: '',
      almacenId: '',
      stockInicial: 0,
      stockMinimo: 0,
      stockMaximo: 0,
      puntoReposicion: 0,
    });

    this.almacenes = [];
    this.stockUbicaciones = [];
    this.cargandoStock = false;

    this.modal = true;
  }

  /* =========================================================
     EDITAR PRODUCTO
  ========================================================= */

  abrirEditar(item: Api.ProductoResponseDTO): void {
    this.cargarCombos();

    this.editando = true;
    this.fraccionesActuales = item.fracciones ?? [];
    this.errorFormulario = null;

    this.form.reset({
      id: item.id ?? '',
      nombre: item.nombre ?? '',
      codigoSku: item.codigoSku ?? '',
      descripcion: item.descripcion ?? '',
      categoriaId: item.categoria?.id ?? '',
      proveedorId: item.proveedor?.id ?? '',
      tipo: item.tipo ?? 'FISICO',
      unidad: item.unidad ?? 'UNIDAD',
      precioCompra: item.precioCompra ?? 0,
      precioVentaBase: item.precioVentaBase ?? 0,
      activo: item.activo ?? true,
      esFraccionable: item.esFraccionable ?? false,
      destacado: item.destacado ?? false,
      incluyeIgv: item.incluyeIgv ?? true,
      imagen: item.imagen ?? '',
      enOferta: ofertaVigente(item),
      ofertaPorcentaje: item.ofertaPorcentaje ?? 0,
      precioOferta: item.precioOferta ?? 0,
      ofertaDias: this.diasRestantes(item.ofertaHasta),
      sedeId: '',
      almacenId: '',
      stockInicial: 0,
      stockMinimo: 0,
      stockMaximo: 0,
      puntoReposicion: 0,
    });

    this.teniaPrecioOferta = item.precioOferta != null;
    this.silencioOferta = false;
    this.archivoPendiente = null;

    this.modoImagen =
      item.imagen?.startsWith('http://') || item.imagen?.startsWith('https://')
        ? 'url'
        : 'archivo';

    this.vistaPrevia = this.modoImagen === 'url' ? item.imagen ?? null : null;

    if (this.modoImagen === 'archivo' && item.imagen) {
      this.cargarVistaPrevia(item.imagen);
    }

    this.almacenes = [];
    this.stockUbicaciones = [];
    this.cargandoStock = false;

    if (item.id) this.cargarStockUbicaciones(item.id);

    this.modal = true;
  }

  /* =========================================================
     GUARDAR PRODUCTO
  ========================================================= */

  guardar(): void {
    if (this.guardando) return;

    this.form.markAllAsTouched();
    this.errorFormulario = null;

    if (this.form.invalid) {
      this.errorFormulario = 'Revisa los campos marcados antes de guardar.';
      this.pintar();
      return;
    }

    const value = this.form.getRawValue();

    if (this.modoImagen === 'url') {
      const url = value.imagen.trim();
      if (url && !/^https?:\/\//i.test(url)) {
        this.errorFormulario =
          'La URL de la imagen debe empezar por http:// o https://.';
        this.pintar();
        return;
      }
    }

    if (value.enOferta) {
      const base = Number(value.precioVentaBase);
      const oferta = Number(value.precioOferta);
      const dias = Number(value.ofertaDias);

      if (!(oferta > 0) || oferta >= base) {
        this.errorFormulario =
          'El precio de oferta tiene que ser menor que el precio de venta.';
        this.pintar();
        return;
      }

      if (dias < 1 || dias > 365) {
        this.errorFormulario = 'La oferta dura entre 1 y 365 días.';
        this.pintar();
        return;
      }
    }

    this.guardando = true;
    this.pintar();

    if (
      this.modoImagen === 'archivo' &&
      this.archivoPendiente &&
      !(this.editando && value.id)
    ) {
      this.masivo
        .subirImagen(this.archivoPendiente)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (respuesta) => {
            this.form.controls.imagen.setValue(respuesta.ruta);
            this.archivoPendiente = null;
            this.persistir();
          },
          error: (error: unknown) => {
            this.guardando = false;
            this.errorFormulario = problemText(error);
            this.toast.error(this.errorFormulario);
            this.pintar();
          },
        });
      return;
    }

    this.persistir();
  }

  get gananciaOferta(): number {
    return (
      Math.round(
        (Number(this.form.controls.precioOferta.value) -
          Number(this.form.controls.precioCompra.value)) *
          100,
      ) / 100
    );
  }

  /* =========================================================
     CIERRE Y ACTUALIZACIÓN DEL PRODUCTO
  ========================================================= */

  private cerrarProducto(guardado: Api.ProductoResponseDTO): void {
    const editaba = this.editando;

    this.guardando = false;
    this.archivoPendiente = null;
    this.modal = false;
    this.teniaPrecioOferta = false;

    this.form.reset({
      id: '',
      nombre: '',
      codigoSku: '',
      descripcion: '',
      categoriaId: '',
      proveedorId: '',
      tipo: 'FISICO',
      unidad: 'UNIDAD',
      precioCompra: 0,
      precioVentaBase: 0,
      activo: true,
      esFraccionable: false,
      destacado: false,
      incluyeIgv: true,
      imagen: '',
      enOferta: false,
      ofertaPorcentaje: 0,
      precioOferta: 0,
      ofertaDias: 7,
      sedeId: '',
      almacenId: '',
      stockInicial: 0,
      stockMinimo: 0,
      stockMaximo: 0,
      puntoReposicion: 0,
    });

    this.stockUbicaciones = [];
    this.cargandoStock = false;
    this.almacenes = [];

    this.lookup.invalidate('productos');

    this.aplicarProducto(guardado, editaba ? 'actualizar' : 'crear');

    this.avisarInventario();

    this.toast.success(
      editaba ? 'Producto actualizado.' : 'Producto creado.',
    );
    this.pintar();
  }

  private pintar(): void {
    this.cdr.detectChanges();
  }

  private diasRestantes(hasta?: string): number {
    if (!hasta) return 7;

    const hoy = new Date(
      `${new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Lima',
      }).format(new Date())}T00:00:00`,
    );

    const fin = new Date(`${hasta}T00:00:00`);
    const dias = Math.round((fin.getTime() - hoy.getTime()) / 86400000) + 1;

    return dias >= 1 && dias <= 365 ? dias : 7;
  }

  /* =========================================================
     OFERTAS
  ========================================================= */

  private enlazarOferta(): void {
    this.form.controls.ofertaPorcentaje.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.silencioOferta) return;

        const base = Number(this.form.controls.precioVentaBase.value);
        const porcentaje = Number(this.form.controls.ofertaPorcentaje.value);

        if (!(base > 0) || !(porcentaje > 0) || porcentaje >= 100) return;

        this.silencioOferta = true;
        this.form.controls.precioOferta.setValue(
          Math.round(base * (1 - porcentaje / 100) * 100) / 100,
          { emitEvent: false },
        );
        this.silencioOferta = false;
      });

    this.form.controls.precioOferta.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.silencioOferta) return;

        const base = Number(this.form.controls.precioVentaBase.value);
        const oferta = Number(this.form.controls.precioOferta.value);

        if (!(base > 0) || !(oferta > 0) || oferta >= base) return;

        this.silencioOferta = true;
        this.form.controls.ofertaPorcentaje.setValue(
          Math.round(((base - oferta) / base) * 10000) / 100,
          { emitEvent: false },
        );
        this.silencioOferta = false;
      });
  }

  /* =========================================================
     PERSISTENCIA
  ========================================================= */

  private persistir(): void {
    const value = this.form.getRawValue();
    const body = this.cuerpo(value, value.id, this.fraccionesActuales);

    const archivo =
      this.modoImagen === 'archivo' ? this.archivoPendiente : null;

    const request =
      this.editando && value.id && archivo
        ? this.masivo.actualizarConImagen(value.id, body, archivo)
        : this.editando && value.id
          ? this.api.PutApiV1ProductosId({ id: value.id }, body)
          : this.api.PostApiV1Productos({}, body);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: (guardado) => {
        const id = guardado.id ?? value.id;
        const publicar = value.enOferta || this.teniaPrecioOferta;

        const oferta = value.enOferta
          ? {
              oferta: true,
              porcentaje: Number(value.ofertaPorcentaje),
              precioOferta: Number(value.precioOferta),
              dias: Number(value.ofertaDias),
            }
          : { oferta: false };

        if (!id || !publicar) {
          this.cerrarProducto(guardado);
          return;
        }

        this.http
          .put(`${environment.apiUrl}/api/v1/cms/productos/${id}/oferta`, oferta)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              guardado.precioOferta = value.enOferta
                ? Number(value.precioOferta)
                : undefined;
              guardado.ofertaPorcentaje = value.enOferta
                ? Number(value.ofertaPorcentaje)
                : undefined;
              guardado.oferta = value.enOferta;
              this.cerrarProducto(guardado);
            },
            error: (error: unknown) => {
              this.guardando = false;
              this.errorFormulario = problemText(error);
              this.toast.error(
                'El producto quedó guardado, pero la oferta no. ' +
                  this.errorFormulario,
              );
              this.pintar();
            },
          });
      },
      error: (error: unknown) => {
        this.guardando = false;
        applyServerErrors(this.form, error);
        this.errorFormulario = problemText(error);
        this.toast.error(this.errorFormulario);
        this.pintar();
      },
    });
  }

  /* =========================================================
     ELIMINAR Y DESACTIVAR
  ========================================================= */

  pedirEliminar(item: Api.ProductoResponseDTO): void {
    this.seleccionado = item;
    this.accion = 'eliminar';
    this.confirmar = true;
  }

  pedirDesactivar(item: Api.ProductoResponseDTO): void {
    this.seleccionado = item;
    this.accion = 'desactivar';
    this.confirmar = true;
  }

  confirmarAccion(): void {
    if (this.accion === 'desactivar') {
      this.desactivar();
    } else {
      this.eliminar();
    }
  }

  eliminar(): void {
    if (!this.seleccionado?.id || this.eliminando) return;

    const id = this.seleccionado.id;
    this.eliminando = true;

    this.api.DeleteApiV1ProductosId({ id }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (respuesta: unknown) => {
        this.eliminando = false;
        this.confirmar = false;
        this.lookup.invalidate('productos');

        const guardado = this.esProducto(respuesta) ? respuesta : null;

        if (guardado) {
          this.aplicarProducto(guardado, 'actualizar');
          this.toast.success(
            'El producto quedó inactivo para conservar su historial.',
          );
        } else {
          this.state.removeWhere((row) => row.id === id);
          this.toast.success('Producto eliminado.');
          this.ajustarPaginaTrasEliminar();
        }

        this.seleccionado = null;
        this.avisarInventario();
        this.pintar();
      },
      error: (error: unknown) => {
        this.eliminando = false;
        this.confirmar = false;
        this.toast.error(problemText(error));
        this.pintar();
      },
    });
  }

  private ajustarPaginaTrasEliminar(): void {
    if (this.stockFiltro) {
      this.cargar();
      return;
    }

    if (!this.state.rows.length && this.state.page > 0) {
      this.state.page--;
    }
    this.cargar();
  }

  private desactivar(): void {
    const item = this.seleccionado;
    if (!item?.id || this.eliminando) return;

    this.eliminando = true;

    this.api
      .PutApiV1ProductosId({ id: item.id }, this.cuerpoDesde(item, false))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (guardado) => {
          this.eliminando = false;
          this.confirmar = false;
          this.lookup.invalidate('productos');
          this.aplicarProducto(guardado, 'actualizar');
          this.avisarInventario();
          this.seleccionado = null;
          this.toast.success('Producto desactivado.');
          this.pintar();
        },
        error: (error: unknown) => {
          this.eliminando = false;
          this.confirmar = false;
          this.toast.error(problemText(error));
          this.pintar();
        },
      });
  }

  /* =========================================================
     KARDEX
  ========================================================= */

  verKardex(item: Api.ProductoResponseDTO): void {
    void this.router.navigate(['/modules/kardex'], {
      queryParams: { productoId: item.id ?? null },
    });
  }

  /* =========================================================
     EXPORTACIÓN
  ========================================================= */

  exportarCsv(): void {
    const extra = this.filtros.getRawValue();

    this.masivo
      .exportar({
        searchTerm: extra.searchTerm.trim(),
        categoriaId: extra.categoriaId,
        tipo: extra.tipo,
        activo: extra.activo,
        esFraccionable: extra.esFraccionable,
        sedeId: extra.sedeId,
        almacenId: extra.almacenId,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (filas) => {
          this.escribirArchivo(filas, 'csv', 'productos.csv');
          this.toast.success(
            filas.length
              ? 'Catálogo exportado.'
              : 'El archivo se generó sin filas.',
          );
        },
        error: (error: unknown) => {
          this.toast.error(problemText(error));
        },
      });
  }

  /* =========================================================
     IMPORTACIÓN
  ========================================================= */

  abrirImportar(): void {
    this.importando = false;
    this.sobreArchivo = false;
    this.archivoNombre = '';
    this.importErrores = [];
    this.importExito = null;
    this.modalImportar = true;
  }

  descargarPlantilla(): void {
    this.escribirArchivo([], 'xlsx', 'plantilla-productos.xlsx');
  }

  soltarArchivo(event: DragEvent): void {
    event.preventDefault();
    this.sobreArchivo = false;
    const archivo = event.dataTransfer?.files?.[0];
    if (archivo) this.leerArchivo(archivo);
  }

  elegirArchivo(event: Event): void {
    const archivo = (event.target as HTMLInputElement).files?.[0];
    if (archivo) this.leerArchivo(archivo);
  }

  /* =========================================================
     IMÁGENES
  ========================================================= */

  elegirImagen(event: Event): void {
    const archivo = (event.target as HTMLInputElement).files?.[0];
    if (!archivo) return;

    if (archivo.size > 2 * 1024 * 1024) {
      this.errorFormulario = 'La imagen no puede superar 2 MB.';
      return;
    }

    this.errorFormulario = null;
    this.archivoPendiente = archivo;

    const lector = new FileReader();
    lector.onload = () => {
      this.vistaPrevia = String(lector.result ?? '');
    };
    lector.readAsDataURL(archivo);
  }

  usarModoImagen(modo: 'archivo' | 'url'): void {
    this.modoImagen = modo;
    this.archivoPendiente = null;

    const actual = this.form.controls.imagen.value.trim();

    if (modo === 'url') {
      const externa = /^https?:\/\//i.test(actual);
      if (!externa) {
        this.form.controls.imagen.setValue('');
      }
      this.vistaPrevia = externa ? actual : null;
      return;
    }

    this.vistaPrevia = null;
    if (actual.startsWith('productos/')) {
      this.cargarVistaPrevia(actual);
    }
  }

  actualizarVistaUrl(): void {
    const url = this.form.controls.imagen.value.trim();
    this.vistaPrevia = /^https?:\/\//i.test(url) ? url : null;
  }

  vistaDe(producto: Api.ProductoResponseDTO): string | null {
    return producto.id ? this.vistas.get(producto.id) ?? null : null;
  }

  ocultarVista(producto: Api.ProductoResponseDTO): void {
    if (producto.id) this.vistas.delete(producto.id);
  }

  iniciales(nombre: string | undefined): string {
    const partes = (nombre ?? 'P').trim().split(/\s+/).slice(0, 2);
    return partes.map((parte) => parte.charAt(0).toUpperCase()).join('') || 'P';
  }

  errorDe(
    nombre: 'nombre' | 'precioCompra' | 'precioVentaBase',
  ): string | null {
    return fieldError(this.form.controls[nombre]);
  }

  /* =========================================================
     ATAJOS DE TECLADO
  ========================================================= */

  @HostListener('document:keydown', ['$event'])
  atajo(event: KeyboardEvent): void {
    if (event.key !== 'F2' || this.modal) return;
    event.preventDefault();
    document.getElementById('prod-buscar')?.focus();
  }

  /* =========================================================
     PROCESAMIENTO DE ARCHIVOS
  ========================================================= */

  private leerArchivo(archivo: File): void {
    const nombre = archivo.name.toLowerCase();

    if (!nombre.endsWith('.xlsx') && !nombre.endsWith('.csv')) {
      this.importErrores = [{ motivo: 'Solo se aceptan archivos .xlsx o .csv.' }];
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      this.importErrores = [{ motivo: 'El archivo no puede superar 5 MB.' }];
      return;
    }

    this.archivoNombre = archivo.name;
    this.importErrores = [];
    this.importExito = null;
    this.importando = true;

    archivo
      .arrayBuffer()
      .then((buffer) => {
        const libro = XLSX.read(buffer, { type: 'array' });
        const hoja = libro.Sheets[libro.SheetNames[0]];
        const crudas = XLSX.utils.sheet_to_json<Record<string, unknown>>(hoja, {
          defval: '',
        });

        const filas: ProductoImportacionFila[] = [];
        const errores: { fila?: number; motivo?: string }[] = [];

        crudas.forEach((cruda, indice) => {
          const fila = this.filaImportada(cruda);
          if (!fila) return;

          const error = this.validarFilaCliente(fila);
          if (error) {
            errores.push({ fila: indice + 1, motivo: error });
          } else {
            filas.push(fila);
          }
        });

        if (!filas.length && !errores.length) {
          this.importando = false;
          this.importErrores = [{ motivo: 'No hay filas para importar.' }];
          return;
        }

        if (errores.length) {
          this.importando = false;
          this.importErrores = errores;
          return;
        }

        this.masivo
          .importar(filas)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resultado) => {
              this.importando = false;
              this.importExito =
                `Se crearon ${resultado.creados} y se actualizaron ` +
                `${resultado.actualizados}. Ninguna fila quedó a medias.`;

              this.lookup.invalidate('productos');
              this.avisarInventario();
              this.cargar();
            },
            error: (error: unknown) => {
              this.importando = false;
              this.importErrores =
                isProblem(error) && error.errores?.length
                  ? error.errores
                  : [{ motivo: problemText(error) }];
            },
          });
      })
      .catch(() => {
        this.importando = false;
        this.importErrores = [{ motivo: 'No se pudo leer el archivo.' }];
      });
  }

  private filaImportada(
    cruda: Record<string, unknown>,
  ): ProductoImportacionFila | null {
    const normalizada: Record<string, unknown> = {};
    for (const [clave, valor] of Object.entries(cruda)) {
      normalizada[this.aliasColumna(clave)] = valor;
    }

    const sku = this.texto(normalizada['codigoSku']);
    const nombre = this.texto(normalizada['nombre']);

    if (!sku && !nombre) return null;

    return {
      codigoSku: sku || undefined,
      nombre: nombre || undefined,
      descripcion: this.texto(normalizada['descripcion']) || undefined,
      categoria: this.texto(normalizada['categoria']) || undefined,
      tipo: this.texto(normalizada['tipo']).toUpperCase() || undefined,
      precioCompra: this.numero(normalizada['precioCompra']),
      precioVentaBase: this.numero(normalizada['precioVentaBase']),
      unidad: this.texto(normalizada['unidad']) || undefined,
      esFraccionable: this.bandera(normalizada['esFraccionable']),
      activo: this.bandera(normalizada['activo']),
      incluyeIgv: this.bandera(normalizada['incluyeIgv']),
      tipoAfectacion: this.texto(normalizada['tipoAfectacion']) || undefined,
      imagen: this.texto(normalizada['imagen']) || undefined,
      stockInicial: this.numero(normalizada['stockInicial']),
      almacen: this.texto(normalizada['almacen']) || undefined,
    };
  }

  private validarFilaCliente(fila: ProductoImportacionFila): string | null {
    if (!fila.codigoSku) return 'El SKU es obligatorio.';

    if (
      fila.tipo &&
      !['FISICO', 'SERVICIO'].includes(fila.tipo.toUpperCase())
    ) {
      return 'El tipo debe ser FISICO o SERVICIO.';
    }

    if (
      fila.imagen &&
      !/^https?:\/\//i.test(fila.imagen) &&
      !fila.imagen.startsWith('productos/')
    ) {
      return 'La imagen debe ser una URL http(s) o una ruta productos/.';
    }
    return null;
  }

  private aliasColumna(clave: string): string {
    const limpia = clave
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const alias: Record<string, string> = {
      sku: 'codigoSku',
      codigosku: 'codigoSku',
      codigo_sku: 'codigoSku',
      preciocompra: 'precioCompra',
      precio_compra: 'precioCompra',
      precioventabase: 'precioVentaBase',
      precio_venta_base: 'precioVentaBase',
      precioventa: 'precioVentaBase',
      esfraccionable: 'esFraccionable',
      incluyeigv: 'incluyeIgv',
      tipoafectacion: 'tipoAfectacion',
      stockinicial: 'stockInicial',
      stock_inicial: 'stockInicial',
    };

    return alias[limpia] ?? clave.trim();
  }

  private texto(valor: unknown): string {
    if (valor === null || valor === undefined) return '';
    return String(valor).trim();
  }

  private numero(valor: unknown): number | undefined {
    if (valor === null || valor === undefined || valor === '') return undefined;
    const numero =
      typeof valor === 'number'
        ? valor
        : Number(String(valor).replace(',', '.'));
    return Number.isFinite(numero) ? numero : undefined;
  }

  private bandera(valor: unknown): boolean | undefined {
    if (valor === null || valor === undefined || valor === '') return undefined;
    if (typeof valor === 'boolean') return valor;

    const texto = String(valor).trim().toLowerCase();
    if (['true', '1', 'si', 'sí', 's', 'yes'].includes(texto)) return true;
    if (['false', '0', 'no', 'n'].includes(texto)) return false;
    return undefined;
  }

  /* =========================================================
     GENERACIÓN DE ARCHIVOS
  ========================================================= */

  private escribirArchivo(
    filas: ProductoImportacionFila[],
    formato: 'xlsx' | 'csv',
    nombre: string,
  ): void {
    const hoja = filas.length
      ? XLSX.utils.json_to_sheet(filas, { header: [...COLUMNAS_PRODUCTO] })
      : XLSX.utils.aoa_to_sheet([[...COLUMNAS_PRODUCTO]]);

    if (formato === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(hoja);
      const enlace = document.createElement('a');
      enlace.href = URL.createObjectURL(
        new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }),
      );
      enlace.download = nombre;
      enlace.click();
      URL.revokeObjectURL(enlace.href);
      return;
    }

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Productos');
    XLSX.writeFile(libro, nombre);
  }

  /* =========================================================
     PREPARACIÓN DE VISTAS E IMÁGENES
  ========================================================= */

  private prepararVistas(): void {
    const productos = this.stockFiltro
      ? this.filas.map((fila) => fila.producto)
      : this.state.rows;

    for (const producto of productos) {
      const imagen = producto.imagen;
      const id = producto.id;

      if (!imagen || !id || this.vistas.has(id)) continue;

      if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
        this.vistas.set(id, imagen);
      } else {
        this.masivo
          .verImagen(imagen)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (blob) => {
              this.vistas.set(id, URL.createObjectURL(blob));
            },
            error: () => {
              this.vistas.delete(id);
            },
          });
      }
    }
  }

  private cargarVistaPrevia(ruta: string): void {
    this.masivo
      .verImagen(ruta)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          if (this.vistaPrevia?.startsWith('blob:')) {
            URL.revokeObjectURL(this.vistaPrevia);
          }
          this.vistaPrevia = URL.createObjectURL(blob);
        },
        error: () => {
          this.vistaPrevia = null;
        },
      });
  }

  /* =========================================================
     PANEL DE INVENTARIO
  ========================================================= */

  private cargarPanel(sedeId: string): void {
    this.stockApi
      .GetApiV1StockDashboard({ sedeId })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dashboard = data;
        },
        error: () => {
          this.dashboard = null;
        },
      });

    this.stockApi
      .GetApiV1StockBajoStock({ sedeId, page: 0, size: 4 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (page) => {
          this.alertas = page.content ?? [];
        },
        error: () => {
          this.alertas = [];
        },
      });

    if (this.esAdmin) {
      this.kardex
        .GetApiV1KardexMermas({ sedeId, page: 0, size: 3 })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (data) => {
            this.mermas = data;
          },
          error: () => {
            this.mermas = null;
          },
        });
    } else {
      this.mermas = null;
    }
  }

  /* =========================================================
     PERMISOS
  ========================================================= */

  get esAdmin(): boolean {
    return this.tokens.session()?.rol === 'ROLE_ADMIN';
  }

  /* =========================================================
     SINCRONIZACIÓN DEL INVENTARIO
  ========================================================= */

  private avisarInventario(): void {
    this.omitirRevision = this.inventario.revision() + 1;
    this.inventario.marcarCambio();
    // Mutación del catálogo: descartar el buffer predictivo para no servir páginas viejas.
    this.buffer.invalidarPrefijo('productos:');
  }

  private esProducto(valor: unknown): valor is Api.ProductoResponseDTO {
    return (
      !!valor &&
      typeof valor === 'object' &&
      typeof (valor as { id?: unknown }).id === 'string'
    );
  }

  /* =========================================================
     ACTUALIZACIÓN LOCAL DEL PRODUCTO
  ========================================================= */

  private aplicarProducto(
    guardado: Api.ProductoResponseDTO,
    modo: 'crear' | 'actualizar',
  ): void {
    if (!guardado.id) return;

    if (this.stockFiltro) {
      this.cargar();
      return;
    }

    if (modo === 'crear' && this.state.page !== 0) {
      this.state.page = 0;
      this.cargar();
      return;
    }

    const visible = this.visibleEnFiltro(guardado);
    const existe = this.state.rows.some((row) => row.id === guardado.id);

    if (!visible && existe) {
      this.state.removeWhere((row) => row.id === guardado.id);
    } else if (visible) {
      this.state.upsert(guardado, (row) => row.id === guardado.id);
    }

    this.refrescarVista(guardado);
  }

  /* =========================================================
     VALIDACIÓN DE VISIBILIDAD CON FILTROS
  ========================================================= */

  private visibleEnFiltro(producto: Api.ProductoResponseDTO): boolean {
    const filtro = this.filtros.getRawValue();

    const textoBusqueda = [
      producto.nombre ?? '',
      producto.codigoSku ?? '',
      producto.categoria?.nombre ?? '',
    ].join(' ');

    if (!coincideBusqueda(textoBusqueda, filtro.searchTerm)) return false;

    if (filtro.categoriaId && producto.categoria?.id !== filtro.categoriaId) {
      return false;
    }

    if (filtro.tipo && producto.tipo !== filtro.tipo) return false;

    if (filtro.activo === 'true' && producto.activo === false) return false;
    if (filtro.activo === 'false' && producto.activo !== false) return false;

    if (filtro.esFraccionable === 'true' && producto.esFraccionable !== true) {
      return false;
    }
    if (filtro.esFraccionable === 'false' && producto.esFraccionable === true) {
      return false;
    }

    return true;
  }

  /* =========================================================
     ACTUALIZAR IMAGEN DE PRODUCTO
  ========================================================= */

  private refrescarVista(producto: Api.ProductoResponseDTO): void {
    const id = producto.id;
    const imagen = producto.imagen;
    if (!id) return;

    const previa = this.vistas.get(id);
    if (previa?.startsWith('blob:')) {
      URL.revokeObjectURL(previa);
    }
    this.vistas.delete(id);

    if (!imagen) return;

    if (imagen.startsWith('http://') || imagen.startsWith('https://')) {
      this.vistas.set(id, imagen);
      return;
    }

    this.masivo
      .verImagen(imagen)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          this.vistas.set(id, URL.createObjectURL(blob));
        },
        error: () => {
          this.vistas.delete(id);
        },
      });
  }

  /* =========================================================
     CONSTRUCCIÓN DEL DTO
  ========================================================= */

  private cuerpo(
    value: ReturnType<ProductosPageComponent['form']['getRawValue']>,
    productoId: string,
    fracciones: Api.CatalogoFraccionResponseDTO[],
  ): Api.ProductoRequestDTO {
    return {
      nombre: value.nombre.trim(),
      codigoSku: value.codigoSku.trim() || undefined,
      descripcion: value.descripcion.trim() || undefined,
      categoriaId: value.categoriaId || undefined,
      proveedorId: value.proveedorId || undefined,
      tipo: value.tipo,
      unidad: value.unidad.trim() || undefined,
      precioCompra: Number(value.precioCompra),
      precioVentaBase: Number(value.precioVentaBase),
      activo: value.activo,
      esFraccionable: value.esFraccionable,
      destacado: value.destacado,
      incluyeIgv: value.incluyeIgv,
      fracciones: value.esFraccionable
        ? this.fraccionesDe(productoId, fracciones)
        : undefined,
      imagen: value.imagen.trim() || undefined,
      /* ── Ubicación e inventario ── */
      sedeId: value.sedeId || undefined,
      almacenId: value.almacenId || undefined,
      stockInicial:
        Number(value.stockInicial) > 0 ? Number(value.stockInicial) : undefined,
      stockMinimo:
        Number(value.stockMinimo) > 0 ? Number(value.stockMinimo) : undefined,
      stockMaximo:
        Number(value.stockMaximo) > 0 ? Number(value.stockMaximo) : undefined,
      puntoReposicion:
        Number(value.puntoReposicion) > 0
          ? Number(value.puntoReposicion)
          : undefined,
    };
  }

  private cuerpoDesde(
    item: Api.ProductoResponseDTO,
    activo: boolean,
  ): Api.ProductoRequestDTO {
    return {
      nombre: item.nombre ?? '',
      codigoSku: item.codigoSku,
      descripcion: item.descripcion,
      categoriaId: item.categoria?.id,
      proveedorId: item.proveedor?.id,
      tipo: item.tipo ?? 'FISICO',
      unidad: item.unidad,
      precioCompra: Number(item.precioCompra ?? 0),
      precioVentaBase: Number(item.precioVentaBase ?? 0),
      activo,
      esFraccionable: item.esFraccionable ?? false,
      destacado: item.destacado ?? false,
      incluyeIgv: item.incluyeIgv ?? true,
      fracciones: item.esFraccionable
        ? this.fraccionesDe(item.id ?? '', item.fracciones ?? [])
        : undefined,
      imagen: item.imagen,
    };
  }

  private fraccionesDe(
    productoId: string,
    fracciones: Api.CatalogoFraccionResponseDTO[],
  ): Api.CatalogoFraccionRequestDTO[] | undefined {
    const lista = fracciones.filter(
      (fraccion) =>
        fraccion.nombreFraccion &&
        fraccion.factorDescuentoKardex &&
        productoId,
    );

    if (!lista.length) return undefined;

    return lista.map((fraccion) => ({
      productoId,
      nombreFraccion: fraccion.nombreFraccion ?? '',
      factorDescuentoKardex: Number(fraccion.factorDescuentoKardex),
      precioVenta: fraccion.precioVenta,
      activo: fraccion.activo ?? true,
    }));
  }

  /* =========================================================
     CONSTRUCCIÓN DE FILAS DE INVENTARIO
  ========================================================= */

  private fila(producto: Api.ProductoResponseDTO): FilaCatalogo {
    const registros = this.saldos.get(producto.id ?? '') ?? [];

    const cantidad = registros.reduce(
      (total, row) => total + Number(row.cantidad ?? 0),
      0,
    );

    const minimo = registros.reduce(
      (total, row) => total + Number(row.stockMinimo ?? 0),
      0,
    );

    const bajo =
      registros.some((row) => row.bajoMinimo) ||
      (minimo > 0 && cantidad <= minimo);

    const principal = [...registros].sort(
      (a, b) => Number(b.cantidad ?? 0) - Number(a.cantidad ?? 0),
    )[0];

    const unidad = principal?.unidad || producto.unidad || 'UNID';
    const cortes = this.cortes(producto, cantidad);
    const referencia = Math.max(minimo * 2, cantidad, 1);

    let estado: FilaCatalogo['estado'] = 'optimo';
    let estadoLabel = 'Óptimo';

    if (producto.activo === false) {
      estado = 'inactivo';
      estadoLabel = 'Inactivo';
    } else if (cantidad <= 0) {
      estado = 'agotado';
      estadoLabel = 'Sin stock';
    } else if (bajo) {
      estado = 'minimo';
      estadoLabel = 'Stock mínimo';
    }

    return {
      producto,
      cantidad,
      minimo,
      bajo,
      unidad,
      almacen: principal?.almacenNombre || 'Sin almacén',
      sede: principal?.sedeNombre || 'Sin sede',
      otrosAlmacenes: Math.max(registros.length - 1, 0),
      ancho: Math.max(0, Math.min(100, (cantidad / referencia) * 100)),
      cortes,
      estado,
      estadoLabel,
    };
  }

  /* =========================================================
     CORTES Y FRACCIONES
  ========================================================= */

  private cortes(
    producto: Api.ProductoResponseDTO,
    cantidad: number,
  ): CorteVista[] {
    const fracciones = (producto.fracciones ?? []).filter(
      (fraccion) => fraccion.activo !== false,
    );

    const base = fracciones.length
      ? fracciones
      : [
          {
            nombreFraccion: producto.unidad || 'Unidad',
            precioVenta: producto.precioVentaBase,
            factorDescuentoKardex: 1,
          },
        ];

    const vistos = base
      .map((fraccion) => {
        const factor = Number(fraccion.factorDescuentoKardex ?? 0);
        const equivalentes = factor > 0 ? cantidad / factor : 0;
        return {
          nombre: fraccion.nombreFraccion || 'Corte',
          precio: Number(fraccion.precioVenta ?? 0),
          factor,
          equivalentes,
          ancho: 0,
        };
      })
      .sort((a, b) => b.factor - a.factor);

    const mayor = Math.max(...vistos.map((corte) => corte.equivalentes), 1);

    return vistos.map((corte) => ({
      ...corte,
      ancho: Math.max(0, Math.min(100, (corte.equivalentes / mayor) * 100)),
    }));
  }
}

/* =========================================================
   RUTAS
========================================================= */

export const PRODUCTOS_ROUTES: Routes = [
  {
    path: '',
    component: ProductosPageComponent,
    title: 'Productos',
    data: {
      section: 'Inventario',
      breadcrumb: 'Productos',
    },
  },
];
