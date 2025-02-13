import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-action-button',
    templateUrl: './action-button.component.html',
    styleUrls: ['./action-button.component.scss'],
    imports: [NgIf, MatButton],
})
export class ActionButtonComponent implements AfterViewInit {
    @Input() color = 'accent';
    @Input() type = 'button';
    @Input() disabled = false;
    @Input() appearance: 'flat' | 'raised';

    @ViewChild('transcludedContainerRef') transcludedContainerRef: ElementRef | undefined;

    buttonText: string;

    ngAfterViewInit(): void {
        setTimeout(() => (this.buttonText = this.transcludedContainerRef?.nativeElement.innerText));
    }
}
