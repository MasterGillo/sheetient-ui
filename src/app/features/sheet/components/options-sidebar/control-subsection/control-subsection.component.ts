import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-control-subsection',
    templateUrl: './control-subsection.component.html',
    styleUrls: ['./control-subsection.component.scss'],
})
export class ControlSubsectionComponent {
    @Input() title: string;
}
