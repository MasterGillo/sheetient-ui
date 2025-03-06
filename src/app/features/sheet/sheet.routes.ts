import { Routes } from '@angular/router';
import { SheetComponent } from './components/sheet/sheet.component';

export const SHEET_ROUTES: Routes = [
    {
        path: ':sheetId',
        component: SheetComponent,
    },
];
