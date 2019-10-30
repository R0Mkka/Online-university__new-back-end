import { Controller, UseGuards, Get, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

import { CoursesService } from './courses.service';

import { IAuthReq } from '../models/auth.models';
import { SwaggerTags } from '../constants';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiUseTags(SwaggerTags.Courses)
@Controller('courses')
export class CoursesController {
    constructor(
        private readonly coursesService: CoursesService,
    ) {}

    @Get()
    public getCourseList(@Request() req: IAuthReq): any {
        return 'Course list!';
    }
}
