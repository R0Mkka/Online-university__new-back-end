import { ApiModelProperty } from '@nestjs/swagger';

import { ICourseData, CourseModes } from '../../models/courses.models';

export class CourseDataDto implements ICourseData {
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

    @ApiModelProperty({ type: String })
    public pictureName: string;

    @ApiModelProperty({ type: String })
    public colorPaletteName: string;

    @ApiModelProperty({ enum: [0, 1], required: true })
    public courseMode: CourseModes;
}
