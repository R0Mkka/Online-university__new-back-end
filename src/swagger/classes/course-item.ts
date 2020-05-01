import { ApiModelProperty } from '@nestjs/swagger';

import { ICourseItem } from '../../models/courses.models';
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

  @ApiModelProperty({ type: String, required: true })
  public addedAt: string;
}
