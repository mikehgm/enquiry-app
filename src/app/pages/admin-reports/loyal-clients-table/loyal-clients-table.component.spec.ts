import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyalClientsTableComponent } from './loyal-clients-table.component';

describe('LoyalClientsTableComponent', () => {
  let component: LoyalClientsTableComponent;
  let fixture: ComponentFixture<LoyalClientsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoyalClientsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoyalClientsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
