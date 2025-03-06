export class Page {
    id: number;
    name: string;
    colour = 'ffffff';
    height = 1123;
    width = 794;
    showGrid = false;
    gridColour = '000000';
    gridSpacingX = 20;
    gridSpacingY = 20;
    order = 1;

    constructor(name: string, height: number, width: number, order: number) {
        this.name = name;
        this.height = height;
        this.width = width;
        this.order = order;
    }
}
