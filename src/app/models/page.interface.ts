import { GridInterface } from './grid.interface';

export interface PageInterface {
    id: number;
    name: string;
    colour: string;
    height: number;
    width: number;
    order: number;
    grid: GridInterface;
}
