import { Point } from 'pixi.js';
import TransitionDirection from '../logic/TransitionDirection';

export function getOppositeDirection(direction: TransitionDirection): TransitionDirection {
    switch (direction) {
        case TransitionDirection.UP:
            return TransitionDirection.DOWN;
        case TransitionDirection.DOWN:
            return TransitionDirection.UP;
        case TransitionDirection.LEFT:
            return TransitionDirection.RIGHT;
        case TransitionDirection.RIGHT:
            return TransitionDirection.LEFT
        default:
            return TransitionDirection.STILL;
    }
}
