import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { UsersService } from './users.service';

import { UsersController } from './users.controller';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [
        UsersController,
    ],
    providers: [
        UsersService,
    ],
})
export class UsersModule {}
