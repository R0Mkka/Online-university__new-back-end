import { ApiModelProperty } from '@nestjs/swagger';

import { Roles, UserStatuses, IUser } from '../../models/users.models';
import { IImage } from '../../models/common.models';
import { ImageDto } from './image';

export class UserDto implements IUser {
    @ApiModelProperty({ type: Number, required: true })
    public userId: number;

    @ApiModelProperty({ enum: [1, 2, 3], required: true })
    public roleId: Roles;

    @ApiModelProperty({ type: String, required: true })
    public login: string;

    @ApiModelProperty({ type: String, required: true })
    public firstName: string;

    @ApiModelProperty({ type: String, required: true })
    public lastName: string;

    @ApiModelProperty({ type: String, required: true })
    public educationalInstitution: string;

    @ApiModelProperty({ type: String, required: true })
    public email: string;

    @ApiModelProperty({ type: String, required: true })
    public registeredAt: string;

    @ApiModelProperty({ type: Number, required: true })
    public entryId: number;

    @ApiModelProperty({ enum: [1, 2, 3], required: true })
    public statusId: UserStatuses;

    @ApiModelProperty({ type: String, required: true })
    public enteredAt: string;

    @ApiModelProperty({ type: String, required: true })
    public leftAt: string;

    @ApiModelProperty({ type: String, required: true })
    public themeName: string;

    @ApiModelProperty({ type: String, required: true })
    public languageName: string;

    @ApiModelProperty({ type: ImageDto, required: true })
    public avatar: IImage;
}
