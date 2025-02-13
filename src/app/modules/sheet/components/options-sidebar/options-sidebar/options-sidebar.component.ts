import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { first, takeUntil } from 'rxjs';
import { ConfirmationDialogData } from 'src/app/models/confirmation-dialog-data.interface';
import { OptionsInterface } from 'src/app/models/options.interface';
import { Page } from 'src/app/models/page.model';
import { Sheet } from 'src/app/models/sheet.model';
import { ConfirmationDialogComponent } from 'src/app/modules/shared/components/confirmation-dialog/confirmation-dialog.component';
import { UnsubscriberComponent } from 'src/app/modules/shared/components/unsubscriber/unsubscriber.component';
import { OptionsService } from 'src/app/services/options/options.service';
import { SheetService } from 'src/app/services/sheet/sheet.service';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { PageOptionsComponent } from '../page-options/page-options.component';
import { GridOptionsComponent } from '../grid-options/grid-options.component';

@Component({
    selector: 'app-options-sidebar',
    templateUrl: './options-sidebar.component.html',
    styleUrls: ['./options-sidebar.component.scss'],
    imports: [
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatIcon,
        PageOptionsComponent,
        GridOptionsComponent,
    ],
})
export class OptionsSidebarComponent extends UnsubscriberComponent implements OnInit {
    private _sheet: Sheet;
    private _currentPage: Page;

    canDeletePage: boolean;
    optionsConfig: OptionsInterface;

    get sheet(): Sheet {
        return this._sheet;
    }
    set sheet(value: Partial<Sheet>) {
        this.sheetService.updateSheet(value);
    }

    get currentPage(): Page {
        return this._currentPage;
    }
    set currentPage(value: Partial<Page>) {
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
        this.sheetService.currentPage$.pipe(takeUntil(this.unsubscribe)).subscribe((page: Page) => {
            this._currentPage = page;
        });
        this.sheetService.sheet$
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((sheet: Sheet) => (this._sheet = sheet));
        this.sheetService.pages$
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((pages: Page[]) => (this.canDeletePage = pages.length > 1));
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
