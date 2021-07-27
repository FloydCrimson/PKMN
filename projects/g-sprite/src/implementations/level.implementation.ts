import { EventEmitter } from '@angular/core';

export interface LevelComponentImplementation {
    /** @Output */ onSaveLevelEmitter: EventEmitter<void>;
}

export type LevelDataType = {
    config: {
        sprite_width: number;
        sprite_height: number;
        level_width: number;
        level_height: number;
    };
    matrix: LevelDataCellType[][];
};

export type LevelDataCellType = {

};
