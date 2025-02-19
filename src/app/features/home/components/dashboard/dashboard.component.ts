import { NgFor, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Sheet } from 'src/app/models/sheet.model';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SheetService } from 'src/app/services/sheet.service';
import { ToastService } from 'src/app/services/toast.service';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';
import { NewSheetDialogComponent } from '../../../sheet/components/new-sheet-dialog/new-sheet-dialog.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [
        NgFor,
        NgIf,
        LoaderComponent,
        MatIconButton,
        MatIcon,
        MatRipple,
        MatMenu,
        MatMenuTrigger,
        MatMenuItem,
        MatButton,
        MatMenuContent,
    ],
})
export class DashboardComponent implements OnInit {
    @ViewChildren(MatRipple) private matRipples: QueryList<MatRipple>;

    sheets: Sheet[] = [];
    isLoading = true;

    constructor(
        private matDialog: MatDialog,
        private sheetService: SheetService,
        private router: Router,
        private errorHandlerService: ErrorHandlerService,
        private authService: AuthService,
        private toastService: ToastService
    ) {}

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
        const dialog = this.matDialog.open(NewSheetDialogComponent, {
            panelClass: 'sheetient-dialog',
        });
        dialog.afterClosed().subscribe((sheetId: number) => {
            if (sheetId) {
                this.router.navigate(['/sheet', sheetId]);
            }
        });
    }

    logOutClick(): void {
        this.authService.logout().subscribe();
    }

    openSheetMenu(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();
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
        this.sheetService.deleteSheet(sheet.id).subscribe({
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
