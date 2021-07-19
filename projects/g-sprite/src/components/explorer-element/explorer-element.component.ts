import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModulesService } from '@node-cs/client';

import { ExplorerImplementation } from '../../implementations/explorer.implementation';

@Component({
    selector: 'explorer-element-component',
    templateUrl: './explorer-element.component.html',
    styleUrls: ['./explorer-element.component.scss']
})
export class ExplorerElementComponent implements ExplorerImplementation {

    @Input('parent') public parent?: ExplorerImplementation;
    @Input('name') public name?: string;
    @Input('type') public type?: 'directory' | 'file' | 'unknown' = 'unknown';

    @Output('onSelectElement') public onSelectElementEmitter = new EventEmitter<ExplorerImplementation>();

    public elements?: { name: string; type: 'directory' | 'file' | 'unknown'; }[];
    public opened: boolean = false;
    public selected: boolean = false;

    constructor(
        private readonly modulesService: ModulesService
    ) { }

    public async onOpenOrCloseElement(): Promise<void> {
        if (this.type === 'directory') {
            this.opened = !this.opened;
            if (this.opened) {
                await this.onUpdateElement(false);
            }
        }
    }

    public async onUpdateElement(force: boolean): Promise<void> {
        if (this.type === 'directory') {
            const path = this.getPath();
            if (!path) {
                throw new Error('ExplorerElementComponent.updateElement => Unable to update element: "path" is undefined.');
            }
            if (force) {
                this.elements = undefined;
                this.opened = false;
                return;
            }
            if (!this.elements) {
                this.elements = [];
                const [err1, files] = await this.modulesService.getMethod('fs', 'readdir')(path, { encoding: 'utf8' });
                if (!err1 && files?.length > 0) {
                    for (const name of files) {
                        const [err2, stats] = await this.modulesService.getMethod('fs', 'lstat')(path + '/' + name, {});
                        if (!err2 && stats) {
                            const isDirectory = stats.isDirectory[1] ? null : stats.isDirectory[0];
                            const isFile = stats.isFile[1] ? null : stats.isFile[0];
                            if (isDirectory === null || isFile === null) {
                                this.elements.push({ name, type: 'unknown' });
                            } else if (isDirectory && !isFile) {
                                this.elements.push({ name, type: 'directory' });
                            } else if (isFile && !isDirectory) {
                                this.elements.push({ name, type: 'file' });
                            } else {
                                this.elements.push({ name, type: 'unknown' });
                            }
                        } else {
                            this.elements.push({ name, type: 'unknown' });
                        }
                    }
                }
            }
        }
    }

    public onSelectElement(element?: ExplorerImplementation): void {
        if (this.type === 'file') {
            if (element) {
                if (this === element) {
                    this.selected = !this.selected;
                    this.onSelectElementEmitter.emit(this.selected ? element : undefined);
                } else {
                    this.selected = false;
                }
            } else {
                this.onSelectElementEmitter.emit(undefined);
            }
        } else if (this !== element) {
            this.onSelectElementEmitter.emit(element);
        }
    }

    public getPath(): string | undefined {
        const path = this.parent?.getPath();
        const name = this.name;
        return (path && name) ? (path + '/' + name) : undefined;
    }

    public getRootElement(): ExplorerImplementation | undefined {
        const parent = this.parent?.getRootElement();
        return parent ? parent : undefined;
    }

}
