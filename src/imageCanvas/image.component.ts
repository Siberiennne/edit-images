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
    @Input() cropCoor: ImageCoordinate;
    @Input() img: HTMLImageElement;
    @Input() imgDataEdited: ImageData;
    @Input() applyCrop: boolean;
    @Input() compressionRatio: number;

    @Output() onGetImageData = new EventEmitter<ImageData>();
    @Output() onSaveCanvas = new EventEmitter<string>();

    imgData: ImageData = null;
   

    ngOnInit() {
        this.imgCtx = this.imgCanvas.nativeElement.getContext('2d');
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.imgDataEdited) {
            if (changes.imgDataEdited.currentValue) {
                this.clearImageCanvas();
                this.putImageData(this.imgDataEdited);
                return;
            }
        }
        if (this.imgCtx && this.imgCoor) {
            if (!this.imgCoor.isTrivial())
                this.draw();
        }

    }

    getImageData() {
        this.onGetImageData.emit(this.imgData);
    }

    getDataURL() {
        let data: string = this.imgCanvas.nativeElement.toDataURL("image/png").replace("image/png", "image/octet-stream");
        this.onSaveCanvas.emit(data);
    }

    draw() {
        this.clearImageCanvas();
        if (this.applyCrop && !this.cropCoor.isTrivial()) {
            this.createImageCanvas(this.cropCoor)
            let diffLeft = Math.abs(this.imgCoor.startPoint.x - this.cropCoor.startPoint.x)
            let diffTop = Math.abs(this.imgCoor.startPoint.y - this.cropCoor.startPoint.y)
            this.imgCtx.drawImage(this.img, diffLeft / this.compressionRatio, diffTop / this.compressionRatio, this.cropCoor.rect.w / this.compressionRatio, this.cropCoor.rect.h / this.compressionRatio, 0, 0, this.cropCoor.rect.w, this.cropCoor.rect.h);
        }
        else {
            this.createImageCanvas(this.imgCoor)
            this.imgCtx.drawImage(this.img, 0, 0, this.imgCoor.rect.w, this.imgCoor.rect.h);

        }

        this.imgData = this.imgCtx.getImageData(0, 0, this.imgCoor.rect.w, this.imgCoor.rect.h);
        this.getImageData();
        this.getDataURL();
    }


    createImageCanvas(data: ImageCoordinate) {
        this.imgCanvas.nativeElement.width = data.rect.w
        this.imgCanvas.nativeElement.height = data.rect.h;
        this.imgCanvas.nativeElement.style.position = 'absolute';
        this.imgCanvas.nativeElement.style.top = data.startPoint.y + 'px';
        this.imgCanvas.nativeElement.style.left = data.startPoint.x + 'px';
    }

    clearImageCanvas() {
        if (this.imgCtx)
            this.imgCtx.clearRect(0, 0, this.imgCanvas.nativeElement.width, this.imgCanvas.nativeElement.height);
    }


    putImageData(imgData: ImageData): void {
        if (this.imgCtx)
            this.imgCtx.putImageData(imgData, 0, 0);
    }

}
