import { NgComponentOutlet, NgIf } from '@angular/common';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EMPTY, fromEvent, merge, switchMap, takeUntil, tap } from 'rxjs';
import { Field } from 'src/app/models/field.type';
import { Page } from 'src/app/models/page.model';
import { SheetStateService } from 'src/app/services/sheet-state.service';
import { UnsubscriberComponent } from 'src/app/shared/components/unsubscriber/unsubscriber.component';
import { NewFieldPlaceholderComponent } from '../new-field-placeholder/new-field-placeholder.component';

@Component({
    selector: 'app-page',
    imports: [NgIf, NgComponentOutlet],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
})
export class PageComponent extends UnsubscriberComponent implements OnInit, OnDestroy {
    @Input() page: Page;
    @ViewChild('pageElement') pageElement: ElementRef<HTMLElement>;

    newFieldComponent = NewFieldPlaceholderComponent;
    newFieldInputs: { field: Field; position?: { top: number; left: number }; isVisible: boolean } | undefined;
    isAddingNewField: boolean;

    private scrollOffsetX: number;
    private scrollOffsetY: number;

    private clientPosX: number;
    private clientPosY: number;

    constructor(
        private sheetState: SheetStateService,
        private elementRef: ElementRef<HTMLElement>
    ) {
        super();
    }

    ngOnInit(): void {
        this.sheetState.newField$
            .pipe(
                tap((field: Field | null) => {
                    if (field) {
                        this.newFieldInputs = { field: field, position: { top: 0, left: 0 }, isVisible: true };
                        this.isAddingNewField = true;
                        this.scrollOffsetX = this.elementRef.nativeElement.scrollLeft;
                        this.scrollOffsetY = this.elementRef.nativeElement.scrollTop;
                        this.elementRef.nativeElement.style.cursor = 'grabbing';
                    } else {
                        this.newFieldInputs = undefined;
                        this.isAddingNewField = false;
                        this.elementRef.nativeElement.style.cursor = 'auto';
                    }
                }),
                switchMap((field: Field | null) => {
                    if (field) {
                        return merge(
                            fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousemove'),
                            fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mouseenter'),
                            fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mouseleave'),
                            fromEvent<Event>(this.elementRef.nativeElement, 'scroll'),
                            fromEvent<MouseEvent>(this.elementRef.nativeElement, 'click')
                        );
                    } else {
                        return EMPTY;
                    }
                }),
                takeUntil(this.unsubscribe)
            )
            .subscribe((event: MouseEvent | Event) => {
                if (this.newFieldInputs) {
                    if (event.type === 'mouseleave') {
                        this.newFieldInputs.isVisible = false;
                    } else if (event.type === 'mouseenter') {
                        this.newFieldInputs.isVisible = true;
                    } else if (event.type === 'scroll') {
                        this.scrollOffsetX = this.elementRef.nativeElement.scrollLeft;
                        this.scrollOffsetY = this.elementRef.nativeElement.scrollTop;
                        this.moveNewFieldPlaceholder();
                    } else if (event.type === 'click') {
                        //this.addNewField();
                    } else if (event instanceof MouseEvent) {
                        this.clientPosX = event.clientX;
                        this.clientPosY = event.clientY;
                        this.moveNewFieldPlaceholder();
                    }
                }
            });
    }

    override ngOnDestroy(): void {
        this.sheetState.cancelAddNewField();
        super.ngOnDestroy();
    }

    moveNewFieldPlaceholder(): void {
        const boundingRect = this.elementRef.nativeElement.getBoundingClientRect();

        let left = this.clientPosX;
        let top = this.clientPosY;

        left += this.scrollOffsetX - boundingRect.left;
        top += this.scrollOffsetY - boundingRect.top;

        this.newFieldInputs!.position = { top: top, left: left };
        // this.newFieldPlaceholderElement.nativeElement.style.left = `${left}px`;
        // this.newFieldPlaceholderElement.nativeElement.style.top = `${top}px`;

        // const width = this.newFieldPlaceholderElement.nativeElement.offsetWidth;
        // const height = this.newFieldPlaceholderElement.nativeElement.offsetHeight;
        // if (
        //     left + boundingRect.left >= pageBoundingRect.left + this.scrollOffsetX + 2 &&
        //     left + boundingRect.left + width <= pageBoundingRect.right + this.scrollOffsetX + 2 &&
        //     top + boundingRect.top >= pageBoundingRect.top + this.scrollOffsetY + 2 &&
        //     top + boundingRect.top + height <= pageBoundingRect.bottom + this.scrollOffsetY + 2
        // ) {
        //     this.newFieldValidPosition = true;
        // } else {
        //     this.newFieldValidPosition = false;
        // }
    }
}
