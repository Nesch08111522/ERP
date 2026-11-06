import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AvisoSistemaHostComponent } from './shared/components/aviso-sistema/aviso-sistema-host.component';
import { ToastHostComponent } from './shared/components/toast/toast-host.component';
import { MarcaService } from './shared/services/marca.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastHostComponent, AvisoSistemaHostComponent],
  template: `<router-outlet></router-outlet><app-toast-host></app-toast-host><app-aviso-sistema-host></app-aviso-sistema-host>`,
  styleUrls: ['./app.css']
})
export class App {
  title = 'POLICALUM';
  constructor() {
    inject(MarcaService).cargar();
  }
}