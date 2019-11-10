import { IFile } from '../models/common.models';

export class Image implements IFile {
    constructor(
        public id: number,
        public path: string,
        public name: string,
        public originalName: string,
        public mimeType: string,
        public size: number,
        public addedAt: string,
    ) {}
}
