import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Sheet } from 'src/app/models/sheet.model';
import { SheetService } from 'src/app/services/sheet/sheet.service';
import { MatFormField, MatLabel, MatError, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';
import { ActionButtonComponent } from '../../shared/components/action-button/action-button.component';
import { MatDialogClose } from '@angular/material/dialog';

@Component({
    selector: 'app-new-sheet-dialog',
    templateUrl: './new-sheet-dialog.component.html',
    styleUrls: ['./new-sheet-dialog.component.scss'],
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        NgIf,
        MatError,
        MatSuffix,
        ActionButtonComponent,
        MatDialogClose,
    ],
})
export class NewSheetDialogComponent implements OnInit {
    form: FormGroup;

    get sheetNameControl(): AbstractControl<string> {
        return this.form.controls['sheetName'];
    }
    get pageHeightControl(): AbstractControl<number> {
        return this.form.controls['pageHeight'];
    }
    get pageWidthControl(): AbstractControl<number> {
        return this.form.controls['pageWidth'];
    }

    constructor(
        private formBuilder: FormBuilder,
        private sheetService: SheetService
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            sheetName: ['New Sheet', [Validators.required]],
            pageWidth: [794, [Validators.required]],
            pageHeight: [1123, [Validators.required]],
        });
    }

    submit(): void {
        if (this.form.valid) {
            const newSheet = new Sheet(
                this.sheetNameControl.value,
                this.pageHeightControl.value,
                this.pageWidthControl.value
            );
            this.sheetService.createSheet(newSheet).subscribe((x) => console.log(x));
        }
    }
}
