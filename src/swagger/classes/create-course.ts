import { ApiModelProperty } from '@nestjs/swagger';

import { ICourseCreationData } from '../../models/courses.models';

export class CreateCourseDto implements ICourseCreationData {
    @ApiModelProperty({ type: String, required: true })
    public courseName: string;

    @ApiModelProperty({ type: String, required: true })
    public courseGroupName: string;

    @ApiModelProperty({ type: String, required: true })
    public courseDescription: string;

    @ApiModelProperty({ type: String, required: true })
    public courseCode: string;

    @ApiModelProperty({ type: String, required: true })
    public addedAt: string;
}
