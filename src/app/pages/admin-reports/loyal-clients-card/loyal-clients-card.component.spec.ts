import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyalClientsCardComponent } from './loyal-clients-card.component';

describe('LoyalClientsCardComponent', () => {
  let component: LoyalClientsCardComponent;
  let fixture: ComponentFixture<LoyalClientsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyalClientsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyalClientsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
