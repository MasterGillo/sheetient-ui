import { Component, EventEmitter, Output } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatActionList, MatListItem } from '@angular/material/list';
import { FieldType } from 'src/app/models/field-type.enum';

@Component({
    selector: 'app-field-list-dialog',
    templateUrl: './field-list-dialog.component.html',
    styleUrls: ['./field-list-dialog.component.scss'],
    imports: [MatCard, MatCardContent, MatActionList, MatListItem],
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
