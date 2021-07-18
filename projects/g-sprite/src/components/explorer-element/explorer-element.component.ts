import { Component, Input, OnInit } from '@angular/core';
import { ModulesService } from '@node-cs/client';

@Component({
    selector: 'explorer-element-component',
    templateUrl: './explorer-element.component.html',
    styleUrls: ['./explorer-element.component.scss']
})
export class ExplorerElementComponent implements OnInit {

    @Input('parent') public parent?: ExplorerElementComponent | string;
    @Input('name') public name?: string;
    @Input('type') public type?: 'directory' | 'file' | 'unknown';

    public elements: { name: string; type: 'directory' | 'file' | 'unknown'; }[] = [];

    constructor(
        private readonly modulesService: ModulesService
    ) { }

    public async ngOnInit(): Promise<void> {
        if (this.type === 'directory') {
            const location = this.getPath();
            const [err1, files] = await this.modulesService.getMethod('fs', 'readdir')(location, { encoding: 'utf8' });
            if (!err1 && files?.length > 0) {
                for (const name of files) {
                    const [err2, stats] = await this.modulesService.getMethod('fs', 'lstat')(location + '/' + name, {});
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

    public getPath(): string {
        if (typeof this.parent === 'string') {
            return this.parent + '/' + this.name;
        } else {
            return this.parent?.getPath() + '/' + this.name;
        }
    }

}
