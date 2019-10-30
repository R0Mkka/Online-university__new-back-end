import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { CoursesService } from './courses.service';

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
    ],
})
export class CoursesModule {}
