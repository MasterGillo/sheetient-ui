import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { AuthService } from './services/auth/auth.service';

const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isLoggedIn) {
        return true;
    } else {
        return router.parseUrl('home');
    }
};

export const APP_ROUTES: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/sheet/sheet.routes').then((r) => r.SHEET_ROUTES),
        canActivate: [authGuard],
    },
    {
        path: 'home',
        loadChildren: () => import('./features/home/home.routes').then((r) => r.HOME_ROUTES),
    },
];
