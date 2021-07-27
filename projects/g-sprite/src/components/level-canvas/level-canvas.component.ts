import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModulesService } from '@node-cs/client';

import { LevelDataType } from '../../implementations/level.implementation';

@Component({
    selector: 'level-canvas-component',
    templateUrl: './level-canvas.component.html',
    styleUrls: ['./level-canvas.component.scss']
})
export class LevelCanvasComponent {

    private _levelData?: LevelDataType;
    @Input('levelData') public set levelData(levelData: LevelDataType | undefined) {
        this.onLevelDataChange(this._levelData = levelData);
    };
    public get levelData(): LevelDataType | undefined {
        return this._levelData;
    };

    @Output('onCanvasMatrixSelection') public onCanvasMatrixSelectionEmitter = new EventEmitter<{ x: number; y: number; }[]>();

    @ViewChild('canvas', { static: true }) public canvasElementRef?: ElementRef;

    public grid: boolean = true;

    private mouseEvent: { down?: MouseEvent; up?: MouseEvent; } = {};
    private cellsSelected: { x: number; y: number; }[] = [];

    constructor(
        private readonly modulesService: ModulesService
    ) { }

    public onCanvasMouseDown(event: MouseEvent): void {
        this.mouseEvent = { down: event };
    }

    public onCanvasMouseUp(event: MouseEvent): void {
        this.mouseEvent.up = event;
        this.onCanvasMatrixSelection(this.mouseEvent);
    }

    public onLevelDataChange(levelData?: LevelDataType): void {
        const canvas = this.canvasElementRef?.nativeElement as HTMLCanvasElement;
        const context = canvas?.getContext('2d');
        if (levelData && canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = levelData.config.level_width * levelData.config.sprite_width;
            canvas.height = levelData.config.level_height * levelData.config.sprite_height;
            // Grid
            if (this.grid) {
                canvas.width += levelData.config.level_width + 1;
                canvas.height += levelData.config.level_height + 1;
                context.beginPath();
                context.globalAlpha = 0.5;
                context.strokeStyle = 'red';
                for (let x = 0; x <= levelData.config.level_width; x++) {
                    context.moveTo(x * (levelData.config.sprite_width + 1) + 0.5, 0); // 0.5 for 1 px stroke
                    context.lineTo(x * (levelData.config.sprite_width + 1) + 0.5, canvas.height); // 0.5 for 1 px stroke
                    context.stroke();
                }
                for (let y = 0; y <= levelData.config.level_height; y++) {
                    context.moveTo(0, y * (levelData.config.sprite_height + 1) + 0.5); // 0.5 for 1 px stroke
                    context.lineTo(canvas.width, y * (levelData.config.sprite_height + 1) + 0.5); // 0.5 for 1 px stroke
                    context.stroke();
                }
                context.closePath();
            }
        }
    }

    //

    private onCanvasMatrixSelection(mouseEvent: { down?: MouseEvent; up?: MouseEvent; }): void {
        const canvas = this.canvasElementRef?.nativeElement as HTMLCanvasElement;
        const context = canvas?.getContext('2d');
        if (this.levelData && canvas && context) {
            const x1 = Math.floor(this.grid ? (mouseEvent.down!.offsetX / (this.levelData.config.sprite_width + 1)) : (mouseEvent.down!.offsetX / this.levelData.config.sprite_width));
            const y1 = Math.floor(this.grid ? (mouseEvent.down!.offsetY / (this.levelData.config.sprite_height + 1)) : (mouseEvent.down!.offsetY / this.levelData.config.sprite_height));
            const x2 = Math.floor(this.grid ? (mouseEvent.up!.offsetX / (this.levelData.config.sprite_width + 1)) : (mouseEvent.up!.offsetX / this.levelData.config.sprite_width));
            const y2 = Math.floor(this.grid ? (mouseEvent.up!.offsetY / (this.levelData.config.sprite_height + 1)) : (mouseEvent.up!.offsetY / this.levelData.config.sprite_height));
            const x_min = Math.min(x1, x2);
            const x_max = Math.max(x1, x2);
            const y_min = Math.min(y1, y2);
            const y_max = Math.max(y1, y2);
            this.cellsSelected = [];
            this.onLevelDataChange(this.levelData);
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
            this.onCanvasMatrixSelectionEmitter.emit(this.cellsSelected);
        }
    }

}
