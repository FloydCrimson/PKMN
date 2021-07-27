import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LevelConfigComponent } from './level-config.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    LevelConfigComponent
  ],
  exports: [
    LevelConfigComponent
  ]
})
export class LevelConfigComponentModule { }
