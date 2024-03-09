import { FieldType } from './field-type.enum';

export interface FieldInterface {
    pageId: number;
    type: FieldType;
    x: number;
    y: number;
    width: number;
    height: number;
}
