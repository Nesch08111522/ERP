import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { HeaderComponent } from './header';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AuthService, useValue: { getCurrentUser: () => null, logout: () => undefined } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('offers profile, password, and sign-out actions in the avatar menu', () => {
    const botonAvatar = fixture.nativeElement.querySelector('.dropdown:last-child > button') as HTMLButtonElement;
    botonAvatar.click();
    fixture.detectChanges();
    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('Mi perfil');
    expect(texto).toContain('Seguridad y contraseña');
    expect(texto).toContain('Cerrar sesión');
  });
});
