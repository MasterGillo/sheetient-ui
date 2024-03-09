import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelFieldComponent } from './label-field.component';

describe('LabelFieldComponent', () => {
  let component: LabelFieldComponent;
  let fixture: ComponentFixture<LabelFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelFieldComponent]
    });
    fixture = TestBed.createComponent(LabelFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
