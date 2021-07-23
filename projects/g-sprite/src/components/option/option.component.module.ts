import { NgModule } from '@angular/core';

import { OptionCanvasComponentModule } from '../option-canvas/option-canvas.component.module';
import { OptionBlockComponentModule } from '../option-block/option-block.component.module';
import { OptionPreviewComponentModule } from '../option-preview/option-preview.component.module';

import { OptionComponent } from './option.component';

@NgModule({
  imports: [
    OptionCanvasComponentModule,
    OptionBlockComponentModule,
    OptionPreviewComponentModule
  ],
  declarations: [
    OptionComponent
  ],
  exports: [
    OptionComponent
  ]
})
export class OptionComponentModule { }
