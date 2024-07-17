import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteWarningModalComponent } from './delete-warning-modal.component';

describe('DeleteWarningModalComponent', () => {
  let component: DeleteWarningModalComponent;
  let fixture: ComponentFixture<DeleteWarningModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteWarningModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteWarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
