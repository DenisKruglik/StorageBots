import { Application, Loader, Point } from 'pixi.js';
import Config from './config';
import Field from './drawables/Field';
import StorageObject from './drawables/StorageObject';
import Robot from './drawables/Robot';
import Commander from './logic/Commander';
import Crate from './drawables/Crate';
import Task from './logic/Task';
import Pathfinder from './logic/Pathfinder';

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
    private commander = new Commander(this);
    private pathfinder = new Pathfinder(this);
    readonly targetCells: Point[] = [];
    readonly tasks: Task[] = [];
    get robots(): Robot[] {
        return this.objects.filter(item => item instanceof Robot) as Robot[];
    }
    get crates(): Crate[] {
        return this.objects.filter(item => item instanceof Crate) as Crate[];
    }

    constructor() {
        this.app = new Application({
            width: window.innerWidth,
            height: window.innerHeight
        });
        this.app.renderer.view.style.position = 'absolute';
        this.app.renderer.view.style.display = 'block';
    }

    run(): void {
        // @ts-ignore
        document.body.appendChild(this.app.view);
        Loader.shared.add(Config.TEXTURES).load(this.setup);
    }

    private setup = () => {
        this.app.ticker.add(() => this.loop());
        const { fieldWidth, fieldHeight, targetCells, robots } = Config.INIT_DATA;
        this.commander.initField(fieldWidth, fieldHeight);
        const mapPoints = Config.MAP.map(
            (row, y) => row.map((value, x) => ({ x, y, value }))
        ).reduce((prev, curr) => [...prev, ...curr]);
        const crates = mapPoints.filter(item => item.value === 'crate');
        targetCells.forEach(item => this.commander.addTargetCell(item.x, item.y));
        crates.forEach(item => this.commander.addCrate(item.x, item.y));
        this.commander.generateAndAddTasks();
        robots.forEach(item => this.commander.addRobot(item.x, item.y));
    }

    private loop(): void {
        this.robots.forEach(robot => {
            if (!robot.task && this.tasks.length) {
                robot.task = this.tasks.shift() as Task;
            }
            if (robot.task && !robot.isBusy) {
                this.pathfinder.guide(robot);
            }
            robot.act()
        });
    }

    addObject(obj: StorageObject) {
        this.objects.push(obj);
    }

    removeObject(obj: StorageObject) {
        const ind = this.objects.indexOf(obj);
        if (ind > -1) {
            this.objects.splice(ind, 1)
        }
    }
}

export default App;