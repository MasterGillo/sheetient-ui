import { FieldType } from './field-type.enum';
import { FieldInterface } from './field.interface';

export interface TextInputInterface extends FieldInterface {
    type: FieldType.TextInput;
    labelText: string;
}
