import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldListDialogComponent } from './field-list-dialog.component';

describe('FieldListDialogComponent', () => {
  let component: FieldListDialogComponent;
  let fixture: ComponentFixture<FieldListDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FieldListDialogComponent]
    });
    fixture = TestBed.createComponent(FieldListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
