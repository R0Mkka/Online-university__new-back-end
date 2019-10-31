import { Module } from '@nestjs/common';

import { ChatsService } from './chats.service';

import { ChatsController } from './chats.controller';

@Module({
    imports: [],
    controllers: [
        ChatsController,
    ],
    providers: [
        ChatsService,
    ],
})
export class ChatsModule {}
