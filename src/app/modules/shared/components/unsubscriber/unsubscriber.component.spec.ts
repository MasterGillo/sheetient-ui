import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscriberComponent } from './unsubscriber.component';

describe('UnsubscriberComponent', () => {
  let component: UnsubscriberComponent;
  let fixture: ComponentFixture<UnsubscriberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnsubscriberComponent]
    });
    fixture = TestBed.createComponent(UnsubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
