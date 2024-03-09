import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlSubsectionComponent } from './control-subsection.component';

describe('ControlSubsectionComponent', () => {
  let component: ControlSubsectionComponent;
  let fixture: ComponentFixture<ControlSubsectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ControlSubsectionComponent]
    });
    fixture = TestBed.createComponent(ControlSubsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
