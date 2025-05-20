import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Enquiry } from '../../../models/enquiry.model';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { parseLocalDate } from '../../../utils/date-utils';
type PeriodType = 'day' | 'week' | 'month' | 'bimester' | 'quarter' | 'semester' | 'year' | 'range';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './revenue-chart.component.html'
})
export class RevenueChartComponent implements OnChanges {
  @Input() enquiries: Enquiry[] = [];
  @Input() dateRange!: { from: string; to: string };
  @Input() selectedPeriod!: PeriodType;

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Revenue Over Time' },
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: value => `$${value}` }
      }
    },
    maintainAspectRatio: false
  };

  public barChartLabels: string[] = [];
  public barChartData: ChartConfiguration<'bar'>['data']['datasets'] = [];

  ngOnChanges(): void {
    if (!this.enquiries || !this.dateRange || !this.selectedPeriod) return;

    const from = parseLocalDate(this.dateRange.from);
    const to = parseLocalDate(this.dateRange.to);

    const filtered = this.enquiries.filter(enquiry => {
      const created = enquiry.createdDate ? parseLocalDate(enquiry.createdDate) : null;
      return created && created >= from && created <= to;
    });

    const labels = this.generateDateLabels(from, to);
    const revenueTotals = this.sumRevenueByLabel(filtered, labels);

    this.barChartLabels = labels;
    this.barChartData = [{
      data: revenueTotals,
      label: 'Revenue',
      backgroundColor: ['#132A13', '#31572C', '#4F772D', '#90A955']
    }];
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

  private sumRevenueByLabel(data: Enquiry[], labels: string[]): number[] {
    const sums = new Map<string, number>();
    for (const label of labels) sums.set(label, 0);

    data.forEach(enquiry => {
      if (!enquiry.createdDate || enquiry.costo == null) return;
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

      if (sums.has(label)) sums.set(label, sums.get(label)! + enquiry.costo);
    });

    return labels.map(l => +(sums.get(l)?.toFixed(2) || 0));
  }
}

