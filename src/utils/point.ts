import {Point} from "pixi.js";
import TransitionDirection from '../logic/TransitionDirection';

const transitionVectorToDirectionMapping = new Map([
    [new Point(0, -1), TransitionDirection.UP],
    [new Point(0, 1), TransitionDirection.DOWN],
    [new Point(-1, 0), TransitionDirection.LEFT],
    [new Point(1, 0), TransitionDirection.RIGHT],
]);

export function getDirectionByTransitionVector(transitionVector: Point): TransitionDirection {
    for (const [key, value] of Array.from(transitionVectorToDirectionMapping)) {
        if (transitionVector.equals(key)) {
            return value;
        }
    }
    return TransitionDirection.STILL;
}
