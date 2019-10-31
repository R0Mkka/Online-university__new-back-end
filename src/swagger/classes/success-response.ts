import { ApiModelProperty } from '@nestjs/swagger';

import { ISqlSuccessResponse } from '../../models/common.models';

export class SuccessResponseDto implements ISqlSuccessResponse {
    @ApiModelProperty({ type: Number, required: true })
    public fieldCount: number;

    @ApiModelProperty({ type: Number, required: true })
    public affectedRows: number;

    @ApiModelProperty({ type: Number, required: true })
    public insertId: number;

    @ApiModelProperty({ type: String, required: true })
    public info: string;

    @ApiModelProperty({ type: Number, required: true })
    public serverStatus: number;

    @ApiModelProperty({ type: Number, required: true })
    public warningStatus: number;
}
