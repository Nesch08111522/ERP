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
  imagenes?: string[];
  cliente?: string;
  lugar?: string;
  anio?: string;
  servicio?: string;
  referencia?: string;
  etiquetas?: string[];
  orden: number;
  publicado: boolean;
  createdAt?: string;
}

interface CuerpoProyecto {
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  orden: number;
  publicado: boolean;
  cliente: string;
  lugar: string;
  anio: string;
  servicio: string;
  referencia: string;
  etiquetas: string[];
  imagenes: string[];
}

@Component({
  selector: 'app-portafolio-web-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent, FormFieldComponent],
  templateUrl: './portafolio-web-page.component.html',
  styleUrls: ['./portafolio-web-page.component.css'],
})
export class PortafolioWebPageComponent implements OnInit {
  readonly topeDescripcion = 40;
  readonly topeReferencia = 16;
  readonly topeImagenes = 6;
  proyectos: ProyectoWeb[] = [];
  editando: string | null = null;
  cargando = false;
  errorCarga = '';
  guardando = false;
  subiendo = false;
  eliminandoId: string | null = null;
  readonly esAdmin: boolean;
  private readonly fb = inject(FormBuilder);
  readonly imagenes = this.fb.nonNullable.array<string>([]);
  readonly form = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.maxLength(160)]],
    descripcion: ['', [Validators.required, Validators.maxLength(800), maxPalabras(this.topeDescripcion)]],
    cliente: ['', Validators.maxLength(160)],
    lugar: ['', Validators.maxLength(80)],
    anio: ['', Validators.pattern(/^$|^\d{4}$/)],
    servicio: ['', Validators.maxLength(60)],
    referencia: ['', [Validators.maxLength(160), maxPalabras(this.topeReferencia)]],
    etiquetas: ['', etiquetasValidas],
    orden: [0, [Validators.required, entero]],
    publicado: [true],
    imagenes: this.imagenes,
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

  palabras(texto: string | null | undefined): number {
    return String(texto ?? '').trim().split(/\s+/).filter(Boolean).length;
  }

  ficha(proyecto: ProyectoWeb): string {
    return [proyecto.servicio, proyecto.lugar, proyecto.anio].filter((item) => !!item?.trim()).join(' · ');
  }

  portada(proyecto: ProyectoWeb): string {
    const ruta = proyecto.imagenes?.find((item) => item.trim()) || proyecto.imagenUrl || '';
    if (!ruta) return '';
    if (ruta.startsWith('http://') || ruta.startsWith('https://')) return ruta;
    return `${environment.apiUrl}${ruta.startsWith('/') ? ruta : `/${ruta}`}`;
  }

  cargar(): void {
    this.cargando = true;
    this.errorCarga = '';
    this.pintar();
    this.http.get<ProyectoWeb[]>(`${environment.apiUrl}/api/v1/portafolio`).subscribe({
      next: (lista) => {
        this.proyectos = lista ?? [];
        this.cargando = false;
        this.pintar();
      },
      error: (error: unknown) => {
        this.cargando = false;
        this.errorCarga = problemText(error);
        this.toast.error(this.errorCarga);
        this.pintar();
      },
    });
  }

  editar(proyecto: ProyectoWeb): void {
    this.editando = proyecto.id;
    this.imagenes.clear();
    const fotos = (proyecto.imagenes ?? []).map((item) => item.trim()).filter(Boolean);
    const lista = fotos.length ? fotos : proyecto.imagenUrl ? [proyecto.imagenUrl] : [];
    for (const foto of lista) this.agregarControl(foto);
    this.form.patchValue({
      titulo: proyecto.titulo,
      descripcion: proyecto.descripcion,
      cliente: proyecto.cliente ?? '',
      lugar: proyecto.lugar ?? '',
      anio: proyecto.anio ?? '',
      servicio: proyecto.servicio ?? '',
      referencia: proyecto.referencia ?? '',
      etiquetas: (proyecto.etiquetas ?? []).join(', '),
      orden: proyecto.orden ?? 0,
      publicado: proyecto.publicado !== false,
    });
    this.pintar();
  }

  limpiar(): void {
    this.editando = null;
    this.imagenes.clear();
    this.form.reset({
      titulo: '',
      descripcion: '',
      cliente: '',
      lugar: '',
      anio: '',
      servicio: '',
      referencia: '',
      etiquetas: '',
      orden: 0,
      publicado: true,
    });
  }

  agregarImagen(): void {
    if (this.imagenes.length >= this.topeImagenes) return;
    this.agregarControl('');
  }

  quitarImagen(indice: number): void {
    this.imagenes.removeAt(indice);
  }

  subirImagen(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0] ?? null;
    input.value = '';
    if (!archivo) return;
    if (this.imagenes.length >= this.topeImagenes) {
      this.toast.error('Puedes publicar hasta 6 imágenes.');
      return;
    }
    const datos = new FormData();
    datos.append('archivo', archivo);
    this.subiendo = true;
    this.pintar();
    this.http.post<{ ruta: string }>(`${environment.apiUrl}/api/v1/cms/medios`, datos).subscribe({
      next: (respuesta) => {
        this.subiendo = false;
        if (respuesta?.ruta) this.agregarControl(respuesta.ruta);
        this.pintar();
      },
      error: (error: unknown) => {
        this.subiendo = false;
        this.toast.error(problemText(error));
        this.pintar();
      },
    });
  }

  guardar(): void {
    if (this.guardando) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.guardando = true;
    this.pintar();
    const estabaEditando = this.editando !== null;
    const cuerpo = this.cuerpo();
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
        this.pintar();
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
        this.pintar();
      },
    });
  }

  private cuerpo(): CuerpoProyecto {
    const valor = this.form.getRawValue();
    const fotos = valor.imagenes.map((item) => item.trim()).filter(Boolean);
    return {
      titulo: valor.titulo,
      descripcion: valor.descripcion,
      imagenUrl: fotos[0] ?? '',
      orden: valor.orden,
      publicado: valor.publicado,
      cliente: valor.cliente,
      lugar: valor.lugar,
      anio: valor.anio,
      servicio: valor.servicio,
      referencia: valor.referencia,
      etiquetas: valor.etiquetas.split(',').map((item) => item.trim()).filter(Boolean),
      imagenes: fotos,
    };
  }

  private agregarControl(valor: string): void {
    this.imagenes.push(this.fb.nonNullable.control(valor, [Validators.maxLength(500), urlImagen]));
  }

  private pintar(): void {
    this.cdr.detectChanges();
  }
}

function entero(control: AbstractControl): ValidationErrors | null {
  return Number.isInteger(control.value) ? null : { entero: true };
}

function maxPalabras(tope: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const total = String(control.value ?? '').trim().split(/\s+/).filter(Boolean).length;
    return total > tope ? { palabras: { max: tope, actual: total } } : null;
  };
}

function etiquetasValidas(control: AbstractControl): ValidationErrors | null {
  const etiquetas = String(control.value ?? '').split(',').map((item) => item.trim()).filter(Boolean);
  if (etiquetas.length > 6) return { etiquetas: true };
  if (etiquetas.some((item) => item.length > 24)) return { etiquetaLarga: true };
  return null;
}

function urlImagen(control: AbstractControl): ValidationErrors | null {
  const valor = String(control.value ?? '').trim();
  if (!valor) return null;
  if (valor.startsWith('/') && !valor.startsWith('//') && !valor.includes('..')) return null;
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
