import { ApiModelProperty } from '@nestjs/swagger';

import { IChatWithImage } from '../../models/chats.models';
import { IFile } from '../../models/common.models';
import { FileDto } from './file';

export class ChatWithImageDto implements IChatWithImage {
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
}
