import { Graphics } from 'pixi.js';
import Config from '../config';

export default class Loader extends Graphics {
    get progress(): number {
        return this._progress;
    }
    private _progress = 0;

    constructor() {
        super();
        this.redraw();
    }

    setProgressAndRedraw(progress: number) {
        this._progress = progress < 1 ? progress : 1;
        this.redraw();
    }

    private redraw() {
        this.clear();
        if (this._progress) {
            this.beginFill(0x00ff00);
            this.arc(0, 0, Config.LOADER_RADIUS, -Math.PI / 2, (-Math.PI / 2) + (Math.PI * 2 * this._progress));
            this.lineTo(0, 0);
            this.closePath();
            this.endFill();
        }
    }
}
