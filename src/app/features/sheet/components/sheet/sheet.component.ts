import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { FieldType } from 'src/app/models/field-type.enum';
import { Field } from 'src/app/models/field.type';
import { LabelField } from 'src/app/models/label-field';
import { Page } from 'src/app/models/page.model';
import { Sheet } from 'src/app/models/sheet.model';
import { SheetStateService } from 'src/app/services/sheet-state.service';
import { PageContainerComponent } from 'src/app/shared/components/page-container/page-container.component';
import { UnsubscriberComponent } from 'src/app/shared/components/unsubscriber/unsubscriber.component';
import { PageComponent } from '../page/page.component';
import { SheetSidebarComponent } from '../sheet-sidebar/sheet-sidebar.component';

@Component({
    selector: 'app-sheet',
    templateUrl: './sheet.component.html',
    styleUrls: ['./sheet.component.scss'],
    imports: [
        PageContainerComponent,
        MatSidenav,
        MatSidenavContainer,
        MatSidenavContent,
        SheetSidebarComponent,
        NgFor,
        NgIf,
        MatIcon,
        MatIconButton,
        MatRipple,
        NgClass,
        PageComponent,
        CdkDrag,
        CdkDropList,
        MatFabButton,
        MatTooltip,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
    ],
    providers: [SheetStateService],
})
export class SheetComponent extends UnsubscriberComponent implements OnInit {
    @Input() sheetId: number;

    isLoading = true;
    sheetName: string;

    sheet: Sheet;
    currentPage: Page;

    get fieldType(): typeof FieldType {
        return FieldType;
    }

    constructor(
        private sheetState: SheetStateService,
        private router: Router
    ) {
        super();
    }

    ngOnInit(): void {
        this.isLoading = true;
        this.sheetState.sheet$.pipe(takeUntil(this.unsubscribe)).subscribe((sheet: Sheet | undefined) => {
            if (sheet) {
                if (this.isLoading) {
                    this.isLoading = false;
                }
                sheet.pages.sort((a: Page, b: Page) => a.order - b.order);
                this.sheet = sheet;
            }
        });
        this.sheetState.currentPage$.pipe(takeUntil(this.unsubscribe)).subscribe((currentPage: Page) => {
            if (currentPage) {
                this.currentPage = currentPage;
            }
        });

        this.sheetState.loadSheet(this.sheetId);
    }

    addNewPage(): void {
        const pages = this.sheet.pages;
        let pageNumber = pages.length + 1;
        let pageName = 'Page ' + pageNumber;
        while (pages.some((page: Page) => page.name == pageName)) {
            pageNumber++;
            pageName = 'Page ' + pageNumber;
        }
        const newPage = new Page(pageName, this.currentPage.height, this.currentPage.width, pages.length + 1);
        this.sheetState.createPage(newPage);
    }

    changePage(pageId: number): void {
        this.sheetState.changePage(pageId);
    }

    dropPageTab(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.sheet.pages, event.previousIndex, event.currentIndex);
        this.sheetState.reorderPages(this.sheet.pages.map((page: Page) => page.id));
    }

    back(): void {
        this.router.navigate(['/']);
    }

    addField(fieldType: FieldType): void {
        let newField: Field | null = null;
        switch (fieldType) {
            case FieldType.Label: {
                newField = new LabelField();
            }
        }
        if (newField) {
            this.sheetState.addNewField(newField);
        }
    }
}
