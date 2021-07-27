import { Component } from '@angular/core';

import { LevelDataType } from '../../implementations/level.implementation';

@Component({
    selector: 'level-component',
    templateUrl: './level.component.html',
    styleUrls: ['./level.component.scss']
})
export class LevelComponent {

    public levelData?: LevelDataType;
    public cellsSelected: { x: number; y: number; }[] = [];

    public onLevelDataChange(levelData: LevelDataType): void {
        this.levelData = levelData;
    }

    public onCanvasMatrixSelection(cellsSelected: { x: number; y: number; }[]): void {
        this.cellsSelected = cellsSelected;
    }

}
