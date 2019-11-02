import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { CourseItemsService } from './course-items.service';
import { UsersService } from '../users/users.service';

import { CourseItemsController } from './course-items.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [
    CourseItemsController,
  ],
  providers: [
    CourseItemsService,
    UsersService,
  ],
})
export class CourseItems {}
