import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Colour } from 'src/app/models/colour.type';

@Component({
    selector: 'app-colour-input-dialog',
    templateUrl: './colour-input-dialog.component.html',
    styleUrls: ['./colour-input-dialog.component.scss'],
})
export class ColourInputDialogComponent implements OnInit {
    @Input() colour: Colour | null;

    @Output() colourChanged = new EventEmitter<Colour>();

    form: FormGroup;

    get redControlValue(): number {
        return this.form.get('red')?.value;
    }
    get greenControlValue(): number {
        return this.form.get('green')?.value;
    }
    get blueControlValue(): number {
        return this.form.get('blue')?.value;
    }

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            red: [this.colour?.red, [Validators.required, Validators.min(0), Validators.max(255)]],
            green: [this.colour?.green, [Validators.required, Validators.min(0), Validators.max(255)]],
            blue: [this.colour?.blue, [Validators.required, Validators.min(0), Validators.max(255)]],
        });

        this.form.valueChanges.subscribe((formValue) => {
            if (this.form.valid) {
                this.colourChanged.emit(formValue);
            }
        });
    }
}
