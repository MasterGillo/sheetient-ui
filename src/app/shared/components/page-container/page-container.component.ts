import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
    selector: 'app-page-container',
    imports: [MatButton, LoaderComponent, NgIf, MatIconButton, MatIcon],
    templateUrl: './page-container.component.html',
    styleUrl: './page-container.component.scss',
})
export class PageContainerComponent {
    @Input() pageHeader?: string;
    @Input() isLoading: boolean;
    @Input() showBackButton: boolean;
    @Output() backButtonClick = new EventEmitter<void>();

    constructor(private authService: AuthService) {}

    logOutClick(): void {
        this.authService.logout().subscribe();
    }
}
