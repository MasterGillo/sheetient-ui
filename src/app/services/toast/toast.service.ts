import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private _snackBarRef: MatSnackBarRef<TextOnlySnackBar>;

    constructor(private snackBar: MatSnackBar) {}

    showErrorMessage(message: string, action?: string): void {
        this._snackBarRef = this.snackBar.open(message, action ?? 'Ok', {
            panelClass: ['snack-bar-error'],
            duration: 3000,
        });
    }

    dismissErrorMessage(): void {
        this._snackBarRef.dismiss();
    }
}
