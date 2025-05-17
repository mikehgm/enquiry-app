import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTypeCardComponent } from './top-type-card.component';

describe('TopTypeCardComponent', () => {
  let component: TopTypeCardComponent;
  let fixture: ComponentFixture<TopTypeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopTypeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopTypeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
