import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function UsernameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const regEx = new RegExp(/[\w-._@+]+/g);
        const invalidCharacters = Array.from((control.value as string).replace(regEx, ''));
        if (invalidCharacters.length == 0) {
            return null;
        }

        control.markAsTouched();
        const uniqueInvalidCharacters = invalidCharacters.filter(
            (value: string, index: number, array: string[]) => array.indexOf(value) === index
        );
        return { username: { invalidCharacters: uniqueInvalidCharacters } };
    };
}
