import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
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
    errorMessage: string;

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
        private router: Router,
        private toastService: ToastService
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
            this.errorMessage = '';
        });
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.isLoggingIn = true;
            this.errorMessage = '';
            this.authService.login(this.form.value).subscribe({
                next: () => {
                    this.router.navigate(['']);
                },
                error: (error: HttpErrorResponse) => {
                    this.isLoggingIn = false;
                    if (error.status === 0) {
                        this.errorMessage = 'Unknown problem connecting to server.';
                    } else if (error.status === 401) {
                        this.usernameOrEmailControl.setErrors({ loginFailed: true }, { emitEvent: false });
                        this.passwordControl.setErrors({ loginFailed: true }, { emitEvent: false });
                        this.errorMessage = error.error;
                    } else if (error.status === 403) {
                        this.errorMessage = error.error;
                    } else {
                        this.errorMessage = `${error.status} error. Login failed.`;
                    }
                },
            });
        }
    }
}
