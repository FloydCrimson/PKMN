import { Component, EventEmitter, Input, Output } from '@angular/core';

import { OptionDataSpritesBlockType, OptionDataSpritesImplementation, OptionComponentImplementation, OptionDataImplementation } from '../../implementations/option.implementation';

@Component({
    selector: 'option-block-component',
    templateUrl: './option-block.component.html',
    styleUrls: ['./option-block.component.scss']
})
export class OptionBlockComponent implements OptionComponentImplementation {

    private _explorerComponentOptionSelectSprite?: OptionDataImplementation['sprites'];
    @Input('explorerComponentOptionSelectSprite') public set explorerComponentOptionSelectSprite(explorerComponentOptionSelectSprite: OptionDataImplementation['sprites'] | undefined) {
        this._explorerComponentOptionSelectSprite = explorerComponentOptionSelectSprite;
        if (this._explorerComponentOptionSelectSprite) {
            this.name = Object.keys(this._explorerComponentOptionSelectSprite).pop()!;
            const sprite = this._explorerComponentOptionSelectSprite[this.name];
            if (sprite.type === 'block') {
                this.optionUI = this.initialize(sprite.data as OptionDataSpritesBlockType);
                this.update();
            }
        }
    };
    public get explorerComponentOptionSelectSprite(): OptionDataImplementation['sprites'] | undefined {
        return this._explorerComponentOptionSelectSprite;
    };

    @Output('onOpenOrCloseOption') public onOpenOrCloseOptionEmitter = new EventEmitter<OptionComponentImplementation>();
    @Output('onSaveOption') public onSaveOptionEmitter = new EventEmitter();
    @Output('onOptionDataChange') public onOptionDataChangeEmitter = new EventEmitter<OptionDataSpritesImplementation<'block'>>();
    @Output('onOptionDrawChange') public onOptionDrawChangeEmitter = new EventEmitter<{ x: number; y: number; w: number; h: number; }[]>();

    public opened: boolean = true;
    public error: string = '';
    public name: string = '';
    public optionUI: OptionDataSpritesBlockUIType = this.initialize();

    private option?: OptionDataSpritesBlockType;

    constructor() {
        this.update();
    }

    public onOpenOrCloseOption(): void {
        this.onOpenOrCloseOptionEmitter.emit(this);
    }

    public onSaveOption(): void {
        this.onSaveOptionEmitter.emit();
    }

    //

    private initialize(data?: OptionDataSpritesBlockType): OptionDataSpritesBlockUIType {
        if (data) {
            return {
                sprite_width: data.sprite_width.toString(),
                sprite_height: data.sprite_height.toString(),
                block_width: data.block_width.toString(),
                block_height: data.block_height.toString(),
                array: Object.keys(data.array).reduce((pv, cv) => {
                    const index = parseInt(cv);
                    const name = data.array[index];
                    pv[index].name = name;
                    return pv;
                }, new Array(data.block_width * data.block_height).fill({}).map(_ => { return { name: '', selected: false }; }))
            };
        } else {
            return {
                sprite_width: '1',
                sprite_height: '1',
                block_width: '1',
                block_height: '1',
                array: [{
                    name: '',
                    selected: false
                }]
            };
        }
    }

    public onCellSelectedChange(cell: { name: string; selected: boolean; }, index: number): void {
        for (let i = 0; i < this.optionUI.array.length; i++) {
            if (index === i) {
                this.optionUI.array[i].selected = !cell.selected;
            } else {
                this.optionUI.array[i].selected = false;
            }
        }
        this.update();
    }

    public update(): void {
        // Parse
        const name = this.name.trim();
        const sprite_width = this.optionUI.sprite_width ? parseInt(this.optionUI.sprite_width) : undefined;
        const sprite_height = this.optionUI.sprite_height ? parseInt(this.optionUI.sprite_height) : undefined;
        const block_width = this.optionUI.block_width ? parseInt(this.optionUI.block_width) : undefined;
        const block_height = this.optionUI.block_height ? parseInt(this.optionUI.block_height) : undefined;
        // Check
        if (!name) {
            this.error = '"name" must be defined.';
            return;
        }
        if (!sprite_width || sprite_width < 1) {
            this.error = '"sprite_width" must be more or equal than 1.';
            return;
        }
        if (!sprite_height || sprite_height < 1) {
            this.error = '"sprite_height" must be more or equal than 1.';
            return;
        }
        if (!block_width || block_width < 1) {
            this.error = '"block_width" must be more or equal than 1.';
            return;
        }
        if (!block_height || block_height < 1) {
            this.error = '"block_height" must be more or equal than 1.';
            return;
        }
        const length = block_width * block_height;
        if (length > this.optionUI.array.length) {
            for (let i = this.optionUI.array.length; i < length; i++) {
                this.optionUI.array.push({ name: '', selected: false });
            }
        } else if (length < this.optionUI.array.length) {
            this.optionUI.array.splice(length);
        }
        const array = this.optionUI.array.map((cell) => {
            cell.name = cell.name.trim();
            return cell;
        });
        if (array.every((cell) => !cell.name)) {
            this.error = 'at least one "cell.suffix" must be defined.';
            return;
        }
        this.error = '';
        // OptionData
        this.option = {
            sprite_width,
            sprite_height,
            block_width,
            block_height,
            array: array.reduce<OptionDataSpritesBlockType['array']>((pv, cv, i) => {
                if (cv.name.length > 0) {
                    pv[i.toString()] = cv.name;
                }
                return pv;
            }, {})
        };
        this.onOptionDataChangeEmitter.emit({ [name]: { type: 'block', data: this.option } });
        // OptionDraw
        const selectedIndex = array.findIndex((cell) => cell.selected);
        const draw = array.reduce<{ x: number; y: number; w: number; h: number; }[]>((pv, cv, i) => {
            if (cv.name.length > 0 && (selectedIndex < 0 || selectedIndex === i)) {
                const x = i % block_width;
                const y = (i - x) / block_width;
                pv.push({ x: x * sprite_width, y: y * sprite_height, w: sprite_width, h: sprite_height });
            }
            return pv;
        }, []);
        this.onOptionDrawChangeEmitter.emit(draw);
    }

}

type OptionDataSpritesBlockUIType = {
    sprite_width: string;
    sprite_height: string;
    block_width: string;
    block_height: string;
    array: {
        name: string;
        selected: boolean;
    }[]
};
