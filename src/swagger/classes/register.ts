import { ApiModelProperty } from '@nestjs/swagger';

import { Roles } from '../../models/users.models';

export class RegisterUserDataDto {
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
    public password: string;
}
