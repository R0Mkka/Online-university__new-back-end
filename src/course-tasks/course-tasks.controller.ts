import { Controller, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CourseTasksService } from './course-tasks.service';

// @UseGuards(AuthGuard()) TODO: TEMP
@Controller('course-tasks')
export class CourseTasksController {
  constructor(
    private courseTasksService: CourseTasksService,
  ) {}

  @Get()
  public getCourseTasks(): any[] {
    return [];
  }
}
