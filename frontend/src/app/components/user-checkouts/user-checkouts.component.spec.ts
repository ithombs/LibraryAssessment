import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCheckoutsComponent } from './user-checkouts.component';

describe('UserCheckoutsComponent', () => {
  let component: UserCheckoutsComponent;
  let fixture: ComponentFixture<UserCheckoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCheckoutsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCheckoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
