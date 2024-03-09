import { FieldType } from './field-type.enum';
import { FieldInterface } from './field.interface';

export class LabelField implements FieldInterface {
    pageId: number;
    x: number;
    y: number;
    width = 80;
    height = 20;

    type = FieldType.Label;
    text = 'Label';

    constructor(pageId: number) {
        this.pageId = pageId;
    }
}
