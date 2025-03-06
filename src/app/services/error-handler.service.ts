import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlerService {
    constructor(private toastService: ToastService) {}

    handle(error: HttpErrorResponse, message?: string): void {
        console.error(error);
        const errorMessage =
            (message ? message + ': ' : '') +
            (typeof error.error == 'string' ? error.error : this.getErrorMessage(error.status));
        this.toastService.showErrorMessage(errorMessage);
    }

    private getErrorMessage(statusCode: number): string {
        switch (statusCode) {
            case 403:
                return "You aren't allowed to do this.";
            case 404:
                return "This doesn't seem to exist.";
            default:
                return 'Something unexpected went wrong.';
        }
    }
}
