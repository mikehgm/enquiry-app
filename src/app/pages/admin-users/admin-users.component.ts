import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { AlertService } from '../../service/alert.service';
import { User } from '../../models/user.model';
import { BackButtonComponent } from "../../shared/back-button/back-button.component";

@Component({
  selector: 'app-admin-users',
  imports: [RouterLink, CommonModule, FormsModule, BackButtonComponent],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  userList: User[] = [];


  constructor(
    private userService: UserService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (res) => this.userList = res,
      error: () => this.alert.error('Error al cargar los usuarios')
    });
  }

  deleteUser(id: number): void {
    this.alert.confirm({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer.',
      confirmColor: '#dc3545'
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.loadUsers();
            this.alert.success('Usuario eliminado');
          },
          error: () => this.alert.error('No se pudo eliminar el usuario')
        });
      }
    });
  }
}
