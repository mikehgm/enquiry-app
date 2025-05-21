import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { AlertService } from '../../service/alert.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelPipe } from '../../pipes/label.pipe';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LabelPipe],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private alert: AlertService,
    private router: Router
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.form.value.newPassword !== this.form.value.confirmPassword) {
      this.alert.error('Las contraseñas no coinciden o son inválidas');
      return;
    }

    this.auth.changePassword(this.form.value.newPassword).subscribe({
      next: () => {
        this.alert.success(
          '¡Listo!',
          'Tu contraseña fue actualizada con éxito. Ya puedes continuar usando la aplicación.'
        );
        this.router.navigate(['/']);
      },
      error: () => {
        this.alert.error('No se pudo actualizar la contraseña');
      }
    });
  }
}
