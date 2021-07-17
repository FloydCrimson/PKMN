import { Component, Input, OnInit } from '@angular/core';
import { ModulesService } from '@node-cs/client';

@Component({
    selector: 'explorer-folder-component',
    templateUrl: './explorer-folder.component.html',
    styleUrls: ['./explorer-folder.component.scss']
})
export class ExplorerFolderComponent implements OnInit {

    @Input('parent') public parent?: ExplorerFolderComponent | string;
    @Input('name') public name?: string;

    public folders: string[] = [];
    public files: string[] = [];

    constructor(
        private readonly modulesService: ModulesService
    ) { }

    public async ngOnInit(): Promise<void> {
        const location = this.getLocation();
        const [err, list] = await this.modulesService.getMethod('fs', 'readdir')(location, { encoding: 'utf8' });
        if (!err && list?.length > 0) {
            for (const element of list) {
                if (element.includes('.')) {
                    this.files.push(element);
                } else {
                    this.folders.push(element);
                }
            }
        }
    }

    public getLocation(): string {
        if (typeof this.parent === 'string') {
            return this.parent + '/' + this.name;
        } else {
            return this.parent?.getLocation() + '/' + this.name;
        }
    }

}
