import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { QrEscanerComponent } from '../../../../shared/components/qr-escaner/qr-escaner.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { FormFieldComponent } from '../../../../shared/components/form-field/form-field.component';
import { StatCardComponent } from '../../../../shared/components/stat-card/stat-card.component';
import { QrPublicoComponent } from '../../../../components/qr-publico/qr-publico.component';
import { AsistenciaService } from '../../../../services/asistencia.service';
import { LookupService } from '../../../../shared/services/lookup.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { SelectOption } from '../../../../shared/models/ui.models';
import { problemText } from '../../../../shared/utils/feedback';
import { fechaHoraLocal, fechaLocal } from '../../../../shared/utils/fecha-local';
import * as Api from '../../../../core/api/openapi.types';
import { AsistenciaRosterDTO, MarcarLoteResponseDTO } from '../../../../models/asistencia.model';

type Modo = 'escanear' | 'kiosco' | 'asistieron' | 'manual';
type TipoMarcacion = 'ENTRADA' | 'SALIDA' | 'INICIO_RECESO' | 'FIN_RECESO';

/**
 * Las 4 formas de registrar asistencia del ADMINISTRADOR, en una sola pantalla:
 *
 *  - escanear:   lee con la cámara el QR personal del empleado (nuevo).
 *  - kiosco:     muestra el QR dinámico público para que cada quien marque desde su celular.
 *  - asistieron: roster del día con casillas, para marcar en lote a todos los que llegaron.
 *  - manual:     marcación individual con fecha y tipo, para correcciones retroactivas.
 *
 * El MULTIFUNCIONAL no llega aquí: la ruta /modules/rrhh es solo-ADMIN
 * (`module.routes.ts:183-188`) y cada endpoint del servicio exige ROLE_ADMIN.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-asistencia-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconComponent, QrEscanerComponent, QrPublicoComponent, SelectComponent, FormFieldComponent, StatCardComponent],
  templateUrl: './asistencia-admin.component.html',
  styleUrls: ['./asistencia-admin.component.css'],
})
export class AsistenciaAdminComponent implements OnInit, OnDestroy {
  private readonly api = inject(AsistenciaService);
  private readonly lookup = inject(LookupService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  modo: Modo = 'asistieron';
  readonly modos: Array<{ id: Modo; label: string; icono: string }> = [
    { id: 'asistieron', label: 'Asistieron hoy', icono: 'users' },
    { id: 'escanear', label: 'Escanear QR', icono: 'qr' },
    { id: 'kiosco', label: 'QR dinámico', icono: 'device' },
    { id: 'manual', label: 'Marcación manual', icono: 'edit' },
  ];

  /* ── Roster ── */
  fecha = fechaLocal(new Date());
  sedeId = '';
  sedes: SelectOption[] = [];
  roster: AsistenciaRosterDTO[] = [];
  rosterCargando = false;
  rosterError: string | null = null;
  seleccion = new Set<string>();
  marcando = false;
  ultimoLote: MarcarLoteResponseDTO | null = null;

  /* ── Escáner ── */
  escaneando = false;
  resultadoEscaneo: string | null = null;
  errorEscaneo: string | null = null;

  /* ── Manual ── */
  usuarios: SelectOption[] = [];
  readonly manualForm = this.fb.nonNullable.group({
    empleadoId: ['', Validators.required],
    tipoMarcacion: ['ENTRADA' as TipoMarcacion, Validators.required],
    fechaHora: [''],
  });

  /* ── Contadores ── */
  presentes = 0;
  ausentes = 0;
  tardanzas = 0;

  @Output() cambiada = new EventEmitter<void>();

  ngOnInit(): void {
    this.lookup.loadSedes().pipe(takeUntil(this.destroy$))
      .subscribe((rows) => (this.sedes = this.lookup.options(rows, (r) => (r as Api.SedeResponseDTO).nombre ?? 'Sede')));
    this.lookup.loadUsuarios().pipe(takeUntil(this.destroy$))
      .subscribe((rows) => (this.usuarios = this.lookup.options(rows, (r) =>
        `${(r as Api.UserResponseDTO).nombre ?? ''} ${(r as Api.UserResponseDTO).apellido ?? ''}`.trim() || 'Usuario')));
    this.cargarRoster();
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  cambiarModo(modo: Modo): void {
    this.modo = modo;
    if (modo !== 'escanear') this.escaneando = false;
    if (modo === 'asistieron') this.cargarRoster();
    this.cdr.detectChanges();
  }

  /* =========================================================
     ROSTER: "quiénes asistieron el día de hoy"
  ========================================================= */

  cargarRoster(): void {
    this.rosterCargando = true;
    this.rosterError = null;
    this.api.obtenerRoster(this.fecha || undefined, this.sedeId || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (filas) => {
          this.roster = filas ?? [];
          this.contar();
          this.podaSeleccion();
          this.rosterCargando = false;
          this.cdr.detectChanges();
        },
        error: (error: unknown) => {
          this.rosterError = problemText(error);
          this.rosterCargando = false;
          this.cdr.detectChanges();
        },
      });
  }

  private contar(): void {
    this.presentes = this.roster.filter((f) => f.marcoEntrada).length;
    this.ausentes = this.roster.length - this.presentes;
    this.tardanzas = this.roster.filter((f) => f.estado === 'TARDANZA').length;
  }

  /** Descarta selecciones que dejaron de ser marcables tras recargar. */
  private podaSeleccion(): void {
    const validos = new Set(this.roster.filter((f) => f.puedeMarcarEntrada || f.puedeMarcarSalida).map((f) => f.empleadoId));
    this.seleccion = new Set([...this.seleccion].filter((id) => validos.has(id)));
  }

  esHoy(): boolean { return this.fecha === fechaLocal(new Date()); }

  marcar(fila: AsistenciaRosterDTO): void {
    this.seleccion.has(fila.empleadoId) ? this.seleccion.delete(fila.empleadoId) : this.seleccion.add(fila.empleadoId);
  }

  toggleTodos(): void {
    const marcables = this.roster.filter((f) => f.puedeMarcarEntrada);
    if (marcables.length && marcables.every((f) => this.seleccion.has(f.empleadoId))) {
      marcables.forEach((f) => this.seleccion.delete(f.empleadoId));
    } else {
      marcables.forEach((f) => this.seleccion.add(f.empleadoId));
    }
  }

  todosMarcados(): boolean {
    const marcables = this.roster.filter((f) => f.puedeMarcarEntrada);
    return marcables.length > 0 && marcables.every((f) => this.seleccion.has(f.empleadoId));
  }

  marcarSeleccion(tipo: 'ENTRADA' | 'SALIDA'): void {
    if (!this.seleccion.size) { this.toast.error('Seleccione al menos un empleado.'); return; }
    this.marcando = true;
    this.ultimoLote = null;
    this.api.marcarLote({
      fecha: this.fecha || undefined,
      empleadoIds: [...this.seleccion],
      tipoMarcacion: tipo,
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.marcando = false;
        this.ultimoLote = res;
        this.seleccion.clear();
        this.toast.success(`${res.registrados} marcación(es) registrada(s).`);
        this.cargarRoster();
        this.cambiada.emit();
      },
      error: (error: unknown) => {
        this.marcando = false;
        this.toast.error(problemText(error));
        this.cdr.detectChanges();
      },
    });
  }

  /** Marca a todos los que aún no entraron, sin pasar por las casillas. */
  marcarPendientes(): void {
    const pendientes = this.roster.filter((f) => f.puedeMarcarEntrada);
    if (!pendientes.length) { this.toast.info('Todos los empleados ya tienen entrada del día.'); return; }
    this.seleccion = new Set(pendientes.map((f) => f.empleadoId));
    this.marcarSeleccion('ENTRADA');
  }

  /* =========================================================
     ESCÁNER: el admin lee el QR personal del empleado
  ========================================================= */

  onQrDetectado(payload: string): void {
    this.errorEscaneo = null;
    this.resultadoEscaneo = null;
    this.api.escanearQrEmpleado(payload).pipe(takeUntil(this.destroy$)).subscribe({
      next: (r) => {
        this.resultadoEscaneo = `${r.tipoMarcacion} de ${r.empleadoNombreCompleto} a las ${this.hora(r.fechaHora)}`;
        this.toast.success(this.resultadoEscaneo);
        this.cargarRoster();
        this.cambiada.emit();
      },
      error: (error: unknown) => {
        this.errorEscaneo = problemText(error);
        this.toast.error(this.errorEscaneo);
      },
    });
  }

  /* =========================================================
     MANUAL
  ========================================================= */

  guardarManual(): void {
    if (this.manualForm.invalid) { this.manualForm.markAllAsTouched(); return; }
    const value = this.manualForm.getRawValue();
    this.marcando = true;
    this.api.registrarManual({
      empleadoId: value.empleadoId,
      tipoMarcacion: value.tipoMarcacion,
      // Vacío = ahora, en hora local. toISOString() daría la hora UTC y el backend
      // rechazaría una marcación "en el futuro" cuando el reloj va retrasado.
      fechaHora: value.fechaHora || fechaHoraLocal(),
      dispositivoInfo: 'Manual por Admin (RRHH)',
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.marcando = false;
        this.toast.success('Marcación registrada.');
        this.manualForm.patchValue({ fechaHora: '' });
        this.cargarRoster();
        this.cambiada.emit();
      },
      error: (error: unknown) => { this.marcando = false; this.toast.error(problemText(error)); },
    });
  }

  /* =========================================================
     HELPERS DE VISTA
  ========================================================= */

  seleccionados(): number { return this.seleccion.size; }

  hora(iso: string | null): string {
    if (!iso) return '—';
    return new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
  }

  tonoEstado(estado: string | null): string {
    if (estado === 'TARDANZA') return 'alerta';
    if (estado === 'AUSENTE') return 'ausente';
    if (estado === 'PRESENTE') return 'presente';
    return 'neutro';
  }
}
