import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSheetDialogComponent } from './new-sheet-dialog.component';

describe('NewSheetDialogComponent', () => {
  let component: NewSheetDialogComponent;
  let fixture: ComponentFixture<NewSheetDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewSheetDialogComponent]
    });
    fixture = TestBed.createComponent(NewSheetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
