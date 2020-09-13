import { TRectangle } from "./types";

export class Rectangle {
    area: TRectangle = { w: 0, h: 0 };

    constructor(rect?: TRectangle) {
        if (rect) {
            if (rect.w < 0)
                throw new Error("Incorrect width: " + rect.w);
            if (rect.h < 0)
                throw new Error("Incorrect height: " + rect.h);
            this.area = rect;
        }
    }

    isTrivial(): boolean {
        return (this.area.w == 0 || this.area.h == 0)
    }
}