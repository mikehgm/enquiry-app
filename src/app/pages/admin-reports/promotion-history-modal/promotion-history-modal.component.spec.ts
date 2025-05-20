import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionHistoryModalComponent } from './promotion-history-modal.component';

describe('PromotionHistoryModalComponent', () => {
  let component: PromotionHistoryModalComponent;
  let fixture: ComponentFixture<PromotionHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionHistoryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
