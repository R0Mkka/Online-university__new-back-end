import { IImage } from '../models/common.models';

export class Image implements IImage {
    constructor(
        public id: number,
        public label: string,
        public path: string,
        public addedAt: string,
    ) {}
}
