import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, Type, ViewChild } from '@angular/core';

import { ExplorerImplementation } from '../../implementations/explorer.implementation';
import { OptionJSONImplementation } from '../../implementations/option.implementation';
import { ExplorerElementJSONsComponent } from '../explorer-element-jsons/explorer-element-jsons.component';

@Component({
    selector: 'explorer-component',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.scss']
})
export class ExplorerComponent implements ExplorerImplementation, OnInit {

    @Input('component') public component?: Type<ExplorerImplementation>;
    @Input('root') public root?: string;
    @Input('name') public name?: string;
    @Input('extensions') public extensions?: string[];

    @Output('onSelectElement') public onSelectElementEmitter = new EventEmitter<ExplorerImplementation>();
    @Output('onSelectSprite') public onSelectSpriteEmitter = new EventEmitter<OptionJSONImplementation['sprites']>();

    @ViewChild('element', { static: true }) public element!: ExplorerImplementation;

    public parent?: ExplorerImplementation;
    public type?: 'directory' | 'file' | 'unknown' = 'directory';

    private selectedElement?: ExplorerImplementation;

    constructor(
        protected readonly componentFactoryResolver: ComponentFactoryResolver
    ) { }

    public ngOnInit(): void {
        if (this.component) {
            const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
            const viewContainerRef = this.element.viewContainerRef;
            viewContainerRef!.clear();
            const componentRef = viewContainerRef!.createComponent<ExplorerImplementation>(componentFactory);
            componentRef.instance.parent = this;
            componentRef.instance.name = this.name;
            componentRef.instance.type = this.type;
            componentRef.instance.extensions = this.extensions;
            componentRef.instance.onSelectElementEmitter.subscribe(this.onSelectElement.bind(this));
            if (componentRef.instance instanceof ExplorerElementJSONsComponent) {
                componentRef.instance.onSelectSpriteEmitter.subscribe(this.onSelectSprite.bind(this));
            }
            this.element = componentRef.instance;
        }
    }

    public async onUpdateElement(force: boolean): Promise<void> {
        await this.element?.onUpdateElement(force);
        this.onSelectElement(undefined);
    }

    public onSelectElement(element?: ExplorerImplementation): void {
        if (this.selectedElement && element) {
            this.selectedElement.onSelectElement(element);
        }
        this.onSelectElementEmitter.emit(this.selectedElement = element);
    }

    public onSelectSprite(sprite?: OptionJSONImplementation['sprites']): void {
        this.onSelectSpriteEmitter.emit(sprite);
    }

    public getPath(): string | undefined {
        return this.root;
    }

    public getRootElement(): ExplorerImplementation | undefined {
        return this;
    }

}
