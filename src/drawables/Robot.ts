import StorageObject from './StorageObject';
import { Loader } from 'pixi.js';
import TransitionDirection from '../logic/TransitionDirection';
import Config from '../config';
import Crate from './Crate';
import LoaderGraphic from '../graphics/Loader';
import Task from '../logic/Task';
import Path from '../logic/Path';

export default class Robot extends StorageObject{
    get direction(): TransitionDirection {
        return this._direction;
    }
    get path(): Path | null {
        return this._path;
    }

    set path(value: Path | null) {
        this._path = value;
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

    private _direction: TransitionDirection = TransitionDirection.STILL;
    private _load: Crate | null = null;
    private loader: LoaderGraphic | null = null;
    private onLoadingEnd: Function | null = null;
    private _task: Task | null = null;
    private _isBusy = false;
    private _path: Path | null = null;

    protected getTexture(): PIXI.Texture {
        return Loader.shared.resources['robot'].texture;
    }

    protected getZIndex(): number {
        return 3;
    }

    go(direction: TransitionDirection): void {
        this._direction = direction;
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

    private move(): void {
        let resultX, resultY;
        const targetY = this.cellY * Config.CELL_SIDE_LENGTH + this.getOffset();
        const targetX = this.cellX * Config.CELL_SIDE_LENGTH + this.getOffset();
        switch (this._direction) {
            case TransitionDirection.UP:
                resultY = this.sprite.y - Config.ROBOTS_SPEED;
                if (resultY <= targetY) {
                    this.sprite.y = targetY;
                    this._direction = TransitionDirection.STILL;
                    this.isBusy = false;
                } else {
                    this.sprite.y = resultY;
                }
                break;
            case TransitionDirection.DOWN:
                resultY = this.sprite.y + Config.ROBOTS_SPEED;
                if (resultY >= targetY) {
                    this.sprite.y = targetY;
                    this._direction = TransitionDirection.STILL;
                    this.isBusy = false;
                } else {
                    this.sprite.y = resultY;
                }
                break;
            case TransitionDirection.LEFT:
                resultX = this.sprite.x - Config.ROBOTS_SPEED;
                if (resultX <= targetX) {
                    this.sprite.x = targetX;
                    this._direction = TransitionDirection.STILL;
                    this.isBusy = false;
                } else {
                    this.sprite.x = resultX;
                }
                break;
            case TransitionDirection.RIGHT:
                resultX = this.sprite.x + Config.ROBOTS_SPEED;
                if (resultX >= targetX) {
                    this.sprite.x = targetX;
                    this._direction = TransitionDirection.STILL;
                    this.isBusy = false;
                } else {
                    this.sprite.x = resultX;
                }
                break;
        }
    }

    act(): void {
        this.move();
        this.proceedLoading();
    }

    private _take(crate: Crate): void {
        this._load = crate;
        this.container.removeChild(crate.sprite);
        const sideLength = this.getWidth() * 4 - this.getOffset() * 4;
        this.sprite.addChild(crate.sprite);
        crate.sprite.y = -sideLength;
        crate.sprite.x = 0;
        crate.sprite.zIndex = this.getZIndex();
        crate.sprite.width = sideLength;
        crate.sprite.height = sideLength;
    }

    take(crate: Crate, callback: Function | null = null): void {
        const action = (): void => {
            this._take(crate);
            if (callback) callback();
        };
        this.addLoadableAction(action);
    }

    private proceedLoading(): void {
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

    private _put(): void {
        if (this._load) {
            this.sprite.removeChild(this._load.sprite);
            this._load.cellX = this.cellX;
            this._load.cellY = this.cellY;
            this._load.draw();
            this._load = null;
        }
    }

    put(callback: Function | null = null): void {
        const action = (): void => {
            this._put();
            if (callback) callback();
        };
        if (this._load) {
            this.addLoadableAction(action);
        }
    }

    addLoadableAction(action: Function, showLoader = true): void {
        this.onLoadingEnd = action;
        this.loader = new LoaderGraphic();
        this.loader.x = this.getWidth() * 2 - this.getOffset() * 2;
        this.loader.y =  -Config.LOADER_RADIUS - Config.LOADER_OFFSET;
        this.loader.zIndex = this.getZIndex();
        if (showLoader) {
            this.sprite.addChild(this.loader);
        }
        this.isBusy = true;
    }

    getId(): number {
        return this.app.robots.indexOf(this);
    }
}