import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyalClientService } from '../../../service/loyal-client.service';
import { LoyalClient } from '../../../models/loyalClient.model';
import { SendPromotionModalComponent } from '../send-promotion-modal/send-promotion-modal.component';

@Component({
  selector: 'app-loyal-clients-table',
  standalone: true,
  imports: [CommonModule, SendPromotionModalComponent],
  templateUrl: './loyal-clients-table.component.html'
})
export class LoyalClientsTableComponent implements OnChanges {
  @Input() min: number = 5;
  @Input() period: number = 30;

  clients: LoyalClient[] = [];
  loading = true;
  @ViewChild(SendPromotionModalComponent)
  sendPromoModal!: SendPromotionModalComponent;

  selectedClient: { name: string; email: string; phone: string } | null = null;


  constructor(private loyalClientService: LoyalClientService) {}

  ngOnChanges(): void {
    this.fetchClients();
  }

  fetchClients(): void {
    this.loading = true;
    this.loyalClientService.getLoyalClients(this.min, this.period).subscribe({
      next: (res) => {
        this.clients = res;
        this.loading = false;
      },
      error: () => {
        this.clients = [];
        this.loading = false;
      }
    });
  }

  openPromotionModal(client: { name: string; email: string; phone: string }): void {
    this.selectedClient = client;
    setTimeout(() => this.sendPromoModal.open(), 0);
  }

  onPromotionSend(data: {
    method: 'email' | 'whatsapp',
    message: string,
    imageFile?: File
  }): void {
    console.log('📤 Enviando promoción:', data, 'a', this.selectedClient);

    // Aquí puedes:
    // - Llamar al EmailService para enviar email
    // - O generar link para WhatsApp

    if (data.method === 'whatsapp') {
      const phone = this.selectedClient?.phone.replace(/\D/g, '');
      const message = encodeURIComponent(data.message);
      window.open(`https://wa.me/52${phone}?text=${message}`, '_blank');
    }

    if (data.method === 'email' && data.imageFile) {
      // Preparar envío por email (puede hacerse por backend)
      alert('📧 Email con imagen y mensaje será enviado (pendiente integración)');
    }
  }

}
