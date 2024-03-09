import {
    AfterViewInit,
    Component,
    ComponentRef,
    ElementRef,
    NgZone,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import { SheetService } from './services/sheet/sheet.service';
import { SheetInterface } from './models/sheet.interface';
import { filter, first, merge, takeUntil } from 'rxjs';
import { CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { ComponentPortal } from '@angular/cdk/portal';
import { FieldListDialogComponent } from './components/field-list-dialog/field-list-dialog.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { UnsubscriberComponent } from './shared/components/unsubscriber/unsubscriber.component';
import { FieldType } from './models/field-type.enum';
import { Field } from './models/field.type';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent extends UnsubscriberComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('sheetName') sheetName: ElementRef;
    @ViewChild('fieldButton') fieldButton: ElementRef;
    @ViewChildren('tabTooltip') tabTooltips: QueryList<MatTooltip>;
    @ViewChildren('sheetNameInput') sheetNameInputs: QueryList<ElementRef>;
    @ViewChildren('dragPreview') dragPreviews: QueryList<ElementRef>;

    sheetNameWidth = 0;
    sheet: SheetInterface;
    sheetNameInnerHtml: string;
    sheetNameControl: FormControl = this.formBuilder.control('', [Validators.required]);
    editingSheetName: boolean;
    draggingTab: boolean;

    fieldListOverlayRef: OverlayRef;
    fieldListPortal: ComponentPortal<FieldListDialogComponent>;
    fieldListComponentRef: ComponentRef<FieldListDialogComponent>;

    constructor(
        public sheetService: SheetService,
        private formBuilder: FormBuilder,
        private zone: NgZone,
        private viewContainerRef: ViewContainerRef,
        private overlay: Overlay
    ) {
        super();
    }

    ngOnInit(): void {
        this.sheetService.sheet$.pipe(first(), takeUntil(this.unsubscribe)).subscribe((sheet: SheetInterface) => {
            this.sheetNameControl.setValue(sheet.name);
        });
        this.sheetService.sheet$.pipe(takeUntil(this.unsubscribe)).subscribe((sheet: SheetInterface) => {
            this.sheetNameInnerHtml = sheet.name.replace(/\s/g, '&nbsp;');
        });
        this.sheetNameControl.valueChanges.subscribe((value: string) => {
            this.sheetService.updateSheet({ name: value });
        });
    }

    ngAfterViewInit(): void {
        const observer = new ResizeObserver((entries) => {
            this.zone.run(() => {
                this.sheetNameWidth = Math.ceil(entries[0].contentRect.width);
            });
        });
        observer.observe(this.sheetName.nativeElement);

        this.sheetNameInputs.changes.subscribe((queryList: QueryList<ElementRef>) => {
            if (queryList.first && this.editingSheetName) {
                queryList.first.nativeElement.focus();
            }
        });
    }

    override ngOnDestroy(): void {
        this.closeFieldList();
        if (this.fieldListOverlayRef) {
            this.fieldListOverlayRef.dispose();
            this.fieldListComponentRef.destroy();
        }
        super.ngOnDestroy();
    }

    addPage(): void {
        this.sheetService.addPage();
    }

    switchPage(pageId: number): void {
        this.sheetService.switchCurrentPage(pageId);
    }

    dropPage(event: CdkDragDrop<string[]>): void {
        this.sheetService.reorderPages(event.previousIndex, event.currentIndex);
    }

    toggleDrag(dragging: boolean) {
        this.draggingTab = dragging;
        this.tabTooltips.forEach((toolTip) => {
            if (!dragging) {
                toolTip.disabled = false;
            } else {
                toolTip.disabled = true;
                toolTip.hide();
            }
        });
    }

    dragMoved(event: CdkDragMove) {
        if (this.dragPreviews.first) {
            const xPos = event.pointerPosition.x - 16;
            const yPos = event.pointerPosition.y;
            this.dragPreviews.first.nativeElement.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }
    }

    toggleFieldList(): void {
        if (
            (this.fieldListOverlayRef && this.fieldListOverlayRef.hasAttached()) ||
            (this.fieldListPortal && this.fieldListPortal.isAttached)
        ) {
            this.closeFieldList();
        } else {
            this.openFieldList();
        }
    }

    openFieldList(): void {
        if (!this.fieldListPortal) {
            this.fieldListPortal = new ComponentPortal(FieldListDialogComponent, this.viewContainerRef);
        }

        if (!this.fieldListOverlayRef) {
            this.fieldListOverlayRef = this.overlay.create({
                positionStrategy: this.overlay
                    .position()
                    .flexibleConnectedTo(this.fieldButton)
                    .withPositions([{ originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }]),
            });
        }

        if (!this.fieldListOverlayRef.hasAttached()) {
            this.fieldListComponentRef = this.fieldListOverlayRef.attach(this.fieldListPortal);
            this.fieldListComponentRef.instance.addNewField
                .pipe(takeUntil(this.unsubscribe))
                .subscribe((fieldType: FieldType) => {
                    this.sheetService.placeNewField(fieldType);
                });
        }

        merge(
            this.fieldListOverlayRef.detachments(),
            this.fieldListOverlayRef.keydownEvents().pipe(
                filter((event: KeyboardEvent) => {
                    return event.key === 'Escape';
                })
            )
        )
            .pipe(first())
            .subscribe((event: void | KeyboardEvent) => {
                if (event) {
                    event.preventDefault();
                }
                this.closeFieldList();
            });
    }

    closeFieldList(): void {
        if (this.fieldListOverlayRef.hasAttached()) {
            this.fieldListOverlayRef.detach();
        }
        if (this.fieldListPortal.isAttached) {
            this.fieldListPortal.detach();
        }
    }

    addNewField(field: Field): void {
        this.sheetService.addField(field);
    }
}
