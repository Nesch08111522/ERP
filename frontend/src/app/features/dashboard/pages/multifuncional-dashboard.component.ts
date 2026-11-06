import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject, catchError, forkJoin, of, takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PenPipe } from '../../../shared/pipes/format.pipes';
import { TokenService } from '../../../services/token.service';
import { ToastService } from '../../../shared/services/toast.service';
import { fechaLocal } from '../../../shared/utils/fecha-local';
import { problemText } from '../../../shared/utils/feedback';

interface MarcaHoy {
  tipo: string;
  hora: string;
  icono: string;
  color: string;
}

interface DesempenoMes {
  ventasCantidad: number;
  ventasMonto: number;
  ticketPromedio: number;
  comisionesMonto: number;
  comisionesEstado: string;
  sueldoBase: number;
}

interface TareasPendientes {
  preformasAbiertas: number;
  cotizacionesPendientes: number;
  despachosPendientes: number;
}

interface MiInformacion {
  fechaIngreso: string | null;
  antiguedad: string;
  tipoContrato: string;
  diaCobro: number | null;
  proximoPago: string | null;
  diasParaPago: number | null;
}

interface TurnoCaja {
  abierto: boolean;
  montoInicial: number;
  ventasTurno: number;
  horaApertura: string | null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-multifuncional-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, PenPipe],
  templateUrl: './multifuncional-dashboard.component.html',
  styleUrls: ['./multifuncional-dashboard.component.css'],
})
export class MultifuncionalDashboardComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly tokens = inject(TokenService);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  /* ─── Datos del usuario ─── */
  nombre = '';
  sede = '';
  rol = '';

  /* ─── Estado general ─── */
  cargando = true;
  error: string | null = null;

  /* ─── Sección 1: encabezado ─── */
  fechaHoy = '';
  estadoDia = 'Fuera de turno';
  estadoDiaDesde: string | null = null;

  /* ─── Sección 2: asistencias ─── */
  marcasHoy: MarcaHoy[] = [];
  horasHoy = 0;
  horasSemana = 0;

  /* ─── Sección 3: ventas de hoy ─── */
  ventasHoyCantidad = 0;
  ventasHoyMonto = 0;
  ticketPromedio = 0;
  ultimaVentaHace = '—';

  /* ─── Sección 4: turno de caja ─── */
  turnoCaja: TurnoCaja = { abierto: false, montoInicial: 0, ventasTurno: 0, horaApertura: null };

  /* ─── Sección 5: desempeño del mes ─── */
  desempenoMes: DesempenoMes = {
    ventasCantidad: 0,
    ventasMonto: 0,
    ticketPromedio: 0,
    comisionesMonto: 0,
    comisionesEstado: '—',
    sueldoBase: 0,
  };

  /* ─── Sección 6: tareas pendientes ─── */
  tareas: TareasPendientes = {
    preformasAbiertas: 0,
    cotizacionesPendientes: 0,
    despachosPendientes: 0,
  };

  /* ─── Sección 7: mi información ─── */
  info: MiInformacion = {
    fechaIngreso: null,
    antiguedad: '—',
    tipoContrato: '—',
    diaCobro: null,
    proximoPago: null,
    diasParaPago: null,
  };

  /* ─── Banner de pago ─── */
  bannerPago: 'hoy' | '3dias' | '7dias' | null = null;

  ngOnInit(): void {
    const user = this.tokens.getUser();
    this.nombre = user?.nombre ?? 'Colaborador';
    this.sede = user?.sedeNombre ?? '';
    this.rol = this.tokens.getRol() ?? '';
    this.fechaHoy = this.formatearFecha(new Date());
    this.cargar();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* =========================================================
     CARGA PRINCIPAL
  ========================================================= */

  cargar(): void {
    this.cargando = true;
    this.error = null;

    const userId = this.tokens.getUserId();
    const sedeId = this.tokens.getUser()?.sedeId ?? '';
    const hoy = fechaLocal(new Date());
    const inicioMes = this.inicioDeMes();
    const inicioSemana = this.inicioDeSemana();

    const hoyDesde = `${hoy}T00:00:00`;
    const hoyHasta = `${hoy}T23:59:59`;
    const mesDesde = `${inicioMes}T00:00:00`;

    if (!userId) {
      this.error = 'No se pudo obtener el usuario autenticado.';
      this.cargando = false;
      return;
    }

    forkJoin({
      estadoDia: this.http.get<any>(`${environment.apiUrl}/api/v1/rrhh/asistencias/estado-dia`).pipe(catchError(() => of(null))),
      ultimaMarca: this.http.get<any>(`${environment.apiUrl}/api/v1/rrhh/asistencias/ultima-marcacion`).pipe(catchError(() => of(null))),
      asistenciasHoy: this.http.get<any>(`${environment.apiUrl}/api/v1/rrhh/asistencias/mis-asistencias`, {
        params: { fechaInicio: hoy, fechaFin: hoy, page: 0, size: 50, sort: 'fechaHora,asc' },
      }).pipe(catchError(() => of(null))),
      asistenciasSemana: this.http.get<any>(`${environment.apiUrl}/api/v1/rrhh/asistencias/mis-asistencias`, {
        params: { fechaInicio: inicioSemana, fechaFin: hoy, page: 0, size: 100, sort: 'fechaHora,asc' },
      }).pipe(catchError(() => of(null))),
      ventasHoy: this.http.get<any>(`${environment.apiUrl}/api/v1/ventas`, {
        params: { userId, desde: hoyDesde, hasta: hoyHasta, page: 0, size: 100, sort: 'createdAt,desc' },
      }).pipe(catchError(() => of(null))),
      ventasMes: this.http.get<any>(`${environment.apiUrl}/api/v1/ventas`, {
        params: { userId, desde: mesDesde, hasta: hoyHasta, page: 0, size: 500, sort: 'createdAt,desc' },
      }).pipe(catchError(() => of(null))),
      turnoCaja: this.http.get<any>(`${environment.apiUrl}/api/v1/turnos-caja/abierto`, {
        params: sedeId ? { sedeId } : {},
      }).pipe(catchError(() => of(null))),
      // NOTA: el endpoint puede devolver array plano o página paginada; procesarComisiones lo maneja.
      comisiones: this.http.get<any>(`${environment.apiUrl}/api/v1/rrhh/comisiones/empleado/${userId}`).pipe(catchError(() => of([]))),
      // NOTA: /legajos/me NO acepta sedeId; quitamos el parámetro.
      legajo: this.http.get<any>(`${environment.apiUrl}/api/v1/rrhh/legajos/me`).pipe(catchError(() => of(null))),
      preformas: this.http.get<any>(`${environment.apiUrl}/api/v1/preformas/abiertas`).pipe(catchError(() => of(null))),
      cotizaciones: this.http.get<any>(`${environment.apiUrl}/api/v1/cotizaciones`, {
        params: { userId, estado: 'EMITIDA', page: 0, size: 50 },
      }).pipe(catchError(() => of(null))),
      despachos: this.http.get<any>(`${environment.apiUrl}/api/v1/despachos/repartidor/${userId}`).pipe(catchError(() => of([]))),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.procesarEstadoDia(data.estadoDia, data.ultimaMarca);
          this.procesarAsistencias(data.asistenciasHoy, data.asistenciasSemana);
          this.procesarVentasHoy(data.ventasHoy);
          this.procesarVentasMes(data.ventasMes);
          this.procesarTurno(data.turnoCaja);
          this.procesarComisiones(data.comisiones);
          this.procesarLegajo(data.legajo);
          this.procesarTareas(data.preformas, data.cotizaciones, data.despachos);
          this.calcularBannerPago();
          this.cargando = false;
          this.pintar();
        },
        error: (err) => {
          this.error = problemText(err);
          this.cargando = false;
          this.toast.error(this.error);
          this.pintar();
        },
      });
  }

  /* =========================================================
     PROCESAMIENTO
  ========================================================= */

  private procesarEstadoDia(estado: any, ultima: any): void {
    if (estado?.yaMarcoEntrada && !estado?.yaMarcoSalida) {
      this.estadoDia = 'En turno';
    } else {
      this.estadoDia = 'Fuera de turno';
    }
    this.estadoDiaDesde = ultima?.fechaHora ? this.formatearHora(ultima.fechaHora) : null;
  }

  private procesarAsistencias(hoy: any, semana: any): void {
    const filasHoy: any[] = hoy?.content ?? [];
    const filasSemana: any[] = semana?.content ?? [];

    this.marcasHoy = filasHoy.map((f) => ({
      tipo: f.tipoMarcacion,
      hora: this.formatearHora(f.fechaHora),
      icono: this.iconoMarcacion(f.tipoMarcacion),
      color: this.colorMarcacion(f.tipoMarcacion),
    }));

    this.horasHoy = this.calcularHoras(filasHoy);
    this.horasSemana = this.calcularHoras(filasSemana);
  }

  private procesarVentasHoy(pagina: any): void {
    const filas: any[] = pagina?.content ?? [];
    const totales = filas.reduce((sum, v) => sum + Number(v.total ?? 0), 0);
    this.ventasHoyCantidad = pagina?.totalElements ?? filas.length;
    this.ventasHoyMonto = totales;
    this.ticketPromedio = this.ventasHoyCantidad > 0 ? totales / this.ventasHoyCantidad : 0;
    this.ultimaVentaHace = filas[0]?.createdAt ? this.haceCuanto(filas[0].createdAt) : '—';
  }

  private procesarVentasMes(pagina: any): void {
    const filas: any[] = pagina?.content ?? [];
    const totales = filas.reduce((sum, v) => sum + Number(v.total ?? 0), 0);
    this.desempenoMes.ventasCantidad = pagina?.totalElements ?? filas.length;
    this.desempenoMes.ventasMonto = totales;
    this.desempenoMes.ticketPromedio = this.desempenoMes.ventasCantidad > 0
      ? totales / this.desempenoMes.ventasCantidad
      : 0;
  }

  private procesarTurno(turno: any): void {
    if (!turno?.id) {
      this.turnoCaja = { abierto: false, montoInicial: 0, ventasTurno: 0, horaApertura: null };
      return;
    }
    this.turnoCaja = {
      abierto: turno.estado !== 'CERRADO',
      montoInicial: Number(turno.montoInicial ?? 0),
      ventasTurno: 0,
      horaApertura: turno.fechaApertura ? this.formatearHora(turno.fechaApertura) : null,
    };
  }

  /**
   * El backend puede devolver las comisiones como:
   * - Array plano: [ { periodo, montoComision, estado }, ... ]
   * - Página paginada: { content: [...], totalElements, ... }
   * - null / undefined (si falla el endpoint)
   * - Un objeto suelto
   * Este método normaliza todo a un array antes de procesar.
   */
  private procesarComisiones(comisiones: any): void {
    let lista: any[] = [];
    if (Array.isArray(comisiones)) {
      lista = comisiones;
    } else if (comisiones && Array.isArray(comisiones.content)) {
      lista = comisiones.content;
    } else if (comisiones && typeof comisiones === 'object') {
      lista = [comisiones];
    }

    const delMes = lista.filter((c) => (c?.periodo ?? '') === this.periodoActual());
    this.desempenoMes.comisionesMonto = delMes.reduce(
      (sum, c) => sum + Number(c.montoComision ?? 0),
      0,
    );
    this.desempenoMes.comisionesEstado = delMes.length > 0
      ? delMes[0].estado ?? '—'
      : 'Sin comisiones';
  }

  private procesarLegajo(legajo: any): void {
    if (!legajo) {
      this.info = { fechaIngreso: null, antiguedad: '—', tipoContrato: '—', diaCobro: null, proximoPago: null, diasParaPago: null };
      return;
    }
    const fechaIngreso = legajo.fechaIngreso as string | undefined;
    this.desempenoMes.sueldoBase = Number(legajo.sueldoBase ?? 0);
    this.info = {
      fechaIngreso: fechaIngreso ? this.formatearFechaCorta(fechaIngreso) : null,
      antiguedad: fechaIngreso ? this.calcularAntiguedad(fechaIngreso) : '—',
      tipoContrato: legajo.tipoContrato ?? '—',
      diaCobro: legajo.diaCobro ? Number(legajo.diaCobro) : null,
      proximoPago: null,
      diasParaPago: null,
    };
    if (this.info.diaCobro) {
      const proximo = this.calcularProximoPago(this.info.diaCobro);
      this.info.proximoPago = this.formatearFechaCorta(proximo.toISOString().slice(0, 10));
      this.info.diasParaPago = Math.ceil((proximo.getTime() - new Date().getTime()) / 86400000);
    }
  }

  private procesarTareas(preformas: any, cotizaciones: any, despachos: any): void {
    this.tareas.preformasAbiertas = preformas?.totalElements ?? 0;
    this.tareas.cotizacionesPendientes = cotizaciones?.totalElements ?? 0;

    let listaDespachos: any[] = [];
    if (Array.isArray(despachos)) {
      listaDespachos = despachos;
    } else if (despachos && Array.isArray(despachos.content)) {
      listaDespachos = despachos.content;
    }
    this.tareas.despachosPendientes = listaDespachos.filter(
      (d) => d.estado === 'PENDIENTE' || d.estado === 'EN_CAMINO',
    ).length;
  }

  private calcularBannerPago(): void {
    const dias = this.info.diasParaPago;
    if (dias == null) { this.bannerPago = null; return; }
    if (dias <= 0) this.bannerPago = 'hoy';
    else if (dias <= 3) this.bannerPago = '3dias';
    else if (dias <= 7) this.bannerPago = '7dias';
    else this.bannerPago = null;
  }

  /* =========================================================
     HELPERS
  ========================================================= */

  private pintar(): void { this.cdr.detectChanges(); }

  private inicioDeMes(): string {
    const d = new Date();
    d.setDate(1);
    return fechaLocal(d);
  }

  private inicioDeSemana(): string {
    const d = new Date();
    const dia = d.getDay() || 7;
    d.setDate(d.getDate() - dia + 1);
    return fechaLocal(d);
  }

  private periodoActual(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  private calcularHoras(marcas: any[]): number {
    let total = 0;
    let entrada: Date | null = null;
    for (const m of marcas) {
      const fecha = new Date(m.fechaHora);
      if (m.tipoMarcacion === 'ENTRADA' || m.tipoMarcacion === 'FIN_RECESO') {
        entrada = fecha;
      } else if ((m.tipoMarcacion === 'SALIDA' || m.tipoMarcacion === 'INICIO_RECESO') && entrada) {
        total += (fecha.getTime() - entrada.getTime()) / 3600000;
        entrada = null;
      }
    }
    if (entrada) {
      total += (new Date().getTime() - entrada.getTime()) / 3600000;
    }
    return Math.max(0, Math.round(total * 100) / 100);
  }

  private calcularAntiguedad(fechaIngreso: string): string {
    const inicio = new Date(fechaIngreso);
    const ahora = new Date();
    let anios = ahora.getFullYear() - inicio.getFullYear();
    let meses = ahora.getMonth() - inicio.getMonth();
    if (meses < 0) { anios--; meses += 12; }
    if (anios <= 0 && meses <= 0) {
      const dias = Math.floor((ahora.getTime() - inicio.getTime()) / 86400000);
      return `${dias} día${dias !== 1 ? 's' : ''}`;
    }
    const partes: string[] = [];
    if (anios > 0) partes.push(`${anios} año${anios !== 1 ? 's' : ''}`);
    if (meses > 0) partes.push(`${meses} mes${meses !== 1 ? 'es' : ''}`);
    return partes.join(', ');
  }

  private calcularProximoPago(diaCobro: number): Date {
    const hoy = new Date();
    let mes = hoy.getMonth();
    let anio = hoy.getFullYear();
    if (hoy.getDate() > diaCobro) {
      mes++;
      if (mes > 11) { mes = 0; anio++; }
    }
    return new Date(anio, mes, Math.min(diaCobro, 28));
  }

  private formatearFecha(d: Date): string {
    return new Intl.DateTimeFormat('es-PE', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }).format(d);
  }

  private formatearFechaCorta(iso: string): string {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
  }

  private formatearHora(iso: string): string {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit' }).format(d);
  }

  private haceCuanto(iso: string): string {
    const diff = (new Date().getTime() - new Date(iso).getTime()) / 60000;
    if (diff < 1) return 'ahora mismo';
    if (diff < 60) return `hace ${Math.floor(diff)} min`;
    if (diff < 1440) return `hace ${Math.floor(diff / 60)} h`;
    return `hace ${Math.floor(diff / 1440)} d`;
  }

  private iconoMarcacion(tipo: string): string {
    switch (tipo) {
      case 'ENTRADA': return 'log-in';
      case 'SALIDA': return 'log-out';
      case 'INICIO_RECESO': return 'coffee';
      case 'FIN_RECESO': return 'play';
      default: return 'clock';
    }
  }

  private colorMarcacion(tipo: string): string {
    switch (tipo) {
      case 'ENTRADA': return 'success';
      case 'SALIDA': return 'info';
      case 'INICIO_RECESO': return 'warning';
      case 'FIN_RECESO': return 'info';
      default: return 'muted';
    }
  }
}