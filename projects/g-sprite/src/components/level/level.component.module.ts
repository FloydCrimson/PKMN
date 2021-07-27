import { NgModule } from '@angular/core';

import { LevelConfigComponentModule } from '../level-config/level-config.component.module';

import { LevelComponent } from './level.component';

@NgModule({
  imports: [
    LevelConfigComponentModule
  ],
  declarations: [
    LevelComponent
  ],
  exports: [
    LevelComponent
  ]
})
export class LevelComponentModule { }
