import { NgModule, inject } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/sheet/sheet.module').then((m) => m.SheetModule),
        canActivate: [authGuard],
    },
    {
        path: 'home',
        loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule),
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
