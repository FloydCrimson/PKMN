import { EventEmitter } from '@angular/core';

export interface OptionComponentImplementation {
    /** @Output */ onOpenOrCloseOptionEmitter: EventEmitter<OptionComponentImplementation>;
    /** @Output */ onSaveOptionEmitter: EventEmitter<void>;
    /** @Output */ onOptionDataChangeEmitter: EventEmitter<OptionDataSpritesImplementation<any>>;
    /** @Output */ onOptionDrawChangeEmitter: EventEmitter<{ x: number; y: number; w: number; h: number; }[]>;
    opened: boolean;
}

export interface OptionDataImplementation {
    location: string;
    sprites: OptionDataSpritesImplementation<keyof OptionDataSpritesTypeImplementation>;
}

export interface OptionDataSpritesImplementation<K extends keyof OptionDataSpritesTypeImplementation> {
    [name: string]: {
        type: K;
        data: OptionDataSpritesTypeImplementation[K];
    };
}

export interface OptionDataSpritesTypeImplementation {
    'block': OptionDataSpritesBlockType;
    'array': OptionDataSpritesArrayType;
}

export type OptionDataSpritesBlockType = {
    sprite_width: number;
    sprite_height: number;
    block_width: number;
    block_height: number;
    cells: {
        [suffix: string]: number;
    }
};

export type OptionDataSpritesArrayType = {
    sprite_width: number;
    sprite_height: number;
    block_width: number;
    block_height: number;
};
