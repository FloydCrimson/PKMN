import { NgModule } from '@angular/core';

import { ExplorerElementComponentModule } from '../explorer-element/explorer-element.component.module';
import { ExplorerElementJSONsComponentModule } from '../explorer-element-jsons/explorer-element-jsons.component.module';

import { ExplorerComponent } from './explorer.component';

@NgModule({
  imports: [
    ExplorerElementComponentModule,
    ExplorerElementJSONsComponentModule
  ],
  declarations: [
    ExplorerComponent
  ],
  exports: [
    ExplorerComponent
  ]
})
export class ExplorerComponentModule { }
