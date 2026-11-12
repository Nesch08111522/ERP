import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { environment } from '../../../environments/environment';
import { TokenService } from '../../services/token.service';
import { ToastService } from '../../shared/services/toast.service';
import { PortafolioWebPageComponent, ProyectoWeb } from './portafolio-web-page.component';

describe('PortafolioWebPageComponent', () => {
  let http: HttpTestingController;
  let component: PortafolioWebPageComponent;
  let toasts: { success: ReturnType<typeof vi.fn>; error: ReturnType<typeof vi.fn> };
  const url = `${environment.apiUrl}/api/v1/portafolio`;
  const proyecto: ProyectoWeb = {
    id: 'proyecto-1',
    titulo: 'Proyecto',
    descripcion: 'Descripción',
    imagenUrl: 'https://example.com/obra.jpg',
    cliente: 'Cliente',
    orden: 1,
    publicado: true,
  };

  beforeEach(() => {
    toasts = { success: vi.fn(), error: vi.fn() };
    TestBed.configureTestingModule({
      imports: [PortafolioWebPageComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: TokenService, useValue: { getRol: () => 'ROLE_ADMIN' } },
        { provide: ToastService, useValue: toasts },
      ],
    });
    http = TestBed.inject(HttpTestingController);
    const fixture = TestBed.createComponent(PortafolioWebPageComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    http.expectOne(url).flush([]);
  });

  afterEach(() => {
    http.verify();
    TestBed.resetTestingModule();
  });

  it('envía una sola alta aunque se invoque guardar varias veces', () => {
    component.form.setValue({
      titulo: proyecto.titulo,
      descripcion: proyecto.descripcion,
      cliente: proyecto.cliente ?? '',
      lugar: '',
      anio: '',
      servicio: '',
      referencia: '',
      etiquetas: '',
      videoUrl: '',
      hlsUrl: '',
      dashUrl: '',
      orden: proyecto.orden,
      publicado: false,
      imagenes: [],
    });

    component.guardar();
    component.guardar();

    const request = http.expectOne(url);
    expect(request.request.method).toBe('POST');
    expect(request.request.body.publicado).toBe(false);
    request.flush(proyecto);
    http.expectOne(url).flush([proyecto]);

    expect(toasts.success).toHaveBeenCalledWith('Proyecto creado.');
    expect(component.form.controls.titulo.value).toBe('');
  });

  it('mantiene los datos de edición cuando el backend rechaza el guardado', () => {
    component.editar(proyecto);
    component.form.controls.descripcion.setValue('Descripción actualizada');

    component.guardar();

    const request = http.expectOne(`${url}/${proyecto.id}`);
    expect(request.request.method).toBe('PUT');
    request.flush({ message: 'No válido' }, { status: 400, statusText: 'Bad Request' });

    expect(component.editando).toBe(proyecto.id);
    expect(component.form.controls.descripcion.value).toBe('Descripción actualizada');
    expect(component.guardando).toBe(false);
    expect(toasts.error).toHaveBeenCalledOnce();
  });
});
