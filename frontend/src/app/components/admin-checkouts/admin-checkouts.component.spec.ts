import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCheckoutsComponent } from './admin-checkouts.component';

describe('AdminCheckoutsComponent', () => {
  let component: AdminCheckoutsComponent;
  let fixture: ComponentFixture<AdminCheckoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCheckoutsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCheckoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
