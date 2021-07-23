import { Component, EventEmitter, Input, Output } from '@angular/core';

import { OptionDataImplementation, OptionImplementation } from '../../implementations/option.implementation';
import { ExplorerImplementation } from '../../implementations/explorer.implementation';

@Component({
    selector: 'option-block-component',
    templateUrl: './option-block.component.html',
    styleUrls: ['./option-block.component.scss']
})
export class OptionBlockComponent implements OptionImplementation {

    private _selectedElement?: ExplorerImplementation;
    @Input('selectedElement') public set selectedElement(selectedElement: ExplorerImplementation | undefined) {
        this.onSelectedElementChange(this._selectedElement = selectedElement);
    };
    public get selectedElement(): ExplorerImplementation | undefined {
        return this._selectedElement;
    };

    @Output('onOpenOrCloseOption') public onOpenOrCloseOptionEmitter = new EventEmitter<OptionImplementation>();
    @Output('onSaveOption') public onSaveOptionEmitter = new EventEmitter();
    @Output('onOptionDataChange') public onOptionDataChangeEmitter = new EventEmitter<OptionDataImplementation<OptionBlockComponentDataType>>();
    @Output('onOptionDrawChange') public onOptionDrawChangeEmitter = new EventEmitter<{ x: number; y: number; w: number; h: number; }[]>();

    public opened: boolean = true;
    public error: string = '';
    public optionUI?: OptionBlockComponentDataUIType;

    private name?: string;
    private option?: OptionBlockComponentDataType;

    constructor() {
        this.initialize();
    }

    public onOpenOrCloseOption(): void {
        this.onOpenOrCloseOptionEmitter.emit(this);
    }

    public onSaveOption(): void {
        this.onSaveOptionEmitter.emit();
    }

    public onSelectedElementChange(element?: ExplorerImplementation): void {
        this.initialize();
    }

    // EVENT

    public onNameChange(event: any): void {
        this.name = event.target.value;
        this.update();
    }

    public onSpriteWidthChange(event: any): void {
        if (this.optionUI) {
            this.optionUI.sprite_width = parseInt(event.target.value);
            this.update();
        }
    }

    public onSpriteHeightChange(event: any): void {
        if (this.optionUI) {
            this.optionUI.sprite_height = parseInt(event.target.value);
            this.update();
        }
    }

    public onBlockWidthChange(event: any): void {
        if (this.optionUI) {
            this.optionUI.block_width = parseInt(event.target.value);
            this.update();
        }
    }

    public onBlockHeightChange(event: any): void {
        if (this.optionUI) {
            this.optionUI.block_height = parseInt(event.target.value);
            this.update();
        }
    }

    public onCellSuffixChange(event: any, index: number): void {
        if (this.optionUI) {
            this.optionUI.cells[index].suffix = event.target.value;
            this.update();
        }
    }

    public onCellSelectedChange(cell: { suffix: string; selected: boolean; }, index: number): void {
        if (this.optionUI) {
            for (let i = 0; i < this.optionUI.cells.length; i++) {
                if (index === i) {
                    this.optionUI.cells[i].selected = !cell.selected;
                } else {
                    this.optionUI.cells[i].selected = false;
                }
            }
            this.update();
        }
    }

    //

    private initialize(): void {
        this.name = '';
        this.optionUI = {
            sprite_width: 1,
            sprite_height: 1,
            block_width: 1,
            block_height: 1,
            cells: [{
                suffix: '',
                selected: false
            }]
        };
        this.update();
    }

    private update(): void {
        if (this.optionUI) {
            // check
            if (!this.name) {
                this.error = '"name" must be defined.';
                return;
            }
            if (this.optionUI.sprite_width < 1) {
                this.error = '"sprite_width" must be more or equal than 1.';
                return;
            }
            if (this.optionUI.sprite_height < 1) {
                this.error = '"sprite_height" must be more or equal than 1.';
                return;
            }
            if (this.optionUI.block_width < 1) {
                this.error = '"block_width" must be more or equal than 1.';
                return;
            }
            if (this.optionUI.block_height < 1) {
                this.error = '"block_height" must be more or equal than 1.';
                return;
            }
            // update
            this.error = '';
            const length = this.optionUI.block_width * this.optionUI.block_height;
            if (length > this.optionUI.cells.length) {
                for (let i = this.optionUI.cells.length; i < length; i++) {
                    this.optionUI.cells.push({ suffix: '', selected: false });
                }
            } else if (length < this.optionUI.cells.length) {
                this.optionUI.cells.splice(length);
            }
            // OptionData
            this.option = {
                sprite_width: this.optionUI.sprite_width,
                sprite_height: this.optionUI.sprite_height,
                block_width: this.optionUI.block_width,
                block_height: this.optionUI.block_height,
                cells: this.optionUI.cells.reduce<OptionBlockComponentDataType['cells']>((pv, cv, i) => {
                    if (cv.suffix.length > 0) {
                        pv[cv.suffix] = i;
                    }
                    return pv;
                }, {})
            };
            this.onOptionDataChangeEmitter.emit({ [this.name]: { type: 'block', data: this.option } });
            // OptionDraw
            const selectedIndex = this.optionUI.cells.findIndex((cell) => cell.selected);
            this.onOptionDrawChangeEmitter.emit(this.optionUI.cells.reduce<{ x: number; y: number; w: number; h: number; }[]>((pv, cv, i) => {
                if (this.optionUI && cv.suffix.length > 0 && (selectedIndex < 0 || selectedIndex === i)) {
                    const x = i % this.optionUI.block_width;
                    const y = (i - x) / this.optionUI.block_width;
                    pv.push({ x: x * this.optionUI.sprite_width, y: y * this.optionUI.sprite_height, w: this.optionUI.sprite_width, h: this.optionUI.sprite_height });
                }
                return pv;
            }, []));
        }
    }

}

export interface OptionBlockComponentDataType {
    sprite_width: number;
    sprite_height: number;
    block_width: number;
    block_height: number;
    cells: {
        [suffix: string]: number;
    }
}

interface OptionBlockComponentDataUIType {
    sprite_width: number;
    sprite_height: number;
    block_width: number;
    block_height: number;
    cells: {
        suffix: string;
        selected: boolean;
    }[]
}
