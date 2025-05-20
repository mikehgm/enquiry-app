import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Enquiry } from '../../../models/enquiry.model';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { parseLocalDate } from '../../../utils/date-utils';
type PeriodType = 'day' | 'week' | 'month' | 'bimester' | 'quarter' | 'semester' | 'year' | 'range';

@Component({
  selector: 'app-status-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './status-chart.component.html'
})
export class StatusChartComponent implements OnChanges {
  @Input() enquiries: Enquiry[] = [];
  @Input() dateRange!: { from: string; to: string };
  @Input() selectedPeriod!: PeriodType;

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Enquiries by Status (Pie Chart)' },
      legend: { position: 'bottom' }
    }
  };

  public pieChartLabels: string[] = ['New', 'In Progress', 'On Hold', 'Resolved'];
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: this.pieChartLabels,
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#0d6efd', '#ffc107', '#6c757d', '#198754']
    }]
  };

  ngOnChanges(): void {
    if (!this.enquiries || !this.dateRange) return;

    const from = parseLocalDate(this.dateRange.from);
    const to = parseLocalDate(this.dateRange.to);

    const filtered = this.enquiries.filter(enquiry => {
      const created = enquiry.createdDate ? parseLocalDate(enquiry.createdDate) : '';
      return created >= from && created <= to;
    });

    const counts = [0, 0, 0, 0];
    for (const enquiry of filtered) {
      if (enquiry.enquiryStatusId >= 1 && enquiry.enquiryStatusId <= 4) {
        counts[enquiry.enquiryStatusId - 1]++;
      }
    }

    this.pieChartData = {
      labels: this.pieChartLabels,
      datasets: [{
        data: counts,
        backgroundColor: ['#0d6efd', '#ffc107', '#6c757d', '#198754']
      }]
    };
  }


}
