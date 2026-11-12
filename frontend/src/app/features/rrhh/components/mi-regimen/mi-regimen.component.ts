import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { PenPipe } from '../../../../shared/pipes/format.pipes';
import { ToastService } from '../../../../shared/services/toast.service';
import { problemText } from '../../../../shared/utils/feedback';
import { periodoLocal } from '../../../../shared/utils/fecha-local';
import {
  BaseReparto,
  ETIQUETA_BASE_REPARTO,
  GananciaPersonalResponseDTO,
  MiRegimenApiService,
  RegimenResponseDTO,
} from '../../data-access/mi-regimen.api';
import { HistorialSalarialApiService, HistorialSalarialResponseDTO } from '../../data-access/historial-salarial.api';

/**
 * "Mi régimen": el administrador fija cuánto gana y ve su bolsillo separado del de la empresa.
 *
 * Por qué es una pantalla aparte y no una fila más del legajo:
 *  - el legajo describe a un EMPLEADO (contrato, sueldo, pensión, día de paga) y lo llena
 *    quien gestiona RRHH;
 *  - el régimen describe al DUEÑO (qué componentes cobra y qué % de la utilidad se reparte)
 *    y solo el propio admin lo escribe.
 * Mezclarlos permitiría que editar un legajo mueva el reparto de utilidades sin querer.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-mi-regimen',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IconComponent, PenPipe],
  templateUrl: './mi-regimen.component.html',
  styleUrls: ['./mi-regimen.component.css'],
})
export class MiRegimenComponent implements OnInit, OnDestroy {
  private readonly api = inject(MiRegimenApiService);
  private readonly historialApi = inject(HistorialSalarialApiService);
  private readonly toast = inject(ToastService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  readonly bases: BaseReparto[] = ['UTILIDAD_NETA', 'VENTAS_NETAS', 'MARGEN_BRUTO'];
  readonly etiquetaBase = ETIQUETA_BASE_REPARTO;

  cargando = true;
  guardando = false;
  error: string | null = null;

  regimen: RegimenResponseDTO | null = null;
  resumen: GananciaPersonalResponseDTO | null = null;
  periodo = periodoLocal();

  /** Su propio historial salarial: el admin también es trabajador y quiere ver cómo evolucionó lo que cobra. */
  historial: HistorialSalarialResponseDTO[] = [];

  /** Espejo editable del régimen. Se recarga desde `cargarRegimen()`. */
  sueldoHabilitado = true;
  comisionHabilitada = true;
  repartoHabilitado = false;
  porcentajeReparto: number | null = 0;
  baseReparto: BaseReparto = 'UTILIDAD_NETA';
  topeRepartoMensual: number | null = null;

  ngOnInit(): void { this.cargarTodo(); }
  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  cargarTodo(): void {
    this.cargando = true;
    this.error = null;
    this.cargarRegimen();
    this.cargarResumen();
    this.cargarHistorial();
  }

  /**
   * 404 = todavía no tiene legajo. No es un error de esta pantalla: el panel ya avisa que
   * el sueldo base vive en RRHH → Legajos, así que el historial simplemente queda vacío.
   */
  private cargarHistorial(): void {
    this.historialApi.mio().pipe(takeUntil(this.destroy$), catchError(() => of([] as HistorialSalarialResponseDTO[])))
      .subscribe((filas) => { this.historial = filas; this.cdr.detectChanges(); });
  }

  private cargarRegimen(): void {
    this.api.mio().pipe(takeUntil(this.destroy$)).subscribe({
      next: (r) => {
        this.regimen = r;
        this.sueldoHabilitado = r.sueldoHabilitado;
        this.comisionHabilitada = r.comisionHabilitada;
        this.repartoHabilitado = r.repartoHabilitado;
        this.porcentajeReparto = r.porcentajeReparto;
        this.baseReparto = r.baseReparto;
        this.topeRepartoMensual = r.topeRepartoMensual;
        this.cdr.detectChanges();
      },
      error: (e: unknown) => { this.error = problemText(e); this.cargando = false; this.cdr.detectChanges(); },
    });
  }

  cargarResumen(): void {
    this.api.resumen(this.periodo || undefined).pipe(takeUntil(this.destroy$)).subscribe({
      next: (r) => { this.resumen = r; this.cargando = false; this.cdr.detectChanges(); },
      error: () => { this.resumen = null; this.cargando = false; this.cdr.detectChanges(); },
    });
  }

  guardar(): void {
    if (this.repartoHabilitado && !(Number(this.porcentajeReparto) > 0)) {
      this.toast.error('Active un porcentaje de reparto mayor a 0, o desactive el reparto.');
      return;
    }
    if (!this.sueldoHabilitado && !this.comisionHabilitada && !this.repartoHabilitado) {
      this.toast.error('Active al menos un componente de ganancia personal.');
      return;
    }

    this.guardando = true;
    this.api.guardar({
      sueldoHabilitado: this.sueldoHabilitado,
      comisionHabilitada: this.comisionHabilitada,
      repartoHabilitado: this.repartoHabilitado,
      porcentajeReparto: this.repartoHabilitado ? Number(this.porcentajeReparto ?? 0) : 0,
      baseReparto: this.baseReparto,
      topeRepartoMensual: this.topeRepartoMensual ? Number(this.topeRepartoMensual) : null,
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (r) => {
        this.guardando = false;
        this.regimen = r;
        this.toast.success('Régimen guardado. Recalculando el desglose…');
        this.cargarResumen();
      },
      error: (e: unknown) => { this.guardando = false; this.toast.error(problemText(e)); this.cdr.detectChanges(); },
    });
  }

  /** El reparto no puede activarse sin base porcentual: la UI lo refleja. */
  get repartoInvalido(): boolean {
    return this.repartoHabilitado && !(Number(this.porcentajeReparto) > 0);
  }

  get hayCambios(): boolean {
    const r = this.regimen;
    if (!r) return false;
    return r.sueldoHabilitado !== this.sueldoHabilitado
      || r.comisionHabilitada !== this.comisionHabilitada
      || r.repartoHabilitado !== this.repartoHabilitado
      || Number(r.porcentajeReparto) !== Number(this.porcentajeReparto ?? 0)
      || r.baseReparto !== this.baseReparto
      || Number(r.topeRepartoMensual ?? 0) !== Number(this.topeRepartoMensual ?? 0);
  }

  get saldoNegativo(): boolean {
    return !!this.resumen && Number(this.resumen.saldoEmpresaTrasReparto) < 0;
  }
}
