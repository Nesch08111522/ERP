import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes } from '@angular/router';
import { EMPTY, Observable, Subject, expand, reduce, takeUntil } from 'rxjs';
import * as Api from '../../../core/api/openapi.types';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { InventarioSyncService } from '../../../shared/services/inventario-sync.service';
import { LookupService } from '../../../shared/services/lookup.service';
import { ToastService } from '../../../shared/services/toast.service';
import { problemText } from '../../../shared/utils/feedback';
import { coincideBusqueda } from '../../../shared/utils/search-text';
import { ProductosApiService } from '../../productos/data-access/productos.api';

interface NivelFraccion {
  nombreFraccion: string;
  factorDescuentoKardex: number;
  precioVenta: number;
  activo: boolean;
  personalizado: boolean;
}

const NIVELES_ESTANDAR = [
  { nombreFraccion: 'Fracción 1/4', factorDescuentoKardex: 0.25 },
  { nombreFraccion: 'Fracción 1/2', factorDescuentoKardex: 0.5 },
  { nombreFraccion: 'Fracción 3/4', factorDescuentoKardex: 0.75 },
  { nombreFraccion: 'Plancha entera', factorDescuentoKardex: 1 },
];

@Component({
  selector: 'app-catalogo-fracciones-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent, IconComponent],
  templateUrl: './catalogo-fracciones-page.component.html',
  styleUrls: ['./catalogo-fracciones-page.component.css'],
})
export class CatalogoFraccionesPageComponent implements OnInit, OnDestroy {
  productos: Api.ProductoResponseDTO[] = [];
  productoSeleccionado: Api.ProductoResponseDTO | null = null;
  niveles: NivelFraccion[] = [];
  busqueda = '';
  filtro: 'TODOS' | 'FRACCIONABLES' | 'NORMALES' = 'TODOS';
  fraccionable = false;
  cargando = true;
  cargandoProducto = false;
  guardando = false;
  error: string | null = null;
  private seleccionToken = 0;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly productosApi: ProductosApiService,
    private readonly lookup: LookupService,
    private readonly inventario: InventarioSyncService,
    private readonly toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get productosVisibles(): Api.ProductoResponseDTO[] {
    return this.productos.filter((producto) => {
      if (this.filtro === 'FRACCIONABLES' && !producto.esFraccionable) return false;
      if (this.filtro === 'NORMALES' && producto.esFraccionable) return false;
      return coincideBusqueda(`${producto.nombre ?? ''} ${producto.codigoSku ?? ''}`, this.busqueda);
    });
  }

  get precioBase(): number {
    return Number(this.productoSeleccionado?.precioVentaBase ?? 0);
  }

  sugerido(factor: number): number {
    return Math.round((this.precioBase * factor + Number.EPSILON) * 100) / 100;
  }

  seleccionar(producto: Api.ProductoResponseDTO): void {
    if (!producto.id) return;
    const token = ++this.seleccionToken;
    this.productoSeleccionado = producto;
    this.cargandoProducto = true;
    this.error = null;
    this.productosApi.GetApiV1ProductosId({ id: producto.id }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (detalle) => {
        if (token !== this.seleccionToken) return;
        this.configurarProducto(detalle);
        this.cargandoProducto = false;
      },
      error: (error: unknown) => {
        if (token !== this.seleccionToken) return;
        this.cargandoProducto = false;
        this.error = problemText(error);
      },
    });
  }

  cambiarFraccionable(activo: boolean): void {
    this.fraccionable = activo;
    if (activo && !this.niveles.length) this.niveles = this.crearNiveles([]);
  }

  restaurarPreciosSugeridos(): void {
    this.niveles = this.niveles.map((nivel) => ({
      ...nivel,
      precioVenta: this.sugerido(nivel.factorDescuentoKardex),
    }));
  }

  guardar(): void {
    const producto = this.productoSeleccionado;
    if (!producto?.id || this.guardando || this.cargandoProducto) return;
    if (this.fraccionable && !this.niveles.some((nivel) => nivel.activo)) {
      this.error = 'Activa al menos una medida para habilitar la venta fraccionada.';
      return;
    }
    if (this.niveles.some((nivel) => !Number.isFinite(nivel.precioVenta) || nivel.precioVenta < 0)) {
      this.error = 'Los precios deben ser números iguales o mayores que cero.';
      return;
    }

    const fracciones = this.fraccionable
      ? this.niveles.map((nivel) => ({
          productoId: producto.id!,
          nombreFraccion: nivel.nombreFraccion,
          factorDescuentoKardex: nivel.factorDescuentoKardex,
          precioVenta: Number(nivel.precioVenta),
          activo: nivel.activo,
        }))
      : [];
    const cuerpo: Api.ProductoRequestDTO = {
      nombre: producto.nombre ?? '',
      codigoSku: producto.codigoSku,
      descripcion: producto.descripcion,
      categoriaId: producto.categoria?.id,
      proveedorId: producto.proveedor?.id,
      tipo: producto.tipo ?? 'FISICO',
      unidad: producto.unidad,
      precioCompra: Number(producto.precioCompra ?? 0),
      precioVentaBase: Number(producto.precioVentaBase ?? 0),
      activo: producto.activo !== false,
      esFraccionable: this.fraccionable,
      destacado: producto.destacado ?? false,
      incluyeIgv: producto.incluyeIgv ?? true,
      imagen: producto.imagen,
      fracciones,
    };

    this.guardando = true;
    this.error = null;
    this.productosApi.PutApiV1ProductosId({ id: producto.id }, cuerpo).pipe(takeUntil(this.destroy$)).subscribe({
      next: (actualizado) => {
        this.guardando = false;
        this.configurarProducto(actualizado);
        this.productos = this.productos.map((item) => item.id === actualizado.id ? actualizado : item);
        this.lookup.invalidate('productos');
        this.inventario.marcarCambio();
        this.toast.success('La configuración de fracciones se guardó y se sincronizó con el inventario.');
      },
      error: (error: unknown) => {
        this.guardando = false;
        this.error = problemText(error);
        this.toast.error(this.error);
      },
    });
  }

  private cargarProductos(): void {
    this.cargando = true;
    this.error = null;
    this.productosCompletos().pipe(takeUntil(this.destroy$)).subscribe({
      next: (productos) => {
        this.productos = productos.filter((producto) => producto.tipo !== 'SERVICIO');
        this.cargando = false;
        if (this.productoSeleccionado?.id) {
          const producto = this.productos.find((item) => item.id === this.productoSeleccionado?.id);
          if (producto) this.seleccionar(producto);
        }
      },
      error: (error: unknown) => {
        this.cargando = false;
        this.error = problemText(error);
      },
    });
  }

  private productosCompletos(): Observable<Api.ProductoResponseDTO[]> {
    const params = { page: 0, size: 200, sort: 'nombre,asc', tipo: 'FISICO' };
    return this.productosApi.GetApiV1Productos(params).pipe(
      expand((pagina) => {
        const siguiente = (pagina.number ?? 0) + 1;
        return siguiente < (pagina.totalPages ?? 1)
          ? this.productosApi.GetApiV1Productos({ ...params, page: siguiente })
          : EMPTY;
      }),
      reduce((productos, pagina) => productos.concat(pagina.content ?? []), [] as Api.ProductoResponseDTO[]),
    );
  }

  private configurarProducto(producto: Api.ProductoResponseDTO): void {
    this.productoSeleccionado = producto;
    this.fraccionable = producto.esFraccionable === true;
    this.niveles = this.crearNiveles(producto.fracciones ?? []);
  }

  private crearNiveles(fracciones: Api.CatalogoFraccionResponseDTO[]): NivelFraccion[] {
    const niveles: NivelFraccion[] = NIVELES_ESTANDAR.map((estandar) => {
      const existente = fracciones.find((fraccion) =>
        Math.abs(Number(fraccion.factorDescuentoKardex ?? 0) - estandar.factorDescuentoKardex) < 0.000001,
      );
      return {
        nombreFraccion: existente?.nombreFraccion || estandar.nombreFraccion,
        factorDescuentoKardex: estandar.factorDescuentoKardex,
        precioVenta: Number(existente?.precioVenta ?? this.sugerido(estandar.factorDescuentoKardex)),
        activo: existente?.activo ?? true,
        personalizado: false,
      };
    });
    for (const fraccion of fracciones) {
      const factor = Number(fraccion.factorDescuentoKardex ?? 0);
      if (!factor || NIVELES_ESTANDAR.some((nivel) => Math.abs(nivel.factorDescuentoKardex - factor) < 0.000001)) continue;
      niveles.push({
        nombreFraccion: fraccion.nombreFraccion ?? 'Medida personalizada',
        factorDescuentoKardex: factor,
        precioVenta: Number(fraccion.precioVenta ?? this.sugerido(factor)),
        activo: fraccion.activo ?? true,
        personalizado: true,
      });
    }
    return niveles.sort((a, b) => a.factorDescuentoKardex - b.factorDescuentoKardex);
  }
}

export const CATALOGO_FRACCIONES_ROUTES: Routes = [
  { path: '', component: CatalogoFraccionesPageComponent, title: 'Catálogo de Fracciones', data: { section: 'Inventario', breadcrumb: 'Catálogo de Fracciones' } },
];
