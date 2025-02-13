import { moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FieldType } from 'src/app/models/field-type.enum';
import { Field } from 'src/app/models/field.type';
import { LabelField } from 'src/app/models/label-field';
import { Page } from 'src/app/models/page.model';
import { Sheet } from 'src/app/models/sheet.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
    providedIn: 'root',
})
export class SheetService {
    private _sheet: Sheet = {
        id: 0,
        name: 'Test Sheet',
        description: 'description',
        pages: [],
    };

    private _pages: Page[] = [
        {
            id: 0,
            name: 'Page 1',
            colour: 'ffffff',
            height: 1123,
            width: 794,
            order: 0,
            // grid: {
            //     spacingY: 20,
            //     spacingX: 20,
            //     showGrid: true,
            //     gridColour: 'cccccc',
            // },
        },
    ];

    private _fields: Field[] = [];

    private _currentPageId: number = this._pages[0].id;

    sheet$: BehaviorSubject<Sheet> = new BehaviorSubject(this._sheet);
    pages$: BehaviorSubject<Page[]> = new BehaviorSubject(this._pages);
    currentPage$: BehaviorSubject<Page> = new BehaviorSubject(this._pages[0]);
    newField$: Subject<Field> = new Subject();
    fields$: BehaviorSubject<Field[]> = new BehaviorSubject(this._fields);

    constructor(private httpClient: HttpClient) {}

    updateSheet(sheetConfig: Partial<Sheet>): void {
        this._sheet = { ...this._sheet, ...sheetConfig };
        this.sheet$.next(this._sheet);
    }

    switchCurrentPage(pageId: number): void {
        this._currentPageId = pageId;
        const page = this._pages.find((page) => page.id === pageId);
        if (page) {
            this.currentPage$.next(page);
        }
    }

    updateCurrentPage(pageChanges: Partial<Page>): void {
    //     this.updatePage(this._currentPageId, pageChanges);
    }

    updatePage(pageId: number, pageChanges: Partial<Page>): void {
        // const index = this._pages.findIndex((page) => page.id === pageId);
        // if (index != null) {
        //     const grid = { ...this._pages[index].grid };
        //     this._pages[index] = { ...this._pages[index], ...pageChanges };
        //     this._pages[index].grid = { ...grid, ...pageChanges.grid };

        //     this.pages$.next(this._pages);

        //     if (this._currentPageId === pageId) {
        //         this.currentPage$.next(this._pages[index]);
        //     }
        // }
    }

    addPage(): void {
        // const newId = Math.max(...this._pages.map((page) => page.id)) + 1;
        // this._sheet.pageCount++;
        // this.sheet$.next(this._sheet);
        // const newPage = JSON.parse(JSON.stringify(this.currentPage$.getValue()));
        // newPage.id = newId;
        // newPage.name = 'Page ' + this._sheet.pageCount;
        // newPage.order = this._pages.length;
        // this._pages.push(newPage);
        // this.pages$.next(this._pages);
        // this.switchCurrentPage(newId);
    }

    reorderPages(previousIndex: number, newIndex: number): void {
        moveItemInArray(this._pages, previousIndex, newIndex);
        this.reindexPages();
        this.pages$.next(this._pages);
    }

    deleteCurrentPage(): void {
        if (this._pages.length > 1) {
            const index = this._pages.findIndex((page) => page.id === this._currentPageId);
            if (index > 0) {
                this.switchCurrentPage(this._pages[index - 1].id);
            } else {
                this.switchCurrentPage(this._pages[index + 1].id);
            }
            this._pages.splice(index, 1);
            this.reindexPages();
            this.pages$.next(this._pages);
        }
    }

    reindexPages(): void {
        this._pages.forEach((page, index) => {
            page.order = index;
        });
    }

    placeNewField(fieldType: FieldType): void {
        let newField: Field;
        switch (fieldType) {
            case FieldType.Label: {
                newField = new LabelField(this._currentPageId);
                this.newField$.next(newField);
                break;
            }
        }
    }

    addField(field: Field) {
        if (field.type === FieldType.Label) {
            const newField: LabelField = {
                ...field,
                type: FieldType.Label,
                text: 'Label',
            };
            this._fields.push(newField);
        }
    }

    getSheets(): Observable<Sheet[]> {
        return this.httpClient.get<Sheet[]>(environment.baseApiUrl + '/sheet');
    }

    createSheet(sheet: Sheet): Observable<number> {
        return this.httpClient.post<number>(environment.baseApiUrl + '/sheet', sheet);
    }
}
