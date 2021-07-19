import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

import { ExplorerImplementation } from '../../implementations/explorer.implementation';

@Component({
    selector: 'explorer-component',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements ExplorerImplementation {

    @Input('root') public root?: string;

    @Output('onSelectElement') public onSelectElementEmitter = new EventEmitter<ExplorerImplementation>();

    @ViewChild('element', { static: true }) public element?: ExplorerImplementation;

    public parent?: ExplorerImplementation;
    public name?: string = 'images';
    public type?: 'directory' | 'file' | 'unknown' = 'directory';
    public selectedElement?: ExplorerImplementation;

    public async onUpdateElement(force: boolean): Promise<void> {
        await this.element?.onUpdateElement(force);
        this.onSelectElement(undefined);
    }

    public onSelectElement(element?: ExplorerImplementation): void {
        if (this.selectedElement && element) {
            this.selectedElement.onSelectElement(element);
        }
        this.onSelectElementEmitter.emit(this.selectedElement = element);
    }

    public getPath(): string | undefined {
        return this.root;
    }

    public getRootElement(): ExplorerImplementation | undefined {
        return this;
    }

}
