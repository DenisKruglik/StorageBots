import App from '../App';
import Field from '../drawables/Field';
import Robot from '../drawables/Robot';

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

    addRobot(cellX: number, cellY: number) {
        const robot = new Robot(this.app.app.stage, cellX, cellY);
        robot.draw();
        this.app.addObject(robot);
    }
}

export default Commander;