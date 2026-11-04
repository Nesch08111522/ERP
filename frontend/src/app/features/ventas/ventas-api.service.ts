import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Page<T> { content: T[]; totalElements: number; totalPages: number; number: number; size: number; }
export interface Producto {
  id: string;
  nombre: string;
  precioVentaBase: number;
  precioOferta?: number;
  ofertaDesde?: string;
  ofertaHasta?: string;
  esFraccionable: boolean;
  unidad?: string;
  codigoSku?: string;
  descripcion?: string;
  imagen?: string;
  fracciones?: Fraccion[];
}
export interface Fraccion { id: string; nombreFraccion: string; precioVenta: number; activo?: boolean; factorDescuentoKardex?: number; }
export interface Servicio { id: string; nombre: string; precio: number; activo: boolean; descripcion?: string; }
export interface Cliente { id: string; nombre: string; numeroDocumento?: string; tipoDocumento?: string; }
export interface Sede { id: string; nombre: string; activa: boolean; }
export interface Almacen { id: string; nombre: string; activo: boolean; }
export interface Turno { id: string; montoInicial: number; estado: 'ABIERTO'|'CERRADO'; fechaApertura: string; observaciones?: string; sede?: { id?: string }; }
export interface StockFila { producto?: { id?: string }; productoId?: string; cantidad?: number; }
export interface SaldoAlmacen { productoId?: string; cantidad?: number; unidad?: string; }

@Injectable({ providedIn: 'root' })
export class VentasApiService {
  private readonly api = `${environment.apiUrl}/api/v1`;
  constructor(private http: HttpClient) {}
  productos(searchTerm = '', page = 0): Observable<Page<Producto>> { return this.http.get<Page<Producto>>(`${this.api}/productos`, { params: { activo: true, searchTerm, size: 100, page } }); }
  fracciones(productoId: string): Observable<Fraccion[]> { return this.http.get<Fraccion[]>(`${this.api}/catalogo-fracciones/producto/${productoId}/disponibles`); }
  servicios(searchTerm = ''): Observable<Page<Servicio>> { return this.http.get<Page<Servicio>>(`${this.api}/servicios`, { params: { activo: true, searchTerm, size: 100 } }); }
  stockAlmacen(almacenId: string, page = 0): Observable<Page<StockFila>> { return this.http.get<Page<StockFila>>(`${this.api}/stock/almacen/${almacenId}`, { params: { size: 200, page } }); }
  saldosAlmacen(almacenId: string, page = 0): Observable<Page<SaldoAlmacen>> { return this.http.get<Page<SaldoAlmacen>>(`${this.api}/kardex/saldos/almacen/${almacenId}`, { params: { size: 200, page } }); }
  imagen(ruta: string): Observable<Blob> { return this.http.get(`${this.api}/productos/imagenes`, { params: { ruta }, responseType: 'blob' }); }
  clientes(searchTerm = ''): Observable<Page<Cliente>> { return this.http.get<Page<Cliente>>(`${this.api}/clientes`, { params: { searchTerm, size: 30 } }); }
  sedes(): Observable<Page<Sede>> { return this.http.get<Page<Sede>>(`${this.api}/sedes`, { params: { size: 50 } }); }
  almacenes(sedeId: string): Observable<Almacen[]> { return this.http.get<Almacen[]>(`${this.api}/almacenes/sede/${sedeId}`); }
}
