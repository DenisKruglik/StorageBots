import {Point} from 'pixi.js';
import Robot from '../drawables/Robot';
import App from '../App';
import TaskStatus from './TaskStatus';
import Task from './Task';
import TransitionDirection from './TransitionDirection';
import Path from './Path';

class PathNode {
    point: Point;
    parent: PathNode | null = null;
    f = 0;
    g = 0;
    h = 0;

    constructor(parent: PathNode | null, point: Point) {
        this.parent = parent;
        this.point = point;
    }

    equals(obj: PathNode): boolean {
        return this.point.equals(obj.point);
    }
}

export default class Pathfinder {
    private app: App;

    private readonly valueToDirectionMapping = {
        'up': TransitionDirection.UP,
        'down': TransitionDirection.DOWN,
        'left': TransitionDirection.LEFT,
        'right': TransitionDirection.RIGHT,
    };

    private readonly adjacentPositions = [
        new Point(0, -1),
        new Point(0, 1),
        new Point(-1, 0),
        new Point(1, 0),
    ];

    private readonly directionToForbiddenAdjacentPositionMapping = {
        [TransitionDirection.UP]: new Point(0, 1),
        [TransitionDirection.DOWN]: new Point(0, -1),
        [TransitionDirection.LEFT]: new Point(1, 0),
        [TransitionDirection.RIGHT]: new Point(-1, 0),
        [TransitionDirection.STILL]: null,
    };

    constructor(app: App) {
        this.app = app;
    }

    guide(robot: Robot): void {
        const { start, target, status } = robot.task as Task;
        if (!robot.path) {
            let onArrive;
            let points;
            const obstacles = this.app.crates.map(item => new Point(item.cellX, item.cellY))
                .filter(item => !item.equals(start));
            switch (status) {
                case TaskStatus.GOING_FOR_LOAD:
                    onArrive = (): void => {
                        if (robot.task) {
                            robot.task.status = TaskStatus.TAKING_LOAD;
                            const crate = this.app.crates.find(item => (item.cellX === start.x) && (item.cellY === start.y));
                            const onTake = (): TaskStatus | null => robot.task ? (robot.task.status = TaskStatus.CARRYING_LOAD_TO_TARGET) : null;
                            if (crate) {
                                robot.take(crate, onTake);
                            }
                        }
                    };
                    points = this.aStar(new Point(robot.cellX, robot.cellY), start, obstacles);
                    break;
                case TaskStatus.CARRYING_LOAD_TO_TARGET:
                    onArrive = (): void => {
                        if (robot.task) {
                            robot.task.status = TaskStatus.WAITING;
                            const onWaitingFinished = (): TaskStatus | null => robot.task ? (robot.task.status = TaskStatus.CARRYING_LOAD_TO_START) : null;
                            robot.addLoadableAction(onWaitingFinished);
                        }
                    };
                    points = this.aStar(start, target, obstacles);
                    break;
                case TaskStatus.CARRYING_LOAD_TO_START:
                    onArrive = (): void => {
                        if (robot.task) {
                            robot.task.status = TaskStatus.PUTTING_LOAD;
                            const onPuttingFinished = (): void => {
                                robot.task = null;
                                const to = this.app.targetCells[Math.floor(Math.random() * this.app.targetCells.length)];
                                this.app.commander.addTask(start, to);
                            };
                            robot.put(onPuttingFinished);
                        }
                    };
                    points = this.aStar(target, start, obstacles);
                    break;
            }
            robot.path = points ? new Path(points, onArrive || ((): void => undefined)) : null;
        }
        const nextPoint = robot.path?.getNextPoint();
        if (nextPoint) {
            const forbiddenPoints = this.app.robots.map(item => {
                const currentPoint = new Point(item.cellX, item.cellY);
                const result = [currentPoint];
                if (item.direction !== TransitionDirection.STILL) {
                    const transitionVector = this.directionToForbiddenAdjacentPositionMapping[item.direction];
                    const pointFrom = new Point(currentPoint.x + transitionVector.x, currentPoint.y + transitionVector.y);
                    result.push(pointFrom);
                }
                return result;
            }).reduce((prev, curr) => [...prev, ...curr]);
            if (!forbiddenPoints.find(item => item.equals(nextPoint))) {
                robot.path?.follow(robot);
            }
        } else {
            robot.path?.follow(robot);
        }
    }

    private aStar(start: Point, end: Point, obstacles: Point[]): Point[] | null {
        const startNode = new PathNode(null, start);
        const endNode = new PathNode(null, end);
        const open: PathNode[] = [];
        const closed: PathNode[] = [];
        open.push(startNode);
        while (open.length) {
            let currentNode = open[0];
            let currentInd = 0;
            open.forEach((item, ind) => {
                if (item.f < currentNode.f) {
                    currentNode = item;
                    currentInd = ind;
                }
            });
            open.splice(currentInd, 1);
            closed.push(currentNode);
            if (currentNode.equals(endNode)) {
                const path = [];
                let current: PathNode | null = currentNode;
                while (current) {
                    path.unshift(current.point);
                    current = current.parent;
                }
                return path;
            }
            const children: PathNode[] = [];
            const currentPointDirection = this.getPointDirection(currentNode.point)
            const adjacentPositions = this.getAvailableAdjacentPositions(currentPointDirection);
            adjacentPositions.forEach(item => {
                const point = new Point(currentNode.point.x + item.x, currentNode.point.y + item.y);
                const pointDirection = this.getPointDirection(point);
                const pointForbiddenPosition = this.directionToForbiddenAdjacentPositionMapping[pointDirection];
                const transitionVector = new Point(point.x - currentNode.point.x, point.y - currentNode.point.y);
                if (pointForbiddenPosition && transitionVector.equals(pointForbiddenPosition)) {
                    return;
                }
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                if (point.x > (this.app.field?.cols - 1)
                    || point.x < 0
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    || point.y > (this.app.field?.rows - 1)
                    || point.y < 0
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    || obstacles.find(item => item.equals(point))) {
                    return;
                }
                const node = new PathNode(currentNode, point);
                children.push(node);
            });
            children.forEach(child => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                if (closed.find(item => item.equals(child))) {
                    return;
                }
                child.g = currentNode.g + 1;
                child.h = (Math.pow(child.point.x - endNode.point.x, 2) + Math.pow(child.point.y - endNode.point.y, 2));
                child.f = child.g + child.h;

                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                if (open.find(item => item.equals(child) && child.g > item.g)) {
                    return;
                }
                open.push(child);
            });
        }
        return null;
    }

    private getPointDirection(point: Point): TransitionDirection {
        const pointValue = this.app.mapPoints.find(item => item.x === point.x && item.y === point.y)?.value;
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        return this.valueToDirectionMapping[pointValue || ''] || TransitionDirection.STILL;
    }

    private getAvailableAdjacentPositions(direction: TransitionDirection): Point[] {
        const forbiddenPosition = this.directionToForbiddenAdjacentPositionMapping[direction];
        return forbiddenPosition !== null ? this.adjacentPositions.filter(item => !item.equals(forbiddenPosition)) : this.adjacentPositions;
    }
}