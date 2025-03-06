import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Page } from 'src/app/models/page.model';

@Component({
    selector: 'app-page',
    imports: [NgIf],
    templateUrl: './page.component.html',
    styleUrl: './page.component.scss',
})
export class PageComponent {
    @Input() page: Page;
}
