import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedEnquiriesComponent } from './archived-enquiries.component';

describe('ArchivedEnquiriesComponent', () => {
  let component: ArchivedEnquiriesComponent;
  let fixture: ComponentFixture<ArchivedEnquiriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivedEnquiriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivedEnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
