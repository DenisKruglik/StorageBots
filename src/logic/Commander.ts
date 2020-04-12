import App from '../App';
import Field from '../drawables/Field';

class Commander {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    initField(cols: number, rows: number) {
        const field = new Field(this.app.app.stage, cols, rows);
        field.draw();
        this.app.field = field;
    }
}

export default Commander;