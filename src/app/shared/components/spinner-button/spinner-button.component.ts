import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActionButtonComponent } from '../action-button/action-button.component';

@Component({
    selector: 'app-spinner-button',
    templateUrl: './spinner-button.component.html',
    styleUrls: ['./spinner-button.component.scss'],
    imports: [NgIf, MatProgressSpinner, ActionButtonComponent],
})
export class SpinnerButtonComponent {
    @Input() color: string;
    @Input() type: string;
    @Input() isSpinning: boolean;
}
