import { NgModule } from '@angular/core';

import { ExplorerElementComponentModule } from '../explorer-element/explorer-element.component.module';
import { ExplorerElementOptionComponentModule } from '../explorer-element-option/explorer-element-option.component.module';
import { ExplorerElementOptionSpriteComponentModule } from '../explorer-element-option-sprite/explorer-element-option-sprite.component.module';
import { ExplorerElementLevelComponentModule } from '../explorer-element-level/explorer-element-level.component.module';

import { ExplorerComponent } from './explorer.component';

@NgModule({
  imports: [
    ExplorerElementComponentModule,
    ExplorerElementOptionComponentModule,
    ExplorerElementOptionSpriteComponentModule,
    ExplorerElementLevelComponentModule
  ],
  declarations: [
    ExplorerComponent
  ],
  exports: [
    ExplorerComponent
  ]
})
export class ExplorerComponentModule { }
