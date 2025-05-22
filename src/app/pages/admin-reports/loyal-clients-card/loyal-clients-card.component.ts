import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Enquiry } from '../../../models/enquiry.model';
import { PeriodType } from '../admin-reports.component';
import { parseLocalDate } from '../../../utils/date-utils';
import { LabelPipe } from '../../../pipes/label.pipe';

@Component({
  selector: 'app-loyal-clients-card',
  standalone: true,
  imports: [CommonModule, LabelPipe],
  templateUrl: './loyal-clients-card.component.html',
  styleUrl: './loyal-clients-card.component.css'
})
export class LoyalClientsCardComponent {

  @Input() enquiries: Enquiry[] = [];
  @Input() dateRange!: { from: string; to: string };
  @Input() selectedPeriod!: PeriodType;

  loyalClients: { name: string; email: string; phone: string; count: number }[] = [];

  ngOnChanges(): void {
    if (!this.enquiries || !this.dateRange) return;

    const from = parseLocalDate(this.dateRange.from);
    const to = parseLocalDate(this.dateRange.to);

    const filtered = this.enquiries.filter(enquiry => {
      const created = enquiry.createdDate ? parseLocalDate(enquiry.createdDate) : null;
      return created && created >= from && created <= to;
    });

    const clientMap = new Map<string, { name: string; email: string; phone: string; count: number }>();

    for (const enquiry of filtered) {
      const key = `${enquiry.customerName}|${enquiry.email}|${enquiry.phone}`;
      if (!clientMap.has(key)) {
        clientMap.set(key, {
          name: enquiry.customerName,
          email: enquiry.email,
          phone: enquiry.phone,
          count: 1
        });
      } else {
        clientMap.get(key)!.count++;
      }
    }

    this.loyalClients = Array.from(clientMap.values())
      .filter(client => client.count >= 5)
      .sort((a, b) => b.count - a.count);
  }
}
