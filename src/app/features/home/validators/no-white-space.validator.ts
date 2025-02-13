import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function NoWhiteSpaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const regEx = new RegExp(/\s/);
        const valid = !regEx.test(control.value);
        if (!valid) {
            control.markAsTouched();
            return { noWhiteSpace: true };
        }

        return null;
    };
}
