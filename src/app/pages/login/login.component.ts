import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private alert: AlertService, private router: Router) {}

  login(): void {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        const mustChangePassword = res.mustChangePassword;
        this.authService.setTokens(res.access_token, res.refresh_token);

        if (!mustChangePassword) {
          this.router.navigate(['/change-password']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.alert.error('Error de inicio de sesión', 'Correo o contraseña incorrectos, o la cuenta no está confirmada.');
      }
    });
  }
}
