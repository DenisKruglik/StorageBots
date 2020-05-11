import { Point } from 'pixi.js';
import TaskStatus from './TaskStatus';

export default interface Task {
    start: Point;
    target: Point;
    status: TaskStatus;
}