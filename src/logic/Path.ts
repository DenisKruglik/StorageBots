import { Point } from 'pixi.js';
import Robot from '../drawables/Robot';
import { getDirectionByTransitionVector } from '../utils/point';

export default class Path {
    private readonly points: Point[];
    private readonly onArrive: Function;
    private currentPointIndex = 0;

    constructor(points: Point[], onArrive: Function) {
        this.points = points;
        this.onArrive = onArrive;
    }

    follow(robot: Robot): void {
        if (this.currentPointIndex === (this.points.length - 1)) {
            this.onArrive();
            robot.path = null;
        }
        const currentPoint = this.points[this.currentPointIndex];
        const nextPoint = this.getNextPoint();
        if (!nextPoint) {
            return;
        }
        const transitionVector = new Point(nextPoint.x - currentPoint.x, nextPoint.y - currentPoint.y);
        const direction = getDirectionByTransitionVector(transitionVector);
        robot.go(direction);
        this.currentPointIndex++;
    }

    getNextPoint(): Point | null {
        return this.points[this.currentPointIndex + 1] || null;
    }

    getPointAfter(point: Point): Point {
        return this.points[this.points.indexOf(point) + 1] || null;
    }
}