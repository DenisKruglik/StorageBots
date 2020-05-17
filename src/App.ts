import { Application, Loader, Point } from 'pixi.js';
import Config from './config';
import Field from './drawables/Field';
import Robot from './drawables/Robot';
import Commander from './logic/Commander';
import Crate from './drawables/Crate';
import Task from './logic/Task';
import Pathfinder from './logic/Pathfinder';

class App {
    get tasksCompleted(): number {
        return this._tasksCompleted;
    }
    set tasksCompleted(value: number) {
        this._tasksCompleted = value;
    }
    get field(): Field | undefined {
        return this._field;
    }

    set field(value: Field | undefined) {
        this._field = value;
    }
    readonly app: Application;
    private _field: Field | undefined;
    readonly commander = new Commander(this);
    private pathfinder = new Pathfinder(this);
    readonly targetCells: Point[] = [];
    readonly tasks: Task[] = [];
    readonly mapPoints: { x: number; y: number; value: string }[];
    readonly crossroads: Point[];
    readonly robots: Robot[] = [];
    readonly crates: Crate[] = [];
    private ticks = 0;
    private _tasksCompleted = 0;

    constructor() {
        this.app = new Application({
            width: window.innerWidth,
            height: window.innerHeight
        });
        this.app.stage.sortableChildren = true;
        this.app.renderer.view.style.position = 'absolute';
        this.app.renderer.view.style.display = 'block';
        this.mapPoints = Config.MAP.map(
            (row, y) => row.map((value, x) => ({ x, y, value }))
        ).reduce((prev, curr) => [...prev, ...curr]);
        this.crossroads = Config.CROSSROADS.map(item => new Point(item.x, item.y));
    }

    run(): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        document.body.appendChild(this.app.view);
        Loader.shared.add(Config.TEXTURES).load(this.setup);
    }

    private setup = (): void => {
        this.app.ticker.add(() => this.loop());
        const { fieldWidth, fieldHeight, targetCells, robots } = Config.INIT_DATA;
        this.commander.initField(fieldWidth, fieldHeight);
        const crates = this.mapPoints.filter(item => item.value === 'crate');
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
        this.ticks++;
        if (this.ticks % Config.MEASURE_INTERVAL === 0) {
            console.log({
                ticks: this.ticks,
                tasks: this._tasksCompleted,
                avgSpeed: this._tasksCompleted / this.ticks,
            });
        }
    }
}

export default App;