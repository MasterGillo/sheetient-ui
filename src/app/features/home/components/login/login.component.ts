import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { SpinnerButtonComponent } from '../../../../shared/components/spinner-button/spinner-button.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        ReactiveFormsModule,
        MatFormField,
        MatLabel,
        MatInput,
        NgIf,
        MatError,
        MatIconButton,
        MatSuffix,
        MatIcon,
        MatCheckbox,
        SpinnerButtonComponent,
        MatButton,
    ],
})
export class LoginComponent implements OnInit {
    @Output() loggingIn = new EventEmitter<boolean>();

    private _isLoggingIn = false;
    get isLoggingIn(): boolean {
        return this._isLoggingIn;
    }
    private set isLoggingIn(value: boolean) {
        this.loggingIn.emit(value);
        this._isLoggingIn = value;
    }

    hidePassword = true;
    form: FormGroup;

    get usernameOrEmailControl(): AbstractControl {
        return this.form.controls['usernameOrEmail'];
    }

    get passwordControl(): AbstractControl {
        return this.form.controls['password'];
    }

    get rememberMeControl(): AbstractControl {
        return this.form.controls['rememberMe'];
    }

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private errorHandlerService: ErrorHandlerService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            usernameOrEmail: ['', [Validators.required]],
            password: ['', [Validators.required]],
            rememberMe: [false],
        });

        this.form.valueChanges.subscribe(() => {
            if (this.usernameOrEmailControl.errors?.['loginFailed']) {
                delete this.usernameOrEmailControl.errors?.['loginFailed'];
                this.usernameOrEmailControl.updateValueAndValidity();
            }
            if (this.passwordControl.errors?.['loginFailed']) {
                delete this.passwordControl.errors?.['loginFailed'];
                this.passwordControl.updateValueAndValidity();
            }
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.isLoggingIn = true;
            this.authService.login(this.form.value).subscribe({
                next: () => {
                    this.router.navigate(['/home']);
                },
                error: (error: HttpErrorResponse) => {
                    this.isLoggingIn = false;
                    if (error.status === 401) {
                        this.usernameOrEmailControl.setErrors({ loginFailed: true }, { emitEvent: false });
                        this.passwordControl.setErrors({ loginFailed: true }, { emitEvent: false });
                    }
                    this.errorHandlerService.handle(error, 'Log in failed');
                },
            });
        }
    }
}
