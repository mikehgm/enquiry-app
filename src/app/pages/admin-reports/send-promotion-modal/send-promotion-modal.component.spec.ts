import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPromotionModalComponent } from './send-promotion-modal.component';

describe('SendPromotionModalComponent', () => {
  let component: SendPromotionModalComponent;
  let fixture: ComponentFixture<SendPromotionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendPromotionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendPromotionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
