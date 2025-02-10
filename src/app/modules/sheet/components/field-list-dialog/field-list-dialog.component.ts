import { Component, EventEmitter, Output } from '@angular/core';
import { FieldType } from 'src/app/models/field-type.enum';

@Component({
    selector: 'app-field-list-dialog',
    templateUrl: './field-list-dialog.component.html',
    styleUrls: ['./field-list-dialog.component.scss'],
    standalone: false,
})
export class FieldListDialogComponent {
    @Output() addNewField = new EventEmitter<FieldType>();

    get fieldType(): typeof FieldType {
        return FieldType;
    }

    fieldClick(type: FieldType): void {
        this.addNewField.emit(type);
    }
}
