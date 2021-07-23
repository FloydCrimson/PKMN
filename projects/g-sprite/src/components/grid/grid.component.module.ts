import { NgModule } from '@angular/core';

import { ExplorerComponentModule } from '../explorer/explorer.component.module';
import { OptionComponentModule } from '../option/option.component.module';

import { GridComponent } from './grid.component';

@NgModule({
  imports: [
    ExplorerComponentModule,
    OptionComponentModule
  ],
  declarations: [
    GridComponent
  ],
  exports: [
    GridComponent
  ]
})
export class GridComponentModule { }
