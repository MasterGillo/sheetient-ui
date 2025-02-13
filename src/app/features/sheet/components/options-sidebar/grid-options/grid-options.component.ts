import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Page } from 'src/app/models/page.model';
import { NgIf } from '@angular/common';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ColourInputComponent } from '../../colour-input/colour-input/colour-input.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-grid-options',
    templateUrl: './grid-options.component.html',
    styleUrls: ['./grid-options.component.scss'],
    imports: [
        NgIf,
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        MatSuffix,
        ColourInputComponent,
        MatSlideToggle,
    ],
})
export class GridOptionsComponent implements OnInit, OnChanges {
    @Input() page: Page;
    @Output() pageChange = new EventEmitter<Partial<Page>>();

    form: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            // showGrid: [this.page.grid.showGrid, [Validators.required]],
            // spacingX: [this.page.grid.spacingX, [Validators.required]],
            // spacingY: [this.page.grid.spacingY, [Validators.required]],
            // gridColour: [this.page.grid.gridColour, [Validators.required]],
        });

        this.form.valueChanges.subscribe((value) => {
            if (this.form.valid && value !== null) {
                //this.pageChange.emit({ grid: value });
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
