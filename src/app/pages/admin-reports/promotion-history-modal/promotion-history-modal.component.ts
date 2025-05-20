import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from '../../../../environment/environment';

@Component({
  selector: 'app-promotion-history-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promotion-history-modal.component.html',
  styleUrls: ['./promotion-history-modal.component.css']
})
export class PromotionHistoryModalComponent {
  @Input() show = false;
  @Input() history: any[] = [];
  @Input() clientName = '';
  @Output() close = new EventEmitter<void>();

  getFullImageUrl(relativePath: string): string {
    return `${environment.apiUrl}${relativePath}`;
  }
}

