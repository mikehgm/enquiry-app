import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoyalClientService } from '../../../service/loyal-client.service';
import { LoyalClient } from '../../../models/loyalClient.model';
import { SendPromotionModalComponent } from '../send-promotion-modal/send-promotion-modal.component';
import { PromotionHistoryModalComponent } from "../promotion-history-modal/promotion-history-modal.component";
import { AlertService } from '../../../service/alert.service';
import { LabelPipe } from '../../../pipes/label.pipe';

@Component({
  selector: 'app-loyal-clients-table',
  standalone: true,
  imports: [CommonModule, SendPromotionModalComponent, PromotionHistoryModalComponent, LabelPipe],
  templateUrl: './loyal-clients-table.component.html'
})
export class LoyalClientsTableComponent implements OnChanges {
  @Input() min: number = 5;
  @Input() period: number = 30;

  loyalClients: LoyalClient[] = [];
  loading = true;
  @ViewChild(SendPromotionModalComponent)
  sendPromoModal!: SendPromotionModalComponent;

  selectedClient: {
    clientId: number;
    name: string;
    email: string;
    phone: string } | null = null;

  historyModalVisible = false;
  promotionHistory: any[] = [];

  constructor(private alert: AlertService, private loyalClientService: LoyalClientService) {}

  ngOnChanges(): void {
    this.fetchClients();
  }

  fetchClients(): void {
    this.loading = true;
    this.loyalClientService.getLoyalClients(this.min, this.period).subscribe({
      next: (res) => {
        this.loyalClients = res;
        this.loading = false;
      },
      error: () => {
        this.loyalClients = [];
        this.loading = false;
      }
    });
  }

  openPromotionModal(loyalClient: LoyalClient): void {
    this.selectedClient = loyalClient;
    this.sendPromoModal.clientId = this.selectedClient.clientId;
    setTimeout(() => this.sendPromoModal.open(), 0);
  }

  openHistoryModal(client: LoyalClient): void {
    this.selectedClient = client;
    this.historyModalVisible = true;

    this.loyalClientService.getPromotionHistory(client.clientId).subscribe({
      next: (res) => {
        this.promotionHistory = res;
      },
      error: () => {
        this.alert.error('Error', 'No se pudo obtener el historial de promociones.');
        this.promotionHistory = [];
      }
    });
  }
}
