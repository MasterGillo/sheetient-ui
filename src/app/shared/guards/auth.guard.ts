import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

export const AUTH_GUARD = () => {
    const authService = inject(AuthService);
    if (authService.isLoggedIn) {
        return true;
    } else {
        return false;
    }
};
