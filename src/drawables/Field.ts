import { Container, Graphics } from 'pixi.js';
import Config from '../config';

class Field implements Drawable {
    container: Container;
    readonly cols: number;
    readonly rows: number;

    constructor(container: Container, cols: number, rows: number) {
        this.container = container;
        this.cols = cols;
        this.rows = rows;
    }

    draw(): void {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const rectangle = new Graphics();
                rectangle.lineStyle(Config.CELL_BORDER_SIZE, Config.CELL_BORDER_COLOR, 1);
                rectangle.beginFill(Config.CELL_COLOR);
                rectangle.drawRect(0, 0, Config.CELL_SIDE_LENGTH, Config.CELL_SIDE_LENGTH);
                rectangle.endFill();
                rectangle.x = j * Config.CELL_SIDE_LENGTH;
                rectangle.y = i * Config.CELL_SIDE_LENGTH;
                rectangle.zIndex = 1;
                this.container.addChild(rectangle);
            }
        }
    }
}

export default Field;