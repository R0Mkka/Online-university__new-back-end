import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { CoursesService } from './courses.service';
import { ChatsService } from '../chats/chats.service';
import { CourseItemsService } from '../course-items/course-items.service';
import { UsersService } from '../users/users.service';
import { TimetableService } from '../timetable/timetable.service';

import { CoursesController } from './courses.controller';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [
        CoursesController,
    ],
    providers: [
        CoursesService,
        ChatsService,
        CourseItemsService,
        UsersService,
        TimetableService,
    ],
})
export class CoursesModule {}
