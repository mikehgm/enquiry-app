import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Enquiry } from '../../../models/enquiry.model';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { parseLocalDate } from '../../../utils/date-utils';
import { CatalogDataService } from '../../../service/catalog-data.service';
import { AppConfigService } from '../../../service/app-config.service';

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

  private catalogService = inject(CatalogDataService);
  private config = inject(AppConfigService);

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: '' },
      legend: { position: 'bottom' }
    }
  };

  public pieChartLabels: string[] = [];
  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ]
  };

  ngOnChanges(): void {
    if (!this.enquiries || !this.dateRange) return;

    const from = parseLocalDate(this.dateRange.from);
    const to = parseLocalDate(this.dateRange.to);

    const filtered = this.enquiries.filter(enquiry => {
      const created = enquiry.createdDate ? parseLocalDate(enquiry.createdDate) : '';
      return created >= from && created <= to;
    });

    const statusCounts: { [statusId: number]: number } = {};
    for (const enquiry of filtered) {
      const id = enquiry.enquiryStatusId;
      statusCounts[id] = (statusCounts[id] || 0) + 1;
    }

    const labels: string[] = [];
    const data: number[] = [];
    const backgroundColor: string[] = [];

    const colorMap = new Map<number, string>([
      [1, '#0d6efd'],
      [2, '#ffc107'],
      [3, '#6c757d'],
      [4, '#198754']
    ]);

    for (const statusId of Object.keys(statusCounts).map(Number)) {
      labels.push(this.catalogService.getStatusNameById(statusId));
      data.push(statusCounts[statusId]);
      backgroundColor.push(colorMap.get(statusId) || '#999');
    }

    this.pieChartLabels = labels;

    this.pieChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor
        }
      ]
    };

    const title = this.config.getLabel('ui_enquiries_pie_chart') || 'Enquiries by Status';
    this.pieChartOptions.plugins!.title!.text = title;
  }
}
