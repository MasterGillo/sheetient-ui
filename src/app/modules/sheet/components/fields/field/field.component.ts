import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { FieldType } from 'src/app/models/field-type.enum';
import { Field } from 'src/app/models/field.type';

@Component({
    selector: 'app-field',
    templateUrl: './field.component.html',
    styleUrls: ['./field.component.scss'],
    standalone: false,
})
export class FieldComponent implements OnInit {
    @Input() field: Field;

    get fieldType(): typeof FieldType {
        return FieldType;
    }

    constructor(private elementRef: ElementRef) {}

    ngOnInit(): void {
        this.elementRef.nativeElement.style.left = this.field.x + 'px';
        this.elementRef.nativeElement.style.top = this.field.y + 'px';
        this.elementRef.nativeElement.style.height = this.field.height + 'px';
        this.elementRef.nativeElement.style.width = this.field.width + 'px';
    }
}
