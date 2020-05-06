import StorageObject from './StorageObject';
import { Loader } from 'pixi.js';

export default class Crate extends StorageObject {
    protected getTexture(): PIXI.Texture {
        return Loader.shared.resources['crate'].texture;
    }

}
