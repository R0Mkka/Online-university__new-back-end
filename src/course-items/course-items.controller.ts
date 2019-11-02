import { Controller, UseGuards, Post, Delete, Patch, Body, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUseTags,
  ApiImplicitBody,
} from '@nestjs/swagger';

import { CourseItemsService } from './course-items.service';
import { NoStudentsGuard } from '../guards/no-students.guard';

import { ICreateCourseItemData } from '../models/courses.models';
import { IAuthReq } from '../models/auth.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { SwaggerTags } from '../constants';
import { createCourseItemOptions } from '../swagger/configs';

@UseGuards(AuthGuard(), NoStudentsGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'You have to authorize and provide a token in headers' })
@ApiForbiddenResponse({ description: 'Only Teachers and Admins have the opportunity to create/remove/mofidy courses items' })
@ApiInternalServerErrorResponse({ description: 'Server internal error' })
@ApiUseTags(SwaggerTags.CourseItems)
@Controller('course-items')
export class CourseItemsController {
  constructor(
    private readonly courseItemsService: CourseItemsService,
  ) {}

  @Post()
  @ApiImplicitBody(createCourseItemOptions)
  public addCourseItem(
    @Body() createCourseItemData: ICreateCourseItemData,
    @Request() req: IAuthReq,
  ): Promise<ISqlSuccessResponse> {
    return this.courseItemsService.addCourseItem(createCourseItemData, req.user);
  }

  @Delete(':courseItemId')
  public removeCourseItem(@Param('courseItemId') courseItemIdAsString: string): any {
    
  }

  @Patch()
  public modifyCourseItem(@Body() courseItemDto: ICreateCourseItemData): any {

  }
}
