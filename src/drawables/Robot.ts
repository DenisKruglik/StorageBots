import StorageObject from './StorageObject';
import { Loader, Container } from 'pixi.js';

export default class Robot extends StorageObject{
    constructor(container: Container, cellX: number, cellY: number) {
        super(container, cellX, cellY);
    }

    protected getTexture(): PIXI.Texture {
        return Loader.shared.resources['robot'].texture;
    }
}