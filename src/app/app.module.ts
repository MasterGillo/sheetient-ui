import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OptionsSidebarComponent } from './components/options-sidebar/options-sidebar/options-sidebar.component';
import { PageComponent } from './components/page/page.component';
import { PageOptionsComponent } from './components/options-sidebar/page-options/page-options.component';
import { ControlSubsectionComponent } from './components/options-sidebar/control-subsection/control-subsection.component';
import { ColourInputComponent } from './components/colour-input/colour-input/colour-input.component';
import { ColourInputDialogComponent } from './components/colour-input/colour-input-dialog/colour-input-dialog.component';
import { GridOptionsComponent } from './components/options-sidebar/grid-options/grid-options.component';
import { FieldListDialogComponent } from './components/field-list-dialog/field-list-dialog.component';

import { SharedModule } from './shared/shared.module';
import { LabelFieldComponent } from './components/fields/label-field/label-field.component';
import { FieldComponent } from './components/fields/field/field.component';

@NgModule({
    declarations: [
        AppComponent,
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
    ],
    imports: [BrowserModule, AppRoutingModule, SharedModule],
    bootstrap: [AppComponent],
})
export class AppModule {}
