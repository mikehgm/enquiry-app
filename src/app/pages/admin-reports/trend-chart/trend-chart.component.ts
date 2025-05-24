import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Enquiry } from '../../../models/enquiry.model';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { parseLocalDate } from '../../../utils/date-utils';
import { AppConfigService } from '../../../service/app-config.service';

@Component({
  selector: 'app-trend-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './trend-chart.component.html'
})
export class TrendChartComponent implements OnChanges {
  @Input() enquiries: Enquiry[] = [];
  @Input() dateRange!: { from: string; to: string };
  @Input() selectedPeriod!: 'day' | 'week' | 'month' | 'bimester' | 'quarter' | 'semester' | 'year' | 'range';

  private config = inject(AppConfigService);

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: '' },
      legend: { display: false }
    },
    maintainAspectRatio: false
  };

  public lineChartLabels: string[] = [];
  public lineChartData: ChartConfiguration<'line'>['data']['datasets'] = [];

  ngOnChanges(): void {
    if (!this.enquiries || !this.dateRange || !this.selectedPeriod) return;

    const from = parseLocalDate(this.dateRange.from);
    const to = parseLocalDate(this.dateRange.to);
    const filtered = this.enquiries.filter(enquiry => {
      if (!enquiry.createdDate) return;

      const d = parseLocalDate(enquiry.createdDate);
      return d >= from && d <= to;
    });

    const labels = this.generateDateLabels(from, to);
    const counts = this.countEnquiriesByLabel(filtered, labels);

    this.lineChartLabels = labels;
    this.lineChartData = [{
      data: counts,
      label: this.config.getLabel('ui_enquiries') || 'Enquiries',
      borderColor: '#0d6efd',
      fill: true,
      tension: 0.4
    }];

    this.lineChartOptions.plugins!.title!.text = this.config.getLabel('ui_enquiries_trend_chart') || 'Enquiries Created per Period';
  }

  private generateDateLabels(from: Date, to: Date): string[] {
    const labels: string[] = [];
    const current = new Date(from);

    while (current <= to) {
      let label = '';
      switch (this.selectedPeriod) {
        case 'day':
        case 'week':
        case 'range':
          label = current.toISOString().substring(0, 10);
          current.setDate(current.getDate() + 1);
          break;
        case 'month':
          label = `${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}`;
          current.setMonth(current.getMonth() + 1);
          break;
        case 'bimester':
          label = `${current.getFullYear()}-B${Math.floor(current.getMonth() / 2) + 1}`;
          current.setMonth(current.getMonth() + 2);
          break;
        case 'quarter':
          label = `${current.getFullYear()}-Q${Math.floor(current.getMonth() / 3) + 1}`;
          current.setMonth(current.getMonth() + 3);
          break;
        case 'semester':
          label = `${current.getFullYear()}-S${current.getMonth() < 6 ? 1 : 2}`;
          current.setMonth(current.getMonth() + 6);
          break;
        case 'year':
          label = `${current.getFullYear()}`;
          current.setFullYear(current.getFullYear() + 1);
          break;
      }
      labels.push(label);
    }

    return labels;
  }

  private countEnquiriesByLabel(data: Enquiry[], labels: string[]): number[] {
    const counts = new Map<string, number>();
    for (const label of labels) counts.set(label, 0);

    data.forEach(enquiry => {
      if (!enquiry.createdDate) return;
      const d = parseLocalDate(enquiry.createdDate);

      let label = '';
      switch (this.selectedPeriod) {
        case 'day':
        case 'week':
        case 'range':
          label = d.toISOString().substring(0, 10);
          break;
        case 'month':
          label = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
          break;
        case 'bimester':
          label = `${d.getFullYear()}-B${Math.floor(d.getMonth() / 2) + 1}`;
          break;
        case 'quarter':
          label = `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}`;
          break;
        case 'semester':
          label = `${d.getFullYear()}-S${d.getMonth() < 6 ? 1 : 2}`;
          break;
        case 'year':
          label = `${d.getFullYear()}`;
          break;
      }

      if (counts.has(label)) counts.set(label, counts.get(label)! + 1);
    });

    return labels.map(l => counts.get(l) ?? 0);
  }
}
