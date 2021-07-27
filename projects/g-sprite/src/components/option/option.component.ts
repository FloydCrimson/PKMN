import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { ModulesService } from '@node-cs/client';

import { OptionComponentImplementation, OptionDataImplementation } from '../../implementations/option.implementation';
import { ExplorerImplementation } from '../../implementations/explorer.implementation';

@Component({
    selector: 'option-component',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss']
})
export class OptionComponent {

    @Input('explorerComponentImagesSelectElement') public explorerComponentImagesSelectElement?: ExplorerImplementation;
    @Input('explorerComponentOptionSelectElement') public explorerComponentOptionSelectElement?: ExplorerImplementation;
    @Input('explorerComponentOptionSelectSprite') public explorerComponentOptionSelectSprite?: OptionDataImplementation['sprites'];

    @ViewChildren('block') public options?: QueryList<OptionComponentImplementation>;

    public optionData?: OptionDataImplementation['sprites'];
    public optionDraw?: { x: number; y: number; w: number; h: number; }[];

    constructor(
        private readonly modulesService: ModulesService
    ) { }

    public onOpenOrCloseOption(option: OptionComponentImplementation): void {
        const array = this.options?.toArray();
        if (array) {
            const position = array.indexOf(option);
            const opened = array[position].opened;
            if (!opened) {
                array.forEach((_, index) => option.opened = index === position);
            }
        }
    }

    public async onSaveOption(): Promise<void> {
        const imagePath = this.explorerComponentImagesSelectElement?.getPath();
        const rootPath = this.explorerComponentImagesSelectElement?.getRootElement()?.getPath();
        if (imagePath && rootPath) {
            const location = imagePath.replace(rootPath + '/images', '');
            const jsonPath = rootPath.replace('/projects/game/', '/projects/g-sprite/') + '/images' + location.split('.').slice(0, -1).join('') + '.json';
            const exists = await this.modulesService.getMethod('fs', 'access')(jsonPath, 'F_OK').then(_ => true).catch(_ => false);
            const json: OptionDataImplementation = exists ?
                JSON.parse(await this.modulesService.getMethod('fs', 'readFile')(jsonPath, { encoding: 'utf8' })) :
                { location, sprites: {} };
            if (await this.showConfirmDialog(json.sprites, this.optionData!)) {
                Object.assign(json.sprites, this.optionData);
                const saved = await this.modulesService.getMethod('fs', 'writeFile')(jsonPath, JSON.stringify(json, undefined, '\t'), { encoding: 'utf8' }).then(_ => true).catch(_ => false);
                alert(saved ? 'Data saved.' : 'Data not saved.');
            }
        }
    }

    public onOptionDataChange(optionData: OptionDataImplementation['sprites']): void {
        this.optionData = optionData;
    }

    public onOptionDrawChange(optionDraw?: { x: number; y: number; w: number; h: number; }[]): void {
        this.optionDraw = optionDraw;
    }

    //

    private async showConfirmDialog(optionDataSaved: OptionDataImplementation['sprites'], optionDataNew: OptionDataImplementation['sprites']): Promise<boolean> {
        const keys = optionDataNew ? Object.keys(optionDataNew) : [];
        if (keys.length !== 1) {
            return false;
        }
        return (keys[0] in optionDataSaved) ? window.confirm('Data "' + keys[0] + '" already saved. Overwrite?') : true;
    }

}
