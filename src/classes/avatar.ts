import { IAvatar } from './../models/users.models';

export class Avatar implements IAvatar {
    constructor(
        public id: number,
        public label: string,
        public path: string,
        public addedAt: string,
    ) {}
}
