import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, Routes } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ToastService } from '../../shared/services/toast.service';
import { problemText } from '../../shared/utils/feedback';
import { Notificacion, NotificacionesApi } from './notificaciones.api';

@Component({
  selector: 'app-notificaciones-page',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, PageHeaderComponent],
  templateUrl: './notificaciones-page.component.html',
  styleUrls: ['./notificaciones-page.component.css'],
})
export class NotificacionesPageComponent implements OnInit {
  avisos: Notificacion[] = [];
  filtro: 'hoy' | 'todas' | 'eliminadas' | 'pasadas' = 'hoy';
  cargando = true;

  constructor(private readonly api: NotificacionesApi, private readonly router: Router, private readonly toast: ToastService, private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.cargar(); }

  get visibles(): Notificacion[] {
    const hoy = this.fechaHoy();
    return this.avisos.filter((aviso) => {
      if (this.filtro === 'eliminadas') return aviso.eliminada;
      if (aviso.eliminada) return false;
      if (this.filtro === 'hoy') return this.fechaAviso(aviso) === hoy;
      if (this.filtro === 'pasadas') return this.fechaAviso(aviso) < hoy;
      return true;
    });
  }

  get cantidadHoy(): number { return this.avisos.filter((aviso) => !aviso.eliminada && this.fechaAviso(aviso) === this.fechaHoy()).length; }
  get cantidadNoLeidas(): number { return this.avisos.filter((aviso) => !aviso.eliminada && !aviso.leida).length; }
  get cantidadVisiblesEliminables(): number { return this.visibles.filter((aviso) => !aviso.eliminada).length; }

  tipo(aviso: Notificacion): string {
    switch (aviso.tipo) {
      case 'STOCK_CRITICO': return 'Stock crítico';
      case 'STOCK_MINIMO': return 'Stock mínimo';
      case 'MENSAJE_WEB': return 'Mensaje web';
      case 'COTIZACION_WEB': return 'Cotización web';
      default: return 'Notificación';
    }
  }

  cargar(): void {
    this.cargando = true;
    this.api.listar().subscribe({
      next: (avisos) => { this.avisos = avisos; this.cargando = false; this.cdr.detectChanges(); },
      error: (error: unknown) => { this.cargando = false; this.toast.error(problemText(error)); this.cdr.detectChanges(); },
    });
  }

  abrir(aviso: Notificacion): void {
    const ir = () => void this.router.navigateByUrl(aviso.ruta || '/modules/stock?tab=bajo');
    if (aviso.leida) { ir(); return; }
    this.api.leida(aviso.id).subscribe({ next: () => { aviso.leida = true; ir(); }, error: () => ir() });
  }

  leida(aviso: Notificacion): void {
    this.api.leida(aviso.id).subscribe({
      next: () => { aviso.leida = true; this.toast.success('Notificación marcada como leída.'); this.cdr.detectChanges(); },
      error: (error: unknown) => this.toast.error(problemText(error)),
    });
  }

  leerTodas(): void {
    this.api.leerTodas().subscribe({
      next: () => { this.avisos.forEach((aviso) => { if (!aviso.eliminada) aviso.leida = true; }); this.toast.success('Notificaciones marcadas como leídas.'); this.cdr.detectChanges(); },
      error: (error: unknown) => this.toast.error(problemText(error)),
    });
  }

  archivar(aviso: Notificacion): void {
    this.api.archivar(aviso.id).subscribe({
      next: () => { aviso.eliminada = true; aviso.leida = true; this.toast.success('La notificación queda en el historial 30 días.'); this.cdr.detectChanges(); },
      error: (error: unknown) => this.toast.error(problemText(error)),
    });
  }

  archivarVisibles(): void {
    const pendientes = this.visibles.filter((aviso) => !aviso.eliminada);
    if (!pendientes.length) return;
    forkJoin(pendientes.map((aviso) => this.api.archivar(aviso.id))).subscribe({
      next: () => {
        pendientes.forEach((aviso) => { aviso.eliminada = true; aviso.leida = true; });
        this.toast.success(`${pendientes.length} notificación(es) movida(s) a Eliminadas.`);
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        this.toast.error(problemText(error));
        this.cargar();
      },
    });
  }

  private fechaHoy(): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  }

  private fechaAviso(aviso: Notificacion): string {
    if (!aviso.createdAt) return '';
    const fecha = new Date(aviso.createdAt);
    if (Number.isNaN(fecha.getTime())) return '';
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(fecha);
  }
}

export const NOTIFICACIONES_ROUTES: Routes = [
  { path: '', component: NotificacionesPageComponent, title: 'Notificaciones', data: { section: 'Inicio', breadcrumb: 'Notificaciones' } },
];
