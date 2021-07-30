import { EventEmitter } from '@angular/core';

import { OptionDataImplementation } from './option.implementation';

export interface LevelComponentImplementation {
    /** @Output */ onSaveLevelEmitter: EventEmitter<void>;
    /** @Output */ onLevelDataChangeEmitter: EventEmitter<LevelDataType>;
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

export type LevelImageType = {
    option: OptionDataImplementation;
    name: string;
    image: string;
    id: string;
};
