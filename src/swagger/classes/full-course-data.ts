import { ApiModelProperty } from '@nestjs/swagger';

import { CourseModes, IFullCourseData, ICourseItem } from '../../models/courses.models';
import { ICourseUser } from '../../models/users.models';
import { CourseItemDto } from './course-item';
import { CourseUserDto } from './course-user';

export class FullCourseDataDto {
  @ApiModelProperty({ type: Number, required: true })
  public courseId: number;

  @ApiModelProperty({ type: Number, required: true })
  public courseOwnerId: number;

  @ApiModelProperty({ type: String, required: true })
  public courseOwnerFullName: string;

  @ApiModelProperty({ type: Number, required: true })
  public chatId: number;

  @ApiModelProperty({ type: String, required: true })
  public courseName: string;

  @ApiModelProperty({ type: String, required: true })
  public courseGroupName: string;

  @ApiModelProperty({ type: String, required: true })
  public courseDescription: string;

  @ApiModelProperty({ type: String, required: true, uniqueItems: true })
  public courseCode: string;

  @ApiModelProperty({ type: String, required: true })
  public courseCreatedAt: string;

  @ApiModelProperty({ type: String, required: true })
  public pictureName: string;

  @ApiModelProperty({ type: String, required: true })
  public colorPaletteName: string;

  @ApiModelProperty({ enum: [0, 1], required: true })
  public courseMode: CourseModes;

  @ApiModelProperty({ type: [CourseItemDto], required: true })
  public courseItems: ICourseItem[];

  @ApiModelProperty({ type: [CourseUserDto], required: true })
  public courseUsers: ICourseUser[];
}
