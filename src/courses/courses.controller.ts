import { Controller, UseGuards, Get, Request, Post, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiUseTags,
    ApiImplicitBody,
    ApiCreatedResponse,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';

import { CoursesService } from './courses.service';
import { NoStudentsGuard } from './no-students.guard';

import { IAuthReq } from '../models/auth.models';
import { ICourseCreationData, IJoinCourseData, IShortCourseData } from '../models/courses.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { SwaggerTags } from '../constants';
import { courseOptions, joinCourseOptions } from '../swagger/configs';
import { ShortCourseDataDto } from '../swagger/classes/short-course-data';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiUseTags(SwaggerTags.Courses)
@Controller('courses')
export class CoursesController {
    constructor(
        private readonly coursesService: CoursesService,
    ) {}

    @Get()
    @ApiOkResponse({ description: 'User course list', type: [ShortCourseDataDto] })
    @ApiInternalServerErrorResponse({ description: 'Server internal error' })
    public getUserCourseList(@Request() req: IAuthReq): Promise<IShortCourseData[]> {
        return this.coursesService.getUserCourseList(req.user.userId);
    }

    @UseGuards(NoStudentsGuard)
    @Post()
    @ApiImplicitBody(courseOptions)
    @ApiCreatedResponse({ description: 'The course was successfully created' })
    @ApiBadRequestResponse({ description: 'There are some problems with input data' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized error' })
    @ApiForbiddenResponse({ description: 'Only Teachers and Admins have the opportunity to create courses' })
    @ApiInternalServerErrorResponse({ description: 'Server internal error' })
    public createCourse(
        @Body() courseCreationInfo: ICourseCreationData,
        @Request() req: IAuthReq,
    ): Promise<ISqlSuccessResponse> {
        return this.coursesService.createCourse(courseCreationInfo, req.user);
    }

    @Post('/join')
    @ApiImplicitBody(joinCourseOptions)
    @ApiCreatedResponse({ description: 'Course joined successfully' })
    @ApiBadRequestResponse({ description: 'There are some problems with input data' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized error' })
    @ApiNotFoundResponse({ description: 'Course with such code does not exist' })
    @ApiInternalServerErrorResponse({ description: 'Server internal error' })
    public joinCourse(
        @Body() joinCourseData: IJoinCourseData,
        @Request() req: IAuthReq,
    ): Promise<ISqlSuccessResponse> {
        return this.coursesService.joinCourse(joinCourseData.courseCode, req.user);
    }
}
