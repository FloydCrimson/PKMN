import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LevelCanvasComponent } from './level-canvas.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    LevelCanvasComponent
  ],
  exports: [
    LevelCanvasComponent
  ]
})
export class LevelCanvasComponentModule { }
