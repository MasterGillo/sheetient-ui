import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { takeUntil } from 'rxjs';
import { Sheet } from 'src/app/models/sheet.model';
import { SheetStateService } from 'src/app/services/sheet-state.service';
import { UnsubscriberComponent } from 'src/app/shared/components/unsubscriber/unsubscriber.component';
import { PageOptionsComponent } from './page-options/page-options.component';
import { SheetOptionsComponent } from './sheet-options/sheet-options.component';

@Component({
    selector: 'app-sheet-sidebar',
    imports: [
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatExpansionPanelTitle,
        NgIf,
        PageOptionsComponent,
        SheetOptionsComponent,
    ],
    templateUrl: './sheet-sidebar.component.html',
    styleUrl: './sheet-sidebar.component.scss',
})
export class SheetSidebarComponent extends UnsubscriberComponent implements OnInit {
    isLoading = true;

    constructor(private sheetState: SheetStateService) {
        super();
    }

    ngOnInit(): void {
        this.sheetState.sheet$.pipe(takeUntil(this.unsubscribe)).subscribe((sheet?: Sheet) => {
            if (sheet) {
                if (this.isLoading) {
                    this.isLoading = false;
                }
            }
        });
    }
}
