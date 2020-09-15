import { TResizeData, TCropData } from './../helper/types';
import { PointPosition } from './../helper/PointPosition';
import { ImageCoordinate } from './../helper/ImageCoordinate';
import { Component, ViewChild, ElementRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ResizeDirectionEnum } from "../helper/enums";
import { Rectangle } from './../helper/Rectangle';


@Component({
  selector: 'crop-comp',
  template: `
    <div #cropContainer [ngClass]="{ cropArea: isCropped }">
      <div resize 
      (resize)="onResize($event)"
      [targetElement]="cropContainer"
      [direction]="ResizeDirectionEnum.TOP_LEFT"
      [ngClass]="{ cropHandle: isCropped, cropHandleTL: isCropped}"
        (mousedown)="handleCropArea($event)"
      ></div>

      <div resize 
      (resize)="onResize($event)"
      [targetElement]="cropContainer"
      [direction]="ResizeDirectionEnum.TOP_RIGHT"
      [ngClass]="{ cropHandle: isCropped, cropHandleTR: isCropped}"
        (mousedown)="handleCropArea($event)"
      
      ></div>
      <div resize 
      (resize)="onResize($event)"
      [targetElement]="cropContainer"
      [direction]="ResizeDirectionEnum.BOTTOM_LEFT"
        [ngClass]="{ cropHandle: isCropped, cropHandleBL: isCropped }"   
        (mousedown)="handleCropArea($event)"
      
      ></div>
      <div resize 
      (resize)="onResize($event)"
      [targetElement]="cropContainer"
      [direction]="ResizeDirectionEnum.BOTTOM_RIGHT"
        [ngClass]="{ cropHandle: isCropped, cropHandleBR: isCropped }"
        (mousedown)="handleCropArea($event)"
       
      ></div>
    </div>`,
  styleUrls: ['./app.component.scss']
})

export class CropComponent implements OnInit {
  @Input() isCropped: boolean = false;
  @Input() imgCoor: ImageCoordinate;
  @Output() сropCanvasData: EventEmitter<ImageCoordinate> = new EventEmitter();

  @ViewChild('cropContainer', { static: true })
  cropContainer: ElementRef<HTMLDivElement>;
  ResizeDirectionEnum = ResizeDirectionEnum;
  cropData: TCropData = {
    originalWidth: 0,
    originalHeight: 0,
    originalX: 0,
    originalY: 0,
    originalMouseX: 0,
    originalMouseY: 0,
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.isCropped) {
      this.cropData.originalWidth = this.imgCoor.rect.w;
      this.cropData.originalHeight = this.imgCoor.rect.h;
      this.cropData.originalX = this.imgCoor.startPoint.x;
      this.cropData.originalY = this.imgCoor.startPoint.y;

      this.cropContainer.nativeElement.style.top = this.imgCoor.startPoint.y + 'px';
      this.cropContainer.nativeElement.style.left = this.imgCoor.startPoint.x + 'px';
      this.cropContainer.nativeElement.style.width = this.imgCoor.rect.w + 'px';
      this.cropContainer.nativeElement.style.height = this.imgCoor.rect.h + 'px';
    }
  }

  public onResize(event: TResizeData): void {

    let diffWidth = event.diffWidth;
    let diffHeight = event.diffHeight;

    let w = this.cropData.originalWidth - diffWidth;
    let h = this.cropData.originalHeight - diffHeight;

    let left = this.cropData.originalX;
    let top = this.cropData.originalY;
    if (event.direction == ResizeDirectionEnum.TOP_LEFT) {
      left = left + diffWidth;
      top = top + diffHeight;
    }
    if (event.direction == ResizeDirectionEnum.TOP_RIGHT) {
      top = top + diffHeight;
    }
    if (event.direction == ResizeDirectionEnum.BOTTOM_LEFT) {
      left = left + diffWidth;
    }

    this.cropContainer.nativeElement.style.width = w + "px";
    this.cropContainer.nativeElement.style.height = h + "px";
    this.cropContainer.nativeElement.style.top = top + "px";
    this.cropContainer.nativeElement.style.left = left + "px";
    let cropData: ImageCoordinate = new ImageCoordinate(new PointPosition(left,  top ), new Rectangle(  w,  h ));
    this.сropCanvasData.emit(cropData);
  }

  handleCropArea(event: any) {
    event.preventDefault();

    this.cropData.originalMouseX = event.clientX;
    this.cropData.originalMouseY = event.pageY;
  }
}
