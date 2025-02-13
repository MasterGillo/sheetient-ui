import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { ActionButtonComponent } from '../../../shared/components/action-button/action-button.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [
        NgIf,
        LoginComponent,
        RegisterComponent,
        ActionButtonComponent,
    ],
})
export class HomeComponent {
    login = true;
    loading = false;
}
