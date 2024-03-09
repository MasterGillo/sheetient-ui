import { Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ColourInputDialogComponent } from '../colour-input-dialog/colour-input-dialog.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay } from '@angular/cdk/overlay';
import { MatFormField } from '@angular/material/form-field';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Colour } from 'src/app/models/colour.type';
import { filter, first, merge, takeUntil } from 'rxjs';
import { UnsubscriberComponent } from '../../../shared/components/unsubscriber/unsubscriber.component';

@Component({
    selector: 'app-colour-input',
    templateUrl: './colour-input.component.html',
    styleUrls: ['./colour-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: ColourInputComponent,
        },
    ],
})
export class ColourInputComponent extends UnsubscriberComponent implements OnInit, ControlValueAccessor {
    @Input() label: string;

    @ViewChild('formField') formField: MatFormField;
    @ViewChild('input') input: ElementRef<HTMLInputElement>;

    onChange: (value: string) => void;
    onTouched: () => void;

    touched = false;

    disabled = false;

    formControl: FormControl;

    lastValidValue: string;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private overlay: Overlay
    ) {
        super();
    }

    ngOnInit(): void {
        this.formControl = new FormControl('', [
            Validators.required,
            Validators.pattern(/^[a-fA-F0-9]{3}(?:[a-fA-F0-9]{3})?$/),
        ]);
        this.formControl.valueChanges.subscribe((value: string) => {
            this.markAsTouched();
            if (this.formControl.valid) {
                this.onChange(value);
                this.lastValidValue = value;
            }
        });
    }

    writeValue(value: string): void {
        this.formControl.setValue(value, { emitEvent: false });
        if (this.formControl.valid) {
            this.lastValidValue = value;
        }
    }

    registerOnChange(onChange: (value: string) => void): void {
        this.onChange = onChange;
    }

    registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }

    markAsTouched() {
        if (!this.touched) {
            this.onTouched();
            this.touched = true;
        }
    }

    setDisabledState(disabled: boolean) {
        if (disabled) {
            this.formControl.disable({ emitEvent: false });
        } else {
            this.formControl.enable({ emitEvent: false });
        }
    }

    open() {
        this.markAsTouched();
        const portal = new ComponentPortal(ColourInputDialogComponent, this.viewContainerRef);
        const popupRef = this.overlay.create({
            hasBackdrop: true,
            width: '16.75rem',
            backdropClass: 'mat-overlay-transparent-backdrop',
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.overlay
                .position()
                .flexibleConnectedTo(this.formField.getConnectedOverlayOrigin())
                .withPositions([{ originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }]),
        });

        const popupComponentRef = popupRef.attach(portal);
        popupComponentRef.instance.colour = this.hexToRgb(this.lastValidValue);
        const colourSubscription = popupComponentRef.instance.colourChanged
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((colour: Colour) => {
                this.formControl.setValue(
                    colour.red.toString(16).padStart(2, '0') +
                        colour.green.toString(16).padStart(2, '0') +
                        colour.blue.toString(16).padStart(2, '0')
                );
            });
        this.input.nativeElement.blur();
        merge(
            popupRef.backdropClick(),
            popupRef.detachments(),
            popupRef.keydownEvents().pipe(
                filter((event: KeyboardEvent) => {
                    return event.key === 'Escape';
                })
            )
        )
            .pipe(first())
            .subscribe((event) => {
                if (event) {
                    event.preventDefault();
                }
                if (popupRef.hasAttached()) {
                    popupRef.detach();
                }
                if (portal.isAttached) {
                    portal.detach();
                }
                colourSubscription.unsubscribe();
                this.input.nativeElement.focus();
            });
    }

    hexToRgb(hex: string): Colour | null {
        const threeDigitRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const fullRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
        hex = hex.replace(threeDigitRegex, function (_, r, g, b) {
            return r + r + g + g + b + b;
        });

        const result = fullRegex.exec(hex);
        return result
            ? {
                  red: parseInt(result[1], 16),
                  green: parseInt(result[2], 16),
                  blue: parseInt(result[3], 16),
              }
            : null;
    }
}
