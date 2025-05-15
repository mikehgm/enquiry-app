import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Enquiry } from '../../../models/enquiry.model';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-monthly-trend-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './monthly-trend-chart.component.html'
})
export class MonthlyTrendChartComponent implements OnChanges {
  @Input() enquiries: Enquiry[] = [];

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Enquiries Created per Month' },
      legend: { display: false }
    },
    maintainAspectRatio: false
  };

  public lineChartLabels: string[] = [];
  public lineChartData: ChartConfiguration<'line'>['data']['datasets'] = [];

  ngOnChanges(): void {
    const monthlyCounts = new Map<string, number>();

    this.enquiries.forEach(enquiry => {
      const date = enquiry.dueDate ? new Date(enquiry.dueDate) : null;
      const key = date ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}` : '';
      monthlyCounts.set(key, (monthlyCounts.get(key) || 0) + 1);
    });

    const sortedKeys = Array.from(monthlyCounts.keys()).sort();

    this.lineChartLabels = sortedKeys.map(k => {
      const [year, month] = k.split('-');
      return `${new Date(+year, +month - 1).toLocaleString('default', { month: 'short' })} ${year}`;
    });

    this.lineChartData = [{
      data: sortedKeys.map(k => monthlyCounts.get(k) ?? 0),
      label: 'Enquiries',
      borderColor: '#0d6efd',
      fill: true,
      tension: 0.4
    }];
  }
}
