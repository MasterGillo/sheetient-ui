import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { takeUntil } from 'rxjs';
import { Sheet } from 'src/app/models/sheet.model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SheetService } from 'src/app/services/sheet.service';
import { SpinnerButtonComponent } from 'src/app/shared/components/spinner-button/spinner-button.component';
import { UnsubscriberComponent } from 'src/app/shared/components/unsubscriber/unsubscriber.component';

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
        MatButton,
        SpinnerButtonComponent,
        MatDialogClose,
    ],
})
export class NewSheetDialogComponent extends UnsubscriberComponent implements OnInit {
    private _isSaving: boolean;

    get isSaving(): boolean {
        return this._isSaving;
    }

    private set isSaving(value: boolean) {
        this._isSaving = value;
        this.dialogRef.disableClose = value;
        if (value) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }

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
        private sheetService: SheetService,
        private dialogRef: MatDialogRef<NewSheetDialogComponent>,
        private errorHandlerService: ErrorHandlerService
    ) {
        super();
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            sheetName: ['New Sheet', [Validators.required]],
            pageWidth: [794, [Validators.required]],
            pageHeight: [1123, [Validators.required]],
        });
    }

    submit(): void {
        if (this.form.valid) {
            this.isSaving = true;
            const newSheet = new Sheet(
                this.sheetNameControl.value,
                this.pageHeightControl.value,
                this.pageWidthControl.value
            );
            this.sheetService
                .createSheet(newSheet)
                .pipe(takeUntil(this.unsubscribe))
                .subscribe({
                    next: (sheetId: number) => this.dialogRef.close(sheetId),
                    error: (error: HttpErrorResponse) => {
                        this.errorHandlerService.handle(error, 'Failed to create sheet');
                        this.isSaving = false;
                    },
                });
        }
    }
}
