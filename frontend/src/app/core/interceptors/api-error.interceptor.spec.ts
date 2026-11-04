import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { apiErrorInterceptor } from './api-error.interceptor';
import { ToastService } from '../../shared/services/toast.service';
import { TokenService } from '../../services/token.service';

describe('apiErrorInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  const logout = vi.fn();
  const toastError = vi.fn();

  beforeEach(() => {
    logout.mockReset();
    toastError.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenService, useValue: { getRefresh: () => null, logout } },
        { provide: ToastService, useValue: { error: toastError } },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
    TestBed.resetTestingModule();
  });

  it('handles a non-string error message and closes the expired session', () => {
    let fallo: unknown;
    http.get('/api/v1/stock/almacen/test').subscribe({ error: (error: unknown) => { fallo = error; } });

    httpTesting.expectOne('/api/v1/stock/almacen/test').flush(
      { message: 401 },
      { status: 401, statusText: 'Unauthorized' },
    );

    expect(fallo).toMatchObject({ status: 401, message: 'Tu sesión expiró. Vuelve a iniciar sesión.' });
    expect(logout).toHaveBeenCalledOnce();
    expect(toastError).not.toHaveBeenCalled();
  });
});
