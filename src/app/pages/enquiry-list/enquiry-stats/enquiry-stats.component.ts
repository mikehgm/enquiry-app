import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Enquiry } from '../../../models/enquiry.model';

@Component({
  selector: 'app-enquiry-stats',
  imports: [CommonModule],
  templateUrl: './enquiry-stats.component.html',
  styleUrl: './enquiry-stats.component.css'
})
export class EnquiryStatsComponent {
  @Input() enquiryList: Enquiry[] = [];
  @Input() selectedStatusId: number | null = null;
  @Output() statusFilter = new EventEmitter<number>();

  onStatusClick(status: number): void {
    this.statusFilter.emit(status);
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'badge-new';
      case 2: return 'badge-progress';
      case 3: return 'badge-hold';
      case 4: return 'badge-resolved';
      default: return '';
    }
  }

  getStatusIcon(status: number): string {
    switch (status) {
      case 1: return 'fas fa-plus-circle';
      case 2: return 'fas fa-spinner';
      case 3: return 'fas fa-pause-circle';
      case 4: return 'fas fa-check-circle';
      default: return '';
    }
  }

  getStatusLabel(status: number): string {
    switch (status) {
      case 1: return 'New';
      case 2: return 'In Progress';
      case 3: return 'On Hold';
      case 4: return 'Resolved';
      default: return '';
    }
  }

  countByStatus(status: number): number {
    return this.enquiryList.filter(e => e.enquiryStatusId === status).length;
  }

}
