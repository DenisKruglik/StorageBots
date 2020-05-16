import {Point} from 'pixi.js';
import TaskStatus from './TaskStatus';

export default class Task {
    start: Point;
    target: Point;
    status: TaskStatus;

    constructor(start: Point, target: Point, status: TaskStatus) {
        this.start = start;
        this.target = target;
        this.status = status;
    }

    getCurrentTarget(): Point {
        switch (this.status) {
            case TaskStatus.GOING_FOR_LOAD:
            case TaskStatus.TAKING_LOAD:
            case TaskStatus.CARRYING_LOAD_TO_START:
            case TaskStatus.PUTTING_LOAD:
                return this.start;
            case TaskStatus.CARRYING_LOAD_TO_TARGET:
            case TaskStatus.WAITING:
                return this.target;
        }
    }
}