import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModulesService } from '@node-cs/client';

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
    @Output('onLevelDrawChange') public onLevelDrawChangeEmitter = new EventEmitter<{ x: number; y: number; layers: { level: number; collision_type: LevelDataCellLayerCollisionTypeUIEnum; movement_type: LevelDataCellLayerMovementTypeUIEnum; images: { id: string; src: string; }[]; }[]; }[]>();

    public readonly collisionOptions = [LevelDataCellLayerCollisionTypeUIEnum.Floor, LevelDataCellLayerCollisionTypeUIEnum.Wall, LevelDataCellLayerCollisionTypeUIEnum.Bridge];
    public readonly movementOptions = [LevelDataCellLayerMovementTypeUIEnum.Ground, LevelDataCellLayerMovementTypeUIEnum.Water, LevelDataCellLayerMovementTypeUIEnum.Lava, LevelDataCellLayerMovementTypeUIEnum.Air];

    public matrixSelected?: LevelDataCellUIType;

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
                matrix: [[{
                    layers: [{
                        level: 1,
                        collision_type: LevelDataCellLayerCollisionTypeUIEnum.Floor,
                        movement_type: LevelDataCellLayerMovementTypeUIEnum.Ground,
                        sprites: this.getSpritesUI(11)
                    }]
                }]]
            };
        }
    }

    private onCellsSelectedChange(cellsSelected: { x: number; y: number; }[]): void {
        if (cellsSelected.length > 0) {
            if (cellsSelected.length === 1) {
                this.matrixSelected = JSON.parse(JSON.stringify(this.levelUI.matrix[cellsSelected[0].y][cellsSelected[0].x])); // Cloning
            } else {
                const length = Math.max(...this.cellsSelected.map((coor) => this.levelUI.matrix[coor.y][coor.x].layers.length));
                this.matrixSelected = { layers: this.getLayersUI(length) };
            }
        } else {
            this.matrixSelected = undefined;
        }
    }

    public onLevelChange(i_layer: number): void {
        const level = this.matrixSelected!.layers[i_layer].level;
        this.cellsSelected.forEach((coor) => {
            if (this.levelUI.matrix[coor.y][coor.x].layers.length <= i_layer) {
                this.levelUI.matrix[coor.y][coor.x].layers.push(...this.getLayersUI(i_layer - this.levelUI.matrix[coor.y][coor.x].layers.length + 1));
            }
            this.levelUI.matrix[coor.y][coor.x].layers[i_layer].level = level;
        });
        this.update();
    }

    public onCollisionTypeChange(i_layer: number): void {
        const collision_type = this.matrixSelected!.layers[i_layer].collision_type;
        this.cellsSelected.forEach((coor) => {
            if (this.levelUI.matrix[coor.y][coor.x].layers.length <= i_layer) {
                this.levelUI.matrix[coor.y][coor.x].layers.push(...this.getLayersUI(i_layer - this.levelUI.matrix[coor.y][coor.x].layers.length + 1));
            }
            this.levelUI.matrix[coor.y][coor.x].layers[i_layer].collision_type = collision_type;
        });
        this.update();
    }

    public onMovementTypeChange(i_layer: number): void {
        const movement_type = this.matrixSelected!.layers[i_layer].movement_type;
        this.cellsSelected.forEach((coor) => {
            if (this.levelUI.matrix[coor.y][coor.x].layers.length <= i_layer) {
                this.levelUI.matrix[coor.y][coor.x].layers.push(...this.getLayersUI(i_layer - this.levelUI.matrix[coor.y][coor.x].layers.length + 1));
            }
            this.levelUI.matrix[coor.y][coor.x].layers[i_layer].movement_type = movement_type;
        });
        this.update();
    }

    public onSpriteChange(i_layer: number, i_sprite: number, option?: LevelImageType): void {
        this.matrixSelected!.layers[i_layer].sprites[i_sprite].option = option;
        this.cellsSelected.forEach((coor) => {
            if (this.levelUI.matrix[coor.y][coor.x].layers.length <= i_layer) {
                this.levelUI.matrix[coor.y][coor.x].layers.push(...this.getLayersUI(i_layer - this.levelUI.matrix[coor.y][coor.x].layers.length + 1));
            }
            this.levelUI.matrix[coor.y][coor.x].layers[i_layer].sprites[i_sprite].option = option;
        });
        this.update();
    }

    public onLayerChange(offset: number): void {
        if (offset > 0) {
            this.matrixSelected!.layers.push(...this.getLayersUI(offset));
        } else if (offset < 0) {
            this.matrixSelected!.layers.splice(offset);
        }
        this.cellsSelected.forEach((coor) => {
            const diff = this.matrixSelected!.layers.length - this.levelUI.matrix[coor.y][coor.x].layers.length;
            if (diff > 0) {
                this.levelUI.matrix[coor.y][coor.x].layers.push(...this.getLayersUI(diff));
            } else if (diff < 0) {
                this.levelUI.matrix[coor.y][coor.x].layers.splice(diff);
            }
        });
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
                    this.levelUI.matrix[y].push(...this.getCellsUI(1));
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
                    array.push(...this.getCellsUI(1));
                }
                this.levelUI.matrix.push(array);
            }
        } else if (height < this.levelUI.matrix.length) {
            this.levelUI.matrix.splice(height);
        }
        if (this.levelUI.matrix.some((cells) => cells.some((cell) => cell.layers.some((layer) => layer.sprites.every((sprite) => !sprite.option))))) {
            this.error = 'at least one sprite per layer must be defined.';
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
        const draw: { x: number; y: number; layers: { level: number; collision_type: LevelDataCellLayerCollisionTypeUIEnum; movement_type: LevelDataCellLayerMovementTypeUIEnum; images: { id: string; src: string; }[]; }[]; }[] = [];
        for (let y = 0; y < this.levelUI.matrix.length; y++) {
            for (let x = 0; x < this.levelUI.matrix[y].length; x++) {
                const layers = this.levelUI.matrix[y][x].layers.map((layer) => { return { level: layer.level, collision_type: layer.collision_type, movement_type: layer.movement_type, sprites: layer.sprites.filter((sprite) => sprite.option) }; }); // .filter((layer) => layer.sprites.length > 0);
                if (layers.length > 0) {
                    const images = new Array<{ id: string; src: string; }[]>(layers.length);
                    for (let i1 = 0; i1 < layers.length; i1++) {
                        images[i1] = [];
                        for (let i2 = 0; i2 < layers[i1].sprites.length; i2++) {
                            const sprite = layers[i1].sprites[i2];
                            images[i1].push({ id: sprite.option!.id, src: await this.getSrcImage(sprite.option!) });
                        }
                    }
                    draw.push({ x, y, layers: layers.map((layer, i1) => { return { level: layer.level, collision_type: layer.collision_type, movement_type: layer.movement_type, images: images[i1] }; }) });
                }
            }
        }
        this.onLevelDrawChangeEmitter.emit(draw);
    }

    //

    private getCellsUI(length: number): LevelDataCellUIType[] {
        const cells: LevelDataCellUIType[] = [];
        for (let i = 0; i < length; i++) {
            cells.push({
                layers: this.getLayersUI(1)
            });
        }
        return cells;
    }

    private getLayersUI(length: number): LevelDataCellLayerUIType[] {
        const layers: LevelDataCellLayerUIType[] = [];
        for (let i = 0; i < length; i++) {
            layers.push({
                level: 1,
                collision_type: LevelDataCellLayerCollisionTypeUIEnum.Floor,
                movement_type: LevelDataCellLayerMovementTypeUIEnum.Ground,
                sprites: this.getSpritesUI(11)
            });
        }
        return layers;
    }

    private getSpritesUI(length: number): LevelDataCellLayerSpriteUIType[] {
        const sprites: LevelDataCellLayerSpriteUIType[] = [];
        for (let i = 0; i < length; i++) {
            sprites.push({});
        }
        return sprites;
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

    private getSrcImageFromBlock(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, image: HTMLImageElement, option: LevelImageType): string {
        const data = option.option.sprites[option.name].data as OptionDataSpritesTypeImplementation['block'];
        const i = parseInt(option.image);
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
    matrix: LevelDataCellUIType[][];
};

type LevelDataCellUIType = {
    layers: LevelDataCellLayerUIType[];
};

type LevelDataCellLayerUIType = {
    level: number;
    collision_type: LevelDataCellLayerCollisionTypeUIEnum;
    movement_type: LevelDataCellLayerMovementTypeUIEnum;
    sprites: LevelDataCellLayerSpriteUIType[];
};

type LevelDataCellLayerSpriteUIType = {
    option?: LevelImageType;
};

export enum LevelDataCellLayerCollisionTypeUIEnum {
    /** Normal type. Player can walk over it if the level is the same. */
    Floor = 'floor',
    /** Blocking type. Player can never walk over it and the level is ignored. */
    Wall = 'wall',
    /** Connecting type. Player can always walk over it and must be used to allow the player to change level. */
    Bridge = 'bridge'
}

export enum LevelDataCellLayerMovementTypeUIEnum {
    /** Normal type. Player can always walk over it. */
    Ground = 'ground',
    /** Special type. Player can walk over it only if special conditions are met (es. right pkm in party). */
    Water = 'water',
    /** Special type. Player can walk over it only if special conditions are met (es. right pkm in party). */
    Lava = 'lava',
    /** Special type. Player can walk over it only if special conditions are met (es. right pkm in party). */
    Air = 'air'
}
