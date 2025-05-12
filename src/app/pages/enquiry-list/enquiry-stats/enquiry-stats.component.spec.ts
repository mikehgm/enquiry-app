import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryStatsComponent } from './enquiry-stats.component';

describe('EnquiryStatsComponent', () => {
  let component: EnquiryStatsComponent;
  let fixture: ComponentFixture<EnquiryStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnquiryStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnquiryStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
