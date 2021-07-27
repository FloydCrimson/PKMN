import { Component, EventEmitter, Output } from '@angular/core';
import { OptionDataSpritesTypeImplementation, OptionDataImplementation } from '../../implementations/option.implementation';

import { ExplorerElementComponent } from '../explorer-element/explorer-element.component';

@Component({
    selector: 'explorer-element-option-component',
    templateUrl: './explorer-element-option.component.html',
    styleUrls: ['./explorer-element-option.component.scss']
})
export class ExplorerElementOptionComponent extends ExplorerElementComponent {

    @Output('onSelectSprite') public onSelectSpriteEmitter = new EventEmitter<OptionDataImplementation['sprites']>();

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
                throw new Error('ExplorerElementOptionComponent.updateElement => Unable to update element: "path" is undefined.');
            }
            if (force) {
                this.elements = undefined;
                this.opened = false;
                return;
            }
            if (!this.sprites) {
                this.sprites = [];
                const json: OptionDataImplementation = JSON.parse(await this.modulesService.getMethod('fs', 'readFile')(path, { encoding: 'utf8' }));
                for (const name in json.sprites) {
                    const optionData = json.sprites[name];
                    this.sprites.push({ name, type: optionData.type, data: optionData.data, selected: false });
                }
            }
        }
    }

    public onSelectSprite(sprite?: OptionDataImplementation['sprites']): void {
        this.onSelectSpriteEmitter.emit(sprite);
    }

    public onSelectSpriteUI(sprite: SpriteUI): void {
        const position = this.sprites!.indexOf(sprite);
        this.sprites!.forEach((sprite, index) => sprite.selected = index === position ? !sprite.selected : false);
        this.onSelectSprite(sprite.selected ? { [sprite.name]: { type: sprite.type, data: sprite.data } } : undefined);
    }

}

type SpriteUI<K extends keyof OptionDataSpritesTypeImplementation = keyof OptionDataSpritesTypeImplementation> = {
    name: string;
    type: K;
    data: OptionDataSpritesTypeImplementation[K];
    selected: boolean;
};
