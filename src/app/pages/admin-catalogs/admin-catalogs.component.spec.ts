import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCatalogsComponent } from './admin-catalogs.component';

describe('AdminCatalogsComponent', () => {
  let component: AdminCatalogsComponent;
  let fixture: ComponentFixture<AdminCatalogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCatalogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCatalogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
