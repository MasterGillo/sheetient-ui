import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PageInterface } from 'src/app/models/page.interface';

@Component({
    selector: 'app-grid-options',
    templateUrl: './grid-options.component.html',
    styleUrls: ['./grid-options.component.scss'],
})
export class GridOptionsComponent implements OnInit, OnChanges {
    @Input() page: PageInterface;
    @Output() pageChange = new EventEmitter<Partial<PageInterface>>();

    form: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            showGrid: [this.page.grid.showGrid, [Validators.required]],
            spacingX: [this.page.grid.spacingX, [Validators.required]],
            spacingY: [this.page.grid.spacingY, [Validators.required]],
            gridColour: [this.page.grid.gridColour, [Validators.required]],
        });

        this.form.valueChanges.subscribe((value) => {
            if (this.form.valid && value !== null) {
                this.pageChange.emit({ grid: value });
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const pageChanges = changes['page'];
        if (!pageChanges.isFirstChange()) {
            this.form.patchValue(pageChanges.currentValue.grid, { emitEvent: false });
        }
    }
}
