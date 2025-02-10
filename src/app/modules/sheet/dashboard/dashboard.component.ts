import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sheet } from 'src/app/models/sheet.model';
import { NewSheetDialogComponent } from '../new-sheet-dialog/new-sheet-dialog.component';
import { SheetService } from 'src/app/services/sheet/sheet.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
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
            console.log(sheets);
        });
    }

    openNewSheetDialog(): void {
        this.matDialog.open(NewSheetDialogComponent, {
            panelClass: 'sheetient-dialog',
        });
    }
}
