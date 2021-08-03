import { EventEmitter, ViewContainerRef } from '@angular/core';

export interface ExplorerImplementation {
    /** constructor */ viewContainerRef?: ViewContainerRef;
    /** @Input */ parent?: ExplorerImplementation;
    /** @Input */ name?: string;
    /** @Input */ type?: 'directory' | 'file' | 'unknown';
    /** @Input */ extensions?: string[];
    /** @Output */ onSelectElementEmitter: EventEmitter<ExplorerImplementation>;
    onUpdateElement(force: boolean): Promise<void>;
    onSelectElement(element?: ExplorerImplementation): void;
    getPath(): string | undefined;
    getRootElement(): ExplorerImplementation | undefined;
}
