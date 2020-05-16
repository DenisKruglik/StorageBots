import { Point } from "pixi.js";

export default class PathNode {
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
