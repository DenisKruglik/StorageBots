import { Texture, Container, Sprite } from 'pixi.js';
import Config from '../config';
import App from '../App';

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
    protected app: App;
    readonly sprite: Sprite = new Sprite(this.getTexture());

    constructor(app: App, container: Container, cellX: number, cellY: number) {
        this.app = app;
        this.container = container;
        this._cellX = cellX;
        this._cellY = cellY;
    }

    protected abstract getTexture(): Texture;

    getWidth(): number {
        return Config.CELL_SIDE_LENGTH - this.getOffset() * 2;
    }

    getHeight(): number {
        return Config.CELL_SIDE_LENGTH - this.getOffset() * 2;
    }

    getOffset(): number {
        return Config.DEFAULT_STORAGE_OBJECT_OFFSET;
    }

    protected getZIndex(): number {
        return 2;
    }

    draw(): void {
        this.sprite.width = this.getWidth();
        this.sprite.height = this.getHeight();
        const offset = this.getOffset();
        this.sprite.x = this.cellX * Config.CELL_SIDE_LENGTH + offset;
        this.sprite.y = this.cellY * Config.CELL_SIDE_LENGTH + offset;
        this.sprite.zIndex = this.getZIndex();
        this.container.addChild(this.sprite);
    }
}

export default StorageObject;