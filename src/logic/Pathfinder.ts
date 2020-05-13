import {Point} from 'pixi.js';
import Robot from '../drawables/Robot';
import App from '../App';
import TaskStatus from './TaskStatus';
import Task from './Task';
import Config from '../config';
import TransitionDirection from './TransitionDirection';

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

    equals(obj: PathNode) {
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
        [TransitionDirection.UP]: new Point(0, -1),
        [TransitionDirection.DOWN]: new Point(0, 1),
        [TransitionDirection.LEFT]: new Point(1, 0),
        [TransitionDirection.RIGHT]: new Point(-1, 0),
        [TransitionDirection.STILL]: null,
    };

    constructor(app: App) {
        this.app = app;
    }

    guide(robot: Robot) {
        const { start, target, status } = robot.task as Task;
        switch (status) {
            case TaskStatus.GOING_FOR_LOAD:
                // TODO: implement
                break;
            case TaskStatus.CARRYING_LOAD_TO_TARGET:
                // TODO: implement
                break;
            case TaskStatus.CARRYING_LOAD_TO_START:
                // TODO: implement
                break;
        }
    }

    private aStar(start: Point, end: Point, obstacles: Point[]) {
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
                // @ts-ignore
                if (point.x > (this.app.field?.cols - 1)
                    || point.x < 0
                    // @ts-ignore
                    || point.y > (this.app.field?.rows - 1)
                    || point.y < 0
                    // @ts-ignore
                    || obstacles.find(item => item.equals(point))) {
                    return;
                }
                const node = new PathNode(currentNode, point);
                children.push(node);
            });
            children.forEach(child => {
                // @ts-ignore
                if (closed.find(item => item.equals(child))) {
                    return;
                }
                child.g = currentNode.g + 1;
                child.h = (Math.pow(child.point.x - endNode.point.x, 2) + Math.pow(child.point.y - endNode.point.y, 2));
                child.f = child.g + child.h;

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
        // @ts-ignore
        return this.valueToDirectionMapping[Config.MAP[point.y][point.x]] || TransitionDirection.STILL;
    }

    private getAvailableAdjacentPositions(direction: TransitionDirection) {
        const forbiddenPosition = this.directionToForbiddenAdjacentPositionMapping[direction];
        return forbiddenPosition !== null ? this.adjacentPositions.filter(item => !item.equals(forbiddenPosition)) : this.adjacentPositions;
    }
}