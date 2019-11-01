import { Controller, UseGuards, Get, Request, Post, Delete, Param, Body, BadRequestException } from '@nestjs/common';
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
import { ICourseCreationData, IJoinCourseData, ICourseData, IFullCourseData } from '../models/courses.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { SwaggerTags } from '../constants';
import { tryNumberParse } from '../helpers';
import { createCourseOptions, joinCourseOptions } from '../swagger/configs';
import { CourseDataDto } from '../swagger/classes/course-data';
import { SuccessResponseDto } from '../swagger/classes/success-response';
import { FullCourseDataDto } from '../swagger/classes/full-course-data';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'You have to authorize and provide a token in headers' })
@ApiInternalServerErrorResponse({ description: 'Server internal error' })
@ApiUseTags(SwaggerTags.Courses)
@Controller('courses')
export class CoursesController {
    constructor(
        private readonly coursesService: CoursesService,
    ) {}

    @Get()
    @ApiOkResponse({ description: 'User course list', type: [CourseDataDto] })
    public getUserCourseList(@Request() req: IAuthReq): Promise<ICourseData[]> {
        return this.coursesService.getUserCourseList(req.user.userId);
    }

    // TODO: Think about getting courses only when users are in them
    @Get(':courseId')
    @ApiOkResponse({ description: 'Course full data', type: FullCourseDataDto })
    @ApiNotFoundResponse({ description: 'Course does not exist' })
    public getFullCourseData(@Param('courseId') courseIdAsString: string): Promise<IFullCourseData> {
        const courseId: number = tryNumberParse(courseIdAsString);

        return this.coursesService.getFullCourseData(courseId);
    }

    @UseGuards(NoStudentsGuard)
    @Post()
    @ApiImplicitBody(createCourseOptions)
    @ApiCreatedResponse({ description: 'The course was successfully created', type: SuccessResponseDto })
    @ApiBadRequestResponse({ description: 'There are some problems with input data' })
    @ApiForbiddenResponse({ description: 'Only Teachers and Admins have the opportunity to create courses' })
    public createCourse(
        @Body() courseCreationInfo: ICourseCreationData,
        @Request() req: IAuthReq,
    ): Promise<ISqlSuccessResponse> {
        return this.coursesService.createCourse(courseCreationInfo, req.user);
    }

    @UseGuards(NoStudentsGuard)
    @Delete(':courseId')
    @ApiOkResponse({ description: 'Course was removed (if existed)', type: SuccessResponseDto })
    @ApiBadRequestResponse({ description: 'Id value type is incorrect' })
    @ApiForbiddenResponse({ description: 'Only Teachers and Admins have the opportunity to create courses' })
    public removeCourse(
        @Param('courseId') courseIdAsString: string,
        @Request() req: IAuthReq,
    ): Promise<ISqlSuccessResponse> {
        const courseId: number = tryNumberParse(courseIdAsString);

        return this.coursesService.removeCourse(courseId, req.user);
    }

    @Post('/join')
    @ApiImplicitBody(joinCourseOptions)
    @ApiCreatedResponse({ description: 'Course joined successfully', type: SuccessResponseDto })
    @ApiBadRequestResponse({ description: 'There are some problems with input data' })
    @ApiNotFoundResponse({ description: 'Course with such code does not exist' })
    public joinCourse(
        @Body() joinCourseData: IJoinCourseData,
        @Request() req: IAuthReq,
    ): Promise<ISqlSuccessResponse> {
        return this.coursesService.joinCourse(joinCourseData.courseCode, req.user);
    }

    @Delete('/leave/:courseId')
    @ApiOkResponse({ description: 'Course was left (if existed)', type: SuccessResponseDto })
    @ApiBadRequestResponse({ description: 'Id value type is incorrect' })
    public leaveCourse(
        @Param('courseId') courseIdAsString: string,
        @Request() req: IAuthReq,
    ): Promise<ISqlSuccessResponse> {
        const courseId: number = tryNumberParse(courseIdAsString);

        return this.coursesService.destroyConnection(courseId, req.user);
    }
}
