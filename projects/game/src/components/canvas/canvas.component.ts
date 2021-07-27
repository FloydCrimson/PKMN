import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModulesService } from '@node-cs/client';

@Component({
  selector: 'canvas-component',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {

  @ViewChild('canvas', { static: true }) public canvasElementRef?: ElementRef;

  constructor(
    private readonly modulesService: ModulesService
  ) { }

}
