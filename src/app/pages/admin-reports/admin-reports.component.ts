import { Component, OnInit } from '@angular/core';
import { Enquiry } from '../../models/enquiry.model';
import { EnquiryDataService } from '../../service/enquiry-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusChartComponent } from './status-chart/status-chart.component';
import { TrendChartComponent } from "./trend-chart/trend-chart.component";
import { RevenueChartComponent } from "./revenue-chart/revenue-chart.component";
import { TopTypeCardComponent } from './top-type-card/top-type-card.component';
import { LoyalClientsCardComponent } from './loyal-clients-card/loyal-clients-card.component';
import { LoyalClientsTableComponent } from './loyal-clients-table/loyal-clients-table.component';
import { parseLocalDate } from '../../utils/date-utils';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { BackButtonComponent } from "../../shared/back-button/back-button.component";
export type PeriodType = 'day' | 'week' | 'month' | 'bimester' | 'quarter' | 'semester' | 'year' | 'range';

@Component({
  selector: 'app-admin-reports',
  imports: [
    CommonModule,
    FormsModule,
    StatusChartComponent,
    TrendChartComponent,
    RevenueChartComponent,
    TopTypeCardComponent,
    LoyalClientsTableComponent,
    BackButtonComponent
],
  templateUrl: './admin-reports.component.html',
  styleUrl: './admin-reports.component.css'
})
export class AdminReportsComponent implements OnInit {

  enquiryList: Enquiry[] = [];
  summaryByStatus: { label: string; count: number; class: string, statusId: number }[] = [];
  filter = {
    from: '',
    to: ''
  };

  selectedPeriod: PeriodType = 'week';
  periodOptions: PeriodType[] = ['day', 'week', 'month', 'bimester', 'quarter', 'semester', 'year', 'range'];

  customRange: { from: Date; to: Date } = { from: new Date(), to: new Date() };

  filteredList: Enquiry[] = [];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private enquiryService: EnquiryDataService) {}

  ngOnInit(): void {
    this.enquiryService.getAllEnquiries().subscribe({
      next: (list) => {
        this.enquiryList = list;
        this.updateDateRange();
        this.generateSummary();
      }
    });
  }

  onPeriodChange(period: PeriodType): void {
    this.selectedPeriod = period;
    this.updateDateRange();
  }

  onCustomRangeChange(): void {
    if (this.selectedPeriod === 'range') {
      const fromDate = new Date(this.customRange.from);
      const toDate = new Date(this.customRange.to);

      if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
        this.filter.from = fromDate.toISOString().substring(0, 10);
        this.filter.to = toDate.toISOString().substring(0, 10);
        this.applyDateFilter();
      }
    }
  }


  private updateDateRange(): void {
    if (this.selectedPeriod === 'range') {
      this.onCustomRangeChange();
    } else {
      const { from, to } = this.calculateDateRange(this.selectedPeriod);
      this.filter.from = from.toISOString().substring(0, 10);
      this.filter.to = to.toISOString().substring(0, 10);
      this.applyDateFilter();
    }
  }

  private calculateDateRange(period: PeriodType): { from: Date; to: Date } {
    const today = new Date();
    const end = new Date(today);
    const start = new Date(today);

    switch (period) {
      case 'day': break;
      case 'week': start.setDate(today.getDate() - 6); break;
      case 'month': start.setMonth(today.getMonth() - 1); break;
      case 'bimester': start.setMonth(today.getMonth() - 2); break;
      case 'quarter': start.setMonth(today.getMonth() - 3); break;
      case 'semester': start.setMonth(today.getMonth() - 6); break;
      case 'year': start.setFullYear(today.getFullYear() - 1); break;
    }

    return { from: start, to: end };
  }

  generateSummary(): void {
    const statusMap = new Map<number, { label: string; class: string }>([
      [1, { label: 'New', class: 'bg-primary' }],
      [2, { label: 'In Progress', class: 'bg-warning text-dark' }],
      [3, { label: 'On Hold', class: 'bg-secondary' }],
      [4, { label: 'Resolved', class: 'bg-success' }]
    ]);

    const baseList = this.filteredList.length > 0 ? this.filteredList : this.enquiryList;

    this.summaryByStatus = Array.from(statusMap.entries()).map(([statusId, meta]) => {
      const count = baseList.filter(e => e.enquiryStatusId === statusId).length;
      return { ...meta, count, statusId };
    });
  }

  applyDateFilter(): void {
    if (!this.filter.from && !this.filter.to) {
      this.filteredList = [];
      this.generateSummary();
      return;
    }

    const from = this.filter.from ? parseLocalDate(this.filter.from) : null;
    const to = this.filter.to ? parseLocalDate(this.filter.to) : null;

    this.filteredList = this.enquiryList.filter(enquiry => {
      const dueDate = enquiry.dueDate ? parseLocalDate(enquiry.dueDate) : null;
      const createdDate = enquiry.createdDate ? parseLocalDate(enquiry.createdDate) : null;

      const dueInRange = dueDate &&
        (!from || dueDate >= from) &&
        (!to || dueDate <= to);

      const createdInRange = createdDate &&
        (!from || createdDate >= from) &&
        (!to || createdDate <= to);

      return dueInRange || createdInRange;
    });

    this.generateSummary();
    this.currentPage = 1;
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

  public getStatusClass(statusId: number): string {
    switch (statusId) {
      case 1: return 'bg-primary';
      case 2: return 'bg-warning text-dark';
      case 3: return 'bg-secondary';
      case 4: return 'bg-success';
      default: return 'bg-dark';
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

  getStatusIcon(status: number): string {
    switch (status) {
      case 1: return 'fas fa-plus-circle';
      case 2: return 'fas fa-spinner';
      case 3: return 'fas fa-pause-circle';
      case 4: return 'fas fa-check-circle';
      default: return '';
    }
  }

  showFullTable(): boolean {
    return this.filteredList.length > 0 || (!this.filter.from && !this.filter.to);
  }

  displayedList(): Enquiry[] {
    const list = this.filteredList.length > 0 ? this.filteredList : this.enquiryList;

    if (!this.sortColumn) return list;

    return [...list].sort((a, b) => {
      const valA = (a as any)[this.sortColumn];
      const valB = (b as any)[this.sortColumn];

      if (valA == null || valB == null) return 0;

      const aVal = typeof valA === 'string' ? valA.toLowerCase() : valA;
      const bVal = typeof valB === 'string' ? valB.toLowerCase() : valB;

      return this.sortDirection === 'asc'
        ? aVal > bVal ? 1 : aVal < bVal ? -1 : 0
        : aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    });
  }

  setSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  exportToExcel(): void {
    const dataToExport = (this.filteredList.length > 0 ? this.filteredList : this.enquiryList).map(enquiry => ({
      Folio: enquiry.folio,
      Name: enquiry.customerName,
      Email: enquiry.email,
      Phone: enquiry.phone,
      Type: this.getTypeLabel(enquiry.enquiryTypeId),
      Status: this.getStatusLabel(enquiry.enquiryStatusId),
      DueDate: enquiry.dueDate ? parseLocalDate(enquiry.dueDate).toLocaleDateString() : '',
      CreatedDate: enquiry.createdDate ? parseLocalDate(enquiry.createdDate).toLocaleDateString() : '',
      Costo: enquiry.costo?.toFixed(2) ?? '',
      Resolution: enquiry.resolution
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = { Sheets: { 'Enquiries': worksheet }, SheetNames: ['Enquiries'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'enquiries_report.xlsx');
  }

  exportToCSV(): void {
    const dataToExport = (this.filteredList.length > 0 ? this.filteredList : this.enquiryList).map(enquiry => ({
      Folio: enquiry.folio,
      Name: enquiry.customerName,
      Email: enquiry.email,
      Phone: enquiry.phone,
      Type: this.getTypeLabel(enquiry.enquiryTypeId),
      Status: this.getStatusLabel(enquiry.enquiryStatusId),
      DueDate: enquiry.dueDate ? parseLocalDate(enquiry.dueDate).toLocaleDateString() : '',
      CreatedDate: enquiry.createdDate ? parseLocalDate(enquiry.createdDate).toLocaleDateString() : '',
      Costo: enquiry.costo?.toFixed(2) ?? '',
      Resolution: enquiry.resolution
    }));

    const headers = Object.keys(dataToExport[0]);
    const rows = dataToExport.map(row =>
      headers.map(header => `"${(row as any)[header]}"`).join(',')
    );

    const csvContent = [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    FileSaver.saveAs(blob, 'enquiries_report.csv');
  }

  pagedList(): Enquiry[] {
    const list = this.filteredList.length > 0 ? this.filteredList : this.enquiryList;

    let sortedList = [...list];
    if (this.sortColumn) {
      sortedList.sort((a, b) => {
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
    return sortedList.slice(start, start + this.itemsPerPage);
  }

  totalPages(): number {
    const totalItems = this.filteredList.length > 0 ? this.filteredList.length : this.enquiryList.length;
    return Math.ceil(totalItems / this.itemsPerPage);
  }

}
