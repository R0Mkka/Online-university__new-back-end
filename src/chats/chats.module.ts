import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ChatsService } from './chats.service';
import { ChatsGatewayService } from './chats-gateway.service';
import { ChatsGateway } from './chats.gateway';

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
        ChatsGatewayService,
        ChatsGateway,
    ],
})
export class ChatsModule {}
