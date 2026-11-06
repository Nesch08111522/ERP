import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnDestroy, OnInit, effect, inject, signal, untracked, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { LayoutService } from '../../../shared/services/layout.service';
import { MarcaService } from '../../../shared/services/marca.service';
import { CanalWebAvisos } from '../../../shared/services/canal-web-avisos.service';
import { MensajesSinLeer } from '../../../shared/services/mensajes-sin-leer.service';
import { NAV_SECTIONS, NavSection } from '../../navigation';

const GROUPS_KEY = 'erp-nav-groups';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  sections: NavSection[] = [];
  readonly openGroups = signal<Record<string, boolean>>({});
  readonly bandeja = inject(MensajesSinLeer);

  private readonly destroyRef = inject(DestroyRef);
  private readonly canal = inject(CanalWebAvisos);
  private reloj = 0;
  private readonly alLlegar = effect(() => {
    this.canal.revision();
    untracked(() => this.bandeja.refrescar());
  });

  constructor(
    readonly layout: LayoutService,
    readonly marca: MarcaService,
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const user = this.auth.getCurrentUser();
    const role = user?.rol ?? '';
    this.sections = NAV_SECTIONS
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => !item.roles || item.roles.includes(role)),
      }))
      .filter((section) => section.items.length > 0);
    this.openGroups.set(this.readGroups());
    this.expandActive(this.router.url);
    this.bandeja.refrescar();
    this.reloj = window.setInterval(() => this.bandeja.refrescar(), 8000);
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((event) => {
      this.expandActive((event as NavigationEnd).urlAfterRedirects);
    });
  }

  ngOnDestroy(): void {
    window.clearInterval(this.reloj);
  }

  isOpen(id: string): boolean {
    return this.openGroups()[id] !== false;
  }

  toggleGroup(id: string): void {
    this.openGroups.update((groups) => {
      const next = { ...groups, [id]: groups[id] === false };
      if (typeof localStorage !== 'undefined') localStorage.setItem(GROUPS_KEY, JSON.stringify(next));
      return next;
    });
  }

  private readGroups(): Record<string, boolean> {
    if (typeof localStorage === 'undefined') return {};
    try {
      const raw = localStorage.getItem(GROUPS_KEY);
      return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
    } catch {
      return {};
    }
  }

  private expandActive(url: string): void {
    const section = this.sections.find((item) => item.items.some((link) => url === link.path || url.startsWith(`${link.path}/`)));
    if (!section || this.isOpen(section.id)) return;
    this.toggleGroup(section.id);
  }
}
