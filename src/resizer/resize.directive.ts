import { TResizeData } from '../helper/types';
import { Directive, ElementRef, EventEmitter, Input, Output, Renderer2, HostListener } from '@angular/core';
import { ResizeDirectionEnum } from '../helper/enums';

@Directive({
    selector: '[resize], [resizeStart], [resizeEnd]'
})
export class ResizeDirective {

    private mouseUp$: () => void;
    private mouseMove$: () => void;

    private targetElementWidthValue: number;
    private targetElementHeightValue: number;

    private originalEvent: MouseEvent;

    @Input()
    public targetElement: HTMLElement | ElementRef;

    @Input()
    public direction: ResizeDirectionEnum;

    @Output()
    public resizeStart: EventEmitter<TResizeData> = new EventEmitter();

    @Output()
    public resize: EventEmitter<TResizeData> = new EventEmitter();

    @Output()
    public resizeEnd: EventEmitter<TResizeData> = new EventEmitter();

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    }


    @HostListener('mousedown', ['$event'])
    private onMouseDown(event: MouseEvent): void {
        event.preventDefault();

        this.setOriginalData(event);

        this.resizeStart.emit(this.getResizedArea(event));

        this.mouseUp$ = this.renderer.listen('document', 'mouseup', event => this.onMouseUp(event));
        this.mouseMove$ = this.renderer.listen('document', 'mousemove', event => this.onMouseMove(event));
        this.renderer.addClass(this.elementRef.nativeElement, 'resizes');
    }


    private onMouseUp(event: MouseEvent): void {
        let eventValues = this.getResizedArea(event);
        this.resize.emit(eventValues);

        this.mouseMove$();
        this.mouseUp$();
        this.resizeEnd.emit(eventValues);
    }

    private onMouseMove(event: MouseEvent): void {
        this.resize.emit(this.getResizedArea(event));
    }

    private setOriginalData(originalEvent: MouseEvent) {
        this.originalEvent = originalEvent;
        if (this.targetElement) {
            const dataSource = this.targetElement instanceof ElementRef ? this.targetElement.nativeElement : this.targetElement;
            this.targetElementWidthValue = dataSource.offsetWidth;
            this.targetElementHeightValue = dataSource.offsetHeight;

        } else {
            this.targetElementWidthValue = 0;
            this.targetElementHeightValue = 0;
        }
    }

    private getResizedArea(event: MouseEvent): TResizeData {

        const originalX = this.originalEvent.clientX;
        const originalY = this.originalEvent.clientY;

        let diffWidth = Math.abs(event.clientX - originalX);
        let diffHeight = Math.abs(event.clientY - originalY);

        if (!this.checkMousePosition(event))
            return {
                originalEvent: this.originalEvent,
                diffWidth: 0,
                diffHeight: 0,
                direction: this.direction
            };
        return {
            originalEvent: this.originalEvent,
            diffWidth: diffWidth,
            diffHeight: diffHeight,
            direction: this.direction
        };
    }


    checkMousePosition(event: MouseEvent): boolean {
        let mouseX = event.clientX;
        let mouseY = event.clientY;

        let startX = this.originalEvent.clientX;
        let startY = this.originalEvent.clientY;

        let elemWidth = this.originalEvent.clientX + this.targetElementWidthValue;
        let elemHeight = this.originalEvent.clientY + this.targetElementHeightValue;

        switch (this.direction) {
            case ResizeDirectionEnum.TOP_LEFT: {
                return ((mouseX > startX && Math.abs(mouseX - startX) < elemWidth)
                    && (mouseY > startY && Math.abs(mouseY - startY) < elemHeight))
            }
            case ResizeDirectionEnum.TOP_RIGHT: {
                return ((mouseX < startX && Math.abs(mouseX - startX) < elemWidth)
                    && (mouseY > startY && Math.abs(mouseY - startY) < elemHeight))
            }
            case ResizeDirectionEnum.BOTTOM_LEFT: {
                return ((mouseX > startX && Math.abs(mouseX - startX) < elemWidth)
                    && (mouseY < startY && Math.abs(mouseY - startY) < elemHeight))
            }
            case ResizeDirectionEnum.BOTTOM_RIGHT: {
                return ((mouseX < startX && Math.abs(mouseX - startX) < elemWidth)
                    && (mouseY < startY && Math.abs(mouseY - startY) < elemHeight))
            }
            default: {
                throw new Error("Wrong resize direction type");
            }
        }
    }
}