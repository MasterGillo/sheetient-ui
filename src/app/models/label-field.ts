import { FieldType } from './field-type.enum';
import { FieldInterface } from './field.interface';

export class LabelField implements FieldInterface {
    x: number;
    y: number;
    width = 80;
    height = 20;

    type = FieldType.Label;
    text = 'Label';
}
