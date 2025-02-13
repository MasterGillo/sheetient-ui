import { Component, Input } from '@angular/core';
import { LabelField } from 'src/app/models/label-field';

@Component({
    selector: 'app-label-field',
    templateUrl: './label-field.component.html',
    styleUrls: ['./label-field.component.scss'],
})
export class LabelFieldComponent {
    @Input() labelField: LabelField;
}
