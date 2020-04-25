import { Module } from '@nestjs/common';

import { TimetableService } from './timetable.service';

import { TimetableController } from './timetable.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [
        TimetableController,
    ],
    providers: [
        TimetableService,
    ],
})
export class TimetableModule {}
