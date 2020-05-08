import StorageObject from './StorageObject';
import { Loader } from 'pixi.js';

export default class Flag extends StorageObject {
    protected getTexture(): PIXI.Texture {
        return Loader.shared.resources['finish'].texture;
    }
}