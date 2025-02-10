export class Page {
    id: number;
    name: string;
    colour = 'ffffff';
    height = 1123;
    width = 794;
    order = 0;

    constructor(name: string, height: number, width: number) {
        this.name = name;
        this.height = height;
        this.width = width;
    }
}
