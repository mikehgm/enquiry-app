import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogDataService } from '../../../service/catalog-data.service';
import { FormsModule } from '@angular/forms';
import { EnquiryStatus } from '../../../models/status.model';
import { LabelPipe } from '../../../pipes/label.pipe';

@Component({
  standalone: true,
  selector: 'app-status-list',
  imports: [CommonModule, FormsModule, LabelPipe],
  templateUrl: './status-list.component.html'
})
export class StatusListComponent implements OnInit {
  statuses: EnquiryStatus[] = [];
  editIndex: number | null = null;

  constructor(private catalogService: CatalogDataService) {}

  ngOnInit(): void {
    this.catalogService.getStatuses().subscribe({
      next: data => this.statuses = data,
      error: err => console.error(err)
    });
  }

  startEdit(index: number): void {
    this.editIndex = index;
  }

  save(status: EnquiryStatus): void {
    this.catalogService.updateStatus(status).subscribe({
      next: () => this.editIndex = null,
      error: err => console.error(err)
    });
  }

  cancel(): void {
    this.editIndex = null;
  }
}
