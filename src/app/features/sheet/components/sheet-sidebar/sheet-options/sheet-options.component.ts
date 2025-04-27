import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, skip, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { Sheet } from 'src/app/models/sheet.model';
import { SheetStateService } from 'src/app/services/sheet-state.service';
import { UnsubscriberComponent } from 'src/app/shared/components/unsubscriber/unsubscriber.component';

@Component({
    selector: 'app-sheet-options',
    imports: [MatFormField, MatLabel, MatInput, ReactiveFormsModule],
    templateUrl: './sheet-options.component.html',
    styleUrl: './sheet-options.component.scss',
})
export class SheetOptionsComponent extends UnsubscriberComponent implements OnInit {
    form: FormGroup;

    constructor(
        private sheetState: SheetStateService,
        private formBuilder: FormBuilder
    ) {
        super();
    }
    ngOnInit(): void {
        this.form = this.formBuilder.group({
            name: ['', [Validators.required]],
            description: [''],
        });

        this.sheetState.sheet$
            .pipe(
                tap((sheet?: Sheet) => {
                    if (sheet) {
                        this.form.patchValue(sheet, { emitEvent: false });
                    }
                }),
                switchMap(() =>
                    this.form.valueChanges.pipe(
                        startWith(this.form.value),
                        debounceTime(500),
                        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
                        skip(1)
                    )
                ),
                takeUntil(this.unsubscribe)
            )
            .subscribe((formValue: any) => {
                if (this.form.valid) {
                    this.sheetState.updateSheet(formValue);
                }
            });
    }
}
