import { EventEmitter } from '@angular/core';

import { OptionDataImplementation } from './option.implementation';

export interface LevelComponentImplementation {
    /** @Output */ onSaveLevelEmitter: EventEmitter<{ path: string; name: string; }>;
    /** @Output */ onLevelDataChangeEmitter: EventEmitter<LevelDataImplementation>;
}

export interface LevelDataImplementation {
    sprite_width: number;
    sprite_height: number;
    level_width: number;
    level_height: number;
    matrix: LevelDataCellImplementation[][];
};

export interface LevelDataCellImplementation {
    layers: LevelDataCellLayerImplementation[];
};

export interface LevelDataCellLayerImplementation {
    level: number;
    collision_type: LevelDataCellLayerCollisionTypeEnum;
    movement_type: LevelDataCellLayerMovementTypeEnum;
    sprites: {
        [index: string]: LevelDataCellLayerSpriteImplementation;
    };
};

export interface LevelDataCellLayerSpriteImplementation {
    location: string;
    name: string;
    image: string;
};

export enum LevelDataCellLayerCollisionTypeEnum {
    /** Normal type. Player can walk over it if the level is the same. */
    Floor = 'floor',
    /** Blocking type. Player can never walk over it and the level is ignored. */
    Wall = 'wall',
    /** Connecting type. Player can always walk over it and must be used to allow the player to change level. */
    Bridge = 'bridge'
}

export enum LevelDataCellLayerMovementTypeEnum {
    /** Normal type. Player can always walk over it. */
    Ground = 'ground',
    /** Special type. Player can walk over it only if special conditions are met (es. right pkm in party). */
    Water = 'water',
    /** Special type. Player can walk over it only if special conditions are met (es. right pkm in party). */
    Lava = 'lava',
    /** Special type. Player can walk over it only if special conditions are met (es. right pkm in party). */
    Air = 'air'
}

export type LevelImageType = {
    option: OptionDataImplementation;
    name: string;
    image: string;
    id: string;
};
