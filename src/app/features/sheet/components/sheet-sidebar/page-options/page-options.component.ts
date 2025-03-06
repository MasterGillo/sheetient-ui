import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, filter, map, skip, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { ConfirmationDialogData } from 'src/app/models/confirmation-dialog-data.interface';
import { Page } from 'src/app/models/page.model';
import { SheetStateService } from 'src/app/services/sheet-state.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { UnsubscriberComponent } from 'src/app/shared/components/unsubscriber/unsubscriber.component';

@Component({
    selector: 'app-page-options',
    imports: [MatFormField, MatLabel, MatInput, ReactiveFormsModule, MatButton],
    templateUrl: './page-options.component.html',
    styleUrl: './page-options.component.scss',
})
export class PageOptionsComponent extends UnsubscriberComponent implements OnInit {
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private sheetState: SheetStateService,
        private dialog: MatDialog
    ) {
        super();
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            name: ['', [Validators.required]],
        });
        this.sheetState.currentPage$
            .pipe(
                filter((page: Page) => page != null),
                tap((page: Page) => {
                    this.form.patchValue(page, { emitEvent: false });
                }),
                switchMap((page: Page) =>
                    this.form.valueChanges.pipe(
                        startWith(this.form.value),
                        debounceTime(500),
                        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
                        skip(1),
                        map((formValue: any) => ({ pageId: page.id, page: <Partial<Page>>formValue }))
                    )
                ),
                takeUntil(this.unsubscribe)
            )
            .subscribe((map: { pageId: number; page: Partial<Page> }) => {
                if (this.form.valid) {
                    this.sheetState.updatePage(map.pageId, map.page);
                }
            });
    }

    deletePage(): void {
        const confirmationDialogData: ConfirmationDialogData = {
            headerIcon: 'delete',
            headerText: 'Confirm Delete',
            bodyText: 'Are you sure you want to permanently delete this page?',
            actionButtonText: 'Delete',
            noActionButtonText: 'Cancel',
        };
        const dialog = this.dialog.open(ConfirmationDialogComponent, {
            autoFocus: 'dialog',
            data: confirmationDialogData,
        });
        dialog
            .afterClosed()
            .pipe(
                filter((confirmed: boolean) => confirmed),
                takeUntil(this.unsubscribe)
            )
            .subscribe(() => this.sheetState.deleteCurrentPage());
    }
}
