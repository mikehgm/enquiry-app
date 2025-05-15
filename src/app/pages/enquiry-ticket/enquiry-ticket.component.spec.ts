import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryTicketComponent } from './enquiry-ticket.component';

describe('EnquiryTicketComponent', () => {
  let component: EnquiryTicketComponent;
  let fixture: ComponentFixture<EnquiryTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnquiryTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnquiryTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
