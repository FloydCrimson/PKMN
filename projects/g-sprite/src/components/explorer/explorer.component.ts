import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, Type, ViewChild } from '@angular/core';

import { ExplorerImplementation } from '../../implementations/explorer.implementation';
import { OptionDataImplementation } from '../../implementations/option.implementation';
import { ExplorerElementOptionComponent } from '../explorer-element-option/explorer-element-option.component';
import { ExplorerElementOptionSpriteComponent } from '../explorer-element-option-sprite/explorer-element-option-sprite.component';
import { LevelDataImplementation, LevelImageType } from '../../implementations/level.implementation';
import { ExplorerElementLevelComponent } from '../explorer-element-level/explorer-element-level.component';

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
    @Output('onSelectSprite') public onSelectSpriteEmitter = new EventEmitter<OptionDataImplementation['sprites']>();
    @Output('onSelectImage') public onSelectImageEmitter = new EventEmitter<LevelImageType>();
    @Output('onSelectLevel') public onSelectLevelEmitter = new EventEmitter<{ path: string; name: string; data: LevelDataImplementation; }>();

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
            if (componentRef.instance instanceof ExplorerElementOptionComponent) {
                componentRef.instance.onSelectSpriteEmitter.subscribe(this.onSelectSprite.bind(this));
            }
            if (componentRef.instance instanceof ExplorerElementOptionSpriteComponent) {
                componentRef.instance.onSelectImageEmitter.subscribe(this.onSelectImage.bind(this));
            }
            if (componentRef.instance instanceof ExplorerElementLevelComponent) {
                componentRef.instance.onSelectLevelEmitter.subscribe(this.onSelectLevel.bind(this));
            }
            this.element = componentRef.instance;
        }
    }

    public async onUpdateElement(force: boolean): Promise<void> {
        await this.element?.onUpdateElement(force);
        await this.onSelectElement(undefined);
    }

    public async onSelectElement(element?: ExplorerImplementation): Promise<void> {
        if (this.selectedElement && element) {
            await this.selectedElement.onSelectElement(element);
        }
        this.onSelectElementEmitter.emit(this.selectedElement = element);
    }

    public onSelectSprite(sprite?: OptionDataImplementation['sprites']): void {
        this.onSelectSpriteEmitter.emit(sprite);
    }

    public onSelectImage(data?: LevelImageType): void {
        this.onSelectImageEmitter.emit(data);
    }

    public onSelectLevel(data?: { path: string; name: string; data: LevelDataImplementation; }): void {
        this.onSelectLevelEmitter.emit(data);
    }

    public getPath(): string | undefined {
        return this.root;
    }

    public getRootElement(): ExplorerImplementation | undefined {
        return this;
    }

}
