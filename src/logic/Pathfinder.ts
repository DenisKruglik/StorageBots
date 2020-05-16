import {Point} from 'pixi.js';
import Robot from '../drawables/Robot';
import App from '../App';
import TaskStatus from './TaskStatus';
import Task from './Task';
import TransitionDirection from './TransitionDirection';
import Path from './Path';
import { getOppositeDirection } from '../utils/direction'
import { getDirectionByTransitionVector } from '../utils/point';
import Lock from './Lock';
import PathNode from './PathNode';

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

    private locks: Lock[] = [];

    constructor(app: App) {
        this.app = app;
    }

    guide(robot: Robot): void {
        if (!robot.path) {
            const path = this.buildPath(robot);
            robot.path = path || robot.path;
        }
        const nextPoint = robot.path?.getNextPoint();
        if (nextPoint) {
            const lockedPoints = this.locks.filter(item => item.addedBy !== robot.getId())
                .map(item => item.point);``
            const forbiddenPoints = [...this.app.robots.map(item => {
                const currentPoint = new Point(item.cellX, item.cellY);
                const result = [currentPoint];
                if (item.direction !== TransitionDirection.STILL) {
                    const transitionVector = this.directionToForbiddenAdjacentPositionMapping[item.direction];
                    const pointFrom = new Point(currentPoint.x + transitionVector.x, currentPoint.y + transitionVector.y);
                    result.push(pointFrom);
                }
                return result;
            }).reduce((prev, curr) => [...prev, ...curr]), ...lockedPoints];
            const isCrossroads = this.isCrossroads(nextPoint);
            if (!forbiddenPoints.find(item => item.equals(nextPoint)) && !isCrossroads) {
                this.unlockCellsByRobot(robot);
                robot.path?.follow(robot);
            } else if (isCrossroads) {
                if (this.hasLockFor(nextPoint, robot)) {
                    robot.path?.follow(robot);
                    return;
                }
                let currentPoint: PIXI.Point | undefined = nextPoint;
                let isCurrentPointCrossroads: boolean = isCrossroads;
                const pointsToLock = [];
                while (isCurrentPointCrossroads) {
                    if (forbiddenPoints.find(item => currentPoint?.equals(item))) {
                        return;
                    }
                    currentPoint && pointsToLock.push(currentPoint);
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    currentPoint = robot.path?.getPointAfter(currentPoint);
                    isCurrentPointCrossroads = currentPoint ? this.isCrossroads(currentPoint) : false;
                }
                if (!currentPoint || !forbiddenPoints.find(item => currentPoint?.equals(item))) {
                    currentPoint && pointsToLock.push(currentPoint);
                    this.lockCells(pointsToLock, robot);
                    robot.path?.follow(robot);
                }
            } else {
                const transitionVector = new Point(nextPoint.x - robot.cellX, nextPoint.y - robot.cellY);
                const direction = getDirectionByTransitionVector(transitionVector);
                const pathBlockingRobot = this.app.robots.find(item => nextPoint.equals(new Point(item.cellX, item.cellY)));
                if (pathBlockingRobot) {
                    const pathBlockingRobotNextPoint = pathBlockingRobot.path?.getNextPoint();
                    if (pathBlockingRobotNextPoint) {
                        const pathBlockingRobotTransitionVector = new Point(
                            pathBlockingRobotNextPoint.x - pathBlockingRobot.cellX,
                            pathBlockingRobotNextPoint.y - pathBlockingRobot.cellY
                        );
                        const pathBlockingRobotDirection = getDirectionByTransitionVector(pathBlockingRobotTransitionVector);
                        if (direction === getOppositeDirection(pathBlockingRobotDirection)) {
                            const newPath = this.buildPath(robot, [nextPoint]);
                            robot.path = newPath || robot.path;
                        }
                    }
                }
            }
        } else {
            robot.path?.follow(robot);
        }
    }

    private buildPath(robot: Robot, extraObstacles: Point[] = []): Path | null {
        const { start, target, status } = robot.task as Task;
        let onArrive;
        let points;
        const obstacles = [...this.app.mapPoints
            .filter(item => item.value === 'crate')
            .map(item => new Point(item.x, item.y))
            .filter(item => !item.equals(start)), ...extraObstacles];
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
                points = this.aStar(new Point(robot.cellX, robot.cellY), target, obstacles);
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
                points = this.aStar(new Point(robot.cellX, robot.cellY), start, obstacles);
                break;
        }
        return points ? new Path(points, onArrive || ((): void => undefined)) : null;
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

    private isCrossroads(point: Point): boolean {
        return !!this.app.crossroads.find(item => item.equals(point));
    }

    private lockCells(cells: Point[], robot: Robot): void {
        this.locks.push(...cells.map(item => ({
            addedBy: robot.getId(),
            point: item,
        })));
    }

    private unlockCellsByRobot(robot: Robot): void {
        this.locks
            .filter(item => item.addedBy === robot.getId())
            .forEach(item => this.locks.splice(this.locks.indexOf(item), 1));
    }

    private hasLockFor(point: Point, robot: Robot): boolean {
        return !!this.locks.find(item => item.addedBy === robot.getId() && point.equals(item.point));
    }
}
