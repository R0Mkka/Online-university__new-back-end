export interface ISqlSuccessResponse {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    info: string;
    serverStatus: number;
    warningStatus: number;
}

export interface IImage {
    id: number;
    label: string;
    path: string;
    addedAt: string;
}
