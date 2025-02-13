import { NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { NoWhiteSpaceValidator } from 'src/app/features/home/validators/no-white-space.validator';
import { UsernameValidator } from 'src/app/features/home/validators/username.validator';
import { IdentityError } from 'src/app/models/identity-error.interface';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.service';
import { SpinnerButtonComponent } from '../../../../shared/components/spinner-button/spinner-button.component';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
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
        SpinnerButtonComponent,
    ],
})
export class RegisterComponent implements OnInit {
    @Output() signingUp = new EventEmitter<boolean>();

    private _isSigningUp = false;
    get isSigningUp(): boolean {
        return this._isSigningUp;
    }
    private set isSigningUp(value: boolean) {
        this.signingUp.emit(value);
        this._isSigningUp = value;
    }

    hidePassword = true;
    form: FormGroup;

    get usernameControl(): AbstractControl {
        return this.form.controls['username'];
    }

    get emailControl(): AbstractControl {
        return this.form.controls['email'];
    }

    get passwordControl(): AbstractControl {
        return this.form.controls['password'];
    }

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toastService: ToastService
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            username: this.formBuilder.control('', {
                validators: [NoWhiteSpaceValidator(), UsernameValidator()],
                updateOn: 'change',
            }),
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    addUsernameValidators(): void {
        this.usernameControl.setValidators([
            Validators.required,
            NoWhiteSpaceValidator(),
            UsernameValidator(),
            Validators.minLength(6),
        ]);
        this.usernameControl.updateValueAndValidity();
    }

    onSubmit(): void {
        if (this.usernameControl.valid) {
            this.addUsernameValidators();
        }

        if (this.form.valid) {
            this.isSigningUp = true;
            this.authService.register(this.form.value).subscribe({
                next: () => {
                    this.router.navigate(['']);
                },
                error: (error: HttpErrorResponse) => {
                    this.isSigningUp = false;
                    if (error.status == 0) {
                        this.toastService.showErrorMessage('Unknown problem connecting to server.');
                    } else if (error.status == 409) {
                        const errorList = JSON.parse(error.error) as IdentityError[];
                        errorList.forEach((error: IdentityError) => {
                            if (error.Code === 'DuplicateUserName') {
                                this.usernameControl.setErrors(
                                    { registerFailed: error.Description },
                                    { emitEvent: false }
                                );
                            }
                            if (error.Code === 'DuplicateEmail') {
                                this.emailControl.setErrors(
                                    { registerFailed: error.Description },
                                    { emitEvent: false }
                                );
                            }
                        });
                    } else {
                        this.toastService.showErrorMessage(error.error);
                    }
                },
            });
        }
    }

    getControlErrorMessage(control: AbstractControl): string {
        if (control.errors) {
            const firstError = Object.keys(control.errors)[0];
            switch (firstError) {
                case 'required': {
                    return 'Required field.';
                }
                case 'minlength': {
                    const requiredLength = control.errors[firstError].requiredLength;
                    return `Must be at least ${requiredLength} characters.`;
                }
                case 'email': {
                    return 'Must be a valid email address.';
                }
                case 'username': {
                    const invalidCharacters: Array<string> = control.errors[firstError].invalidCharacters;
                    return `Invalid characters: '${invalidCharacters.join(",' '")}'.`;
                }
                case 'noWhiteSpace': {
                    return 'No spaces allowed.';
                }
                case 'registerFailed': {
                    return control.errors[firstError];
                }
            }
        }
        return '';
    }
}
