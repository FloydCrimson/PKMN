import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExplorerComponentModule } from '../explorer/explorer.component.module';
import { OptionComponentModule } from '../option/option.component.module';

import { GridComponent } from './grid.component';

@NgModule({
  imports: [
    CommonModule,
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
