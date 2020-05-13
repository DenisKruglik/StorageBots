import { Point } from 'pixi.js';
import Robot from '../drawables/Robot';

export default class Path {
    private points: Point[];
    private onArrive: Function;

    constructor(points: Point[], onArrive: Function) {
        this.points = points;
        this.onArrive = onArrive;
    }

    follow(robot: Robot) {

    }
}