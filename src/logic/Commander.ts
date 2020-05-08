import App from '../App';
import Field from '../drawables/Field';
import Robot from '../drawables/Robot';
import Crate from '../drawables/Crate';
import { Point } from 'pixi.js';
import Flag from '../drawables/Flag';

class Commander {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    initField(cols: number, rows: number) {
        const field = new Field(this.app.app.stage, cols, rows);
        field.draw();
        this.app.field = field;
        return field;
    }

    addRobot(cellX: number, cellY: number) {
        const robot = new Robot(this.app, this.app.app.stage, cellX, cellY);
        robot.draw();
        this.app.addObject(robot);
        return robot;
    }

    addCrate(cellX: number, cellY: number) {
        const crate = new Crate(this.app, this.app.app.stage, cellX, cellY);
        crate.draw();
        this.app.addObject(crate);
        return crate;
    }

    addTargetCell(x: number, y: number) {
        this.app.targetCells.push(new Point(x, y));
        const flag = new Flag(this.app, this.app.app.stage, x, y);
        flag.draw();
    }

    addTask(from: Point, to: Point) {
        this.app.tasks.push({ from ,to });
    }

    generateAndAddTasks() {
        this.app.crates.forEach(item => {
            const from = new Point(item.cellX, item.cellY);
            const to = this.app.targetCells[Math.floor(Math.random() * this.app.targetCells.length)];
            this.addTask(from, to);
        });
    }
}

export default Commander;