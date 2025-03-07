import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Page } from 'src/app/models/page.model';
import { ColourInputComponent } from '../../colour-input/colour-input/colour-input.component';

@Component({
    selector: 'app-page-options',
    templateUrl: './page-options.component.html',
    styleUrls: ['./page-options.component.scss'],
    imports: [NgIf, ReactiveFormsModule, MatFormField, MatLabel, MatInput, ColourInputComponent, MatSuffix, MatButton],
})
export class PageOptionsComponent implements OnInit, OnChanges {
    @Input() page: Page;
    @Input() canDelete: boolean;
    @Output() pageChange = new EventEmitter<Partial<Page>>();
    @Output() deletePage = new EventEmitter<void>();

    form: FormGroup;

    constructor(private formBuilder: FormBuilder) {}

    get pageColour(): string {
        const value = this.form.get('colour')?.value;
        return value ?? '';
    }
    set pageColour(value: string) {
        this.form.get('colour')?.setValue(value);
    }

    get gridColour(): string {
        const value = this.form.get('grid')?.get('gridColour')?.value;
        return value ?? '';
    }
    set gridColour(value: string) {
        this.form.get('grid')?.get('gridColour')?.setValue(value);
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            name: [this.page.name, [Validators.required]],
            colour: [this.page.colour, [Validators.required]],
            height: [this.page.height, [Validators.required]],
            width: [this.page.width, [Validators.required]],
            // grid: this.formBuilder.group({
            //     showGrid: [this.page.grid.showGrid, [Validators.required]],
            //     spacingX: [this.page.grid.spacingX, [Validators.required]],
            //     spacingY: [this.page.grid.spacingY, [Validators.required]],
            //     gridColour: [this.page.grid.gridColour, [Validators.required]],
            // }),
        });

        this.form.valueChanges.subscribe((value) => {
            if (this.form.valid && value !== null) {
                this.pageChange.emit(value);
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const pageChanges = changes['page'];
        if (!pageChanges.isFirstChange()) {
            this.form.patchValue(pageChanges.currentValue, { emitEvent: false });
        }
    }
}
