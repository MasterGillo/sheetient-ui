import { Routes } from '@angular/router';
import { AUTH_GUARD } from './shared/guards/auth.guard';

export const APP_ROUTES: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then((r) => r.HOME_ROUTES),
    },
    {
        path: 'sheet',
        loadChildren: () => import('./features/sheet/sheet.routes').then((r) => r.SHEET_ROUTES),
        canActivate: [AUTH_GUARD],
    },
];
