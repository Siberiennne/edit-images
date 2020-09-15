import { Rectangle } from './Rectangle';
import { PointPosition } from './PointPosition';

export class ImageCoordinate {
    startPoint: PointPosition;
    rect: Rectangle;

    constructor(startPoint?: PointPosition, rect?: Rectangle) {
        if (!startPoint)
            this.startPoint = new PointPosition(0, 0);
        else this.startPoint = startPoint;
        if (!rect)
            this.rect = new Rectangle(0, 0);
        else this.rect = rect;
    }

    public isTrivial() {
        return this.rect.isTrivial();
    }
}