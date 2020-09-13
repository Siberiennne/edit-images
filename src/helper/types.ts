import {ResizeDirectionEnum} from "./enums"
export type TPointPosition = { x: number, y: number };
export type TRectangle = { w: number, h: number };
export type TCanvasData = { startPoint: TPointPosition, area: TRectangle };



export type TResizeData = {
    currentWidth: number;
    currentHeight: number;
    originalWidth: number;
    originalHeight: number;
    differenceWidthValue: number;
    differenceHeightValue: number;
    originalEvent: MouseEvent;
    direction: ResizeDirectionEnum;
}