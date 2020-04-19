import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ChatsService } from './chats.service';
import { UsersService } from '../users/users.service';

import { ChatsController } from './chats.controller';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
    controllers: [
        ChatsController,
    ],
    providers: [
        ChatsService,
        UsersService,
    ],
})
export class ChatsModule {}
