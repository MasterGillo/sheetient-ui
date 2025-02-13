import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ActionButtonComponent } from '../../../../shared/components/action-button/action-button.component';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [NgIf, LoginComponent, RegisterComponent, ActionButtonComponent],
})
export class HomeComponent {
    login = true;
    loading = false;
}
