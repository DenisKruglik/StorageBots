import StorageObject from './StorageObject';
import { Loader } from 'pixi.js';
import TransitionDirection from '../logic/TransitionDirection';
import Config from '../config';
import Crate from './Crate';
import LoaderGraphic from '../graphics/Loader';

export default class Robot extends StorageObject{
    private direction: TransitionDirection = TransitionDirection.STILL;
    private load: Crate | null = null;
    private loader: LoaderGraphic | null = null;
    private onLoadingEnd: Function | null = null;

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
        this.proceedLoading();
    }

    private _take(crate: Crate) {
        this.load = crate;
        this.app.removeObject(crate);
        this.container.removeChild(crate.sprite);
        const sideLength = this.getWidth() * 2 - this.getOffset() * 2;
        this.sprite.addChild(crate.sprite);
        crate.sprite.y = -sideLength;
        crate.sprite.x = 0;
        crate.sprite.width = sideLength;
        crate.sprite.height = sideLength;
    }

    take(crate: Crate) {
        this.addLoadableAction(this._take.bind(this, crate));
    }

    private proceedLoading() {
        if (this.loader) {
            this.loader.setProgressAndRedraw(this.loader.progress + Config.LOADING_SPEED);
            if (this.loader.progress === 1) {
                if (this.onLoadingEnd) this.onLoadingEnd();
                this.sprite.removeChild(this.loader);
                this.onLoadingEnd = null;
                this.loader = null;
            }
        }
    }

    private _put() {
        if (this.load) {
            this.app.addObject(this.load);
            this.sprite.removeChild(this.load.sprite);
            this.load.cellX = this.cellX;
            this.load.cellY = this.cellY;
            this.load.draw();
            this.load = null;
        }
    }

    put() {
        if (this.load) {
            this.addLoadableAction(this._put.bind(this));
        }
    }

    private addLoadableAction(action: Function) {
        this.onLoadingEnd = action;
        this.loader = new LoaderGraphic();
        this.loader.x = this.getWidth() - this.getOffset();
        this.loader.y =  -Config.LOADER_RADIUS - Config.LOADER_OFFSET;
        this.sprite.addChild(this.loader);
    }
}