import { Module } from '@nestjs/common';

import { WebSocketsGateway } from './websockets.gateway';
import { UsersService } from '../users/users.service';
import { ChatsService } from '../chats/chats.service';

@Module({
    imports: [],
    controllers: [],
    providers: [
        WebSocketsGateway,
        UsersService,
        ChatsService,
    ],
})
export class WebsocketsModule {}
