import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-spinner-button',
    templateUrl: './spinner-button.component.html',
    styleUrls: ['./spinner-button.component.scss'],
    standalone: false,
})
export class SpinnerButtonComponent {
    @Input() color: string;
    @Input() type: string;
    @Input() isSpinning: boolean;
}
