import { Texture, Container, Sprite } from 'pixi.js';
import Config from '../config';

abstract class StorageObject implements Drawable {
    get cellY(): number {
        return this._cellY;
    }

    set cellY(value: number) {
        this._cellY = value;
    }

    get cellX(): number {
        return this._cellX;
    }

    set cellX(value: number) {
        this._cellX = value;
    }
    container: Container;
    private _cellX: number;
    private _cellY: number;

    constructor(container: Container, cellX: number, cellY: number) {
        this.container = container;
        this._cellX = cellX;
        this._cellY = cellY;
    }

    protected abstract getTexture(): Texture;

    protected getX(): number {
        return this.cellX;
    }

    protected getY(): number {
        return this.cellY;
    }

    protected getWidth(): number {
        return Config.CELL_SIDE_LENGTH - this.getOffset() * 2;
    }

    protected getHeight(): number {
        return Config.CELL_SIDE_LENGTH - this.getOffset() * 2;
    }

    protected getOffset(): number {
        return Config.DEFAULT_STORAGE_OBJECT_OFFSET;
    }

    draw(): void {
        const sprite = new Sprite(this.getTexture());
        sprite.width = this.getWidth();
        sprite.height = this.getHeight();
        const offset = this.getOffset();
        sprite.x = this.getX() + offset;
        sprite.y = this.getY() + offset;
        this.container.addChild(sprite);
    }
}

export default StorageObject;