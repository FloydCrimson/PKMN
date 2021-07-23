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

export interface OptionDataImplementation<O> {
    [name: string]: {
        type: string;
        data: O;
    };
}
