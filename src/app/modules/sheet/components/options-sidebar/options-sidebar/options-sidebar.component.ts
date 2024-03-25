import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first, takeUntil } from 'rxjs';
import { OptionsInterface } from 'src/app/models/options.interface';
import { PageInterface } from 'src/app/models/page.interface';
import { SheetInterface } from 'src/app/models/sheet.interface';
import { OptionsService } from 'src/app/services/options/options.service';
import { SheetService } from 'src/app/services/sheet/sheet.service';
import { ConfirmationDialogData } from 'src/app/models/confirmation-dialog-data.interface';
import { ConfirmationDialogComponent } from 'src/app/modules/shared/components/confirmation-dialog/confirmation-dialog.component';
import { UnsubscriberComponent } from 'src/app/modules/shared/components/unsubscriber/unsubscriber.component';

@Component({
    selector: 'app-options-sidebar',
    templateUrl: './options-sidebar.component.html',
    styleUrls: ['./options-sidebar.component.scss'],
})
export class OptionsSidebarComponent extends UnsubscriberComponent implements OnInit {
    private _sheet: SheetInterface;
    private _currentPage: PageInterface;

    canDeletePage: boolean;
    optionsConfig: OptionsInterface;

    get sheet(): SheetInterface {
        return this._sheet;
    }
    set sheet(value: Partial<SheetInterface>) {
        this.sheetService.updateSheet(value);
    }

    get currentPage(): PageInterface {
        return this._currentPage;
    }
    set currentPage(value: Partial<PageInterface>) {
        this.sheetService.updatePage(this._currentPage.id, value);
    }

    constructor(
        private optionsService: OptionsService,
        private sheetService: SheetService,
        private matDialog: MatDialog
    ) {
        super();
    }

    ngOnInit(): void {
        this.optionsService.optionsConfig$.pipe(first()).subscribe((optionsConfig: OptionsInterface) => {
            this.optionsConfig = optionsConfig;
        });
        this.sheetService.currentPage$.pipe(takeUntil(this.unsubscribe)).subscribe((page: PageInterface) => {
            this._currentPage = page;
        });
        this.sheetService.sheet$
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((sheet: SheetInterface) => (this._sheet = sheet));
        this.sheetService.pages$
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((pages: PageInterface[]) => (this.canDeletePage = pages.length > 1));
    }

    handleExpansionChange(sectionName: string, open: boolean): void {
        switch (sectionName) {
            case 'page': {
                this.optionsService.updateOptionsConfig({ pageSectionExpanded: open });
                break;
            }
            case 'grid': {
                this.optionsService.updateOptionsConfig({ gridSectionExpanded: open });
                break;
            }
        }
    }

    deletePage() {
        const confirmationDialogData: ConfirmationDialogData = {
            headerIcon: 'delete',
            headerText: 'DELETE PAGE',
            bodyText: 'Are you sure you want to delete this page?',
            actionButtonText: 'DELETE',
            noActionButtonText: 'CANCEL',
        };
        const dialogRef = this.matDialog.open(ConfirmationDialogComponent, { data: confirmationDialogData });
        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.sheetService.deleteCurrentPage();
            }
        });
    }
}
