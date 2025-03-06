import { Page } from './page.model';

export class Sheet {
    id: number;
    name: string;
    description: string;
    pages: Page[];

    constructor(name: string, pageHeight: number, pageWidth: number) {
        this.name = name;
        this.pages = [new Page('Page 1', pageHeight, pageWidth, 1)];
    }
}
