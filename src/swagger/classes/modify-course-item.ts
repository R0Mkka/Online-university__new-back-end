import { ApiModelProperty } from '@nestjs/swagger';

import { IModifyCourseItemData } from '../../models/courses.models';

export class ModifyCourseItemDto implements IModifyCourseItemData {
  @ApiModelProperty({ type: String })
  public courseItemTitle: string;

  @ApiModelProperty({ type: String })
  public courseItemTextContent: string;
}
