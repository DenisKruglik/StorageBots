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
    protected sprite: Sprite = new Sprite(this.getTexture());

    constructor(container: Container, cellX: number, cellY: number) {
        this.container = container;
        this._cellX = cellX;
        this._cellY = cellY;
    }

    protected abstract getTexture(): Texture;

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
        this.sprite.width = this.getWidth();
        this.sprite.height = this.getHeight();
        const offset = this.getOffset();
        this.sprite.x = this.cellX * Config.CELL_SIDE_LENGTH + offset;
        this.sprite.y = this.cellY * Config.CELL_SIDE_LENGTH + offset;
        this.container.addChild(this.sprite);
    }
}

export default StorageObject;