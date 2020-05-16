import App from '../App';
import Field from '../drawables/Field';
import Robot from '../drawables/Robot';
import Crate from '../drawables/Crate';
import { Point } from 'pixi.js';
import Flag from '../drawables/Flag';
import TaskStatus from './TaskStatus';
import { shuffle } from '../utils/array';
import Task from './Task';

class Commander {
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    initField(cols: number, rows: number): Field {
        const field = new Field(this.app.app.stage, cols, rows);
        field.draw();
        this.app.field = field;
        return field;
    }

    addRobot(cellX: number, cellY: number): Robot {
        const robot = new Robot(this.app, this.app.app.stage, cellX, cellY);
        robot.draw();
        this.app.robots.push(robot);
        return robot;
    }

    addCrate(cellX: number, cellY: number): Crate {
        const crate = new Crate(this.app, this.app.app.stage, cellX, cellY);
        crate.draw();
        this.app.crates.push(crate);
        return crate;
    }

    addTargetCell(x: number, y: number): void {
        this.app.targetCells.push(new Point(x, y));
        const flag = new Flag(this.app, this.app.app.stage, x, y);
        flag.draw();
    }

    addTask(start: Point, target: Point): void {
        this.app.tasks.push(new Task(start, target, TaskStatus.GOING_FOR_LOAD));
    }

    generateAndAddTasks(): void {
        shuffle(this.app.crates).forEach(item => {
            const from = new Point(item.cellX, item.cellY);
            const to = this.app.targetCells[Math.floor(Math.random() * this.app.targetCells.length)];
            this.addTask(from, to);
        });
    }
}

export default Commander;