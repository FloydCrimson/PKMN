import { Component, EventEmitter, Output } from '@angular/core';
import { ExplorerImplementation } from '../../implementations/explorer.implementation';
import { LevelDataImplementation } from '../../implementations/level.implementation';

import { ExplorerElementComponent } from '../explorer-element/explorer-element.component';

@Component({
    selector: 'explorer-element-level-component',
    templateUrl: './explorer-element-level.component.html',
    styleUrls: ['./explorer-element-level.component.scss']
})
export class ExplorerElementLevelComponent extends ExplorerElementComponent {

    @Output('onSelectLevel') public onSelectLevelEmitter = new EventEmitter<{ path: string; name: string; data: LevelDataImplementation; }>();

    public async onSelectElement(element?: ExplorerImplementation): Promise<void> {
        if (element?.type === 'file') {
            const jsonPath = this.getPath();
            const rootPath = this.getRootElement()?.getPath();
            if (!jsonPath) {
                throw new Error('ExplorerElementLevelComponent.onSelectElement => Unable to update element: "path" is undefined.');
            }
            if (!rootPath) {
                throw new Error('ExplorerElementLevelComponent.onSelectElement => Unable to update element: "rootPath" is undefined.');
            }
            const path = jsonPath.replace(rootPath + '/images', '');
            const name = jsonPath.split(/\/|\\/).pop()!;
            const data: LevelDataImplementation = JSON.parse(await this.modulesService.getMethod('fs', 'readFile')(jsonPath, { encoding: 'utf8' }));
            this.onSelectLevel({ path, name, data });
        }
        await super.onSelectElement(element);
    }

    public onSelectLevel(data: { path: string; name: string; data: LevelDataImplementation; }): void {
        this.onSelectLevelEmitter.emit(data);
    }

}
