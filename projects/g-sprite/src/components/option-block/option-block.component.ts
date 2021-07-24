import { Component, EventEmitter, Input, Output } from '@angular/core';

import { OptionBlockComponentDataType, OptionDataImplementation, OptionImplementation, OptionJSONImplementation } from '../../implementations/option.implementation';

@Component({
    selector: 'option-block-component',
    templateUrl: './option-block.component.html',
    styleUrls: ['./option-block.component.scss']
})
export class OptionBlockComponent implements OptionImplementation {

    private _explorerComponentJSONsSelectSprite?: OptionJSONImplementation['sprites'];
    @Input('explorerComponentJSONsSelectSprite') public set explorerComponentJSONsSelectSprite(explorerComponentJSONsSelectSprite: OptionJSONImplementation['sprites'] | undefined) {
        this._explorerComponentJSONsSelectSprite = explorerComponentJSONsSelectSprite;
        if (this._explorerComponentJSONsSelectSprite) {
            this.name = Object.keys(this._explorerComponentJSONsSelectSprite).pop()!;
            const sprite = this._explorerComponentJSONsSelectSprite[this.name];
            if (sprite.type === 'block') {
                this.optionUI = this.initialize(sprite.data as OptionBlockComponentDataType);
                this.update();
            }
        }
    };
    public get explorerComponentJSONsSelectSprite(): OptionJSONImplementation['sprites'] | undefined {
        return this._explorerComponentJSONsSelectSprite;
    };

    @Output('onOpenOrCloseOption') public onOpenOrCloseOptionEmitter = new EventEmitter<OptionImplementation>();
    @Output('onSaveOption') public onSaveOptionEmitter = new EventEmitter();
    @Output('onOptionDataChange') public onOptionDataChangeEmitter = new EventEmitter<OptionDataImplementation<'block'>>();
    @Output('onOptionDrawChange') public onOptionDrawChangeEmitter = new EventEmitter<{ x: number; y: number; w: number; h: number; }[]>();

    public opened: boolean = true;
    public error: string = '';
    public name: string = '';
    public optionUI: OptionBlockComponentUIType = this.initialize();

    private option?: OptionBlockComponentDataType;

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

    private initialize(data?: OptionBlockComponentDataType): OptionBlockComponentUIType {
        if (data) {
            return {
                sprite_width: data.sprite_width.toString(),
                sprite_height: data.sprite_height.toString(),
                block_width: data.block_width.toString(),
                block_height: data.block_height.toString(),
                cells: Object.keys(data.cells).reduce((pv, cv) => {
                    const index = data.cells[cv];
                    pv[index].suffix = cv;
                    return pv;
                }, new Array(data.block_width * data.block_height).fill({}).map(_ => { return { suffix: '', selected: false }; }))
            };
        } else {
            return {
                sprite_width: '1',
                sprite_height: '1',
                block_width: '1',
                block_height: '1',
                cells: [{
                    suffix: '',
                    selected: false
                }]
            };
        }
    }

    public onCellSelectedChange(cell: { suffix: string; selected: boolean; }, index: number): void {
        for (let i = 0; i < this.optionUI.cells.length; i++) {
            if (index === i) {
                this.optionUI.cells[i].selected = !cell.selected;
            } else {
                this.optionUI.cells[i].selected = false;
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
        if (!block_height || block_height < 1) {
            this.error = '"block_height" must be more or equal than 1.';
            return;
        }
        const length = block_width * block_height;
        if (length > this.optionUI.cells.length) {
            for (let i = this.optionUI.cells.length; i < length; i++) {
                this.optionUI.cells.push({ suffix: '', selected: false });
            }
        } else if (length < this.optionUI.cells.length) {
            this.optionUI.cells.splice(length);
        }
        const cells = this.optionUI.cells.map((cell) => {
            cell.suffix = cell.suffix.trim();
            return cell;
        });
        if (cells.every((cell) => !cell.suffix)) {
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
            cells: cells.reduce<OptionBlockComponentDataType['cells']>((pv, cv, i) => {
                if (cv.suffix.length > 0) {
                    pv[cv.suffix] = i;
                }
                return pv;
            }, {})
        };
        this.onOptionDataChangeEmitter.emit({ [name]: { type: 'block', data: this.option } });
        // OptionDraw
        const selectedIndex = cells.findIndex((cell) => cell.selected);
        const draw = cells.reduce<{ x: number; y: number; w: number; h: number; }[]>((pv, cv, i) => {
            if (cv.suffix.length > 0 && (selectedIndex < 0 || selectedIndex === i)) {
                const x = i % block_width;
                const y = (i - x) / block_width;
                pv.push({ x: x * sprite_width, y: y * sprite_height, w: sprite_width, h: sprite_height });
            }
            return pv;
        }, []);
        this.onOptionDrawChangeEmitter.emit(draw);
    }

}

type OptionBlockComponentUIType = {
    sprite_width: string;
    sprite_height: string;
    block_width: string;
    block_height: string;
    cells: {
        suffix: string;
        selected: boolean;
    }[]
};
