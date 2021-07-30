import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModulesService } from '@node-cs/client';
import { Subject } from 'rxjs';

import { LevelDataType, LevelComponentImplementation, LevelImageType } from '../../implementations/level.implementation';
import { OptionDataSpritesTypeImplementation } from '../../implementations/option.implementation';

@Component({
    selector: 'level-config-component',
    templateUrl: './level-config.component.html',
    styleUrls: ['./level-config.component.scss']
})
export class LevelConfigComponent implements LevelComponentImplementation {

    @Input('root') public root?: string;

    private _cellsSelected: { x: number; y: number; }[] = [];
    @Input('cellsSelected') public set cellsSelected(cellsSelected: { x: number; y: number; }[] | undefined) {
        this.onCellsSelectedChange(this._cellsSelected = cellsSelected || []);
    };
    public get cellsSelected(): { x: number; y: number; }[] {
        return this._cellsSelected;
    };

    private _explorerComponentOptionSpritesSelectImage?: LevelImageType;
    @Input('explorerComponentOptionSpritesSelectImage') public set explorerComponentOptionSpritesSelectImage(explorerComponentOptionSpritesSelectImage: LevelImageType | undefined) {
        this._explorerComponentOptionSpritesSelectImage = explorerComponentOptionSpritesSelectImage;
    };
    public get explorerComponentOptionSpritesSelectImage(): LevelImageType | undefined {
        return this._explorerComponentOptionSpritesSelectImage;
    };

    @Output('onSaveLevel') public onSaveLevelEmitter = new EventEmitter();
    @Output('onLevelDataChange') public onLevelDataChangeEmitter = new EventEmitter<LevelDataType>();
    @Output('onLevelDrawChange') public onLevelDrawChangeEmitter = new EventEmitter<{ x: number; y: number; images: { id: string; src: string; depth: number; }[]; }[]>();

    public inputsSelected: LevelDataImageUIType[] = [];

    public error: string = '';
    public name: string = '';
    public levelUI: LevelDataUIType = this.initialize();

    private level?: LevelDataType;

    private canvas = document.createElement('canvas');
    private map = new Map<string, string>();

    constructor(
        private readonly modulesService: ModulesService
    ) {
        this.update();
    }

    public onSaveLevel(): void {
        this.onSaveLevelEmitter.emit();
    }

    //

    private initialize(data?: LevelDataType): LevelDataUIType {
        if (data) {
            return {
                config: {
                    sprite_width: data.config.sprite_width.toString(),
                    sprite_height: data.config.sprite_height.toString(),
                    level_width: data.config.level_width.toString(),
                    level_height: data.config.level_height.toString()
                },
                matrix: data.matrix as any // TODO
            };
        } else {
            return {
                config: {
                    sprite_width: '1',
                    sprite_height: '1',
                    level_width: '1',
                    level_height: '1',
                },
                matrix: [[{ cells: this.getImagesUI(21), selected: false }]]
            };
        }
    }

    private onCellsSelectedChange(cellsSelected: { x: number; y: number; }[]): void {
        if (cellsSelected.length > 0) {
            if (cellsSelected.length === 1) {
                this.inputsSelected = this.levelUI.matrix[cellsSelected[0].y][cellsSelected[0].x].cells.map((image) => { return { option: image.option }; });
            } else {
                this.inputsSelected = this.getImagesUI(21);
            }
        }
    }

    public onInputSet(input: LevelDataImageUIType, index: number): void {
        input.option = this.explorerComponentOptionSpritesSelectImage;
        this.cellsSelected.forEach((coor) => this.levelUI.matrix[coor.y][coor.x].cells[index].option = this.explorerComponentOptionSpritesSelectImage);
        this.update();
    }

    public onInputRemove(input: LevelDataImageUIType, index: number): void {
        input.option = undefined;
        this.cellsSelected.forEach((coor) => this.levelUI.matrix[coor.y][coor.x].cells[index].option = undefined);
        this.update();
    }

    public async update(): Promise<void> {
        // Parse
        const name = this.name.trim();
        const sprite_width = this.levelUI.config.sprite_width ? parseInt(this.levelUI.config.sprite_width) : undefined;
        const sprite_height = this.levelUI.config.sprite_height ? parseInt(this.levelUI.config.sprite_height) : undefined;
        const level_width = this.levelUI.config.level_width ? parseInt(this.levelUI.config.level_width) : undefined;
        const level_height = this.levelUI.config.level_height ? parseInt(this.levelUI.config.level_height) : undefined;
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
        if (!level_width || level_width < 1) {
            this.error = '"level_width" must be more or equal than 1.';
            return;
        }
        if (!level_height || level_height < 1) {
            this.error = '"level_height" must be more or equal than 1.';
            return;
        }
        const width = level_width;
        const height = level_height;
        if (width > this.levelUI.matrix[0].length) {
            for (let y = 0; y < this.levelUI.matrix.length; y++) {
                for (let i = this.levelUI.matrix[y].length; i < width; i++) {
                    this.levelUI.matrix[y].push({ cells: this.getImagesUI(21), selected: false });
                }
            }
        } else if (width < this.levelUI.matrix[0].length) {
            for (let y = 0; y < this.levelUI.matrix.length; y++) {
                this.levelUI.matrix[y].splice(width);
            }
        }
        if (height > this.levelUI.matrix.length) {
            for (let i = this.levelUI.matrix.length; i < height; i++) {
                const array = [];
                for (let x = 0; x < width; x++) {
                    array.push({ cells: this.getImagesUI(21), selected: false });
                }
                this.levelUI.matrix.push(array);
            }
        } else if (height < this.levelUI.matrix.length) {
            this.levelUI.matrix.splice(height);
        }
        if (this.levelUI.matrix.some((cells) => cells.some((cell) => cell.cells.every((image) => !image.option)))) {
            this.error = 'at least one "image.image" per cell must be defined.';
            // return;
        }
        this.error = '';
        // LevelData
        this.level = {
            config: {
                sprite_width,
                sprite_height,
                level_width,
                level_height
            },
            matrix: [[{}]]
        };
        this.onLevelDataChangeEmitter.emit(this.level);
        // OptionDraw
        const draw: { x: number; y: number; images: { id: string; src: string; depth: number; }[]; }[] = [];
        for (let y = 0; y < this.levelUI.matrix.length; y++) {
            for (let x = 0; x < this.levelUI.matrix[y].length; x++) {
                const cells = this.levelUI.matrix[y][x].cells.map((image, depth) => { return { image, depth }; }).filter(({ image }) => image.option);
                if (cells.length > 0) {
                    const images = [];
                    for (let i = 0; i < cells.length; i++) {
                        images.push({ id: cells[i].image.option!.id, src: await this.getSrcImage(cells[i].image.option!), depth: cells[i].depth });
                    }
                    draw.push({ x, y, images });
                }
            }
        }
        this.onLevelDrawChangeEmitter.emit(draw);
    }

    //

    private getImagesUI(length: number): LevelDataImageUIType[] {
        const images: LevelDataImageUIType[] = [];
        for (let i = 0; i < length; i++) {
            images.push({});
        }
        return images;
    }

    private async getSrcImage(option: LevelImageType): Promise<string> {
        return new Promise<string>(async (resolve) => {
            const image = new Image();
            image.addEventListener('load', () => {
                if (!this.map.has(path)) {
                    this.map.set(path, image.src);
                }
                const context = this.canvas.getContext('2d');
                if (context) {
                    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.canvas.width = image.width;
                    this.canvas.height = image.height;
                    context.drawImage(image, 0, 0);
                    let src = '';
                    switch (option.option.sprites[option.name].type) {
                        case 'block': src = this.getSrcImageFromBlock(this.canvas, context, image, option);
                    }
                    resolve(src);
                } else {
                    resolve('');
                }
            }, false);
            const path = this.root! + option.option.location;
            image.src = this.map.has(path) ? this.map.get(path)! : ('data:image/png;base64,' + await this.modulesService.getMethod('fs', 'readFile')(path, { encoding: 'base64' }));
        }).catch(_ => '');
    }

    //

    private getSrcImageFromBlock(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, image: HTMLImageElement, option: LevelImageType): string {
        const data = option.option.sprites[option.name].data as OptionDataSpritesTypeImplementation['block'];
        const i = data.cells[option.image];
        const x = i % data.block_width;
        const y = (i - x) / data.block_width;
        const imageData = context.getImageData(x * data.sprite_width, y * data.sprite_height, data.sprite_width, data.sprite_height);
        this.canvas.width = data.sprite_width;
        this.canvas.height = data.sprite_height;
        context.putImageData(imageData, 0, 0);
        return canvas.toDataURL();
    }

}

type LevelDataUIType = {
    config: {
        sprite_width: string;
        sprite_height: string;
        level_width: string;
        level_height: string;
    };
    matrix: { cells: LevelDataImageUIType[]; selected: boolean; }[][];
};

type LevelDataImageUIType = {
    option?: LevelImageType;
};
