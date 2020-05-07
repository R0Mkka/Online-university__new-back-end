import { ApiModelProperty } from '@nestjs/swagger';

import { ICourseItem, ICourseItemAttachment } from '../../models/courses.models';
import { IUser } from '../../models/users.models';
import { UserDto } from './user';

export class CourseItemDto implements ICourseItem {
  @ApiModelProperty({ type: Number, required: true })
  public courseItemId: number;

  @ApiModelProperty({ type: Number, required: true })
  public courseItemTypeId: number;

  @ApiModelProperty({ type: Number, required: true })
  public courseId: number;

  @ApiModelProperty({ type: UserDto, required: true })
  public creator: IUser;

  @ApiModelProperty({ type: String, required: true })
  public courseItemTitle: string;

  @ApiModelProperty({ type: String, required: true })
  public courseItemTextContent: string;

  @ApiModelProperty({ type: null, required: true })
  public attachments: ICourseItemAttachment[];

  @ApiModelProperty({ type: [0, 1], required: true })
  public isEdited: 0 | 1;

  @ApiModelProperty({ type: String, required: true })
  public addedAt: string;
}
