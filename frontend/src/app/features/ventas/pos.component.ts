import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild, ChangeDetectionStrategy, effect, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EMPTY, forkJoin, Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap, takeUntil } from 'rxjs/operators';
import { expand, reduce } from 'rxjs/operators';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { PenPipe } from '../../shared/pipes/format.pipes';
import { CajaSessionService } from '../../shared/services/caja-session.service';
import { SedeFiltroService } from '../../shared/services/sede-filtro.service';
import { InventarioSyncService } from '../../shared/services/inventario-sync.service';
import { LookupService } from '../../shared/services/lookup.service';
import { MarcaService } from '../../shared/services/marca.service';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { CotizacionesApiService } from '../cotizaciones/data-access/cotizaciones.api';
import { FacturacionElectronicaApiService } from '../facturacion-electronica/data-access/facturacion-electronica.api';
import { PreformasApiService } from '../preformas/data-access/preformas.api';
import { TicketVentaData, VentaTicketComponent, ticketDesdeVenta } from './components/venta-ticket.component';
import { ofertaVigente, precioFraccionVigente, precioVigente } from '../../shared/utils/precio-oferta';
import { coincideBusqueda } from '../../shared/utils/search-text';
import * as Api from '../../core/api/openapi.types';
import { VentasApiService as GeneratedVentasApiService } from './data-access/ventas.api';
import { Almacen, Cliente, Fraccion, Page, Producto, Sede, Servicio, StockFila, Turno, VentasApiService } from './ventas-api.service';

type Catalogo = 'productos' | 'servicios' | 'favoritos';
type Comprobante = 'BOLETA' | 'FACTURA';
type Metodo = 'EFECTIVO' | 'TARJETA' | 'YAPE' | 'PLIN' | 'TRANSFERENCIA' | 'SIP_AGORA';

interface Linea {
  tipo: 'PRODUCTO' | 'SERVICIO';
  id: string;
  nombre: string;
  detalle?: string;
  precio: number;
  cantidad: number;
  unidad?: string;
  fraccion?: Fraccion;
}

const FAVORITOS = 'erp-pos-favoritos';

function mensajeError(error: unknown): string {
  const http = error as { error?: { message?: string; detail?: string }; message?: string };
  return http?.error?.message || http?.error?.detail || http?.message || 'No se pudo completar la operación.';
}

function redondear(valor: number, decimales = 2): number {
  const factor = 10 ** decimales;
  return Math.round((valor + Number.EPSILON) * factor) / factor;
}

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, PenPipe, ModalComponent, VentaTicketComponent],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css', './pos.component.part2.css', './pos.component.part3.css'],
})
export class PosComponent implements OnInit, OnDestroy {
  @ViewChild('buscador') buscador?: ElementRef<HTMLInputElement>;

  productos: Producto[] = [];
  servicios: Servicio[] = [];
  clientes: Cliente[] = [];
  sedes: Sede[] = [];
  almacenes: Almacen[] = [];
  carrito: Linea[] = [];
  fracciones: Record<string, Fraccion[]> = {};
  stock: Record<string, number> = {};
  favoritos = new Set<string>();
  vistas = new Map<string, string>();

  sedeId = '';
  almacenId = '';
  clienteId = '';
  turno?: Turno;
  busqueda = '';
  mensaje = '';
  error = '';
  catalogo: Catalogo = 'productos';
  comprobante: Comprobante = 'BOLETA';
  metodo: Metodo = 'EFECTIVO';
  referencia = '';
  guardando = false;
  catalogoCargando = false;
  stockListo = false;
  stockError = false;
  resaltada = '';
  rucEmpresa = '';
  rucEmpresa20 = false;
  ventaRegistrada: TicketVentaData | null = null;
  ticketAbierto = false;
  ticketDetalleError = '';

  readonly metodos: Array<{ id: Metodo; label: string; icon: string }> = [
    { id: 'EFECTIVO', label: 'Efectivo', icon: 'cash' },
    { id: 'TARJETA', label: 'Tarjeta', icon: 'card' },
    { id: 'YAPE', label: 'Yape', icon: 'cash' },
    { id: 'PLIN', label: 'Plin', icon: 'cash' },
    { id: 'TRANSFERENCIA', label: 'Transferencia', icon: 'building' },
    { id: 'SIP_AGORA', label: 'Agora', icon: 'cash' },
  ];

  private readonly destroy$ = new Subject<void>();
  private stockToken = 0;
  private sedeToken = 0;
  private readonly blobs: string[] = [];
  private resalteTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly api: VentasApiService,
    private readonly ventasApi: GeneratedVentasApiService,
    private readonly caja: CajaSessionService,
    private readonly inventario: InventarioSyncService,
    private readonly lookup: LookupService,
    private readonly preformas: PreformasApiService,
    private readonly cotizaciones: CotizacionesApiService,
    private readonly sunat: FacturacionElectronicaApiService,
    readonly marca: MarcaService,
    private readonly cdr: ChangeDetectorRef,
    private readonly sedeFiltro: SedeFiltroService,
  ) {
    let revisionInventario = this.inventario.revision();
    effect(() => {
      const revision = this.inventario.revision();
      if (revision === revisionInventario) return;
      revisionInventario = revision;
      untracked(() => {
        this.cargarCatalogos();
        if (this.almacenId) this.seleccionarAlmacen(this.almacenId);
      });
    });
  }

  ngOnInit(): void {
    const abierto = this.caja.turno();
    if (abierto?.id && abierto.estado !== 'CERRADO') {
      this.turno = {
        id: abierto.id,
        montoInicial: abierto.montoInicial ?? 0,
        estado: 'ABIERTO',
        fechaApertura: abierto.fechaApertura ?? '',
        observaciones: abierto.observaciones,
        sede: abierto.sede?.id ? { id: abierto.sede.id } : undefined,
      };
    }
    this.favoritos = new Set(this.leerFavoritos());
    this.api.sedes().pipe(takeUntil(this.destroy$)).subscribe({
      next: (page) => {
        this.sedes = page.content.filter((sede) => sede.activa);
        const preferida = this.sedeFiltro.sedeId();
        const elegida = this.sedes.find((sede) => sede.id === preferida) ?? this.sedes[0];
        if (elegida) this.seleccionarSede(elegida.id);
        this.refrescar();
      },
      error: () => { this.error = 'No se pudieron cargar las sedes.'; this.refrescar(); },
    });
    this.cargarCatalogos();
    this.api.clientes().pipe(takeUntil(this.destroy$)).subscribe((page) => { this.clientes = page.content; this.refrescar(); });
    this.sunat.panel().pipe(takeUntil(this.destroy$), catchError(() => of(null))).subscribe((panel) => {
      this.rucEmpresa = panel?.ruc?.trim() ?? '';
      this.rucEmpresa20 = panel?.rucEmpresa20 === true;
      this.refrescar();
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.resalteTimer);
    for (const url of this.blobs) URL.revokeObjectURL(url);
    this.destroy$.next();
    this.destroy$.complete();
  }

  
  /**
   * Navega dentro de la misma vista del Punto de Venta.
   * No cambia rutas ni modifica la sesión del usuario.
   */
  irASeccion(id: string): void {
    const elemento = document.getElementById(id);

    if (!elemento) {
      console.warn(`No se encontró la sección del POS: ${id}`);
      return;
    }

    elemento.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }


  @HostListener('window:keydown', ['$event'])
  atajo(event: KeyboardEvent): void {
    const escribe = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement;
    if (event.key === 'F2') {
      event.preventDefault();
      this.buscador?.nativeElement.focus();
    }
    if (event.key === 'F10' && !escribe) {
      event.preventDefault();
      this.cobrar();
    }
  }

  get cajaTexto(): string {
    const nombre = this.turno?.observaciones?.trim();
    return nombre ? `Caja abierta: ${nombre}` : 'Caja abierta';
  }

  get clienteSeleccionado(): Cliente | undefined {
    return this.clientes.find((cliente) => cliente.id === this.clienteId);
  }

  get almacenNombre(): string {
    return this.almacenes.find((almacen) => almacen.id === this.almacenId)?.nombre ?? '';
  }

  get textoTicket(): string {
    const cantidad = this.carrito.length;
    if (!cantidad) return 'Todavía no hay productos';
    return cantidad === 1 ? '1 ítem' : `${cantidad} ítems`;
  }

  get productosVisibles(): Producto[] {
    if (this.catalogo === 'servicios') return [];
    const consulta = this.normalizar(this.busqueda);
    return this.productos.filter((producto) => {
      if (this.catalogo === 'favoritos' && !this.favoritos.has(producto.id)) return false;
      return this.coincideProducto(producto, consulta);
    });
  }

  get serviciosVisibles(): Servicio[] {
    if (this.catalogo === 'productos') return [];
    const consulta = this.normalizar(this.busqueda);
    return this.servicios.filter((servicio) => {
      if (this.catalogo === 'favoritos' && !this.favoritos.has(servicio.id)) return false;
      return coincideBusqueda(`${servicio.nombre} ${servicio.descripcion ?? ''}`, consulta);
    });
  }

  get conteoProductos(): number {
    const consulta = this.normalizar(this.busqueda);
    return this.productos.filter((producto) => this.coincideProducto(producto, consulta)).length;
  }

  get conteoServicios(): number {
    const consulta = this.normalizar(this.busqueda);
    return this.servicios.filter((servicio) => coincideBusqueda(`${servicio.nombre} ${servicio.descripcion ?? ''}`, consulta)).length;
  }

  get conteoFavoritos(): number {
    const consulta = this.normalizar(this.busqueda);
    const productos = this.productos.filter((producto) => this.favoritos.has(producto.id) && this.coincideProducto(producto, consulta)).length;
    const servicios = this.servicios.filter((servicio) => this.favoritos.has(servicio.id) && coincideBusqueda(`${servicio.nombre} ${servicio.descripcion ?? ''}`, consulta)).length;
    return productos + servicios;
  }

  get subtotal(): number {
    return redondear(this.carrito.reduce((suma, linea) => suma + this.importe(linea).neto, 0));
  }

  get igv(): number {
    return redondear(this.carrito.reduce((suma, linea) => suma + this.importe(linea).igv, 0));
  }

  get total(): number {
    return redondear(this.carrito.reduce((suma, linea) => suma + this.importe(linea).total, 0));
  }

  cargarCatalogos(): void {
    this.catalogoCargando = true;
    forkJoin({
      productos: this.api.productos().pipe(
        switchMap((page) => this.unirPaginas(page, (numero) => this.api.productos('', numero))),
        catchError(() => of(null)),
      ),
      servicios: this.api.servicios().pipe(map((page) => page.content ?? []), catchError(() => of(null))),
    }).pipe(takeUntil(this.destroy$)).subscribe(({ productos, servicios }) => {
      if (!productos) this.error = 'No se pudo cargar el catálogo de productos.';
      else {
        this.productos = productos;
        this.aplicarFracciones(productos);
        this.prepararVistas(productos);
      }
      if (!servicios) this.error = this.error || 'No se pudieron cargar los servicios.';
      else this.servicios = servicios;
      this.catalogoCargando = false;
      this.refrescar();
    });
  }

  seleccionarSede(id: string): void {
    const token = ++this.sedeToken;
    this.stockToken += 1;
    this.sedeId = id;
    this.almacenId = '';
    this.almacenes = [];
    this.stock = {};
    this.stockListo = false;
    this.stockError = false;
    this.error = '';
    if (!id) {
      this.refrescar();
      return;
    }
    this.api.almacenes(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (rows) => {
        if (token !== this.sedeToken) return;
        this.almacenes = rows.filter((almacen) => almacen.activo);
        if (this.almacenes[0]) this.seleccionarAlmacen(this.almacenes[0].id);
        this.refrescar();
      },
      error: (error: unknown) => {
        if (token !== this.sedeToken) return;
        this.error = `No se pudieron cargar los almacenes. ${mensajeError(error)}`;
        this.refrescar();
      },
    });
  }

  seleccionarAlmacen(id: string): void {
    const token = ++this.stockToken;
    this.almacenId = id;
    this.stock = {};
    this.stockListo = false;
    this.stockError = false;
    this.error = '';
    if (!id) {
      this.refrescar();
      return;
    }
    this.api.stockAlmacen(id).pipe(
      switchMap((page) => this.unirPaginas(page, (numero) => this.api.stockAlmacen(id, numero))),
      takeUntil(this.destroy$),
    ).subscribe({
      next: (filas) => this.aplicarStock(token, filas),
      error: (error: unknown) => {
        if (token !== this.stockToken) return;
        this.stock = {};
        this.stockListo = false;
        this.stockError = true;
        this.error = `No se pudo leer el stock del almacén. ${mensajeError(error)}`;
        this.refrescar();
      },
    });
  }

  fraccionesDe(producto: Producto): Fraccion[] {
    return this.fracciones[producto.id] ?? [];
  }

  stockNumero(producto: Producto): number | null {
    if (!this.almacenId || !this.stockListo) return null;
    return this.stock[producto.id] ?? 0;
  }

  etiquetaStock(producto: Producto): string {
    const saldo = this.stockNumero(producto);
    const unidad = this.unidadCorta(producto.unidad);
    if (saldo === null) return this.stockError ? 'Stock no disponible' : 'Consultando stock…';
    if (saldo <= 0) return `Sin stock · 0 ${unidad}`;
    return `${this.formatoCantidad(saldo)} ${unidad}`;
  }

  claseStock(producto: Producto): string {
    const saldo = this.stockNumero(producto);
    if (saldo === null) return 'espera';
    return saldo > 0 ? 'ok' : 'vacio';
  }

  textoCorte(producto: Producto, fraccion: Fraccion): string {
    const unidad = this.unidadCorta(producto.unidad);
    const factor = this.formatoCantidad(Number(fraccion.factorDescuentoKardex ?? 1));
    const saldo = this.stockNumero(producto);
    if (saldo === null) return `Descuenta ${factor} ${unidad}`;
    const cupos = this.alcanza(producto, fraccion);
    if (cupos !== null && cupos > 0) return `Descuenta ${factor} · caben ${cupos}`;
    return saldo > 0 ? `Descuenta ${factor} · no alcanza` : 'Sin stock';
  }

  avisoProducto(producto: Producto): string {
    if (!this.almacenId) return 'Elige el almacén para ver el stock y agregar.';
    if (this.stockError) return 'No se pudo leer el stock de este almacén.';
    return '';
  }

  corteDisponible(producto: Producto, fraccion?: Fraccion): boolean {
    return this.motivo(producto, fraccion) === '';
  }

  tituloCorte(producto: Producto, fraccion: Fraccion): string {
    return this.motivo(producto, fraccion) || `Agregar ${fraccion.nombreFraccion}`;
  }

  tituloProducto(producto: Producto): string {
    return this.motivo(producto) || 'Agregar al ticket';
  }

  vistaDe(producto: Producto): string | null {
    return this.vistas.get(producto.id) ?? null;
  }

  marcarImagenRota(id: string): void {
    this.vistas.delete(id);
    this.refrescar();
  }

  inicial(nombre: string): string {
    return (nombre || 'P').trim().slice(0, 1).toUpperCase();
  }

  trackProducto(_index: number, producto: Producto): string { return producto.id; }
  trackServicio(_index: number, servicio: Servicio): string { return servicio.id; }
  trackFraccion(_index: number, fraccion: Fraccion): string { return fraccion.id; }
  /** trackBy se invoca sin el componente como this; la clave no puede usar métodos de la clase. */
  trackLinea(_index: number, linea: Linea): string {
    return `${linea.tipo}:${linea.id}:${linea.fraccion?.id ?? ''}`;
  }

  esFavorito(id: string): boolean {
    return this.favoritos.has(id);
  }

  alternarFavorito(id: string): void {
    const siguiente = new Set(this.favoritos);
    if (siguiente.has(id)) siguiente.delete(id);
    else siguiente.add(id);
    this.favoritos = siguiente;
    localStorage.setItem(FAVORITOS, JSON.stringify([...siguiente]));
  }

  enOferta(producto: Producto): boolean { return ofertaVigente(producto); }
  precioDe(producto: Producto): number { return precioVigente(Number(producto.precioVentaBase), producto); }

  agregarProducto(producto: Producto, fraccion?: Fraccion): void {
    if (producto.esFraccionable && !fraccion) {
      this.error = 'Elige la medida del producto. Cada botón agrega ese corte al ticket.';
      return;
    }
    const bloqueo = this.motivo(producto, fraccion);
    if (bloqueo) {
      this.error = bloqueo;
      return;
    }
    this.agregar({
      tipo: 'PRODUCTO',
      id: producto.id,
      nombre: producto.nombre,
      detalle: fraccion?.nombreFraccion,
      precio: fraccion
        ? precioFraccionVigente(Number(fraccion.precioVenta), producto)
        : precioVigente(Number(producto.precioVentaBase), producto),
      cantidad: 1,
      unidad: this.unidadCorta(producto.unidad),
      fraccion,
    });
  }

  agregarServicio(servicio: Servicio): void {
    this.agregar({
      tipo: 'SERVICIO',
      id: servicio.id,
      nombre: servicio.nombre,
      detalle: servicio.descripcion,
      precio: Number(servicio.precio),
      cantidad: 1,
    });
  }

  cantidadEnTicket(productoId: string, fraccionId?: string): number {
    return this.carrito.reduce((suma, linea) => {
      if (linea.tipo !== 'PRODUCTO' || linea.id !== productoId) return suma;
      if (fraccionId) return linea.fraccion?.id === fraccionId ? suma + linea.cantidad : suma;
      return linea.fraccion ? suma : suma + linea.cantidad;
    }, 0);
  }

  cantidadServicio(id: string): number {
    return this.carrito.reduce((suma, linea) => linea.tipo === 'SERVICIO' && linea.id === id ? suma + linea.cantidad : suma, 0);
  }

  ajustar(index: number, delta: number): void {
    const actual = this.carrito[index];
    if (!actual) return;
    this.fijarCantidad(index, redondear(actual.cantidad + delta, 4));
  }

  fijarCantidad(index: number, valor: number): void {
    const cantidad = Number(valor);
    if (!Number.isFinite(cantidad) || cantidad <= 0) return;
    const actual = this.carrito[index];
    if (!actual) return;
    if (actual.tipo === 'PRODUCTO' && !this.alcanzaStock(actual, cantidad, index)) {
      this.error = 'No hay stock suficiente en el almacén seleccionado.';
      return;
    }
    const next = [...this.carrito];
    next[index] = { ...actual, cantidad };
    this.carrito = next;
    this.error = '';
    this.resaltar(actual);
  }

  quitar(index: number): void {
    this.carrito = this.carrito.filter((_, i) => i !== index);
  }

  importe(linea: Linea): { neto: number; igv: number; total: number } {
    const total = redondear(Number(linea.precio) * linea.cantidad);
    const neto = total / 1.18;
    return { neto, igv: total - neto, total };
  }

  consumoTexto(linea: Linea): string {
    const factor = Number(linea.fraccion?.factorDescuentoKardex ?? 1) || 1;
    const total = factor * linea.cantidad;
    const unidad = linea.unidad || 'UNID';
    return `Descuenta ${this.formatoCantidad(total)} ${unidad} del almacén`;
  }

  cobrar(): void {
    this.error = '';
    this.mensaje = '';
    if (this.guardando) return;
    if (!this.turno || !this.almacenId || !this.carrito.length || !this.sedeId) {
      this.error = 'Abre el turno en Caja, elige el almacén y agrega al menos una línea.';
      return;
    }
    if (this.turno.sede?.id && this.turno.sede.id !== this.sedeId) {
      this.error = 'La caja abierta pertenece a otra sede.';
      return;
    }
    const total = this.total;
    const data: Api.RegistrarVentaRequestDTO = {
      sedeId: this.sedeId,
      almacenId: this.almacenId,
      clienteId: this.clienteId || undefined,
      turnoCajaId: this.turno.id,
      tipoComprobante: this.comprobante,
      canalVenta: 'LOCAL',
      lineas: this.lineasVenta(),
      pagos: [{ metodoPago: this.metodo, monto: total, referencia: this.referencia.trim() || undefined }],
    };
    const resumenLineas = this.carrito.map((linea) => ({
      descripcion: `${linea.nombre}${linea.detalle ? ` · ${linea.detalle}` : ''}`,
      cantidad: linea.cantidad,
      precioUnitario: linea.precio,
      subtotal: this.importe(linea).total,
    }));
    const cliente = this.clienteSeleccionado;
    const sedeNombre = this.sedes.find((sede) => sede.id === this.sedeId)?.nombre;
    const pagos = [{ metodo: this.metodos.find((metodo) => metodo.id === this.metodo)?.label ?? this.metodo, monto: total, referencia: this.referencia.trim() || undefined }];
    this.guardando = true;
    this.ventasApi.PostApiV1Ventas({}, data).pipe(takeUntil(this.destroy$)).subscribe({
      next: (venta) => {
        this.carrito = [];
        this.referencia = '';
        this.inventario.marcarCambio();
        this.caja.tocar();
        this.lookup.invalidate('productos');
        if (!venta.id) {
          this.error = 'El servidor registró la venta, pero no devolvió su identificador. Busca la venta en el historial antes de volver a cobrar.';
          this.guardando = false;
          return;
        }
        const fiscal = this.comprobante === 'FACTURA' ? 'FACTURA' : 'BOLETA';
        this.ventaRegistrada = {
          id: venta.id,
          serieCorrelativo: venta.serieCorrelativo,
          tipoComprobante: fiscal,
          estado: venta.estado || 'COMPLETADA',
          estadoSunat: 'PENDIENTE',
          createdAt: new Date().toISOString(),
          sedeNombre,
          clienteNombre: cliente?.nombre,
          clienteDocumento: cliente?.numeroDocumento,
          subtotalNeto: venta.subtotalNeto ?? this.subtotal,
          totalIgv: venta.totalIgv ?? this.igv,
          total: venta.total ?? total,
          lineas: resumenLineas,
          pagos,
        };
        this.ticketDetalleError = '';
        this.ticketAbierto = true;
        this.ventasApi.GetApiV1VentasId({ id: venta.id }).pipe(takeUntil(this.destroy$)).subscribe({
          next: (detalle) => {
            if (this.ventaRegistrada?.id === venta.id) this.ventaRegistrada = ticketDesdeVenta(detalle) ?? this.ventaRegistrada;
          },
          error: (error: unknown) => {
            console.error('La venta se registró, pero no se pudo cargar su detalle persistido.', error);
            this.ticketDetalleError = 'No se pudo actualizar el ticket con el detalle del servidor; se muestra el resumen capturado al cobrar.';
          },
        });
        this.mensaje = `Venta registrada en el ERP. Emisión electrónica SUNAT pendiente de configurar.`;
        this.guardando = false;
      },
      error: (error: unknown) => {
        this.error = mensajeError(error);
        this.guardando = false;
      },
    });
  }

  cerrarTicket(): void {
    this.ticketAbierto = false;
  }

  guardarPreforma(): void {
    if (!this.puedeGuardar()) return;
    this.guardando = true;
    this.preformas.PostApiV1Preformas({}, {
      sedeId: this.sedeId,
      clienteId: this.clienteId || undefined,
      lineas: this.lineasVenta(),
      minutosVigencia: 60,
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (documento) => {
        this.mensaje = `Borrador POS ${documento.codigo ?? ''} guardado. No reserva stock ni es un comprobante fiscal.`;
        this.guardando = false;
      },
      error: (error: unknown) => this.falloGuardado(error),
    });
  }

  guardarCotizacion(): void {
    if (!this.puedeGuardar()) return;
    this.guardando = true;
    this.cotizaciones.PostApiV1Cotizaciones({}, {
      sedeId: this.sedeId,
      clienteId: this.clienteId || undefined,
      lineas: this.lineasVenta(),
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (documento) => {
        this.mensaje = `Cotización ${documento.id ?? ''} guardada.`;
        this.guardando = false;
      },
      error: (error: unknown) => this.falloGuardado(error),
    });
  }

  private puedeGuardar(): boolean {
    this.error = '';
    this.mensaje = '';
    if (!this.sedeId || !this.carrito.length || this.guardando) {
      this.error = 'Elige la sede y agrega al menos una línea.';
      return false;
    }
    return true;
  }

  private falloGuardado(error: unknown): void {
    this.error = mensajeError(error);
    this.guardando = false;
  }

  private lineasVenta(): Array<{ productoId?: string; fraccionId?: string; servicioId?: string; cantidad: number }> {
    return this.carrito.map((linea) => linea.tipo === 'PRODUCTO'
      ? { productoId: linea.id, fraccionId: linea.fraccion?.id, cantidad: linea.cantidad }
      : { servicioId: linea.id, cantidad: linea.cantidad });
  }

  private agregar(linea: Linea): void {
    this.error = '';
    if (linea.tipo === 'PRODUCTO' && !this.almacenId) {
      this.error = 'Elige el almacén para validar el stock.';
      return;
    }
    const index = this.carrito.findIndex((item) => item.tipo === linea.tipo && item.id === linea.id && item.fraccion?.id === linea.fraccion?.id);
    if (index >= 0) {
      this.ajustar(index, 1);
      return;
    }
    if (linea.tipo === 'PRODUCTO' && !this.alcanzaStock(linea, linea.cantidad, -1)) {
      this.error = 'No hay stock suficiente en el almacén seleccionado.';
      return;
    }
    this.carrito = [...this.carrito, linea];
    this.resaltar(linea);
  }

  /** El consumo de una fracción es su factor sobre el saldo en unidad base. */
  private alcanzaStock(linea: Linea, cantidad: number, excepto: number): boolean {
    const disponible = this.stock[linea.id] ?? 0;
    const consumo = (item: Linea, unidades: number) => Number(item.fraccion?.factorDescuentoKardex ?? 1) * unidades;
    const otros = this.carrito.reduce((suma, item, indice) => {
      if (indice === excepto || item.tipo !== 'PRODUCTO' || item.id !== linea.id) return suma;
      return suma + consumo(item, item.cantidad);
    }, 0);
    return otros + consumo(linea, cantidad) <= disponible + 1e-9;
  }

  private motivo(producto: Producto, fraccion?: Fraccion): string {
    if (!this.almacenId) return 'Primero elige el almacén.';
    if (!this.stockListo) return this.stockError ? 'No se pudo leer el stock.' : 'Consultando el stock del almacén.';
    if (producto.esFraccionable && !fraccion) return 'Elige una medida.';
    const saldo = this.stock[producto.id] ?? 0;
    const factor = Number(fraccion?.factorDescuentoKardex ?? 1) || 1;
    const usado = this.consumoEnCarrito(producto.id);
    if (usado + factor > saldo + 1e-9) {
      return saldo <= 0 ? 'Sin stock en el almacén seleccionado.' : 'El ticket ya usa el stock disponible.';
    }
    return '';
  }

  private alcanza(producto: Producto, fraccion?: Fraccion): number | null {
    const saldo = this.stockNumero(producto);
    if (saldo === null) return null;
    const factor = Number(fraccion?.factorDescuentoKardex ?? 1) || 1;
    const usado = this.consumoEnCarrito(producto.id);
    return Math.floor((saldo - usado + 1e-9) / factor);
  }

  private consumoEnCarrito(productoId: string): number {
    return this.carrito.reduce((suma, linea) => {
      if (linea.tipo !== 'PRODUCTO' || linea.id !== productoId) return suma;
      return suma + Number(linea.fraccion?.factorDescuentoKardex ?? 1) * linea.cantidad;
    }, 0);
  }

  private aplicarStock(token: number, filas: StockFila[]): void {
    if (token !== this.stockToken) return;
    const siguiente: Record<string, number> = {};
    for (const fila of filas) {
      const id = fila.productoId || fila.producto?.id;
      if (id) siguiente[id] = Number(fila.cantidad ?? 0);
    }
    this.stock = siguiente;
    this.stockListo = true;
    this.stockError = false;
    this.refrescar();
  }

  private aplicarFracciones(productos: Producto[]): void {
    const siguiente = { ...this.fracciones };
    const pendientes: Producto[] = [];
    for (const producto of productos) {
      const embebidas = (producto.fracciones ?? []).filter((fraccion) => fraccion.activo !== false && fraccion.id);
      if (embebidas.length) siguiente[producto.id] = this.ordenarCortes(embebidas);
      else if (producto.esFraccionable && !siguiente[producto.id]) pendientes.push(producto);
    }
    this.fracciones = siguiente;
    if (pendientes.length) this.cargarFracciones(pendientes);
  }

  private ordenarCortes(lista: Fraccion[]): Fraccion[] {
    return [...lista].sort((a, b) => Number(b.factorDescuentoKardex ?? 0) - Number(a.factorDescuentoKardex ?? 0));
  }

  private cargarFracciones(productos: Producto[]): void {
    forkJoin(productos.map((producto) => this.api.fracciones(producto.id).pipe(catchError(() => of([] as Fraccion[])))))
      .pipe(takeUntil(this.destroy$))
      .subscribe((listas) => {
        const siguiente = { ...this.fracciones };
        productos.forEach((producto, index) => {
          siguiente[producto.id] = this.ordenarCortes(listas[index].filter((fraccion) => fraccion.activo !== false));
        });
        this.fracciones = siguiente;
        this.refrescar();
      });
  }

  private prepararVistas(productos: Producto[]): void {
    for (const producto of productos) {
      const imagen = producto.imagen?.trim();
      if (!imagen || this.vistas.has(producto.id)) continue;
      if (/^https?:\/\//i.test(imagen)) {
        this.vistas.set(producto.id, imagen);
        continue;
      }
      this.api.imagen(imagen).pipe(takeUntil(this.destroy$)).subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          this.blobs.push(url);
          this.vistas.set(producto.id, url);
          this.refrescar();
        },
        error: () => this.vistas.delete(producto.id),
      });
    }
  }

  private unirPaginas<T>(primera: Page<T>, mas: (pagina: number) => Observable<Page<T>>): Observable<T[]> {
    return of(primera).pipe(
      expand((pagina) => {
        const siguiente = (pagina.number ?? 0) + 1;
        return siguiente < (pagina.totalPages ?? 1) ? mas(siguiente) : EMPTY;
      }),
      reduce((items, pagina) => items.concat(pagina.content ?? []), [] as T[]),
    );
  }

  private coincideProducto(producto: Producto, consulta: string): boolean {
    if (!consulta) return true;
    const cortes = (this.fracciones[producto.id] ?? []).map((fraccion) => fraccion.nombreFraccion).join(' ');
    return coincideBusqueda(`${producto.nombre} ${producto.codigoSku ?? ''} ${cortes}`, consulta);
  }

  private normalizar(valor: string): string {
    return valor.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  private unidadCorta(unidad?: string): string {
    const valor = (unidad || 'UNID').trim();
    return /^unid/i.test(valor) ? 'UNID' : valor;
  }

  private formatoCantidad(valor: number): string {
    if (!Number.isFinite(valor)) return '0';
    return new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 }).format(valor);
  }

  private clave(linea: Linea): string {
    return `${linea.tipo}:${linea.id}:${linea.fraccion?.id ?? ''}`;
  }

  private resaltar(linea: Linea): void {
    this.resaltada = this.clave(linea);
    clearTimeout(this.resalteTimer);
    this.resalteTimer = setTimeout(() => {
      this.resaltada = '';
      this.refrescar();
    }, 1400);
  }

  private refrescar(): void {
    this.cdr.detectChanges();
  }

  private leerFavoritos(): string[] {
    try {
      const raw = localStorage.getItem(FAVORITOS);
      const parsed = raw ? JSON.parse(raw) as unknown : [];
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  }
}
