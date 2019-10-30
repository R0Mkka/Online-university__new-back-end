import { ApiModelProperty } from '@nestjs/swagger';

export class TokenObjectDto {
    @ApiModelProperty({ type: String, required: true })
    public token: string;
}
