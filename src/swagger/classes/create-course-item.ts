import { ApiModelProperty } from '@nestjs/swagger';

import { ICreateCourseItemData } from '../../models/courses.models';

export class CreateCourseItemDto implements ICreateCourseItemData {
  @ApiModelProperty({ type: Number, required: true })
  public courseId: number;

  @ApiModelProperty({ type: Number, required: true })
  public courseItemTypeId: number;

  @ApiModelProperty({ type: String, required: true })
  public courseItemTitle: string;

  @ApiModelProperty({ type: String, required: true })
  public courseItemTextContent: string;
}
