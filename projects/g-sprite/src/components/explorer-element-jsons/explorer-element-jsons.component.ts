import { Component, EventEmitter, Output } from '@angular/core';
import { OptionComponentDataTypeImplementation, OptionJSONImplementation } from '../../implementations/option.implementation';

import { ExplorerElementComponent } from '../explorer-element/explorer-element.component';

@Component({
    selector: 'explorer-element-jsons-component',
    templateUrl: './explorer-element-jsons.component.html',
    styleUrls: ['./explorer-element-jsons.component.scss']
})
export class ExplorerElementJSONsComponent extends ExplorerElementComponent {

    @Output('onSelectSprite') public onSelectSpriteEmitter = new EventEmitter<OptionJSONImplementation['sprites']>();

    public sprites?: SpriteUI[];

    public async onOpenOrCloseElement(): Promise<void> {
        if (this.type === 'directory' || this.type === 'file') {
            this.opened = !this.opened;
            if (this.opened) {
                await this.onUpdateElement(false);
            }
        }
    }

    public async onUpdateElement(force: boolean): Promise<void> {
        if (this.type === 'directory') {
            return super.onUpdateElement(force);
        } else if (this.type === 'file') {
            const path = this.getPath();
            if (!path) {
                throw new Error('ExplorerElementJSONsComponent.updateElement => Unable to update element: "path" is undefined.');
            }
            if (force) {
                this.elements = undefined;
                this.opened = false;
                return;
            }
            if (!this.sprites) {
                this.sprites = [];
                const json: OptionJSONImplementation = JSON.parse(await this.modulesService.getMethod('fs', 'readFile')(path, { encoding: 'utf8' }));
                for (const name in json.sprites) {
                    const optionData = json.sprites[name];
                    this.sprites.push({ name, type: optionData.type, data: optionData.data, selected: false });
                }
            }
        }
    }

    public onSelectSprite(sprite?: OptionJSONImplementation['sprites']): void {
        this.onSelectSpriteEmitter.emit(sprite);
    }

    public onSelectSpriteUI(sprite: SpriteUI): void {
        const position = this.sprites!.indexOf(sprite);
        this.sprites!.forEach((sprite, index) => sprite.selected = index === position ? !sprite.selected : false);
        this.onSelectSprite(sprite.selected ? { [sprite.name]: { type: sprite.type, data: sprite.data } } : undefined);
    }

}

type SpriteUI<K extends keyof OptionComponentDataTypeImplementation = keyof OptionComponentDataTypeImplementation> = {
    name: string;
    type: K;
    data: OptionComponentDataTypeImplementation[K];
    selected: boolean;
};
