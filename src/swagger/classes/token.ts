import { ApiModelProperty } from '@nestjs/swagger';

import { ITokenObject } from '../../models/auth.models';

export class TokenObjectDto implements ITokenObject {
    @ApiModelProperty({ type: String, required: true })
    public token: string;
}
