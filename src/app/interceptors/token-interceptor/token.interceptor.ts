import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if (req.url.includes('api/auth')) {
            return next.handle(req);
        }

        if (this.authService.accessTokenIsExpired) {
            if (!this.authService.isRefreshing) {
                return this.authService.refresh().pipe(
                    switchMap(() => {
                        return next.handle(this.includeAccessToken(req));
                    }),
                    catchError((error) => {
                        if (error.status == '403') {
                            this.authService.logout();
                        }
                        return throwError(() => error);
                    })
                );
            }
        }

        return next.handle(this.includeAccessToken(req));
    }

    private includeAccessToken(req: HttpRequest<unknown>): HttpRequest<unknown> {
        return req.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.authService.accessToken}`,
            },
        });
    }
}
