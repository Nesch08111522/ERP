import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Routes } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { DashboardAdminPageComponent } from './dashboard-admin-page.component';
import { MultifuncionalDashboardComponent } from './multifuncional-dashboard.component';

/**
 * Wrapper que decide qué dashboard renderizar según el rol del usuario.
 * - ROLE_ADMIN → DashboardAdminPageComponent (panel gerencial completo)
 * - ROLE_MULTIFUNCIONAL → MultifuncionalDashboardComponent ("Mi Día")
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, DashboardAdminPageComponent, MultifuncionalDashboardComponent],
  template: `
    <ng-container *ngIf="esAdmin; else multiDashboard">
      <app-dashboard-admin-page></app-dashboard-admin-page>
    </ng-container>
    <ng-template #multiDashboard>
      <app-multifuncional-dashboard></app-multifuncional-dashboard>
    </ng-template>
  `,
})
export class DashboardPageComponent {
  readonly esAdmin: boolean;

  constructor(tokens: TokenService) {
    this.esAdmin = tokens.getRol() === 'ROLE_ADMIN';
  }
}

export const DASHBOARD_ROUTES: Routes = [
  { path: '', component: DashboardPageComponent, title: 'Panel', data: { section: 'Inicio', breadcrumb: 'Panel' } },
];