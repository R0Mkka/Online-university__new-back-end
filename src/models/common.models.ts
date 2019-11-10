export interface ISqlSuccessResponse {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    info: string;
    serverStatus: number;
    warningStatus: number;
    changedRows?: number;
}

export interface IFile {
    id: number;
    path: string;
    name: string;
    originalName: string;
    mimeType: string;
    size: number;
    addedAt: string;
}
