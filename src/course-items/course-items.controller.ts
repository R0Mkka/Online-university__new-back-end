import { Controller, UseGuards, Post, Delete, Patch, Body, Request, Param, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUseTags,
  ApiImplicitBody,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { CourseItemsService } from './course-items.service';
import { NoStudentsGuard } from '../guards/no-students.guard';

import { ICreateCourseItemData, IModifyCourseItemData, ICreatedCourseItemData } from '../models/courses.models';
import { IAuthReq } from '../models/auth.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { SwaggerTags } from '../constants';
import { createCourseItemOptions, modifyCourseItemOptions } from '../swagger/configs';
import { tryNumberParse } from '../helpers';
import { SuccessResponseDto } from '../swagger/classes/success-response';

@UseGuards(AuthGuard(), NoStudentsGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'You have to authorize and provide a token in headers' })
@ApiInternalServerErrorResponse({ description: 'Server internal error' })
@ApiUseTags(SwaggerTags.CourseItems)
@Controller('course-items')
export class CourseItemsController {
  constructor(
    private readonly courseItemsService: CourseItemsService,
  ) {}

  @Get(':courseItemId')
  @ApiNotFoundResponse({ description: 'Course item does not exist' })
  public getCourseItem(@Param('courseItemId') courseItemIdAsString: string): any {
    const courseItemId: number = tryNumberParse(courseItemIdAsString);

    return this.courseItemsService.getCourseItemById(courseItemId);
  }

  @Post()
  @ApiImplicitBody(createCourseItemOptions)
  @ApiForbiddenResponse({ description: 'Only Teachers and Admins have the opportunity to create courses items' })
  public createCourseItem(
    @Body() createCourseItemData: ICreateCourseItemData,
    @Request() req: IAuthReq,
  ): Promise<ICreatedCourseItemData> {
    return this.courseItemsService.createCourseItem(createCourseItemData, req.user);
  }

  @Delete(':courseItemId')
  @ApiOkResponse({ description: 'Course item was removed (if existed)', type: SuccessResponseDto })
  @ApiForbiddenResponse({ description: 'Only Teachers and Admins have the opportunity to remove courses items' })
  public removeCourseItem(@Param('courseItemId') courseItemIdAsString: string): Promise<ISqlSuccessResponse> {
    const courseItemId: number = tryNumberParse(courseItemIdAsString);

    return this.courseItemsService.removeCourseItem(courseItemId);
  }

  @Patch(':courseItemId')
  @ApiImplicitBody(modifyCourseItemOptions)
  @ApiOkResponse({ description: 'Course item was modified', type: SuccessResponseDto })
  @ApiForbiddenResponse({ description: 'Only Teachers and Admins have the opportunity to mofidy courses items' })
  @ApiNotFoundResponse({ description: 'Course item does not exist' })
  public modifyCourseItem(
    @Body() modifyCourseItemData: IModifyCourseItemData,
    @Param('courseItemId') courseItemIdAsString: string,
  ): Promise<ISqlSuccessResponse> {
    const courseItemId: number = tryNumberParse(courseItemIdAsString);

    return this.courseItemsService.modifyCourseItem(modifyCourseItemData, courseItemId);
  }
}
