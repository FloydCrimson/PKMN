import { Component, EventEmitter, Output } from '@angular/core';

import { LevelImageType } from '../../implementations/level.implementation';
import { OptionDataSpritesTypeImplementation, OptionDataImplementation } from '../../implementations/option.implementation';
import { ExplorerElementComponent } from '../explorer-element/explorer-element.component';

@Component({
    selector: 'explorer-element-option-sprite-component',
    templateUrl: './explorer-element-option-sprite.component.html',
    styleUrls: ['./explorer-element-option-sprite.component.scss']
})
export class ExplorerElementOptionSpriteComponent extends ExplorerElementComponent {

    @Output('onSelectImage') public onSelectImageEmitter = new EventEmitter<LevelImageType>();

    public sprites?: SpriteUI[];

    private option?: OptionDataImplementation;

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
                this.option = JSON.parse(await this.modulesService.getMethod('fs', 'readFile')(path, { encoding: 'utf8' }));
                for (const name in this.option!.sprites) {
                    const optionData = this.option!.sprites[name];
                    const spriteUI: SpriteUI = { name, type: optionData.type, data: optionData.data, images: [] };
                    if (spriteUI.type === 'block') {
                        const data = spriteUI.data as SpriteUI<'block'>['data'];
                        for (const index in data.array) {
                            spriteUI.images.push({ name: index, text: data.array[index], selected: false });
                        }
                    }
                    this.sprites.push(spriteUI);
                }
            }
        }
    }

    public onSelectImage(data?: LevelImageType): void {
        this.onSelectImageEmitter.emit(data);
    }

    public onSelectSpriteUI(sprite: SpriteUI, image: { name: string; text: string; selected: boolean; }): void {
        const position1 = this.sprites!.indexOf(sprite);
        const position2 = this.sprites![position1].images.indexOf(image);
        this.sprites!.forEach((sprite, index1) => sprite.images.forEach((image, index2) => image.selected = (index1 === position1) ? ((index2 === position2) ? !image.selected : false) : false));
        this.onSelectImage(image.selected ? { option: this.option!, name: sprite.name, image: image.name, id: this.option!.location + ':' + sprite.name + ':' + image.text } : undefined);
    }

}

type SpriteUI<K extends keyof OptionDataSpritesTypeImplementation = keyof OptionDataSpritesTypeImplementation> = {
    name: string;
    type: K;
    data: OptionDataSpritesTypeImplementation[K];
    images: { name: string; text: string; selected: boolean; }[];
};
