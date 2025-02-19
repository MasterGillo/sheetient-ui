import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { AccessTokenResponseDto } from 'src/app/models/auth/access-token-response-dto.interface';
import { LoginRequest } from 'src/app/models/auth/login-request.interface';
import { RegisterRequest } from 'src/app/models/auth/register-request.interface';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    isRefreshing: boolean;

    get accessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    get isLoggedIn(): boolean {
        return !!this.accessToken;
    }

    get accessTokenIsExpired(): boolean {
        if (this.accessToken) {
            const expiry = JSON.parse(atob(this.accessToken.split('.')[1])).exp;
            return Math.floor(new Date().getTime() / 1000) >= expiry;
        }
        return true;
    }

    constructor(
        private httpClient: HttpClient,
        private router: Router
    ) {}

    login(loginRequest: LoginRequest): Observable<AccessTokenResponseDto> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            withCredentials: true,
        };

        return this.httpClient
            .post<AccessTokenResponseDto>('http://localhost:5008/api/auth/login', loginRequest, httpOptions)
            .pipe(
                tap((response: AccessTokenResponseDto) => {
                    localStorage.setItem('accessToken', response.accessToken);
                })
            );
    }

    logout(): Observable<void> {
        localStorage.clear();
        this.router.navigate(['/home']);
        return this.httpClient.post<void>('http://localhost:5008/api/auth/logout', {});
    }

    refresh(): Observable<AccessTokenResponseDto | null> {
        this.isRefreshing = true;
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            withCredentials: true,
        };

        return this.httpClient
            .post<AccessTokenResponseDto>('http://localhost:5008/api/auth/refresh', '', httpOptions)
            .pipe(
                tap((response: AccessTokenResponseDto) => {
                    this.isRefreshing = false;
                    localStorage.setItem('accessToken', response.accessToken);
                }),
                catchError((error: HttpErrorResponse) => {
                    this.isRefreshing = false;
                    return throwError(() => error);
                })
            );
    }

    register(registerRequest: RegisterRequest): Observable<AccessTokenResponseDto> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            withCredentials: true,
        };

        return this.httpClient
            .post<AccessTokenResponseDto>('http://localhost:5008/api/auth/register', registerRequest, httpOptions)
            .pipe(
                tap((response: AccessTokenResponseDto) => {
                    localStorage.setItem('accessToken', response.accessToken);
                })
            );
    }
}
