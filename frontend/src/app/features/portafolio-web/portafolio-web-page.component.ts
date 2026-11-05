import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Routes } from '@angular/router';
import { RoleGuard } from '../../guards/role.guard';
import { environment } from '../../../environments/environment';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component';
import { ToastService } from '../../shared/services/toast.service';
import { problemText } from '../../shared/utils/feedback';
import { TokenService } from '../../services/token.service';

export interface ProyectoWeb {
  id: string;
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  cliente?: string;
  orden: number;
  publicado: boolean;
  createdAt?: string;
}

@Component({
  selector: 'app-portafolio-web-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, FormFieldComponent],
  templateUrl: './portafolio-web-page.component.html',
  styleUrls: ['./portafolio-web-page.component.css'],
})
export class PortafolioWebPageComponent implements OnInit {
  proyectos: ProyectoWeb[] = [];
  editando: string | null = null;
  cargando = false;
  errorCarga = '';
  guardando = false;
  eliminandoId: string | null = null;
  readonly esAdmin: boolean;
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(160)]],
    descripcion: ['', [Validators.required, Validators.maxLength(800)]],
    imagenUrl: ['', [Validators.maxLength(500), urlImagen]],
    cliente: ['', Validators.maxLength(160)],
    orden: [0, [Validators.required, entero]],
    publicado: [true],
  });

  constructor(
    private readonly http: HttpClient,
    private readonly toast: ToastService,
    private readonly cdr: ChangeDetectorRef,
    tokens: TokenService,
  ) {
    this.esAdmin = tokens.getRol() === 'ROLE_ADMIN';
  }

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.cargando = true;
    this.errorCarga = '';
    this.http.get<ProyectoWeb[]>(`${environment.apiUrl}/api/v1/portafolio`).subscribe({
      next: (lista) => {
        this.proyectos = lista ?? [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        this.cargando = false;
        this.errorCarga = problemText(error);
        this.toast.error(this.errorCarga);
      },
    });
  }

  editar(proyecto: ProyectoWeb): void {
    this.editando = proyecto.id;
    this.form.reset({
      titulo: proyecto.titulo,
      descripcion: proyecto.descripcion,
      imagenUrl: proyecto.imagenUrl ?? '',
      cliente: proyecto.cliente ?? '',
      orden: proyecto.orden ?? 0,
      publicado: proyecto.publicado !== false,
    });
  }

  limpiar(): void {
    this.editando = null;
    this.form.reset({ titulo: '', descripcion: '', imagenUrl: '', cliente: '', orden: 0, publicado: true });
  }

  guardar(): void {
    if (this.guardando) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.guardando = true;
    const estabaEditando = this.editando !== null;
    const cuerpo = this.form.getRawValue();
    const pedido = estabaEditando
      ? this.http.put<ProyectoWeb>(`${environment.apiUrl}/api/v1/portafolio/${this.editando}`, cuerpo)
      : this.http.post<ProyectoWeb>(`${environment.apiUrl}/api/v1/portafolio`, cuerpo);
    pedido.subscribe({
      next: () => {
        this.guardando = false;
        this.toast.success(estabaEditando ? 'Proyecto actualizado.' : 'Proyecto creado.');
        this.limpiar();
        this.cargar();
      },
      error: (error: unknown) => {
        this.guardando = false;
        this.toast.error(problemText(error));
      },
    });
  }

  eliminar(proyecto: ProyectoWeb): void {
    if (this.eliminandoId || !window.confirm(`¿Eliminar el proyecto "${proyecto.titulo}"? Esta acción no se puede deshacer.`)) return;
    this.eliminandoId = proyecto.id;
    this.http.delete(`${environment.apiUrl}/api/v1/portafolio/${proyecto.id}`).subscribe({
      next: () => {
        this.eliminandoId = null;
        this.toast.success('Proyecto eliminado.');
        this.cargar();
      },
      error: (error: unknown) => {
        this.eliminandoId = null;
        this.toast.error(problemText(error));
      },
    });
  }
}

function entero(control: AbstractControl): ValidationErrors | null {
  return Number.isInteger(control.value) ? null : { entero: true };
}

function urlImagen(control: AbstractControl): ValidationErrors | null {
  const valor = String(control.value ?? '').trim();
  if (!valor) return null;
  try {
    const url = new URL(valor);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.hostname && !url.username && !url.password
      ? null
      : { urlImagen: true };
  } catch {
    return { urlImagen: true };
  }
}

export const PORTAFOLIO_WEB_ROUTES: Routes = [
  { path: '', component: PortafolioWebPageComponent, canActivate: [RoleGuard], title: 'Portafolio web', data: { section: 'Configuración', breadcrumb: 'Portafolio web', expectedRoles: ['ROLE_ADMIN', 'ROLE_MULTIFUNCIONAL'] } },
];
