import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import * as Api from '../../core/api/openapi.types';
import { TokenService } from '../../services/token.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { MarcaService } from '../../shared/services/marca.service';
import { SedeFiltroService } from '../../shared/services/sede-filtro.service';
import { SedeUbicacionApi } from '../sedes/data-access/sede-ubicacion.api';
import { SedesApiService } from '../sedes/data-access/sedes.api';

@Component({
  selector: 'app-elegir-sede',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './elegir-sede.component.html',
  styleUrl: './elegir-sede.component.css',
})
export class ElegirSedeComponent implements OnInit, OnDestroy {
  sedes: Api.SedeResponseDTO[] = [];
  fotos: Record<string, string> = {};
  cargando = true;
  error = '';
  private readonly urls: string[] = [];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly api: SedesApiService,
    private readonly ubicacion: SedeUbicacionApi,
    private readonly router: Router,
    private readonly tokens: TokenService,
    private readonly cdr: ChangeDetectorRef,
    readonly marca: MarcaService,
    readonly filtro: SedeFiltroService,
  ) {}

  ngOnInit(): void {
    this.marca.cargar();
    this.api.GetApiV1Sedes({ page: 0, size: 200, sort: 'nombre,asc' }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (page) => {
        this.sedes = (page.content ?? []).filter((sede) => sede.activa !== false && sede.id);
        this.cargando = false;
        this.pintar();
        this.cargarFotos();
      },
      error: () => {
        this.cargando = false;
        this.error = 'No pude cargar las sedes. Revisa la conexión e inténtalo de nuevo.';
        this.pintar();
      },
    });
  }

  ngOnDestroy(): void {
    this.urls.forEach((url) => URL.revokeObjectURL(url));
    this.destroy$.next();
    this.destroy$.complete();
  }

  get administrador(): boolean {
    return this.tokens.isAdmin();
  }

  get nombre(): string {
    return this.tokens.getUser()?.nombre?.trim() || 'trabajador';
  }

  lugar(sede: Api.SedeResponseDTO): string {
    return [sede.direccion, sede.ciudad].filter((parte) => !!parte?.trim()).join(' · ') || 'Sin dirección';
  }

  foto(sede: Api.SedeResponseDTO): string {
    if (sede.id && this.fotos[sede.id]) return this.fotos[sede.id];
    if (sede.imagen?.startsWith('http')) return sede.imagen;
    return '';
  }

  elegir(sede: Api.SedeResponseDTO): void {
    this.filtro.elegir(sede.id ?? '', sede.nombre ?? 'Sede');
    this.entrar();
  }

  todas(): void {
    this.filtro.elegir('', 'Sedes');
    this.entrar();
  }

  crear(): void {
    this.filtro.entrarAlCrear = true;
    void this.router.navigate(['/modules/sedes'], { queryParams: { crear: '1' } });
  }

  salir(): void {
    this.tokens.logout();
  }

  private entrar(): void {
    void this.router.navigateByUrl(this.administrador ? '/modules/turnos-caja' : '/inicio');
  }

  private cargarFotos(): void {
    for (const sede of this.sedes) {
      const ruta = sede.imagen;
      const id = sede.id;
      if (!ruta || !id || ruta.startsWith('http')) continue;
      this.ubicacion.foto(ruta).pipe(takeUntil(this.destroy$)).subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          this.urls.push(url);
          this.fotos = { ...this.fotos, [id]: url };
          this.pintar();
        },
        error: () => undefined,
      });
    }
  }

  private pintar(): void {
    this.cdr.markForCheck();
  }
}
