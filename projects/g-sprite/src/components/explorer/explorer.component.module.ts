import { NgModule } from '@angular/core';

import { ExplorerFolderComponentModule } from '../explorer-folder/explorer-folder.component.module';

import { ExplorerComponent } from './explorer.component';

@NgModule({
  imports: [
    ExplorerFolderComponentModule
  ],
  declarations: [
    ExplorerComponent
  ],
  exports: [
    ExplorerComponent
  ]
})
export class ExplorerComponentModule { }
