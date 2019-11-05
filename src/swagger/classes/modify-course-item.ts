import { ApiModelProperty } from '@nestjs/swagger';

import { IModifyCourseItemData } from '../../models/courses.models';

export class ModifyCourseItemDto implements IModifyCourseItemData {
  @ApiModelProperty({ type: String, required: false })
  public courseItemTitle: string;

  @ApiModelProperty({ type: String, required: false })
  public courseItemTextContent: string;
}
