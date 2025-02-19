import { Routes } from '@angular/router';
import { AUTH_GUARD } from 'src/app/shared/guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';

export const HOME_ROUTES: Routes = [
    {
        path: 'home',
        redirectTo: '',
        pathMatch: 'full',
    },
    {
        path: '',
        component: DashboardComponent,
        canMatch: [AUTH_GUARD],
    },
    {
        path: '',
        component: HomeComponent,
    },
];
