import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ModulesServiceModule } from '@node-cs/client';

import { GridComponentModule } from '../components/grid/grid.component.module';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    ModulesServiceModule.forRoot(),
    GridComponentModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
