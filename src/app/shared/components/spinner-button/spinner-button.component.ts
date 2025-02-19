import { NgIf } from '@angular/common';
import { AfterViewInit, Component, ContentChild, ElementRef, Input, OnChanges } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-spinner-button',
    templateUrl: './spinner-button.component.html',
    styleUrls: ['./spinner-button.component.scss'],
    imports: [NgIf, MatProgressSpinner],
})
export class SpinnerButtonComponent implements AfterViewInit, OnChanges {
    @Input() isSpinning: boolean;
    @Input() color: string;
    @ContentChild('button', { read: ElementRef }) button: ElementRef;

    ngAfterViewInit(): void {
        this.updateButtonState();
    }

    ngOnChanges(): void {
        this.updateButtonState();
    }

    private updateButtonState(): void {
        if (this.button) {
            this.button.nativeElement.disabled = this.isSpinning;
        }
    }
}
