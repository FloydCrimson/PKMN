import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { OptionBlockComponent } from './option-block.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    OptionBlockComponent
  ],
  exports: [
    OptionBlockComponent
  ]
})
export class OptionBlockComponentModule { }
