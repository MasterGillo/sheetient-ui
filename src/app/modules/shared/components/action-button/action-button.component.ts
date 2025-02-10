import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'app-action-button',
    templateUrl: './action-button.component.html',
    styleUrls: ['./action-button.component.scss'],
    standalone: false,
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
