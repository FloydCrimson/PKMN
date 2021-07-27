import { NgModule } from '@angular/core';

import { LevelConfigComponentModule } from '../level-config/level-config.component.module';
import { LevelCanvasComponentModule } from '../level-canvas/level-canvas.component.module';

import { LevelComponent } from './level.component';

@NgModule({
  imports: [
    LevelCanvasComponentModule,
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
