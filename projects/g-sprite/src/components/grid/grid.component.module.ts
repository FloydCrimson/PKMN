import { NgModule } from '@angular/core';

import { ExplorerComponentModule } from '../explorer/explorer.component.module';

import { GridComponent } from './grid.component';

@NgModule({
  imports: [
    ExplorerComponentModule
  ],
  declarations: [
    GridComponent
  ],
  exports: [
    GridComponent
  ]
})
export class GridComponentModule { }
