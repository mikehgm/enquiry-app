import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../service/user.service';
import { AlertService } from '../../../service/alert.service';
import { User } from '../../../models/user.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelPipe } from '../../../pipes/label.pipe';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, LabelPipe],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEdit = false;
  userIdToEdit?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alert: AlertService) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', Validators.required],
      isConfirmed: [false]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.userIdToEdit = +params['id'];
        this.loadUser(this.userIdToEdit);
      }
    });
  }

  loadUser(id: number): void {
    this.userService.getAllUsers().subscribe(users => {
      const user = users.find(u => u.userId === id);
      if (user) {
        this.userForm.patchValue({
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isConfirmed: user.isConfirmed
        });
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const formData = this.userForm.value;

    if (this.isEdit && this.userIdToEdit) {
      this.userService.updateUser(this.userIdToEdit, formData).subscribe({
        next: () => {
          this.alert.success('Usuario actualizado con éxito');
          this.router.navigate(['/admin-users']);
        },
        error: () => this.alert.error('No se pudo actualizar el usuario')
      });
    } else {
      this.userService.createUser(formData).subscribe({
        next: (res) => {
          console.log('User created:', res);
          this.alert.success(
            'Usuario creado',
            'El usuario fue creado con la contraseña por defecto "123456". Se recomienda cambiarla al iniciar sesión.'
          );
          this.router.navigate(['/admin-users']);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.alert.error('No se pudo crear el usuario')
        }
      });

    }
  }
}




//Ok(new { message = "Usuario registrado y correo enviado con éxito." })

/*
next: (res) => {
          this.alert.success('Usuario creado', res.message || 'Se registró correctamente');
          this.router.navigate(['/admin-users']);
        },
        error: (err) => {
          this.alert.error('Error al crear usuario', err?.error?.message || 'Ocurrió un error');
        }
*/
