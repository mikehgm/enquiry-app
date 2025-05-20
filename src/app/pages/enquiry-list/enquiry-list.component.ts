import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnquiryDataService } from '../../service/enquiry-data.service';
import { SearchDataService } from '../../service/search-data.service';
import { Enquiry } from '../../models/enquiry.model';
import { Subject, takeUntil } from 'rxjs';
import { EnquiryStatsComponent } from "./enquiry-stats/enquiry-stats.component";
import { AlertService } from '../../service/alert.service';
import { SignalRService } from '../../service/signlr.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { parseLocalDate } from '../../utils/date-utils';

@Component({
  selector: 'app-enquiry-list',
  imports: [CommonModule, FormsModule, RouterLink, EnquiryStatsComponent],
  templateUrl: './enquiry-list.component.html',
  styleUrl: './enquiry-list.component.css'
})
export class EnquiryListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public enquiryList: Enquiry[] = [];
  public filteredEnquiries: Enquiry[] = [];
  public hasSearchTerm: boolean = false;
  public selectedStatusFilter: number | null = null;
  public currentPage: number = 1;
  public itemsPerPage: number = 12;
  public orderAsc = true;
  public searchTerm: string = '';

  constructor(
    private enquiryDataService: EnquiryDataService,
    private searchDataService: SearchDataService,
    private alert: AlertService,
    private signalRService: SignalRService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.getEnquiryList();

    this.searchDataService.searchTerm$
      .pipe(takeUntil(this.destroy$))
      .subscribe(term => {
        this.selectedStatusFilter = null; // reset filter if search is used
        this.hasSearchTerm = !!term;
        this.filterEnquiries(term);
      });

    this.signalRService.enquiryChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('⚡ Refreshing enquiries...');
        this.getEnquiryList();
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
        enquiry.email.toLowerCase().includes(lowerTerm) ||
        enquiry.folio?.toLowerCase().includes(lowerTerm) ||
        enquiry.createdBy?.toLowerCase().includes(lowerTerm) ||
        enquiry.updatedBy?.toLowerCase().includes(lowerTerm)
      )
    );

    this.sortEnquiriesByDate();

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

  public getStatusIcon(statusId: number): string {
    switch (statusId) {
      case 1: return 'fas fa-inbox';
      case 2: return 'fas fa-spinner';
      case 3: return 'fas fa-pause-circle';
      case 4: return 'fas fa-check-circle';
      default: return 'fas fa-question-circle';
    }
  }

  public getEnquiryList(): void {
    this.enquiryDataService.getEnquiries()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.enquiryList = response;

          // ⚡ Asegura que el filtro de estado se mantenga activo después del refresh
          if (this.selectedStatusFilter !== null) {
            this.filterEnquiries('', this.selectedStatusFilter);
          } else if (this.searchTerm.trim() !== '') {
            this.filterEnquiries(this.searchTerm.trim());
          } else {
            this.filteredEnquiries = [];
          }

          this.sortEnquiriesByDate();
        },
        error: (err) => {
          console.error(err);
          this.alert.error('Error', 'No se pudo obtener el listado de enquiries.');
        }
      });
  }


  public deleteEnquiry(enquiryId: number): void {
    // Confirm deletion
    if (enquiryId !== 0) {
    // Show confirmation dialog
      this.alert.confirm({
        title: '¿Eliminar enquiry?',
        text: 'Esta acción no se puede deshacer.',
        confirmColor: '#dc3545'
      }).then(result => {
        if (result.isConfirmed) {
          this.enquiryDataService.deleteEnquiry(enquiryId).subscribe({
            next: (res) => {
              console.log('Enquiry deleted:', res);
              this.getEnquiryList();
              this.alert.success('Eliminado', 'El enquiry ha sido eliminado.');

            },
            error: (err) => {
              console.error('Error deleting enquiry:', err);
              this.alert.error('Error', 'No se pudo eliminar el enquiry.');
            }
          });
        }
      });
    }
    else {
      this.alert.error('Error', 'Enquiry ID invalido.');
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
      this.sortEnquiriesByDate()
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

  public toggleOrder(): void {
    this.orderAsc = !this.orderAsc;
    this.sortEnquiriesByDate();
  }

  onSearchChange(): void {
    this.searchDataService.setSearchTerm(this.searchTerm.trim().toLowerCase());
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchDataService.setSearchTerm(this.searchTerm);
  }

  sortEnquiriesByDate(): void {
    const list = this.hasSearchTerm ? this.filteredEnquiries : this.enquiryList;

    list.sort((a, b) => {
      const dateA = a.createdDate ? parseLocalDate(a.createdDate).getTime() : 0;
      const dateB = b.createdDate ? parseLocalDate(b.createdDate).getTime() : 0;
      return this.orderAsc ? dateA - dateB : dateB - dateA;
    });
  }

  archiveEnquiry(id: number): void {

    this.alert.confirm({
      title: '¿Estás seguro de archivar este enquiry?',
      text: 'Se pasara al listado de enquiries archivados.',
      confirmColor: '#dc3545'
    }).then(result => {
      if (result.isConfirmed) {

        this.enquiryDataService.archiveEnquiry(id).subscribe({
          next: () => {
            this.alert.success('Archivado correctamente', 'El enquiry fue archivado.');
            //this.getEnquiryList();
          },
          error: () => {
            this.alert.error('Error', 'No se pudo archivar el enquiry.');
          }
        });

      }
    });
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'Admin';
  }

  isArchivable(statusId: number): boolean {
    let validate = false;

    if (statusId === 4 && this.authService.getRole() === 'Admin') {
      validate = true;
    }

    return validate;
  }

}
