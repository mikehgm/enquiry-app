import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminOrSuperGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.authService.getRole();
  if (role === 'Admin' || role === 'SuperAdmin') {
    return true;
  }

    this.router.navigate(['/']);
    return false;
  }
}
