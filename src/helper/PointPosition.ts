export class PointPosition {

    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    set x(x: number) {
        if (x < 0)
            throw new Error("Incorrect x coordinate: " + x);
        this._x = x;
    }

    set y(y: number) {
        if (y < 0)
            throw new Error("Incorrect y coordinate: " + y);
        this._y = y;
    }
}