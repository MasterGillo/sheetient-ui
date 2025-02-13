import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sheet } from 'src/app/models/sheet.model';
import { SheetService } from 'src/app/services/sheet/sheet.service';
import { ActionButtonComponent } from '../../../../shared/components/action-button/action-button.component';
import { NewSheetDialogComponent } from '../new-sheet-dialog/new-sheet-dialog.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [ActionButtonComponent, NgFor],
})
export class DashboardComponent implements OnInit {
    sheets: Sheet[] = [
        {
            id: 1,
            name: 'Character Name Here',
            description: 'This is a description of this one.',
            pages: [],
        },
    ];

    constructor(
        private matDialog: MatDialog,
        private sheetService: SheetService
    ) {}

    ngOnInit(): void {
        this.sheetService.getSheets().subscribe((sheets: Sheet[]) => {
            this.sheets = sheets;
        });
    }

    openNewSheetDialog(): void {
        this.matDialog.open(NewSheetDialogComponent, {
            panelClass: 'sheetient-dialog',
        });
    }
}
