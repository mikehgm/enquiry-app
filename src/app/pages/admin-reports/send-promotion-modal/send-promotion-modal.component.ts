import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../service/alert.service';
import { EmailService } from '../../../service/email.service';


@Component({
  selector: 'app-send-promotion-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-promotion-modal.component.html'
})
export class SendPromotionModalComponent {
  @Input() clientName: string = '';
  @Input() email: string = '';
  @Input() phone: string = '';
  @Output() send = new EventEmitter<{
    method: 'email' | 'whatsapp',
    message: string,
    imageFile?: File
  }>();

  show = false;
  selectedMethod: 'email' | 'whatsapp' = 'email';
  message: string = '';
  imageFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private emailService: EmailService,
    private alert: AlertService
  ) {}



  open(): void {
    this.show = true;
    this.message = '';
    this.selectedMethod = 'email';
    this.imageFile = null;
  }

  close(): void {
    this.show = false;
  }

  submit(): void {
    if (this.selectedMethod === 'email') {
      this.emailService.sendPromotion(
        this.email,
        this.message.trim(),
        this.imageFile || undefined
      ).subscribe({
        next: () => {
          this.alert.success('Correo enviado', 'La promoción fue enviada exitosamente.');
          this.close();
        },
        error: () => {
          this.alert.error('Error al enviar', 'No se pudo enviar el correo. Intenta de nuevo.');
        }
      });
    } else {
        const phone = this.phone.replace(/\D/g, '');

        if (!phone || phone.length < 10) {
          this.alert.error('Número inválido', 'El teléfono del cliente no es válido para WhatsApp.');
          return;
        }

        const fullPhone = `52${phone}`;
        const encodedMsg = encodeURIComponent(this.message.trim());
        const url = `https://wa.me/${fullPhone}?text=${encodedMsg}`;
        window.open(url, '_blank');
        this.alert.success('Redirigiendo a WhatsApp', 'El mensaje está listo para enviarse.');
        this.close();
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      this.alert.error('Archivo demasiado grande', 'El tamaño máximo permitido es 10MB.');
      this.imageFile = null;
      this.imagePreview = null;
    } else {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
