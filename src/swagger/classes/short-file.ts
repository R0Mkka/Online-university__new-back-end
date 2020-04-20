import { ApiModelProperty } from '@nestjs/swagger';

import { IShortFile } from '../../models/common.models';

export class ShortFileDto implements IShortFile {
    @ApiModelProperty({ type: Number, required: true })
    public id: number;

    @ApiModelProperty({ type: String, required: true })
    public name: string;

    @ApiModelProperty({ type: String, required: true })
    public mimeType: string;
}
