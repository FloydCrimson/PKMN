import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { LevelDataType } from '../../implementations/level.implementation';

@Component({
    selector: 'level-canvas-component',
    templateUrl: './level-canvas.component.html',
    styleUrls: ['./level-canvas.component.scss']
})
export class LevelCanvasComponent {

    private _levelData?: LevelDataType;
    @Input('levelData') public set levelData(levelData: LevelDataType | undefined) {
        this._levelData = levelData;
        this.draw();
    };
    public get levelData(): LevelDataType | undefined {
        return this._levelData;
    };

    private _levelDraw?: { x: number; y: number; images: { id: string; src: string; depth: number; }[]; }[];
    @Input('levelDraw') public set levelDraw(levelDraw: { x: number; y: number; images: { id: string; src: string; depth: number; }[]; }[] | undefined) {
        this.onlevelDrawChange(this._levelDraw = levelDraw);
    };
    public get levelDraw(): { x: number; y: number; images: { id: string; src: string; depth: number; }[]; }[] | undefined {
        return this._levelDraw;
    };

    @Output('onCanvasMatrixSelection') public onCanvasMatrixSelectionEmitter = new EventEmitter<{ x: number; y: number; }[]>();

    @ViewChild('canvas', { static: true }) public canvasElementRef?: ElementRef;

    public grid: boolean = true;

    private mouseEvent: { down?: MouseEvent; up?: MouseEvent; } = {};
    private cellsSelected: { x: number; y: number; }[] = [];
    private map = new Map<string, HTMLImageElement>();

    constructor() { }

    public onCanvasMouseDown(event: MouseEvent): void {
        this.mouseEvent = { down: event };
    }

    public async onCanvasMouseUp(event: MouseEvent): Promise<void> {
        this.mouseEvent.up = event;
        await this.draw();
        this.onCanvasMatrixSelectionEmitter.emit(this.cellsSelected);
    }

    public async onlevelDrawChange(levelDraw?: { x: number; y: number; images: { id: string; src: string; depth: number; }[]; }[]): Promise<void> {
        await this.draw();
    }

    //

    private async draw(): Promise<void> {
        const canvas = this.canvasElementRef?.nativeElement as HTMLCanvasElement;
        const context = canvas?.getContext('2d');
        if (this.levelData && canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = this.levelData.config.level_width * this.levelData.config.sprite_width;
            canvas.height = this.levelData.config.level_height * this.levelData.config.sprite_height;
            // Grid
            if (this.grid) {
                canvas.width += this.levelData.config.level_width + 1;
                canvas.height += this.levelData.config.level_height + 1;
                context.beginPath();
                context.globalAlpha = 0.5;
                context.strokeStyle = 'red';
                for (let x = 0; x <= this.levelData.config.level_width; x++) {
                    context.moveTo(x * (this.levelData.config.sprite_width + 1) + 0.5, 0); // 0.5 for 1 px stroke
                    context.lineTo(x * (this.levelData.config.sprite_width + 1) + 0.5, canvas.height); // 0.5 for 1 px stroke
                    context.stroke();
                }
                for (let y = 0; y <= this.levelData.config.level_height; y++) {
                    context.moveTo(0, y * (this.levelData.config.sprite_height + 1) + 0.5); // 0.5 for 1 px stroke
                    context.lineTo(canvas.width, y * (this.levelData.config.sprite_height + 1) + 0.5); // 0.5 for 1 px stroke
                    context.stroke();
                }
                context.closePath();
            }
            // Image
            if (this.levelDraw) {
                context.beginPath();
                context.globalAlpha = 1;
                for (const draw of this.levelDraw) {
                    const x = draw.x * this.levelData.config.sprite_width + draw.x + 1; // 0.5 for 1 px stroke
                    const y = draw.y * this.levelData.config.sprite_height + draw.y + 1; // 0.5 for 1 px stroke
                    const width = this.levelData.config.sprite_width;
                    const height = this.levelData.config.sprite_height;
                    for (const { id, src } of draw.images.sort((i1, i2) => i1.depth - i2.depth)) {
                        const image = await this.getSrcImage(id, src);
                        context.drawImage(image, x, y, width, height);
                    }
                }
                context.closePath();
            }
            // Cells selection
            if (this.mouseEvent && this.mouseEvent.down && this.mouseEvent.up) {
                const x1 = Math.floor(this.grid ? (this.mouseEvent.down!.offsetX / (this.levelData.config.sprite_width + 1)) : (this.mouseEvent.down!.offsetX / this.levelData.config.sprite_width));
                const y1 = Math.floor(this.grid ? (this.mouseEvent.down!.offsetY / (this.levelData.config.sprite_height + 1)) : (this.mouseEvent.down!.offsetY / this.levelData.config.sprite_height));
                const x2 = Math.floor(this.grid ? (this.mouseEvent.up!.offsetX / (this.levelData.config.sprite_width + 1)) : (this.mouseEvent.up!.offsetX / this.levelData.config.sprite_width));
                const y2 = Math.floor(this.grid ? (this.mouseEvent.up!.offsetY / (this.levelData.config.sprite_height + 1)) : (this.mouseEvent.up!.offsetY / this.levelData.config.sprite_height));
                const x_min = Math.min(x1, x2);
                const x_max = Math.max(x1, x2);
                const y_min = Math.min(y1, y2);
                const y_max = Math.max(y1, y2);
                this.cellsSelected = [];
                context.beginPath();
                context.globalAlpha = 0.1;
                context.strokeStyle = 'blue';
                for (let x = x_min; x <= x_max; x++) {
                    for (let y = y_min; y <= y_max; y++) {
                        this.cellsSelected.push({ x, y });
                        context.fillRect(x * (this.levelData.config.sprite_width + 1) + 0.5, y * (this.levelData.config.sprite_height + 1) + 0.5, this.levelData.config.sprite_width + 1, this.levelData.config.sprite_height + 1); // 0.5 for 1 px stroke
                        context.stroke();
                    }
                }
                context.closePath();
            }
        }
    }

    private async getSrcImage(id: string, src: string): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve) => {
            if (this.map.has(id)) {
                resolve(this.map.get(id)!);
            } else {
                const image = new Image();
                image.addEventListener('load', () => {
                    this.map.set(id, image);
                    resolve(image);
                }, false);
                image.src = src;
            }
        });
    }

}
