import { Component, ViewChild } from '@angular/core';

import { ExplorerImplementation } from '../../implementations/explorer.implementation';
import { ExplorerComponent } from '../explorer/explorer.component';
import { OptionComponent } from '../option/option.component';

@Component({
  selector: 'grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {

  @ViewChild('explorerComponentAsset', { static: true }) public explorerComponentAsset?: ExplorerComponent;
  @ViewChild('optionComponent', { static: true }) public optionComponent?: OptionComponent;

  public selectedElement?: ExplorerImplementation;

  constructor() { }

  public async onExplorerComponentAssetSelectElement(element?: ExplorerImplementation): Promise<void> {
    this.selectedElement = element;
  }

}
