import { Component } from '@angular/core';

@Component({
    selector: 'explorer-component',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent {

    public root: string = 'C:/Users/Floyd/OneDrive/Documenti/GitHub/PKMN/projects/game/src/assets/sprites';
    public folder: string = 'images';

}
