import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Enquiry } from '../../../models/enquiry.model';
import { PeriodType } from '../admin-reports.component';
import { parseLocalDate } from '../../../utils/date-utils';

@Component({
  selector: 'app-top-type-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-type-card.component.html',
  styleUrl: './top-type-card.component.css'
})
export class TopTypeCardComponent implements OnChanges {
  @Input() enquiries: Enquiry[] = [];
  @Input() dateRange!: { from: string; to: string };
  @Input() selectedPeriod!: PeriodType;

  mostRequested: { type: string; count: number } | null = null;
  leastRequested: { type: string; count: number } | null = null;

  typeLabels: Record<number, string> = {
    1: 'Wedding',
    2: 'Birthday',
    3: 'Party',
    4: 'Meeting'
  };

  ngOnChanges(): void {
    if (!this.enquiries || !this.dateRange) return;

    const from = parseLocalDate(this.dateRange.from);
    const to = parseLocalDate(this.dateRange.to);

    const filtered = this.enquiries.filter(enquiry => {
      const created = enquiry.createdDate ? parseLocalDate(enquiry.createdDate) : null;
      return created && created >= from && created <= to;
    });

    const countMap = new Map<number, number>();

    for (const id of Object.keys(this.typeLabels).map(Number)) {
      countMap.set(id, 0);
    }

    for (const enquiry of filtered) {
      const count = countMap.get(enquiry.enquiryTypeId) || 0;
      countMap.set(enquiry.enquiryTypeId, count + 1);
    }

    const entries = Array.from(countMap.entries()).filter(([, count]) => count > 0);

    if (entries.length > 0) {
      entries.sort((a, b) => b[1] - a[1]); // sort descending

      this.mostRequested = {
        type: this.typeLabels[entries[0][0]],
        count: entries[0][1]
      };

      this.leastRequested = {
        type: this.typeLabels[entries[entries.length - 1][0]],
        count: entries[entries.length - 1][1]
      };
    } else {
      this.mostRequested = null;
      this.leastRequested = null;
    }
  }

}
