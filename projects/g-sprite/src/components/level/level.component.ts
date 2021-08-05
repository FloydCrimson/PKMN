import { Component, Input } from '@angular/core';
import { ModulesService } from '@node-cs/client';

import { LevelDataCellLayerCollisionTypeEnum, LevelDataCellLayerMovementTypeEnum, LevelDataImplementation, LevelImageType } from '../../implementations/level.implementation';

@Component({
    selector: 'level-component',
    templateUrl: './level.component.html',
    styleUrls: ['./level.component.scss']
})
export class LevelComponent {

    @Input('root') public root?: string;
    @Input('explorerComponentOptionSpritesSelectImage') public explorerComponentOptionSpritesSelectImage?: LevelImageType;

    public levelData?: LevelDataImplementation;
    public levelDraw?: { x: number; y: number; layers: { level: number; collision_type: LevelDataCellLayerCollisionTypeEnum; movement_type: LevelDataCellLayerMovementTypeEnum; images: { id: string; src: string; }[]; }[]; }[];
    public cellsSelected: { x: number; y: number; }[] = [];

    constructor(
        private readonly modulesService: ModulesService
    ) { }

    public async onSaveLevel(path: string, name: string): Promise<void> {
        const jsonPath = await this.modulesService.getMethod('path', 'join')('default', this.root!, path, name + '.json');
        const exists = await this.modulesService.getMethod('fs', 'access')(jsonPath, 'F_OK').then(_ => true).catch(_ => false);
        if (!exists) {
            const jsonDir = jsonPath.split(/\\|\//).filter(f => f).slice(0, -1).join('/');
            await this.modulesService.getMethod('fs', 'mkdir')(jsonDir, { recursive: true });
        }
        const saved = await this.modulesService.getMethod('fs', 'writeFile')(jsonPath, JSON.stringify(this.levelData, undefined, '\t'), { encoding: 'utf8' }).then(_ => true).catch(_ => false);
        alert(saved ? 'Data saved.' : 'Data not saved.');
    }

    public onLevelDataChange(levelData: LevelDataImplementation): void {
        this.levelData = levelData;
    }

    public onLevelDrawChange(levelDraw?: { x: number; y: number; layers: { level: number; collision_type: LevelDataCellLayerCollisionTypeEnum; movement_type: LevelDataCellLayerMovementTypeEnum; images: { id: string; src: string; }[]; }[]; }[]): void {
        this.levelDraw = levelDraw;
    }

    public onCanvasMatrixSelection(cellsSelected: { x: number; y: number; }[]): void {
        this.cellsSelected = cellsSelected;
    }

}
