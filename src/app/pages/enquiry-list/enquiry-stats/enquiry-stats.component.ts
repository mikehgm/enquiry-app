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

  countByStatus(statusId: number): number {
    return this.enquiryList.filter(e => e.enquiryStatusId === statusId).length;
  }

  onStatusClick(statusId: number): void {
    this.statusFilter.emit(statusId);
  }
}
