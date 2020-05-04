import { Application, Loader } from 'pixi.js';
import Config from './config';
import Field from './drawables/Field';
import Commander from './logic/Commander';

class App {
    get app(): PIXI.Application {
        return this._app;
    }
    get field(): Field {
        return this._field;
    }

    set field(value: Field) {
        this._field = value;
    }
    private _app: Application;
    private _field: Field;
    private commander: Commander;

    constructor() {
        this._app = new Application({
            width: Config.CANVAS_WIDTH,
            height: Config.CANVAS_HEIGHT
        });
        this.commander = new Commander(this);
        // this.app.renderer.view.style.position = 'absolute';
        // this.app.renderer.view.style.display = 'block';
        // this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    run(): void {
        // @ts-ignore
        document.body.appendChild(this._app.view);
        Loader.shared.add(Config.TEXTURES).load(this.setup);
    }

    private setup = () => {
        this._app.ticker.add(() => this.loop());
    }

    private loop(): void {
    }

}

export default App;