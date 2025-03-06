import { NgFor } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { filter, switchMap, takeUntil } from 'rxjs';
import { ConfirmationDialogData } from 'src/app/models/confirmation-dialog-data.interface';
import { Sheet } from 'src/app/models/sheet.model';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SheetService } from 'src/app/services/sheet.service';
import { ToastService } from 'src/app/services/toast.service';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { PageContainerComponent } from 'src/app/shared/components/page-container/page-container.component';
import { UnsubscriberComponent } from 'src/app/shared/components/unsubscriber/unsubscriber.component';
import { NewSheetDialogComponent } from '../new-sheet-dialog/new-sheet-dialog.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [
        NgFor,
        MatIconButton,
        MatIcon,
        MatRipple,
        MatMenu,
        MatMenuTrigger,
        MatMenuItem,
        MatButton,
        MatMenuContent,
        PageContainerComponent,
    ],
})
export class DashboardComponent extends UnsubscriberComponent implements OnInit {
    @ViewChildren(MatRipple) private matRipples: QueryList<MatRipple>;

    sheets: Sheet[] = [];
    isLoading = true;

    constructor(
        private matDialog: MatDialog,
        private sheetService: SheetService,
        private router: Router,
        private errorHandlerService: ErrorHandlerService,
        private toastService: ToastService
    ) {
        super();
    }

    ngOnInit(): void {
        this.sheetService.getSheets().subscribe({
            next: (sheets: Sheet[]) => {
                this.sheets = sheets;
                this.isLoading = false;
            },
            error: (error: HttpErrorResponse) => {
                this.errorHandlerService.handle(error, 'Failed to load sheets');
                this.isLoading = false;
            },
        });
    }

    openNewSheetDialog(): void {
        const dialog = this.matDialog.open(NewSheetDialogComponent, {});
        dialog.afterClosed().subscribe((sheetId: number) => {
            if (sheetId) {
                this.router.navigate(['/sheet', sheetId]);
            }
        });
    }

    toggleRipple(event: MouseEvent, index: number, show: boolean): void {
        if (this.matRipples) {
            if (show) {
                this.matRipples.get(index)?.launch(event.clientX, event.clientY, { persistent: true });
            } else {
                this.matRipples.get(index)?.fadeOutAll();
            }
        }
    }

    deleteSheet(sheet: Sheet): void {
        const confirmationDialogData: ConfirmationDialogData = {
            headerIcon: 'delete',
            headerText: 'Confirm Delete',
            bodyText: 'Are you sure you want to permanently delete this sheet?',
            actionButtonText: 'Delete',
            noActionButtonText: 'Cancel',
        };
        const dialog = this.matDialog.open(ConfirmationDialogComponent, {
            autoFocus: 'dialog',
            data: confirmationDialogData,
        });
        dialog
            .afterClosed()
            .pipe(
                filter((confirmed: boolean) => confirmed),
                switchMap(() => this.sheetService.deleteSheet(sheet.id)),
                takeUntil(this.unsubscribe)
            )
            .subscribe({
                next: () => {
                    const index = this.sheets.indexOf(sheet);
                    this.sheets.splice(index, 1);
                    this.toastService.showInfoMessage('Sheet removed.');
                },
                error: (error: HttpErrorResponse) => {
                    this.errorHandlerService.handle(error, 'Failed to delete sheet');
                    this.isLoading = false;
                },
            });
    }

    openSheet(sheetId: number): void {
        this.router.navigate(['/sheet', sheetId]);
    }
}
