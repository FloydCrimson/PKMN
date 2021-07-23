import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { ModulesService } from '@node-cs/client';

import { OptionDataImplementation, OptionImplementation } from '../../implementations/option.implementation';
import { ExplorerImplementation } from '../../implementations/explorer.implementation';

@Component({
    selector: 'option-component',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss']
})
export class OptionComponent {

    @Input('selectedElement') public selectedElement?: ExplorerImplementation;

    @ViewChildren('block') public options?: QueryList<OptionImplementation>;

    public optionData?: OptionDataImplementation<any>;
    public optionDraw?: { x: number; y: number; w: number; h: number; }[];

    constructor(
        private readonly modulesService: ModulesService
    ) { }

    public onOpenOrCloseOption(option: OptionImplementation): void {
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
        const imagePath = this.selectedElement?.getPath();
        const rootPath = this.selectedElement?.getRootElement()?.getPath();
        if (imagePath && rootPath) {
            const location = imagePath.replace(rootPath + '/images', '');
            const jsonPath = rootPath + '/jsons' + location.split('.').slice(0, -1).join('') + '.json';
            const exists = await this.modulesService.getMethod('fs', 'access')(jsonPath, 'F_OK').then(_ => true).catch(_ => false);
            const json = exists ?
                JSON.parse(await this.modulesService.getMethod('fs', 'readFile')(jsonPath, { encoding: 'utf8' })) :
                { location, sprites: {} };
            Object.assign(json.sprites, this.optionData);
            const saved = await this.modulesService.getMethod('fs', 'writeFile')(jsonPath, JSON.stringify(json, undefined, '\t'), { encoding: 'utf8' }).then(_ => true).catch(_ => false);
            console.log(exists, saved, json);
        }
    }

    public onOptionDataChange(optionData: OptionDataImplementation<any>): void {
        this.optionData = optionData;
    }

    public onOptionDrawChange(optionDraw?: { x: number; y: number; w: number; h: number; }[]): void {
        this.optionDraw = optionDraw;
    }

}
