import { Component, Type, ViewChild } from '@angular/core';

import { ExplorerImplementation } from '../../implementations/explorer.implementation';
import { OptionJSONImplementation } from '../../implementations/option.implementation';
import { ExplorerElementJSONsComponent } from '../explorer-element-jsons/explorer-element-jsons.component';
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
  public explorerElementJSONsComponent: Type<ExplorerImplementation> = ExplorerElementJSONsComponent;

  @ViewChild('explorerComponentImages', { static: true }) public explorerComponentImages?: ExplorerComponent;
  @ViewChild('explorerComponentJSONs', { static: true }) public explorerComponentJSONs?: ExplorerComponent;
  @ViewChild('optionComponent', { static: true }) public optionComponent?: OptionComponent;

  public explorerComponentImagesSelectElement?: ExplorerImplementation;
  public explorerComponentJSONsSelectElement?: ExplorerImplementation;
  public explorerComponentJSONsSelectSprite?: OptionJSONImplementation['sprites'];

  constructor() { }

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
