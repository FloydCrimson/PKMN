import { NgModule } from '@angular/core';

import { ExplorerElementComponentModule } from '../explorer-element/explorer-element.component.module';
import { ExplorerElementOptionComponentModule } from '../explorer-element-option/explorer-element-option.component.module';

import { ExplorerComponent } from './explorer.component';

@NgModule({
  imports: [
    ExplorerElementComponentModule,
    ExplorerElementOptionComponentModule
  ],
  declarations: [
    ExplorerComponent
  ],
  exports: [
    ExplorerComponent
  ]
})
export class ExplorerComponentModule { }
