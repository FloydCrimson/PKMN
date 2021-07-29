import { Component, Type, ViewChild } from '@angular/core';

import { ExplorerImplementation } from '../../implementations/explorer.implementation';
import { LevelImageType } from '../../implementations/level.implementation';
import { OptionDataImplementation } from '../../implementations/option.implementation';
import { ExplorerElementOptionSpriteComponent } from '../explorer-element-option-sprite/explorer-element-option-sprite.component';
import { ExplorerElementOptionComponent } from '../explorer-element-option/explorer-element-option.component';
import { ExplorerElementComponent } from '../explorer-element/explorer-element.component';
import { ExplorerComponent } from '../explorer/explorer.component';
import { LevelComponent } from '../level/level.component';
import { OptionComponent } from '../option/option.component';

@Component({
  selector: 'grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {

  public explorerElementComponent: Type<ExplorerImplementation> = ExplorerElementComponent;
  public explorerElementOptionComponent: Type<ExplorerImplementation> = ExplorerElementOptionComponent;
  public explorerElementOptionSpritesComponent: Type<ExplorerImplementation> = ExplorerElementOptionSpriteComponent;

  @ViewChild('explorerComponentImages', { static: true }) public explorerComponentImages?: ExplorerComponent;
  @ViewChild('explorerComponentOption', { static: true }) public explorerComponentOption?: ExplorerComponent;
  @ViewChild('explorerComponentOptionSprites', { static: true }) public explorerComponentOptionSprites?: ExplorerComponent;
  @ViewChild('optionComponent', { static: true }) public optionComponent?: OptionComponent;
  @ViewChild('levelComponent', { static: true }) public levelComponent?: LevelComponent;

  public mode: 'sprite' | 'level' = 'sprite';
  public explorerComponentImagesSelectElement?: ExplorerImplementation;
  public explorerComponentOptionSelectElement?: ExplorerImplementation;
  public explorerComponentOptionSelectSprite?: OptionDataImplementation['sprites'];
  public explorerComponentOptionSpritesSelectElement?: ExplorerImplementation;
  public explorerComponentOptionSpritesSelectImage?: LevelImageType;

  public onChangeModeClick(mode: 'sprite' | 'level'): void {
    this.mode = mode;
  }

  public onExplorerComponentImagesSelectElement(element?: ExplorerImplementation): void {
    this.explorerComponentImagesSelectElement = element;
  }

  public onExplorerComponentOptionSelectElement(element?: ExplorerImplementation): void {
    this.explorerComponentOptionSelectElement = element;
  }

  public onExplorerComponentOptionSelectSprite(sprite?: OptionDataImplementation['sprites']): void {
    this.explorerComponentOptionSelectSprite = sprite;
  }

  public onExplorerComponentOptionSpritesSelectElement(element?: ExplorerImplementation): void {
    this.explorerComponentOptionSpritesSelectElement = element;
  }

  public onExplorerComponentOptionSpritesSelectImage(data?: LevelImageType): void {
    this.explorerComponentOptionSpritesSelectImage = data;
  }

}
