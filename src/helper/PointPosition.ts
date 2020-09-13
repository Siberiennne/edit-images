import { TPointPosition } from './types';
export class PointPosition {

    coor: TPointPosition = { x: 0, y: 0 };

    constructor(position?: TPointPosition) {
        if (position) {
            if (position.x < 0)
                throw new Error("Incorrect point position x: " + position.x);
            if (position.y < 0)
                throw new Error("Incorrect point position y: " + position.y);
            this.coor = position;
        }
    }
}