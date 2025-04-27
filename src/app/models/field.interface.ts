import { FieldType } from './field-type.enum';

export interface FieldInterface {
    type: FieldType;
    x: number;
    y: number;
    width: number;
    height: number;
}
