import { Rectangle } from './../helper/Rectangle';
import { PointPosition } from './../helper/PointPosition';
import { ImageCoordinate } from './../helper/ImageCoordinate';
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpService } from './http.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [HttpService]
})

export class AppComponent implements OnInit {

    @ViewChild('backgroundCanvas', { static: true })
    backgroundCanvas: ElementRef<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D;

    file: File = null;
    image: HTMLImageElement = null;
    compressionRatio: number = 1;

    canvasCoor: ImageCoordinate = new ImageCoordinate();
    imgCoor: ImageCoordinate = new ImageCoordinate();
    cropCoor: ImageCoordinate = new ImageCoordinate();

    isButtonDisabled: boolean = true;
    isCropSet: boolean = false;

    imgCanvasData: string = "";

    defaultImgData: ImageData = null;
    newImgData: ImageData = null;
    isCropped: boolean = false;
 
    imageSrc: string = "";

    constructor(private httpService: HttpService) { }

    ngOnInit() {
        this.ctx = this.backgroundCanvas.nativeElement.getContext('2d');
        this.backgroundCanvas.nativeElement.style.width = '100%';
        this.backgroundCanvas.nativeElement.style.height = '100%';
        this.backgroundCanvas.nativeElement.style.position = 'absolute';
        this.backgroundCanvas.nativeElement.style.zIndex = '1';
    }

    onCrop(event: ImageCoordinate) {
        this.cropCoor = event;
    }

    handleFileInput(files: FileList) {
        this.file = files[0];
        this.image = new Image();
        this.image.src = URL.createObjectURL(files[0]);
        this.imageSrc = this.image.src;

        this.image.onload = () => {
            if (this.ctx)
                this.clearImageCanvas();
            this.isButtonDisabled = false;
            this.imgCoor = this.fitImageToCanvas(this.image);
        }
    }

    fitImageToCanvas(img: HTMLImageElement): ImageCoordinate {
        let wCanvas: number = this.backgroundCanvas.nativeElement.getBoundingClientRect().width,
            hCanvas: number = this.backgroundCanvas.nativeElement.getBoundingClientRect().height;

        let wImage = img.width,
            hImage = img.height;
        let r: number = 1;

        if (wImage > wCanvas || hImage > hCanvas)
            r = Math.min(wCanvas / wImage, hCanvas / hImage);
        let wImageNew = r * wImage,
            hImageNew = r * hImage;

        this.compressionRatio = r;
        let startPoint: PointPosition = this.centerImage(
            new Rectangle(wImageNew, hImageNew),
            new Rectangle(wCanvas, hCanvas));

        let adjustedImageArea: Rectangle = new Rectangle(wImageNew, hImageNew);
        return new ImageCoordinate(startPoint, adjustedImageArea);
    }

    centerImage(imageArea: Rectangle, backgroundArea: Rectangle): PointPosition {

        let point: PointPosition = new PointPosition(0, 0);
        if (imageArea.w < backgroundArea.w) {
            point.x = (backgroundArea.w - imageArea.w) / 2;
        }
        if (imageArea.h < backgroundArea.h) {
            point.y = (backgroundArea.h - imageArea.h) / 2;
        }
        return point;
    }

    getImageData(data: ImageData) {
        this.defaultImgData = data;
    }

    makeImageGray() {
        if (this.defaultImgData) {
            let editedImageData: ImageData = new ImageData(this.imgCoor.rect.w, this.imgCoor.rect.h);
            let dataCopy = new Uint8ClampedArray(this.defaultImgData.data);
            editedImageData.data.set(dataCopy);

            for (let i = 0; i < editedImageData.data.length; i += 4) {
                let r = editedImageData.data[i];
                let g = editedImageData.data[i + 1];
                let b = editedImageData.data[i + 2];
                let v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                editedImageData.data[i] = editedImageData.data[i + 1] = editedImageData.data[i + 2] = v
            }
            dataCopy = new Uint8ClampedArray(editedImageData.data);
            this.defaultImgData.data.set(dataCopy);

            this.newImgData = editedImageData;
        }
    }

    cropImage() {
        this.isCropped = !this.isCropped;
    }

    applyCrop() {
        let croppedImgCoor: ImageCoordinate = new ImageCoordinate();
        if (this.isCropped) {
            croppedImgCoor.startPoint.x = Math.max(this.imgCoor.startPoint.x, this.cropCoor.startPoint.x)
            croppedImgCoor.startPoint.y = Math.max(this.imgCoor.startPoint.y, this.cropCoor.startPoint.y)
            croppedImgCoor.rect.w = this.cropCoor.rect.w;
            croppedImgCoor.rect.h = this.cropCoor.rect.h;
        }
        this.isCropSet = true;
        this.cropCoor = croppedImgCoor;
    }

    changeBrightness(coef: number) {
        if (this.defaultImgData) {
            let editedImageData: ImageData = new ImageData(this.imgCoor.rect.w, this.imgCoor.rect.h);
            let dataCopy = new Uint8ClampedArray(this.defaultImgData.data);
            editedImageData.data.set(dataCopy);

            for (let i = 0; i < editedImageData.data.length; i += 4) {
                editedImageData.data[i] += 255 * (coef / 100);
                editedImageData.data[i + 1] += 255 * (coef / 100);
                editedImageData.data[i + 2] += 255 * (coef / 100);
            }

            dataCopy = new Uint8ClampedArray(editedImageData.data);
            editedImageData.data.set(dataCopy);
            this.newImgData = editedImageData;
        }
    }

    putImageData(imgData: ImageData): void {
        this.ctx.putImageData(imgData, 0, 0);
    }
    getImageCanvasData(event: string) {
        this.imgCanvasData = event;
    }

    uploadImage() {
        this.httpService.postImage(this.imgCanvasData).subscribe(data => {
            console.log('Done!')
        }, error => {
            console.log(error);
        });
    }

    clearImageCanvas() {
        this.ctx.clearRect(0, 0, this.backgroundCanvas.nativeElement.width, this.backgroundCanvas.nativeElement.height);
    }
}