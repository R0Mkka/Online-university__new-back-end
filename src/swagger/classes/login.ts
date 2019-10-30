import { ApiModelProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiModelProperty({ type: String, required: true })
    public login: string;

    @ApiModelProperty({ type: String, required: true })
    public password: string;
}
