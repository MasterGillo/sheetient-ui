import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { EMPTY, fromEvent, merge } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Field } from 'src/app/models/field.type';
import { Page } from 'src/app/models/page.model';
import { UnsubscriberComponent } from 'src/app/modules/shared/components/unsubscriber/unsubscriber.component';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-page',
    templateUrl: './page.component.html',
    styleUrls: ['./page.component.scss'],
    imports: [NgIf],
})
export class PageComponent extends UnsubscriberComponent implements AfterViewInit {
    @Input() page: Page;
    @Input() fields: Field[];
    @Input() newField: Field | null;
    @Output() newFieldAdded = new EventEmitter<Field>();
    @ViewChild('pageElement') pageElement: ElementRef<HTMLElement>;

    @ViewChildren('newFieldPlaceholder') newFieldPlaceholders: QueryList<ElementRef>;

    newFieldPlaceholderElement: ElementRef;
    newFieldX: number;
    newFieldY: number;
    newFieldValidPosition: boolean;

    private scrollOffsetX: number;
    private scrollOffsetY: number;

    private clientPosX: number;
    private clientPosY: number;

    get backgroundSize(): string {
        //return `${this.page.grid.spacingX}px ${this.page.grid.spacingY}px`;
        return '';
    }

    get backgroundImage(): string {
        return '';
        // if (this.page.grid.gridColour) {
        //     return `repeating-linear-gradient(${this.backgroundColour} 1px 2px, transparent 5px 8px),
        //             repeating-linear-gradient(90deg, ${this.backgroundColour} 1px 2px, transparent 5px 8px),

        //             repeating-linear-gradient(#${this.page.grid.gridColour} 0 1px, transparent 1px 100%),
        //             repeating-linear-gradient(90deg, #${this.page.grid.gridColour} 0 1px, transparent 1px 100%)`;
        // } else {
        //     return 'none';
        // }
    }

    get backgroundColour(): string {
        return '#' + this.page.colour;
    }

    constructor(private elementRef: ElementRef<HTMLElement>) {
        super();
    }

    ngAfterViewInit(): void {
        this.newFieldPlaceholders.changes
            .pipe(
                tap((queryList: QueryList<ElementRef>) => {
                    if (queryList.first) {
                        queryList.first.nativeElement.style.width = '80px';
                        queryList.first.nativeElement.style.height = '40px';
                        this.newFieldPlaceholderElement = queryList.first;
                        this.scrollOffsetX = this.elementRef.nativeElement.scrollLeft;
                        this.scrollOffsetY = this.elementRef.nativeElement.scrollTop;
                        this.elementRef.nativeElement.style.cursor = 'grabbing';
                    }
                }),
                switchMap((queryList: QueryList<ElementRef>) => {
                    if (queryList.first) {
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
                })
            )
            .subscribe((event: MouseEvent | Event) => {
                if (event.type === 'mouseleave') {
                    this.newFieldPlaceholderElement.nativeElement.style.visibility = 'hidden';
                } else if (event.type === 'mouseenter') {
                    this.newFieldPlaceholderElement.nativeElement.style.visibility = 'visible';
                } else if (event.type === 'scroll') {
                    this.scrollOffsetX = this.elementRef.nativeElement.scrollLeft;
                    this.scrollOffsetY = this.elementRef.nativeElement.scrollTop;
                    this.moveNewFieldPlaceholder();
                } else if (event.type === 'click') {
                    this.addNewField();
                } else if (event instanceof MouseEvent) {
                    this.clientPosX = event.clientX;
                    this.clientPosY = event.clientY;
                    this.moveNewFieldPlaceholder();
                }
            });
    }

    moveNewFieldPlaceholder(): void {
        const boundingRect = this.elementRef.nativeElement.getBoundingClientRect();
        const pageBoundingRect = this.pageElement.nativeElement.getBoundingClientRect();
        let left = this.clientPosX;
        let top = this.clientPosY;

        if (
            this.clientPosX >= pageBoundingRect.left + 2 &&
            this.clientPosX <= pageBoundingRect.right - 2 &&
            this.clientPosY >= pageBoundingRect.top + 2 &&
            this.clientPosY <= pageBoundingRect.bottom - 2
        ) {
            const pageX = this.clientPosX - (pageBoundingRect.left + 2);
            const pageY = this.clientPosY - (pageBoundingRect.top + 2);

            // this.newFieldX = Math.floor(pageX / this.page.grid.spacingX) * this.page.grid.spacingX;
            // this.newFieldY = Math.floor(pageY / this.page.grid.spacingY) * this.page.grid.spacingY;

            left = this.newFieldX + pageBoundingRect.left + 2;
            top = this.newFieldY + pageBoundingRect.top + 2;
        }

        left += this.scrollOffsetX - boundingRect.left;
        top += this.scrollOffsetY - boundingRect.top;

        this.newFieldPlaceholderElement.nativeElement.style.left = `${left}px`;
        this.newFieldPlaceholderElement.nativeElement.style.top = `${top}px`;

        const width = this.newFieldPlaceholderElement.nativeElement.offsetWidth;
        const height = this.newFieldPlaceholderElement.nativeElement.offsetHeight;
        if (
            left + boundingRect.left >= pageBoundingRect.left + this.scrollOffsetX + 2 &&
            left + boundingRect.left + width <= pageBoundingRect.right + this.scrollOffsetX + 2 &&
            top + boundingRect.top >= pageBoundingRect.top + this.scrollOffsetY + 2 &&
            top + boundingRect.top + height <= pageBoundingRect.bottom + this.scrollOffsetY + 2
        ) {
            this.newFieldValidPosition = true;
        } else {
            this.newFieldValidPosition = false;
        }
    }

    addNewField(): void {
        if (this.newFieldValidPosition && this.newField) {
            this.elementRef.nativeElement.style.cursor = 'auto';
            this.newField = {
                ...this.newField,
                x: this.newFieldX,
                y: this.newFieldY,
            };

            this.newFieldAdded.emit(this.newField);
            this.newField = null;
        }
    }
}
