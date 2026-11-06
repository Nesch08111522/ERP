// src/app/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = (route.data?.['expectedRoles'] as string[] | undefined) ?? null;
    const userRol = this.tokenService.getRol();

    // 1. Sin sesión → login
    if (!userRol) {
      void this.router.navigate(['/login']);
      return false;
    }

    // 2. Ruta sin roles definidos → solo auth necesaria
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    // 3. Rol permitido
    if (expectedRoles.includes(userRol)) {
      return true;
    }

    // 4. Sin permiso → /error/permisos con la URL intentada
    void this.router.navigate(['/error/permisos'], {
      queryParams: { denied: state.url },
    });
    return false;
  }
}