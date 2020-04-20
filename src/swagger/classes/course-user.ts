import { ApiModelProperty } from '@nestjs/swagger';

import { Roles, UserStatuses, ICourseUser } from '../../models/users.models';
import { IShortFile } from '../../models/common.models';
import { ShortFileDto } from './short-file';

export class CourseUserDto implements ICourseUser {
    @ApiModelProperty({ type: Number, required: true })
    public userId: number;

    @ApiModelProperty({ enum: [1, 2, 3], required: true })
    public roleId: Roles;

    @ApiModelProperty({ type: String, required: true })
    public firstName: string;

    @ApiModelProperty({ type: String, required: true })
    public lastName: string;

    @ApiModelProperty({ type: String, required: true })
    public email: string;

    @ApiModelProperty({ type: String, required: true })
    public registeredAt: string;

    @ApiModelProperty({ enum: [1, 2, 3], required: true })
    public statusId: UserStatuses;

    @ApiModelProperty({ type: ShortFileDto, required: true })
    public avatar: IShortFile;
}
