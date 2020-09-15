export class Rectangle {
    private _w: number;
    private _h: number;

    constructor(w: number, h: number) {
        this.w = w;
        this.h = h;
    }

    get w() {
        return this._w;
    }

    get h() {
        return this._h;
    }

    set w(width: number) {
        if (width < 0)
            throw new Error("Incorrect width: " + width);
        this._w = width;
    }

    set h(height: number) {
        if (height < 0)
            throw new Error("Incorrect width: " + height);
        this._h = height;
    }

    isTrivial(): boolean {
        return (this._w == 0 || this._h == 0)
    }
}