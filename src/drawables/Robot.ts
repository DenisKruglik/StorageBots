import StorageObject from './StorageObject';
import {Container, Loader} from 'pixi.js';
import TransitionDirection from '../logic/TransitionDirection';
import Config from '../config';

export default class Robot extends StorageObject{
    private direction: TransitionDirection = TransitionDirection.STILL;

    constructor(container: Container, cellX: number, cellY: number) {
        super(container, cellX, cellY);
    }

    protected getTexture(): PIXI.Texture {
        return Loader.shared.resources['robot'].texture;
    }

    go(direction: TransitionDirection) {
        this.direction = direction;
        switch (direction) {
            case TransitionDirection.UP:
                this.cellY--;
                break;
            case TransitionDirection.DOWN:
                this.cellY++;
                break;
            case TransitionDirection.LEFT:
                this.cellX--;
                break;
            case TransitionDirection.RIGHT:
                this.cellX++;
                break;
        }
    }

    goUp() {
        this.go(TransitionDirection.UP);
    }

    goDown() {
        this.go(TransitionDirection.DOWN);
    }

    goLeft() {
        this.go(TransitionDirection.LEFT);
    }

    goRight() {
        this.go(TransitionDirection.RIGHT);
    }

    private move() {
        let resultX, resultY;
        const targetY = this.cellY * Config.CELL_SIDE_LENGTH + this.getOffset();
        const targetX = this.cellX * Config.CELL_SIDE_LENGTH + this.getOffset();
        switch (this.direction) {
            case TransitionDirection.UP:
                resultY = this.sprite.y - Config.ROBOTS_SPEED;
                if (resultY <= targetY) {
                    this.sprite.y = targetY;
                    this.direction = TransitionDirection.STILL;
                } else {
                    this.sprite.y = resultY;
                }
                break;
            case TransitionDirection.DOWN:
                resultY = this.sprite.y + Config.ROBOTS_SPEED;
                if (resultY >= targetY) {
                    this.sprite.y = targetY;
                    this.direction = TransitionDirection.STILL;
                } else {
                    this.sprite.y = resultY;
                }
                break;
            case TransitionDirection.LEFT:
                resultX = this.sprite.x - Config.ROBOTS_SPEED;
                if (resultX <= targetX) {
                    this.sprite.x = targetX;
                    this.direction = TransitionDirection.STILL;
                } else {
                    this.sprite.x = resultX;
                }
                break;
            case TransitionDirection.RIGHT:
                resultX = this.sprite.x + Config.ROBOTS_SPEED;
                if (resultX >= targetX) {
                    this.sprite.x = targetX;
                    this.direction = TransitionDirection.STILL;
                } else {
                    this.sprite.x = resultX;
                }
                break;
        }
    }

    act() {
        this.move();
    }
}