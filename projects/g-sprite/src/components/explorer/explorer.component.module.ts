import { NgModule } from '@angular/core';

import { ExplorerElementComponentModule } from '../explorer-element/explorer-element.component.module';

import { ExplorerComponent } from './explorer.component';

@NgModule({
  imports: [
    ExplorerElementComponentModule
  ],
  declarations: [
    ExplorerComponent
  ],
  exports: [
    ExplorerComponent
  ]
})
export class ExplorerComponentModule { }
