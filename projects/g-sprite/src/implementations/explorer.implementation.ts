export interface ExplorerImplementation {
    parent?: ExplorerImplementation;
    name?: string;
    type?: 'directory' | 'file' | 'unknown';
    onSelectElement(element?: ExplorerImplementation): void;
    getPath(): string | undefined;
    getRootElement(): ExplorerImplementation | undefined;
}
