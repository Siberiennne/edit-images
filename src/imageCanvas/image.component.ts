import { ImageCoordinate } from './../helper/ImageCoordinate';
import { Component, ViewChild, EventEmitter, ElementRef, OnInit, Input, Output, OnChanges, SimpleChanges } from '@angular/core';


@Component({
    selector: 'image-comp',
    template: `<canvas #imgCanvas></canvas>`
})

export class ImageComponent implements OnInit, OnChanges {
    @ViewChild('imgCanvas', { static: true })
    imgCanvas: ElementRef<HTMLCanvasElement>;
    imgCtx: CanvasRenderingContext2D;

    @Input() imgCoor: ImageCoordinate;
    @Input() img: HTMLImageElement;
    @Input() imgDataEdited: ImageData;
    @Output() onMakeGray = new EventEmitter();
    @Output() onGetImageData = new EventEmitter<ImageData>();

    imgData: ImageData = null;
    imgSrc: string = "";

    ngOnInit() {
        this.imgCtx = this.imgCanvas.nativeElement.getContext('2d');
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log("SimpleChanges");
        console.log(changes);
        // if (changes.imgCoor) {
        //     if (!this.imgCoor.isTrivial()) {
        //         this.clearImageCanvas();
        //         this.imgCtx.drawImage(this.img, 0, 0, this.imgCoor.rect.area.w, this.imgCoor.rect.area.h);
        //         return;
        //     }
        // }
        if (changes.imgDataEdited) {
            if (changes.imgDataEdited.currentValue) {
                this.clearImageCanvas();
                this.putImageData(this.imgDataEdited);
                return;
            }
        }
        // if (changes.img && !this.imgCoor.isTrivial()) {
        //     if (changes.img.currentValue) {
                this.clearImageCanvas();
                // this.imgCtx = this.createImageCanvas(this.imgCoor.area);
                this.createImageCanvas(this.imgCoor)
                this.imgCtx.drawImage(this.img, 0, 0, this.imgCoor.rect.area.w, this.imgCoor.rect.area.h);
                this.imgData = this.imgCtx.getImageData(0, 0, this.imgCoor.rect.area.w, this.imgCoor.rect.area.h);
                this.getImageData();
           // }
       // }
    }

    getImageData() {
        this.onGetImageData.emit(this.imgData);
    }

    draw(ctx: CanvasRenderingContext2D) {


    }


    createImageCanvas(data: ImageCoordinate) {
        // this.imgCanvas = document.createElement('canvas');
        // this.imgCanvas.style.display = 'none';
        // document.body.appendChild(this.imgCanvas);
        this.imgCanvas.nativeElement.width = data.rect.area.w
        this.imgCanvas.nativeElement.height = data.rect.area.h;
        this.imgCanvas.nativeElement.style.position = 'absolute';
        this.imgCanvas.nativeElement.style.top = data.startPoint.coor.y + 'px';
        this.imgCanvas.nativeElement.style.left = data.startPoint.coor.x + 'px';
        // return this.imgCanvas.nativeElement.getContext('2d');
    }

    clearImageCanvas() {
        this.imgCtx.clearRect(0, 0, this.imgCanvas.nativeElement.width, this.imgCanvas.nativeElement.height);
    }
 

    putImageData(imgData: ImageData): void {
        this.imgCtx.putImageData(imgData, 0, 0);
    }

}
