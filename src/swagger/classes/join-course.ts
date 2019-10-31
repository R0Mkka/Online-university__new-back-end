import { ApiModelProperty } from '@nestjs/swagger';

import { IJoinCourseData } from '../../models/courses.models';

export class JoinCourseDto implements IJoinCourseData {
    @ApiModelProperty({ type: String, required: true })
    public courseCode: string;
}
