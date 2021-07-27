import { Component, EventEmitter, Output } from '@angular/core';

import { LevelDataType, LevelComponentImplementation } from '../../implementations/level.implementation';

@Component({
    selector: 'level-config-component',
    templateUrl: './level-config.component.html',
    styleUrls: ['./level-config.component.scss']
})
export class LevelConfigComponent implements LevelComponentImplementation {

    @Output('onSaveLevel') public onSaveLevelEmitter = new EventEmitter();

    public error: string = '';
    public name: string = '';
    public levelUI: LevelDataUIType = this.initialize();

    constructor() {
        this.update();
    }

    public onSaveLevel(): void {
        this.onSaveLevelEmitter.emit();
    }

    //

    private initialize(data?: LevelDataType): LevelDataUIType {
        if (data) {
            return {
                config: {
                    sprite_width: data.config.sprite_width.toString(),
                    sprite_height: data.config.sprite_height.toString(),
                    level_width: data.config.level_width.toString(),
                    level_height: data.config.level_height.toString()
                },
                matrix: data.matrix
            };
        } else {
            return {
                config: {
                    sprite_width: '1',
                    sprite_height: '1',
                    level_width: '1',
                    level_height: '1',
                },
                matrix: [[{}]]
            };
        }
    }

    public update(): void {
        // Parse
        const name = this.name.trim();
        const sprite_width = this.levelUI.config.sprite_width ? parseInt(this.levelUI.config.sprite_width) : undefined;
        const sprite_height = this.levelUI.config.sprite_height ? parseInt(this.levelUI.config.sprite_height) : undefined;
        const level_width = this.levelUI.config.level_width ? parseInt(this.levelUI.config.level_width) : undefined;
        const level_height = this.levelUI.config.level_height ? parseInt(this.levelUI.config.level_height) : undefined;
        // Check
        if (!name) {
            this.error = '"name" must be defined.';
            return;
        }
        if (!sprite_width || sprite_width < 1) {
            this.error = '"sprite_width" must be more or equal than 1.';
            return;
        }
        if (!sprite_height || sprite_height < 1) {
            this.error = '"sprite_height" must be more or equal than 1.';
            return;
        }
        if (!level_width || level_width < 1) {
            this.error = '"level_width" must be more or equal than 1.';
            return;
        }
        if (!level_height || level_height < 1) {
            this.error = '"level_height" must be more or equal than 1.';
            return;
        }
        this.error = '';
    }

}

type LevelDataUIType = {
    config: {
        sprite_width: string;
        sprite_height: string;
        level_width: string;
        level_height: string;
    };
    matrix: any[][];
};
