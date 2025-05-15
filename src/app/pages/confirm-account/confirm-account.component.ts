import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { AlertService } from '../../service/alert.service';

@Component({
  selector: 'app-confirm-account',
  standalone: true,
  templateUrl: './confirm-account.component.html'
})
export class ConfirmAccountComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (token) {
        this.http.get(`${environment.apiUrl}/api/auth/confirm?token=${token}`).subscribe({
          next: () => {
            this.alert.success('Cuenta confirmada', 'Tu cuenta ha sido verificada con éxito.');
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Error al confirmar la cuenta:', error);
            this.alert.error('Error', 'Token inválido o ya fue usado.');
            this.router.navigate(['/']);
          }
        });
      } else {
        this.alert.error('Token faltante');
        this.router.navigate(['/']);
      }
    });
  }
}
