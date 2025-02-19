import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../shared/components/toast/toast.component';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private _snackBar = inject(MatSnackBar);

    showMessage(message: string, icon: string, color: string = 'accent'): void {
        this._snackBar.openFromComponent(ToastComponent, {
            data: { message: message, icon: icon, color: color },
            duration: 5000,
            panelClass: 'toast-container-' + color,
        });
    }

    showInfoMessage(message: string): void {
        this.showMessage(message, 'info_outline', 'accent');
    }

    showErrorMessage(message: string): void {
        this.showMessage(message, 'error_outline', 'warn');
    }
}
