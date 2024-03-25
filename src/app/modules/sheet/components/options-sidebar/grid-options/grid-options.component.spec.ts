import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridOptionsComponent } from './grid-options.component';

describe('GridOptionsComponent', () => {
    let component: GridOptionsComponent;
    let fixture: ComponentFixture<GridOptionsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GridOptionsComponent],
        });
        fixture = TestBed.createComponent(GridOptionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
