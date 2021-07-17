import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExplorerFolderComponent } from './explorer-folder.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ExplorerFolderComponent
  ],
  exports: [
    ExplorerFolderComponent
  ]
})
export class ExplorerFolderComponentModule { }
