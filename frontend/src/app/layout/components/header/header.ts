import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as Api from '../../../core/api/openapi.types';
import { Notificacion, NotificacionesApi } from '../../../features/notificaciones/notificaciones.api';
import { AuthService } from '../../../services/auth.service';
import { TokenService } from '../../../services/token.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { LayoutService } from '../../../shared/services/layout.service';
import { LookupService } from '../../../shared/services/lookup.service';
import { CajaGateService } from '../../../shared/services/caja-gate.service';
import { AvatarService } from '../../../shared/services/avatar.service';
import { SedeFiltroService } from '../../../shared/services/sede-filtro.service';
import { CanalWebAvisos } from '../../../shared/services/canal-web-avisos.service';
import { AvisoSonoro } from '../../../shared/services/aviso-sonoro.service';
import { environment } from '../../../../environments/environment';
import { ThemeService } from '../../../shared/services/theme.service';
import { coincideBusqueda } from '../../../shared/utils/search-text';

import { NAV_SECTIONS, NavItem } from '../../navigation';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  readonly sitioWeb = environment.sitioWebUrl;
  readonly theme = inject(ThemeService);
  query = '';
  results: NavItem[] = [];
  menuOpen = false;
  sedesAbiertas = false;
  avisosAbiertos = false;
  avisos: Notificacion[] = [];
  noLeidas = 0;
  sedes: Api.SedeResponseDTO[] = [];
  private items: NavItem[] = [];
  private eventos?: EventSource;
  private reloj = 0;
  private primeraCarga = true;
  private readonly anunciadas = new Set<string>();
  private readonly canal = inject(CanalWebAvisos);
  private readonly sonido = inject(AvisoSonoro);

  constructor(
    readonly sedeFiltro: SedeFiltroService,
    private readonly layout: LayoutService,
    private readonly auth: AuthService,
    private readonly tokens: TokenService,
    private readonly lookup: LookupService,
    private readonly caja: CajaGateService,
    readonly avatar: AvatarService,
    private readonly notificaciones: NotificacionesApi,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const role = this.tokens.session()?.rol ?? '';
    this.items = NAV_SECTIONS.flatMap((section) => section.items).filter((item) => !item.roles || item.roles.includes(role));
    this.lookup.loadSedes().subscribe((rows) => { this.sedes = rows.filter((sede) => sede.activa !== false); });
    this.cargarAvisos();
    this.escucharCanal();
    this.reloj = window.setInterval(() => this.cargarAvisos(), 12000);
    const pedir = () => {
      this.sonido.preparar();
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') void Notification.requestPermission();
      document.removeEventListener('pointerdown', pedir);
    };
    document.addEventListener('pointerdown', pedir);
    navigator.serviceWorker?.addEventListener('message', (event: MessageEvent) => {
      if (event.data?.tipo === 'sonido-erp') this.sonido.erp();
    });
  }

  ngOnDestroy(): void {
    this.eventos?.close();
    window.clearInterval(this.reloj);
  }

  cargarAvisos(): void {
    this.notificaciones.listar().pipe(catchError(() => of([] as Notificacion[]))).subscribe((lista) => {
      const nuevas = lista.filter((aviso) => !aviso.leida && !aviso.eliminada);
      const frescas = nuevas.filter((aviso) => !this.anunciadas.has(aviso.id));
      nuevas.forEach((aviso) => this.anunciadas.add(aviso.id));
      if (!this.primeraCarga && frescas.length) this.anunciar(frescas);
      this.primeraCarga = false;
      this.noLeidas = nuevas.length;
      this.avisos = nuevas.slice(0, 6);
      this.cdr.detectChanges();
    });
  }

  private anunciar(frescas: Notificacion[]): void {
    this.sonido.erp();
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    const titulo = frescas.length > 1 ? `${frescas.length} avisos nuevos en POLICALUM` : frescas[0].titulo;
    const cuerpo = frescas.length > 1 ? frescas.map((aviso) => aviso.titulo).join(' · ') : frescas[0].detalle;
    const aviso = new Notification(titulo, { body: cuerpo, tag: 'policalum-erp' });
    aviso.onclick = () => {
      window.focus();
      aviso.close();
      void this.router.navigateByUrl(frescas[0].ruta || '/modules/notificaciones');
    };
  }

  private escucharCanal(): void {
    const token = this.tokens.getToken();
    if (!token || typeof EventSource === 'undefined') return;
    const url = `${environment.apiUrl}/api/v1/canal-web/eventos?access_token=${encodeURIComponent(token)}`;
    this.eventos = new EventSource(url);
    this.eventos.addEventListener('aviso', () => {
      this.cargarAvisos();
      this.canal.avisar();
    });
  }

  abrirAviso(aviso: Notificacion): void {
    this.avisosAbiertos = false;
    const ir = () => void this.router.navigateByUrl(aviso.ruta || '/modules/notificaciones');
    if (aviso.leida) { ir(); return; }
    this.notificaciones.leida(aviso.id).subscribe({ next: () => this.cargarAvisos(), error: () => undefined });
    ir();
  }

  elegirSede(id: string, nombre: string): void {
    this.sedeFiltro.elegir(id, nombre);
    this.sedesAbiertas = false;
    this.caja.revisar();
  }

  onQuery(event: Event): void {
    this.query = (event.target as HTMLInputElement).value;
    this.results = this.query.trim()
      ? this.items.filter((item) => coincideBusqueda(item.label ?? '', this.query)).slice(0, 6)
      : [];
  }

  goFirst(): void {
    const target = this.results[0];
    if (!target) return;
    void this.router.navigateByUrl(target.path);
    this.clear();
  }

  clear(): void {
    this.query = '';
    this.results = [];
  }

  abrirSitio(event: Event): void {
    event.preventDefault();
    const destino = this.sitioWeb;
    const ventana = window.open(destino, '_blank', 'noopener,noreferrer');
    if (!ventana) window.location.assign(destino);
  }

  toggleMenu(): void {
    if (window.innerWidth <= 900) this.layout.toggleMobile();
    else this.layout.toggleCollapsed();
  }

  get userName(): string { return this.tokens.session()?.nombre || 'Usuario'; }
  get userEmail(): string { return this.tokens.session()?.email || ''; }
  get userRole(): string { return this.tokens.session()?.rol === 'ROLE_ADMIN' ? 'Administrador' : this.tokens.session() ? 'Multifuncional' : ''; }
  get initials(): string {
    const partes = (this.userName || 'P').trim().split(/\s+/).slice(0, 2);
    return partes.map((parte) => parte.charAt(0).toUpperCase()).join('') || 'P';
  }
  get esAdmin(): boolean { return this.tokens.session()?.rol === 'ROLE_ADMIN'; }

  ir(ruta: string): void {
    this.menuOpen = false;
    void this.router.navigateByUrl(ruta);
  }

  logout(): void {
    this.auth.logout();
    this.menuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  closeMenus(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.menuOpen = false;
      this.sedesAbiertas = false;
      this.avisosAbiertos = false;
    }
    if (!target.closest('.search-shell')) this.results = [];
  }
}
