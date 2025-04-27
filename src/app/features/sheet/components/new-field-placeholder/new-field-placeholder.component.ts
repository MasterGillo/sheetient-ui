import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import { Field } from 'src/app/models/field.type';
import { FieldComponent } from '../fields/field/field.component';

@Component({
    selector: 'app-new-field-placeholder',
    imports: [FieldComponent],
    templateUrl: './new-field-placeholder.component.html',
    styleUrl: './new-field-placeholder.component.scss',
})
export class NewFieldPlaceholderComponent implements OnChanges {
    @Input() field: Field;
    @Input() position: { top: number; left: number };
    @Input() isVisible: boolean;

    constructor(private elementRef: ElementRef) {}

    ngOnChanges(): void {
        this.elementRef.nativeElement.style.visibility = this.isVisible ? 'visible' : 'hidden';
        this.elementRef.nativeElement.style.left = `${this.position.left}px`;
        this.elementRef.nativeElement.style.top = `${this.position.top}px`;
    }
}
