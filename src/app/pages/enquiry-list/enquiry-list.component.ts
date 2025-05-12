import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnquiryDataService } from '../../service/enquiry-data.service';
import { SearchDataService } from '../../service/search-data.service';
import { Enquiry } from '../../models/enquiry.model';
import { Subject, takeUntil } from 'rxjs';
import { EnquiryStatsComponent } from "./enquiry-stats/enquiry-stats.component";

@Component({
  selector: 'app-enquiry-list',
  imports: [CommonModule, RouterLink, EnquiryStatsComponent],
  templateUrl: './enquiry-list.component.html',
  styleUrl: './enquiry-list.component.css'
})
export class EnquiryListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private enquiryDataService = inject(EnquiryDataService);
  private searchDataService = inject(SearchDataService);
  public enquiryList: Enquiry[] = [];
  public filteredEnquiries: Enquiry[] = [];
  public hasSearchTerm: boolean = false;
  public selectedStatusFilter: number | null = null;
  public currentPage: number = 1;
  public itemsPerPage: number = 12;


  ngOnInit(): void {
    this.getEnquiryList();

    this.searchDataService.searchTerm$
      .pipe(takeUntil(this.destroy$))
      .subscribe(term => {
        this.selectedStatusFilter = null; // reset filter if search is used
        this.hasSearchTerm = !!term;
        this.filterEnquiries(term);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private filterEnquiries(term: string, statusId: number | null = null): void {
    const lowerTerm = term.toLowerCase().trim();

    this.filteredEnquiries = this.enquiryList.filter(enquiry =>
      (statusId !== null ? enquiry.enquiryStatusId === statusId : true) &&
      (
        enquiry.enquiryTypeId.toString().includes(lowerTerm) ||
        enquiry.enquiryStatusId.toString().includes(lowerTerm) ||
        this.getTypeLabelLower(enquiry.enquiryTypeId).includes(lowerTerm) ||
        this.getStatusLabelLower(enquiry.enquiryStatusId).includes(lowerTerm) ||
        enquiry.customerName.toLowerCase().includes(lowerTerm) ||
        enquiry.phone.includes(lowerTerm) ||
        enquiry.email.toLowerCase().includes(lowerTerm)
      )
    );

    this.currentPage = 1;
  }

  private getStatusLabelLower(statusId: number): string {
    return this.getStatusLabel(statusId).toLowerCase();
  }

  private getTypeLabelLower(typeId: number): string {
    return this.getTypeLabel(typeId).toLowerCase();
  }

  public getDisplayList(): Enquiry[] {
    return this.filteredEnquiries.length > 0 || this.hasSearchTerm
      ? this.filteredEnquiries
      : this.enquiryList;
  }

  public getStatusLabel(statusId: number): string {
    switch (statusId) {
      case 1: return 'New';
      case 2: return 'In Progress';
      case 3: return 'On Hold';
      case 4: return 'Resolved';
      default: return 'Unknown';
    }
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

  public getStatusClass(statusId: number): string {
    switch (statusId) {
      case 1: return 'bg-primary';
      case 2: return 'bg-warning text-dark';
      case 3: return 'bg-secondary';
      case 4: return 'bg-success';
      default: return 'bg-dark';
    }
  }

  public getEnquiryList(): void {
    this.enquiryDataService.getEnquiryList()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.enquiryList = response,
        error: (err) => console.error(err)
      });
  }

  public deleteEnquiry(enquiryId: number): void {
    // Confirm deletion
    if (enquiryId !== 0) {
    // Show confirmation dialog
      const confirmDelete = confirm('Are you sure you want to delete this enquiry?');
      if (confirmDelete) {
        this.enquiryDataService.deleteEnquiry(enquiryId).subscribe({
          next: () => {
            // Remove the deleted enquiry from the list
            this.getEnquiryList();
            alert('Enquiry deleted successfully');
        },
          error: (err) => console.error('Error deleting enquiry:', err)
        });
      }
    }
    else {
      alert('Enquiry ID is invalid');
    }
  }

  public onStatusFilter(statusId: number): void {
    if (this.selectedStatusFilter === statusId) {
      // Toggle OFF
      this.selectedStatusFilter = null;
      this.hasSearchTerm = false;
      this.filteredEnquiries = [];
    } else {
      // Apply filter
      this.selectedStatusFilter = statusId;
      this.hasSearchTerm = true;
      this.filterEnquiries('', statusId);
    }

    this.currentPage = 1;
  }

  public get pagedEnquiries(): Enquiry[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.getDisplayList().slice(start, start + this.itemsPerPage);
  }

  public get totalPages(): number {
    return Math.ceil(this.getDisplayList().length / this.itemsPerPage);
  }

  public changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

}
