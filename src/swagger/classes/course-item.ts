import { ApiModelProperty } from '@nestjs/swagger';

import { ICourseItem } from '../../models/courses.models';

export class CourseItemDto implements ICourseItem {
  @ApiModelProperty({ type: Number, required: true })
  public courseItemId: number;

  @ApiModelProperty({ type: Number, required: true })
  public courseId: number;

  @ApiModelProperty({ type: Number, required: true })
  public courseDataId: number;

  @ApiModelProperty({ type: String, required: true })
  public courseItemTitle: string;

  @ApiModelProperty({ type: String, required: true })
  public courseItemTextContent: string;
}
