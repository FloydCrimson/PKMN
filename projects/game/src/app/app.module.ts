import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CanvasComponentModule } from '../components/canvas/canvas.component.module';

import { AppComponent } from './app.component';

@NgModule({
  imports: [
    BrowserModule,
    CanvasComponentModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
