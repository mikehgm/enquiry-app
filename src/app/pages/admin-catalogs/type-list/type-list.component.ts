import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogDataService } from '../../../service/catalog-data.service';
import { EnquiryType } from '../../../models/type.model';
import { FormsModule } from '@angular/forms';
import { LabelPipe } from '../../../pipes/label.pipe';

@Component({
  standalone: true,
  selector: 'app-type-list',
  imports: [CommonModule, FormsModule, LabelPipe],
  templateUrl: './type-list.component.html'
})
export class TypeListComponent implements OnInit {
  types: EnquiryType[] = [];
  editIndex: number | null = null;

  constructor(private catalogService: CatalogDataService) {}

  ngOnInit(): void {
    this.catalogService.getTypes().subscribe({
      next: data => this.types = data,
      error: err => console.error(err)
    });
  }

  startEdit(index: number): void {
    this.editIndex = index;
  }

  save(type: EnquiryType): void {
    this.catalogService.updateType(type).subscribe({
      next: () => this.editIndex = null,
      error: err => console.error(err)
    });
  }

  cancel(): void {
    this.editIndex = null;
  }
}
