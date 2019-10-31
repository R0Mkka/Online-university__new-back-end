import { ApiModelProperty } from '@nestjs/swagger';

import { IAvatar } from '../../models/users.models';

export class AvatarDto implements IAvatar {
    @ApiModelProperty({ type: Number, required: true })
    public id: number;

    @ApiModelProperty({ type: String, required: true })
    public label: string;

    @ApiModelProperty({ type: String, required: true })
    public path: string;

    @ApiModelProperty({ type: String, required: true })
    public addedAt: string;
}
