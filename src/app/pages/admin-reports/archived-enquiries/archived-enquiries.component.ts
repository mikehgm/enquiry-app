import { Component, OnInit } from '@angular/core';
import { EnquiryDataService } from '../../../service/enquiry-data.service';
import { Enquiry } from '../../../models/enquiry.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from "../../../shared/back-button/back-button.component";

@Component({
  selector: 'app-archived-enquiries',
  imports: [CommonModule, RouterLink, BackButtonComponent],
  templateUrl: './archived-enquiries.component.html',
  styleUrls: ['./archived-enquiries.component.css']
})
export class ArchivedEnquiriesComponent implements OnInit {
  archivedEnquiries: Enquiry[] = [];

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
}
