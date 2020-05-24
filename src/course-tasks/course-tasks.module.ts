import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { CourseTasksController } from './course-tasks.controller';

import { CourseTasksService } from './course-tasks.service';
import { CourseTasksHelperService } from './course-tasks-helper.service';
import { UsersService } from '../users/users.service';
import { FilesService } from '../upload/files.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [
    CourseTasksController,
  ],
  providers: [
    CourseTasksService,
    CourseTasksHelperService,
    UsersService,
    FilesService,
  ],
})
export class CourseTasksModule {}
