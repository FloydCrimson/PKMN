import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { LevelDataType } from '../../implementations/level.implementation';
import { LevelDataCellLayerCollisionTypeUIEnum, LevelDataCellLayerMovementTypeUIEnum } from '../level-config/level-config.component';

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

    private _levelDraw?: { x: number; y: number; layers: { level: number; collision_type: LevelDataCellLayerCollisionTypeUIEnum; movement_type: LevelDataCellLayerMovementTypeUIEnum; images: { id: string; src: string; }[]; }[]; }[];
    @Input('levelDraw') public set levelDraw(levelDraw: { x: number; y: number; layers: { level: number; collision_type: LevelDataCellLayerCollisionTypeUIEnum; movement_type: LevelDataCellLayerMovementTypeUIEnum; images: { id: string; src: string; }[]; }[]; }[] | undefined) {
        this.onlevelDrawChange(this._levelDraw = levelDraw);
    };
    public get levelDraw(): { x: number; y: number; layers: { level: number; collision_type: LevelDataCellLayerCollisionTypeUIEnum; movement_type: LevelDataCellLayerMovementTypeUIEnum; images: { id: string; src: string; }[]; }[]; }[] | undefined {
        return this._levelDraw;
    };

    @Output('onCanvasMatrixSelection') public onCanvasMatrixSelectionEmitter = new EventEmitter<{ x: number; y: number; }[]>();

    @ViewChild('canvas', { static: true }) public canvasElementRef?: ElementRef;

    public level: boolean = false;
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
        if (this.levelData && this.mouseEvent && this.mouseEvent.down && this.mouseEvent.up) {
            const x1 = Math.floor(this.grid ? (this.mouseEvent.down.offsetX / (this.levelData.config.sprite_width + 1)) : (this.mouseEvent.down.offsetX / this.levelData.config.sprite_width));
            const y1 = Math.floor(this.grid ? (this.mouseEvent.down.offsetY / (this.levelData.config.sprite_height + 1)) : (this.mouseEvent.down.offsetY / this.levelData.config.sprite_height));
            const x2 = Math.floor(this.grid ? (this.mouseEvent.up.offsetX / (this.levelData.config.sprite_width + 1)) : (this.mouseEvent.up.offsetX / this.levelData.config.sprite_width));
            const y2 = Math.floor(this.grid ? (this.mouseEvent.up.offsetY / (this.levelData.config.sprite_height + 1)) : (this.mouseEvent.up.offsetY / this.levelData.config.sprite_height));
            const x_min = Math.min(x1, x2);
            const x_max = Math.max(x1, x2);
            const y_min = Math.min(y1, y2);
            const y_max = Math.max(y1, y2);
            const cellsSelected = [];
            for (let x = x_min; x <= x_max; x++) {
                for (let y = y_min; y <= y_max; y++) {
                    cellsSelected.push({ x, y });
                }
            }
            if (cellsSelected.length === 1 && this.cellsSelected.length === 1 && cellsSelected[0].x === this.cellsSelected[0].x && cellsSelected[0].y === this.cellsSelected[0].y) {
                this.cellsSelected = [];
            } else {
                this.cellsSelected = cellsSelected;
            }
            await this.draw();
            this.onCanvasMatrixSelectionEmitter.emit(this.cellsSelected);
        }
    }

    public async onlevelDrawChange(levelDraw?: { x: number; y: number; layers: { level: number; collision_type: LevelDataCellLayerCollisionTypeUIEnum; movement_type: LevelDataCellLayerMovementTypeUIEnum; images: { id: string; src: string; }[]; }[]; }[]): Promise<void> {
        await this.draw();
    }

    //

    public async draw(): Promise<void> {
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
                this.drawGrid(context, 0, 0, this.levelData.config.level_width, this.levelData.config.level_height, this.levelData.config.sprite_width, this.levelData.config.sprite_height, 'red', this.grid, false);
            }
            // Image
            if (this.levelDraw) {
                context.beginPath();
                context.globalAlpha = 1;
                for (const draw of this.levelDraw) {
                    const x = this.grid ? (draw.x * this.levelData.config.sprite_width + draw.x + 1) : (draw.x * this.levelData.config.sprite_width);
                    const y = this.grid ? (draw.y * this.levelData.config.sprite_height + draw.y + 1) : (draw.y * this.levelData.config.sprite_height);
                    const width = this.levelData.config.sprite_width;
                    const height = this.levelData.config.sprite_height;
                    for (const { images } of draw.layers) {
                        for (const { id, src } of images) {
                            const image = await this.getSrcImage(id, src);
                            context.drawImage(image, x, y, width, height);
                        }
                    }
                }
                context.closePath();
            }
            // Level
            if (this.levelDraw && this.level) {
                context.beginPath();
                for (const draw of this.levelDraw) {
                    const x = this.grid ? (draw.x * this.levelData.config.sprite_width + draw.x + 1) : (draw.x * this.levelData.config.sprite_width);
                    const y = this.grid ? (draw.y * this.levelData.config.sprite_height + draw.y + 1) : (draw.y * this.levelData.config.sprite_height);
                    const width = this.levelData.config.sprite_width / draw.layers.length;
                    const height = this.levelData.config.sprite_height;
                    for (let i = 0; i < draw.layers.length; i++) {
                        // Background
                        context.globalAlpha = 0.2;
                        switch (draw.layers[i].collision_type) {
                            case LevelDataCellLayerCollisionTypeUIEnum.Floor: context.fillStyle = 'green'; break;
                            case LevelDataCellLayerCollisionTypeUIEnum.Wall: context.fillStyle = 'red'; break;
                            case LevelDataCellLayerCollisionTypeUIEnum.Bridge: context.fillStyle = 'yellow'; break;
                        }
                        context.fillRect(x + (i * width), y, width, height);
                        // Text
                        const texts = [];
                        texts.push(draw.layers[i].level.toString());
                        texts.push(draw.layers[i].collision_type[0]);
                        texts.push(draw.layers[i].movement_type[0]);
                        const font_space = height / (4 * texts.length);
                        const font_height = (height - (texts.length + 1) * font_space) / texts.length;
                        context.globalAlpha = 1;
                        context.font = `${font_height}px Arial`;
                        for (let j = 0; j < texts.length; j++) {
                            context.fillStyle = 'white';
                            context.fillText(texts[j], x + (i * width) + (width / 4), y + (j + 1) * (font_space + font_height));
                            context.strokeStyle = 'black';
                            context.lineWidth = 1;
                            context.strokeText(texts[j], x + (i * width) + (width / 4), y + (j + 1) * (font_space + font_height));
                        }
                    }
                }
                context.closePath();
            }
            // Cells selection
            if (this.mouseEvent && this.mouseEvent.down && this.mouseEvent.up && this.cellsSelected.length > 0) {
                const x_min = Math.min(...this.cellsSelected.map((cell) => cell.x));
                const x_max = Math.max(...this.cellsSelected.map((cell) => cell.x));
                const y_min = Math.min(...this.cellsSelected.map((cell) => cell.y));
                const y_max = Math.max(...this.cellsSelected.map((cell) => cell.y));
                this.drawGrid(context, x_min, y_min, x_max - x_min + 1, y_max - y_min + 1, this.levelData.config.sprite_width, this.levelData.config.sprite_height, 'blue', this.grid, true);
            }
        }
    }

    private drawGrid(context: CanvasRenderingContext2D, gx: number, gy: number, gw: number, gh: number, sw: number, sh: number, style: string | CanvasGradient | CanvasPattern, grid: boolean, fill: boolean): void {
        if (fill) {
            context.beginPath();
            context.globalAlpha = 0.1;
            context.fillStyle = style;
            context.fillRect(
                grid ? (gx * (sw + 1) + 0.5) : (gx * sw), // 0.5 for 1 px stroke
                grid ? (gy * (sh + 1) + 0.5) : (gy * sh), // 0.5 for 1 px stroke
                grid ? (gw * (sw + 1) + 1 + 0.5) : (gw * sw), // 0.5 for 1 px stroke
                grid ? (gh * (sh + 1) + 1 + 0.5) : (gh * sh) // 0.5 for 1 px stroke
            );
            context.closePath();
        }
        if (grid) {
            context.beginPath();
            context.globalAlpha = 0.5;
            context.strokeStyle = style;
            for (let x = gx; x <= gx + gw; x++) {
                context.moveTo(x * (sw + 1) + 0.5, gy * (sh + 1) + 0.5); // 0.5 for 1 px stroke
                context.lineTo(x * (sw + 1) + 0.5, (gy + gh) * (sh + 1) + 0.5); // 0.5 for 1 px stroke
                context.stroke();
            }
            for (let y = gy; y <= gy + gh; y++) {
                context.moveTo(gx * (sw + 1) + 0.5, y * (sh + 1) + 0.5); // 0.5 for 1 px stroke
                context.lineTo((gx + gw) * (sw + 1) + 0.5, y * (sh + 1) + 0.5); // 0.5 for 1 px stroke
                context.stroke();
            }
            context.closePath();
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
