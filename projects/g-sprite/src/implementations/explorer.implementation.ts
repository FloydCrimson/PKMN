export interface ExplorerImplementation {
    parent?: ExplorerImplementation;
    name?: string;
    type?: 'directory' | 'file' | 'unknown';
    onUpdateElement(force: boolean): Promise<void>;
    onSelectElement(element?: ExplorerImplementation): void;
    getPath(): string | undefined;
    getRootElement(): ExplorerImplementation | undefined;
}
