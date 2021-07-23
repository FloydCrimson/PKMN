import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModulesService } from '@node-cs/client';

@Component({
  selector: 'grid-component',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {

  @ViewChild('canvas', { static: true }) public canvasER?: ElementRef;

  constructor(
    private readonly modulesService: ModulesService
  ) { }

}
