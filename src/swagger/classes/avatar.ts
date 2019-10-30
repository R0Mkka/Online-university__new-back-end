import { ApiModelProperty } from '@nestjs/swagger';

export class AvatarDto {
    @ApiModelProperty({ type: Number, required: true })
    public id: number;

    @ApiModelProperty({ type: String, required: true })
    public label: string;

    @ApiModelProperty({ type: String, required: true })
    public path: string;

    @ApiModelProperty({ type: String, required: true })
    public addedAt: string;
}
