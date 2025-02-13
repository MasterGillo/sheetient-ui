import { Component, EventEmitter, Output } from '@angular/core';
import { FieldType } from 'src/app/models/field-type.enum';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatActionList, MatListItem } from '@angular/material/list';

@Component({
    selector: 'app-field-list-dialog',
    templateUrl: './field-list-dialog.component.html',
    styleUrls: ['./field-list-dialog.component.scss'],
    imports: [
        MatCard,
        MatCardContent,
        MatActionList,
        MatListItem,
    ],
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
