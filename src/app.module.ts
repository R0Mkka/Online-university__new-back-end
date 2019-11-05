import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganModule, MorganInterceptor } from 'nest-morgan';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CoursesModule } from './courses/courses.module';
import { CourseItems } from './course-items/course-items.module';
import { ChatsModule } from './chats/chats.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    MorganModule.forRoot(),
    AuthModule,
    UsersModule,
    CoursesModule,
    CourseItems,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
  ],
})
export class AppModule {}
