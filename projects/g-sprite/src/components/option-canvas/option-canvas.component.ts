import { Component, ElementRef, Input, ViewChild } from '@angular/core';

import { ExplorerImplementation } from '../../implementations/explorer.implementation';
import { ModulesService } from '@node-cs/client';

@Component({
    selector: 'option-canvas-component',
    templateUrl: './option-canvas.component.html',
    styleUrls: ['./option-canvas.component.scss']
})
export class OptionCanvasComponent {

    private _selectedElement?: ExplorerImplementation;
    @Input('selectedElement') public set selectedElement(selectedElement: ExplorerImplementation | undefined) {
        this.onSelectedElementChange(this._selectedElement = selectedElement);
    };
    public get selectedElement(): ExplorerImplementation | undefined {
        return this._selectedElement;
    };

    private _optionDraw?: { x: number; y: number; w: number; h: number; }[];
    @Input('optionDraw') public set optionDraw(optionDraw: { x: number; y: number; w: number; h: number; }[] | undefined) {
        this.onOptionDrawChange(this._optionDraw = optionDraw);
    };
    public get optionDraw(): { x: number; y: number; w: number; h: number; }[] | undefined {
        return this._optionDraw;
    };

    @ViewChild('canvas', { static: true }) public canvasElementRef?: ElementRef;

    private image: HTMLImageElement = new Image();

    constructor(
        private readonly modulesService: ModulesService
    ) {
        this.addImageLoadEventListener();
    }

    public async onSelectedElementChange(element?: ExplorerImplementation): Promise<void> {
        const path = element?.getPath();
        if (path) {
            this.image.src = 'data:image/png;base64,' + await this.modulesService.getMethod('fs', 'readFile')(path, { encoding: 'base64' });
        } else {
            const canvas = this.canvasElementRef?.nativeElement as HTMLCanvasElement;
            const context = canvas?.getContext('2d');
            if (canvas && context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = 0;
                canvas.height = 0;
            }
        }
    }

    public onOptionDrawChange(optionDraw?: { x: number; y: number; w: number; h: number; }[]): void {
        const canvas = this.canvasElementRef?.nativeElement as HTMLCanvasElement;
        const context = canvas?.getContext('2d');
        if (optionDraw && canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = this.image.width;
            canvas.height = this.image.height;
            context.drawImage(this.image, 0, 0);
            for (const rect of optionDraw) {
                context.beginPath();
                context.globalAlpha = 1;
                context.strokeStyle = 'red';
                context.strokeRect(rect.x, rect.y, rect.w, rect.h);
                context.closePath();
            }
        }
    }

    //

    private addImageLoadEventListener(): void {
        this.image.addEventListener('load', () => {
            const canvas = this.canvasElementRef?.nativeElement as HTMLCanvasElement;
            const context = canvas?.getContext('2d');
            if (canvas && context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                canvas.width = this.image.width;
                canvas.height = this.image.height;
                context.drawImage(this.image, 0, 0);
            }
        }, false);
    }

}
