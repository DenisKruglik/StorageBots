import StorageObject from './StorageObject';
import { Loader } from 'pixi.js';
import TransitionDirection from '../logic/TransitionDirection';
import Config from '../config';
import Crate from './Crate';
import LoaderGraphic from '../graphics/Loader';
import Task from '../logic/Task';

export default class Robot extends StorageObject{
    get load(): Crate | null {
        return this._load;
    }

    get isBusy(): boolean {
        return this._isBusy;
    }

    set isBusy(value: boolean) {
        this._isBusy = value;
    }

    get task(): Task | null {
        return this._task;
    }

    set task(value: Task | null) {
        this._task = value;
    }

    private direction: TransitionDirection = TransitionDirection.STILL;
    private _load: Crate | null = null;
    private loader: LoaderGraphic | null = null;
    private onLoadingEnd: Function | null = null;
    private _task: Task | null = null;
    private _isBusy: boolean = false;

    protected getTexture(): PIXI.Texture {
        return Loader.shared.resources['robot'].texture;
    }

    go(direction: TransitionDirection) {
        this.direction = direction;
        switch (direction) {
            case TransitionDirection.UP:
                this.cellY--;
                this.isBusy = true;
                break;
            case TransitionDirection.DOWN:
                this.cellY++;
                this.isBusy = true;
                break;
            case TransitionDirection.LEFT:
                this.cellX--;
                this.isBusy = true;
                break;
            case TransitionDirection.RIGHT:
                this.cellX++;
                this.isBusy = true;
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
                    this.isBusy = false;
                } else {
                    this.sprite.y = resultY;
                }
                break;
            case TransitionDirection.DOWN:
                resultY = this.sprite.y + Config.ROBOTS_SPEED;
                if (resultY >= targetY) {
                    this.sprite.y = targetY;
                    this.direction = TransitionDirection.STILL;
                    this.isBusy = false;
                } else {
                    this.sprite.y = resultY;
                }
                break;
            case TransitionDirection.LEFT:
                resultX = this.sprite.x - Config.ROBOTS_SPEED;
                if (resultX <= targetX) {
                    this.sprite.x = targetX;
                    this.direction = TransitionDirection.STILL;
                    this.isBusy = false;
                } else {
                    this.sprite.x = resultX;
                }
                break;
            case TransitionDirection.RIGHT:
                resultX = this.sprite.x + Config.ROBOTS_SPEED;
                if (resultX >= targetX) {
                    this.sprite.x = targetX;
                    this.direction = TransitionDirection.STILL;
                    this.isBusy = false;
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
        this._load = crate;
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
                this.isBusy = false;
            }
        }
    }

    private _put() {
        if (this._load) {
            this.app.addObject(this._load);
            this.sprite.removeChild(this._load.sprite);
            this._load.cellX = this.cellX;
            this._load.cellY = this.cellY;
            this._load.draw();
            this._load = null;
        }
    }

    put() {
        if (this._load) {
            this.addLoadableAction(this._put.bind(this));
        }
    }

    private addLoadableAction(action: Function) {
        this.onLoadingEnd = action;
        this.loader = new LoaderGraphic();
        this.loader.x = this.getWidth() - this.getOffset();
        this.loader.y =  -Config.LOADER_RADIUS - Config.LOADER_OFFSET;
        this.sprite.addChild(this.loader);
        this.isBusy = true;
    }
}