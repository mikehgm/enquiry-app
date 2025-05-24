import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { AlertService } from '../../service/alert.service';
import { LabelPipe } from '../../pipes/label.pipe';
declare var bootstrap: any; // Solo si no tienes @types/bootstrap

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [RouterLink, CommonModule, FormsModule, LabelPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  searchTerm: string = '';
  public isNavbarOpen = false;

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

  get isSuperAdmin(): boolean {
    return this.authService.getRole() === 'SuperAdmin';
  }

  collapseNavbar(): void {
    this.isNavbarOpen = false;
    const collapseEl = this.navbarCollapse.nativeElement;
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl);
    bsCollapse.hide();
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    // Cerrar cualquier otro dropdown abierto
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
      menu.classList.remove('show');
    });

    // Abrir el dropdown actual
    const element = event.currentTarget as HTMLElement;
    const parentLi = element.closest('.dropdown');

    // 🔧 Declaramos menu aquí
    let menu: Element | null = null;

    if (parentLi) {
      menu = parentLi.querySelector('.dropdown-menu');
      if (menu) {
        menu.classList.toggle('show');
      }
    }

    // Activar listener para cerrar si se hace clic fuera
    const handleOutsideClick = (clickEvent: MouseEvent) => {
      const target = clickEvent.target as HTMLElement;
      if (!parentLi?.contains(target)) {
        menu?.classList.remove('show');
        document.removeEventListener('click', handleOutsideClick);
      }
    };

    document.addEventListener('click', handleOutsideClick);
  }

  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;

    const collapseEl = this.navbarCollapse.nativeElement;
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl);

    if (this.isNavbarOpen) {
      bsCollapse.show();
    } else {
      bsCollapse.hide();
    }
  }

}
