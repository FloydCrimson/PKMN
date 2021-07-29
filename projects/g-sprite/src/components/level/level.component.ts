import { Component, Input } from '@angular/core';

import { LevelDataType, LevelImageType } from '../../implementations/level.implementation';

@Component({
    selector: 'level-component',
    templateUrl: './level.component.html',
    styleUrls: ['./level.component.scss']
})
export class LevelComponent {

    @Input('explorerComponentOptionSpritesSelectImage') public explorerComponentOptionSpritesSelectImage?: LevelImageType;

    public levelData?: LevelDataType;
    public cellsSelected: { x: number; y: number; }[] = [];

    public onLevelDataChange(levelData: LevelDataType): void {
        this.levelData = levelData;
    }

    public onCanvasMatrixSelection(cellsSelected: { x: number; y: number; }[]): void {
        this.cellsSelected = cellsSelected;
    }

}
