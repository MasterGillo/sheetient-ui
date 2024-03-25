import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColourInputDialogComponent } from './colour-input-dialog.component';

describe('ColourInputDialogComponent', () => {
  let component: ColourInputDialogComponent;
  let fixture: ComponentFixture<ColourInputDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColourInputDialogComponent]
    });
    fixture = TestBed.createComponent(ColourInputDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
