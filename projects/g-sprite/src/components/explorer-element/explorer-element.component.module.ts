import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExplorerElementComponent } from './explorer-element.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ExplorerElementComponent
  ],
  exports: [
    ExplorerElementComponent
  ]
})
export class ExplorerElementComponentModule { }
