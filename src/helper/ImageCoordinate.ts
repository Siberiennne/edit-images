import { Rectangle } from './Rectangle';
import { PointPosition } from './PointPosition';


export class ImageCoordinate {
    startPoint: PointPosition;
    rect: Rectangle;

    constructor(startPoint?: PointPosition, rect?: Rectangle) {
        if (!startPoint)
            this.startPoint = new PointPosition();
        else this.startPoint = startPoint;
        if (!rect)
            this.rect = new Rectangle();
        else this.rect = rect;
    }

    public isTrivial(){
        return this.rect.isTrivial();
    }

    public getIntersectionWith(coor: ImageCoordinate): ImageCoordinate {
        let imageCoor: ImageCoordinate = new ImageCoordinate();

        if ((this.startPoint.coor.x + this.rect.area.w <= coor.startPoint.coor.x)
            || (this.startPoint.coor.y + this.rect.area.h >= coor.startPoint.coor.y)
            || (coor.startPoint.coor.y + coor.rect.area.h >= this.startPoint.coor.y)
            || (coor.startPoint.coor.y + coor.rect.area.h >= this.startPoint.coor.y))
            return imageCoor;

        imageCoor.startPoint.coor.x = Math.max(this.startPoint.coor.x, coor.startPoint.coor.x);
        imageCoor.startPoint.coor.y = Math.max(this.startPoint.coor.y, coor.startPoint.coor.y);
        //********** */
        imageCoor.rect.area.w = Math.max(this.rect.area.w, coor.rect.area.w);
        imageCoor.rect.area.h = Math.max(this.rect.area.h, coor.rect.area.h);
        return imageCoor;
        // if (this.startPoint.coor.x <= coor.startPoint.coor.x)
        //     imageCoor.startPoint.coor.x = this.imgCoor.startPoint.x;
        // else imageCoor.startPoint.coor.x = Math.min(this.imgCoor.startPoint.x, this.cropCoor.startPoint.x);

       
    }
}