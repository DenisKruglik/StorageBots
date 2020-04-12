import { Texture, Container } from 'pixi.js';

abstract class StorageObject implements Drawable {
    container: Container;

    constructor(container: Container) {
        this.container = container;
    }

    protected abstract getTexture(): Texture;

    abstract draw(): void;
}

export default StorageObject;