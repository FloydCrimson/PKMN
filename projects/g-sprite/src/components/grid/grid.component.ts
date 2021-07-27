import { Component, Type, ViewChild } from '@angular/core';

import { ExplorerImplementation } from '../../implementations/explorer.implementation';
import { OptionJSONImplementation } from '../../implementations/option.implementation';
import { ExplorerElementOptionComponent } from '../explorer-element-option/explorer-element-option.component';
import { ExplorerElementComponent } from '../explorer-element/explorer-element.component';
import { ExplorerComponent } from '../explorer/explorer.component';
import { OptionComponent } from '../option/option.component';

@Component({
  selector: 'grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {

  public explorerElementComponent: Type<ExplorerImplementation> = ExplorerElementComponent;
  public explorerElementJSONsComponent: Type<ExplorerImplementation> = ExplorerElementOptionComponent;

  @ViewChild('explorerComponentImages', { static: true }) public explorerComponentImages?: ExplorerComponent;
  @ViewChild('explorerComponentJSONs', { static: true }) public explorerComponentJSONs?: ExplorerComponent;
  @ViewChild('optionComponent', { static: true }) public optionComponent?: OptionComponent;

  public mode: 'sprite' | 'level' = 'sprite';
  public explorerComponentImagesSelectElement?: ExplorerImplementation;
  public explorerComponentJSONsSelectElement?: ExplorerImplementation;
  public explorerComponentJSONsSelectSprite?: OptionJSONImplementation['sprites'];

  public onChangeModeClick(mode: 'sprite' | 'level'): void {
    this.mode = mode;
  }

  public onExplorerComponentImagesSelectElement(element?: ExplorerImplementation): void {
    this.explorerComponentImagesSelectElement = element;
  }

  public onExplorerComponentJSONsSelectElement(element?: ExplorerImplementation): void {
    this.explorerComponentJSONsSelectElement = element;
  }

  public onExplorerComponentJSONsSelectSprite(sprite?: OptionJSONImplementation['sprites']): void {
    this.explorerComponentJSONsSelectSprite = sprite;
  }

}
