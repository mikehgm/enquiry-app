import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../../service/alert.service';
import { EmailService } from '../../../service/email.service';


@Component({
  selector: 'app-send-promotion-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-promotion-modal.component.html',
  styleUrl: './send-promotion-modal.component.css'

})
export class SendPromotionModalComponent {
  @Input() clientId!: number;
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
    this.imagePreview = null;
  }

  close(): void {
    this.message = '';
    this.imageFile = null;
    this.imagePreview = null;
    this.selectedMethod = 'email';
    this.show = false;
    this.send.emit();
  }

  submit(): void {
    const method = this.selectedMethod;
    const trimmedMessage = this.message.trim();

    if (method === 'email') {
      this.emailService.sendPromotion(
        this.clientId,
        trimmedMessage,
        method,
        this.email,
        undefined,
        this.imageFile || undefined
      ).subscribe({
        next: () => {
          this.alert.success('Correo enviado', 'La promoción fue enviada exitosamente.');
          this.close();
        },
        error: (error) => {
          if (error.status === 409) {
            this.alert.error('Promoción ya enviada', 'Ya se envió una promoción a este cliente recientemente.');
          } else {
            this.alert.error('Error al enviar', 'No se pudo enviar la promoción. Intenta de nuevo.');
          }
        }
      });

    } else {
      const phone = this.phone.replace(/\D/g, '');
      if (!phone || phone.length < 10) {
        this.alert.error('Número inválido', 'El teléfono del cliente no es válido para WhatsApp.');
        return;
      }

      const fullPhone = `52${phone}`;

      this.emailService.sendPromotion(
        this.clientId,
        trimmedMessage,
        method,
        undefined,
        fullPhone
      ).subscribe({
        next: () => {
          this.alert.success('WhatsApp registrado', 'La promoción fue registrada exitosamente.');
          this.close();
        },
        error: (error) => {
          if (error.status === 409) {
            this.alert.error('Promoción ya enviada', 'Ya se envió una promoción a este cliente recientemente.');
          } else {
            this.alert.error('Error al enviar', 'No se pudo enviar la promoción. Intenta de nuevo.');
          }
        }
      });

      // También lo redirigimos a WhatsApp Web para enviarlo manualmente
      const encodedMsg = encodeURIComponent(trimmedMessage);
      const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodedMsg}`;
      window.open(whatsappUrl, '_blank');
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
