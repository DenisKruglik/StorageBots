import * as PIXI from 'pixi.js';
import Config from './config';

export class App {
    private app: PIXI.Application;

    constructor() {
        this.app = new PIXI.Application({
            width: Config.CANVAS_WIDTH,
            height: Config.CANVAS_HEIGHT
        });
    }

    run(): void {
        document.body.appendChild(this.app.view);
        PIXI.Loader.shared.add(Config.TEXTURES).load(this.setup.bind(this));
    }

    private setup(): void {
        this.app.ticker.add(delta => this.loop(delta));
    }

    private loop(delta: number): void {
    }
}