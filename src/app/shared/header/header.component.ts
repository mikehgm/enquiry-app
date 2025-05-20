import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { AlertService } from '../../service/alert.service';
declare var bootstrap: any; // Solo si no tienes @types/bootstrap

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  searchTerm: string = '';
  @ViewChild('navbarCollapse') navbarCollapse!: ElementRef;
  @Output() searchChanged = new EventEmitter<string>();


  constructor(public authService: AuthService, private alert: AlertService, private router: Router) {}

  ngOnInit(): void {
    this.searchTerm = '';
    console.log('role', this.authService.getRole());
  }

  onSearchChange(): void {
    this.searchChanged.emit(this.searchTerm.trim().toLowerCase());
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchChanged.emit('');
  }

  logout(): void {

    this.alert.confirm({
      title: '¿Cerrar sesión?',
      text: 'Tu sesión se cerrará y volverás al login.',
      confirmColor: '#dc3545'
    }).then(result => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/login']);
        this.alert.success('Sesión cerrada', 'Has salido correctamente.');
      }
    });
  }

  get isAdmin(): boolean {
    return this.authService.getRole() === 'Admin';
  }

  collapseNavbar(): void {
    const collapseEl = this.navbarCollapse.nativeElement;
    if (collapseEl.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
      bsCollapse?.hide();
    }
  }

}
