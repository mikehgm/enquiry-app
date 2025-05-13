import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  success(title: string, text = '') {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonText: 'OK'
    });
  }

  error(title: string, text = '') {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonText: 'Entendido'
    });
  }

  confirm(options: {
    title: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmColor?: string;
    cancelColor?: string;
  }) {
    return Swal.fire({
      title: options.title,
      text: options.text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: options.confirmColor || '#0d6efd',
      cancelButtonColor: options.cancelColor || '#6c757d',
      confirmButtonText: options.confirmButtonText || 'Sí',
      cancelButtonText: options.cancelButtonText || 'Cancelar'
    });
  }
}
