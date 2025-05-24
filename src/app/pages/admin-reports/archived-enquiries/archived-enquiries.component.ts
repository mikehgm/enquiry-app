import { Component, OnInit } from '@angular/core';
import { EnquiryDataService } from '../../../service/enquiry-data.service';
import { Enquiry } from '../../../models/enquiry.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackButtonComponent } from "../../../shared/back-button/back-button.component";
import { LabelPipe } from '../../../pipes/label.pipe';

@Component({
  selector: 'app-archived-enquiries',
  imports: [CommonModule, RouterLink, FormsModule, BackButtonComponent, LabelPipe],
  templateUrl: './archived-enquiries.component.html',
  styleUrls: ['./archived-enquiries.component.css']
})
export class ArchivedEnquiriesComponent implements OnInit {
  archivedEnquiries: Enquiry[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private enquiryService: EnquiryDataService) {}

  ngOnInit(): void {
    this.enquiryService.getArchivedEnquiries().subscribe({
      next: (data) => this.archivedEnquiries = data,
      error: (err) => console.error(err)
    });
  }

  public getTypeLabel(typeId: number): string {
    switch (typeId) {
      case 1: return 'Wedding';
      case 2: return 'Birthday';
      case 3: return 'Party';
      case 4: return 'Meeting';
      default: return 'Unknown';
    }
  }

  setSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  pagedList(): Enquiry[] {
    const list = [...this.archivedEnquiries];

    if (this.sortColumn) {
      list.sort((a, b) => {
        const valA = (a as any)[this.sortColumn];
        const valB = (b as any)[this.sortColumn];

        const aVal = typeof valA === 'string' ? valA.toLowerCase() : valA;
        const bVal = typeof valB === 'string' ? valB.toLowerCase() : valB;

        return this.sortDirection === 'asc'
          ? aVal > bVal ? 1 : aVal < bVal ? -1 : 0
          : aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      });
    }

    const start = (this.currentPage - 1) * this.itemsPerPage;
    return list.slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.archivedEnquiries.length / this.itemsPerPage);
  }

}
