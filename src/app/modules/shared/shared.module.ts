import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { UnsubscriberComponent } from './components/unsubscriber/unsubscriber.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { SpinnerButtonComponent } from './components/spinner-button/spinner-button.component';
import { ActionButtonComponent } from './components/action-button/action-button.component';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
    declarations: [UnsubscriberComponent, ConfirmationDialogComponent, SpinnerButtonComponent, ActionButtonComponent],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        OverlayModule,
        MatSliderModule,
        MatTooltipModule,
        MatRippleModule,
        DragDropModule,
        MatListModule,
        ScrollingModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatDividerModule,
    ],
    exports: [
        CommonModule,
        MatToolbarModule,
        MatSidenavModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatExpansionModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        OverlayModule,
        MatSliderModule,
        MatTooltipModule,
        MatRippleModule,
        DragDropModule,
        MatListModule,
        ScrollingModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        SpinnerButtonComponent,
        MatSelectModule,
        ActionButtonComponent,
    ],
    providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'outline',
                floatLabel: 'always',
                color: 'accent',
                hideRequiredMarker: true,
            },
        },
    ],
})
export class SharedModule {}
