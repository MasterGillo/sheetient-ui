import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { compare, deepClone, RemoveOperation } from 'fast-json-patch';
import { merge, ReplaySubject, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Page } from '../models/page.model';
import { Sheet } from '../models/sheet.model';
import { ErrorHandlerService } from './error-handler.service';
import { SheetService } from './sheet.service';

@Injectable()
export class SheetStateService implements OnDestroy {
    private _sheet: Sheet;
    private _currentPage: Page;

    sheet$ = new ReplaySubject<Sheet>();
    currentPage$ = new ReplaySubject<Page>();

    unsubscribe$ = new Subject<void>();

    constructor(
        private sheetService: SheetService,
        private errorHandler: ErrorHandlerService
    ) {}

    ngOnDestroy(): void {
        this.unsubscribe$.next();
    }

    loadSheet(sheetId: number): void {
        this.sheetService
            .getSheet(sheetId)
            .pipe(
                tap((sheet: Sheet) => {
                    this.sheet$.next(sheet);
                    this.currentPage$.next(sheet.pages[0]);
                }),
                switchMap(() =>
                    merge(
                        this.sheet$.pipe(tap((sheet: Sheet) => (this._sheet = sheet))),
                        this.currentPage$.pipe(tap((page: Page) => (this._currentPage = page)))
                    )
                ),
                takeUntil(this.unsubscribe$)
            )
            .subscribe({
                error: (error: HttpErrorResponse) => {
                    this.errorHandler.handle(error, 'Failed to load sheet');
                },
            });
    }

    updateSheet(sheetConfig: Partial<Sheet>): void {
        const sheetUpdate = { ...this._sheet, ...sheetConfig };
        const patch = compare(this._sheet, sheetUpdate);
        this.sheetService.patchSheet(this._sheet.id, patch).subscribe({
            next: () => {
                this.sheet$.next(sheetUpdate);
            },
            error: (error: HttpErrorResponse) => {
                this.errorHandler.handle(error, 'Failed to update sheet');
            },
        });
    }

    createPage(page: Page): void {
        this.sheetService.createPage(this._sheet.id, page).subscribe({
            next: (pageId: number) => {
                page.id = pageId;
                const sheetPages = [...this._sheet.pages, page];
                const sheetUpdate = { ...this._sheet, ...{ pages: sheetPages } };
                this.sheet$.next(sheetUpdate);
                this.changePage(pageId);
            },
            error: (error: HttpErrorResponse) => {
                this.errorHandler.handle(error, 'Failed to create page');
            },
        });
    }

    changePage(pageId: number): void {
        const newPage = this._sheet.pages.find((page) => page.id === pageId);
        if (newPage) {
            this.currentPage$.next(newPage);
        }
    }

    updatePage(pageId: number, pageConfig: Partial<Page>): void {
        const sheetClone = deepClone(this._sheet);
        let page = sheetClone.pages.find((page: Page) => page.id === pageId);

        if (page) {
            const index = sheetClone.pages.indexOf(page);
            page = { ...page, ...pageConfig };
            sheetClone.pages[index] = page;
            const patch = compare(this._sheet, sheetClone);
            this.sheetService.patchSheet(this._sheet.id, patch).subscribe({
                next: () => {
                    this.sheet$.next(sheetClone);
                },
                error: (error: HttpErrorResponse) => {
                    this.errorHandler.handle(error, 'Failed to update page');
                },
            });
        }
    }

    deleteCurrentPage(): void {
        const sheetClone = deepClone(this._sheet);
        const page = sheetClone.pages.find((page: Page) => page.id === this._currentPage.id);
        if (page) {
            const index = sheetClone.pages.indexOf(page);
            sheetClone.pages.splice(index, 1);
            const patch = [<RemoveOperation>{ op: 'remove', path: `/pages/${index}` }];
            this.sheetService.patchSheet(this._sheet.id, patch).subscribe({
                next: () => {
                    this.sheet$.next(sheetClone);
                    if (index > 0) {
                        this.changePage(sheetClone.pages[index - 1].id);
                    } else {
                        this.changePage(sheetClone.pages[index].id);
                    }
                },
                error: (error: HttpErrorResponse) => {
                    this.errorHandler.handle(error, 'Failed to delete page');
                },
            });
        }
    }

    reorderPages(pageOrder: number[]): void {
        const sheetClone = deepClone(this._sheet);

        sheetClone.pages.forEach((page: Page) => {
            const newOrder = pageOrder.findIndex((x: number) => x === page.id) + 1;
            page.order = newOrder;
        });

        const patch = compare(this._sheet, sheetClone);
        this.sheetService.patchSheet(this._sheet.id, patch).subscribe({
            next: () => {
                this.sheet$.next(sheetClone);
            },
            error: (error: HttpErrorResponse) => {
                this.errorHandler.handle(error, 'Failed to reorder pages');
            },
        });
    }
}
