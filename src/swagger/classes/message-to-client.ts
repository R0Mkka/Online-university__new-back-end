import { ApiModelProperty } from '@nestjs/swagger';

import { IMessageToClient } from '../../models/chats.models';

export class MessageToClientDto implements IMessageToClient {
  @ApiModelProperty({ type: Number, required: true })
  public messageId: number;

  @ApiModelProperty({ type: Number, required: true })
  public chatId: number;

  @ApiModelProperty({ type: Number, required: true })
  public userId: number;

  @ApiModelProperty({ type: Number, required: true })
  public userEntryId: number;

  @ApiModelProperty({ type: String, required: true })
  public messageText: string;

  @ApiModelProperty({ type: String, required: true })
  public authorName: string;

  @ApiModelProperty({ type: String, required: true })
  public sentAt: string;

  @ApiModelProperty({ type: Boolean, required: true })
  public isRead: boolean;
}
