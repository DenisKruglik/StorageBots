import { Application, Loader } from 'pixi.js';
import Config from './config';
import Field from './drawables/Field';
import StorageObject from './drawables/StorageObject';

class App {
    get field(): Field | undefined {
        return this._field;
    }

    set field(value: Field | undefined) {
        this._field = value;
    }
    readonly app: Application;
    private _field: Field | undefined;
    private objects: StorageObject[] = [];

    constructor() {
        this.app = new Application({
            width: Config.CANVAS_WIDTH,
            height: Config.CANVAS_HEIGHT
        });
        // this.app.renderer.view.style.position = 'absolute';
        // this.app.renderer.view.style.display = 'block';
        // this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    run(): void {
        // @ts-ignore
        document.body.appendChild(this.app.view);
        Loader.shared.add(Config.TEXTURES).load(this.setup);
    }

    private setup = () => {
        this.app.ticker.add(() => this.loop());
    }

    private loop(): void {
    }

    addObject(obj: StorageObject) {
        this.objects.push(obj);
    }
}

export default App;