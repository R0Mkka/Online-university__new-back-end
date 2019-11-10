import { ApiModelProperty } from '@nestjs/swagger';

import { IFullChatData, IMessageToClient } from '../../models/chats.models';
import { IFile } from '../../models/common.models';
import { IUser } from '../../models/users.models';
import { FileDto } from './file';
import { UserDto } from './user';
import { MessageToClientDto } from './message-to-client';

export class FullChatDataDto implements IFullChatData {
  @ApiModelProperty({ type: Number, required: true })
  public chatId: number;

  @ApiModelProperty({ type: Number, required: true })
  public chatOwnerId: number;

  @ApiModelProperty({ type: String, required: true })
  public chatName: string;

  @ApiModelProperty({ type: String, required: true })
  public createdAt: string;

  @ApiModelProperty({ type: FileDto, required: true })
  public image: IFile;

  @ApiModelProperty({ type: [UserDto], required: true })
  public users: IUser[];

  @ApiModelProperty({ type: [MessageToClientDto], required: true })
  public messages: IMessageToClient[];
}
