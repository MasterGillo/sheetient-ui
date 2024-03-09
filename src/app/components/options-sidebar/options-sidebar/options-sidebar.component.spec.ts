import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsSidebarComponent } from './options-sidebar.component';

describe('OptionsSidebarComponent', () => {
    let component: OptionsSidebarComponent;
    let fixture: ComponentFixture<OptionsSidebarComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [OptionsSidebarComponent],
        });
        fixture = TestBed.createComponent(OptionsSidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
