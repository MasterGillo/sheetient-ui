import { CdkDragDrop, CdkDragMove, CdkDropList, CdkDrag, CdkDragHandle, CdkDragPreview } from '@angular/cdk/drag-drop';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
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
import { FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';
import { filter, first, merge, takeUntil } from 'rxjs';
import { FieldType } from 'src/app/models/field-type.enum';
import { Field } from 'src/app/models/field.type';
import { Sheet } from 'src/app/models/sheet.model';
import { UnsubscriberComponent } from 'src/app/modules/shared/components/unsubscriber/unsubscriber.component';
import { SheetService } from 'src/app/services/sheet/sheet.service';
import { FieldListDialogComponent } from '../field-list-dialog/field-list-dialog.component';
import { MatToolbar } from '@angular/material/toolbar';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { OptionsSidebarComponent } from '../options-sidebar/options-sidebar/options-sidebar.component';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { PageComponent } from '../page/page.component';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-sheet',
    templateUrl: './sheet.component.html',
    styleUrls: ['./sheet.component.scss'],
    imports: [
        MatToolbar,
        MatTooltip,
        NgIf,
        MatInput,
        ReactiveFormsModule,
        MatSidenavContainer,
        MatSidenav,
        OptionsSidebarComponent,
        MatSidenavContent,
        CdkDropList,
        NgFor,
        MatRipple,
        CdkDrag,
        MatIcon,
        CdkDragHandle,
        CdkDragPreview,
        PageComponent,
        CdkScrollable,
        MatButton,
        AsyncPipe,
    ],
})
export class SheetComponent extends UnsubscriberComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('sheetName') sheetName: ElementRef;
    @ViewChild('fieldButton') fieldButton: ElementRef;
    @ViewChildren('tabTooltip') tabTooltips: QueryList<MatTooltip>;
    @ViewChildren('sheetNameInput') sheetNameInputs: QueryList<ElementRef>;
    @ViewChildren('dragPreview') dragPreviews: QueryList<ElementRef>;

    sheetNameWidth = 0;
    sheet: Sheet;
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
        this.sheetService.sheet$.pipe(first(), takeUntil(this.unsubscribe)).subscribe((sheet: Sheet) => {
            this.sheetNameControl.setValue(sheet.name);
        });
        this.sheetService.sheet$.pipe(takeUntil(this.unsubscribe)).subscribe((sheet: Sheet) => {
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
