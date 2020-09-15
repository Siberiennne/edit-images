import {ResizeDirectionEnum} from "./enums"
export type TPointPosition = { x: number, y: number };
export type TRectangle = { w: number, h: number };
export type TCanvasData = { startPoint: TPointPosition, area: TRectangle };

export type TResizeData = {
    diffWidth: number;
    diffHeight: number;
    originalEvent: MouseEvent;
    direction: ResizeDirectionEnum;
}

export type TCropData = {
    originalWidth: number,
    originalHeight: number,
    originalX: number,
    originalY: number,
    originalMouseX: number,
    originalMouseY: number
  }