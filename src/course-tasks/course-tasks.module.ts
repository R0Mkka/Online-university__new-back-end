import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { CourseTasksController } from './course-tasks.controller';

import { CourseTasksService } from './course-tasks.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [
    CourseTasksController,
  ],
  providers: [
    CourseTasksService,
  ],
})
export class CourseTasksModule {}
