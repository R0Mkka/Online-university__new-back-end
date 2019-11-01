import { ApiModelProperty } from '@nestjs/swagger';

import { IFullChatData } from '../../models/chats.models';
import { IImage } from '../../models/common.models';
import { IUser } from '../../models/users.models';
import { ImageDto } from './image';
import { UserDto } from './user';

export class FullChatDataDto implements IFullChatData {
  @ApiModelProperty({ type: Number, required: true })
  public chatId: number;

  @ApiModelProperty({ type: Number, required: true })
  public chatOwnerId: number;

  @ApiModelProperty({ type: String, required: true })
  public chatName: string;

  @ApiModelProperty({ type: String, required: true })
  public createdAt: string;

  @ApiModelProperty({ type: ImageDto, required: true })
  public image: IImage;

  @ApiModelProperty({ type: [UserDto], required: true })
  public users: IUser[];

  @ApiModelProperty({ type: [Object], required: true }) // TODO: Types
  public messages: any[];
}
