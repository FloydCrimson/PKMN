import { EventEmitter } from '@angular/core';

import { ExplorerImplementation } from './explorer.implementation';

export interface OptionImplementation {
    /** @Input */ selectedElement?: ExplorerImplementation;
    /** @Output */ onOpenOrCloseOptionEmitter: EventEmitter<OptionImplementation>;
    /** @Output */ onSaveOptionEmitter: EventEmitter<void>;
    /** @Output */ onOptionDataChangeEmitter: EventEmitter<OptionDataImplementation<any>>;
    /** @Output */ onOptionDrawChangeEmitter: EventEmitter<{ x: number; y: number; w: number; h: number; }[]>;
    opened: boolean;
}

export interface OptionJSONImplementation {
    location: string;
    sprites: OptionDataImplementation<keyof OptionComponentDataTypeImplementation>;
}

export interface OptionDataImplementation<K extends keyof OptionComponentDataTypeImplementation> {
    [name: string]: {
        type: K;
        data: OptionComponentDataTypeImplementation[K];
    };
}

export interface OptionComponentDataTypeImplementation {
    'block': OptionBlockComponentDataType;
    'array': OptionArrayComponentDataType;
}

export type OptionBlockComponentDataType = {
    sprite_width: number;
    sprite_height: number;
    block_width: number;
    block_height: number;
    cells: {
        [suffix: string]: number;
    }
};

export type OptionArrayComponentDataType = {
    sprite_width: number;
    sprite_height: number;
    block_width: number;
    block_height: number;
};
