import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Enquiry } from '../../../models/enquiry.model';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './revenue-chart.component.html'
})
export class RevenueChartComponent implements OnChanges {
  @Input() enquiries: Enquiry[] = [];

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      title: { display: true, text: 'Estimated Revenue by Enquiry Type' },
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value) => `$${value}` }
      }
    },
    maintainAspectRatio: false
  };

  public barChartLabels: string[] = ['Wedding', 'Birthday', 'Party', 'Meeting'];
  public barChartData: ChartConfiguration<'bar'>['data']['datasets'] = [];

  ngOnChanges(): void {
    const revenue = [0, 0, 0, 0]; // Index by typeId - 1

    for (const enquiry of this.enquiries) {
      if (enquiry.enquiryTypeId >= 1 && enquiry.enquiryTypeId <= 4 && enquiry.costo != null) {
        revenue[enquiry.enquiryTypeId - 1] += enquiry.costo;
      }
    }

    this.barChartData = [{
      data: revenue,
      label: 'Revenue',
      backgroundColor: ['#132A13', '#31572C', '#4F772D', '#90A955']
    }];
  }
}
