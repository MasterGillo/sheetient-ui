import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ColourInputDialogComponent } from './components/colour-input/colour-input-dialog/colour-input-dialog.component';
import { ColourInputComponent } from './components/colour-input/colour-input/colour-input.component';
import { FieldListDialogComponent } from './components/field-list-dialog/field-list-dialog.component';
import { FieldComponent } from './components/fields/field/field.component';
import { LabelFieldComponent } from './components/fields/label-field/label-field.component';
import { ControlSubsectionComponent } from './components/options-sidebar/control-subsection/control-subsection.component';
import { GridOptionsComponent } from './components/options-sidebar/grid-options/grid-options.component';
import { OptionsSidebarComponent } from './components/options-sidebar/options-sidebar/options-sidebar.component';
import { PageOptionsComponent } from './components/options-sidebar/page-options/page-options.component';
import { PageComponent } from './components/page/page.component';
import { SheetComponent } from './components/sheet/sheet.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewSheetDialogComponent } from './new-sheet-dialog/new-sheet-dialog.component';
import { SheetRoutingModule } from './sheet-routing.module';

@NgModule({
    imports: [CommonModule, SheetRoutingModule, SharedModule, SheetComponent,
        OptionsSidebarComponent,
        PageComponent,
        PageOptionsComponent,
        ControlSubsectionComponent,
        ColourInputComponent,
        ColourInputDialogComponent,
        GridOptionsComponent,
        FieldListDialogComponent,
        LabelFieldComponent,
        FieldComponent,
        DashboardComponent,
        NewSheetDialogComponent],
})
export class SheetModule {}
