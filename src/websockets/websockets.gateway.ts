import { WebSocketGateway, OnGatewayInit, OnGatewayDisconnect, SubscribeMessage, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';

import { UsersService } from '../users/users.service';
import { ChatsService } from '../chats/chats.service';

import { IUserIdObject } from '../models/ws.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { IMessageToServer, IMessageToClient } from '../models/chats.models';
import { MessageToClient } from '../classes/message-to-client';

@WebSocketGateway()
export class WebSocketsGateway implements OnGatewayInit, OnGatewayDisconnect {
    @WebSocketServer()
    private wss: Server;

    private logger = new Logger('WebSocketsGateway');

    constructor(
        private usersService: UsersService,
        private chatsService: ChatsService,
    ) {}

    public afterInit(): void {
        this.logger.log('Initialized!');
    }

    public handleDisconnect(disconnectedSocket): void {
        this.usersService.markUserAsOffline(disconnectedSocket.id)
            .then(() => this.logger.log(disconnectedSocket.id, 'User:disconnect'));
    }

    @SubscribeMessage('user_connect')
    public handleUserConnect(socket, userIdObjectAsJSON: string): void {
        const userIdObject: IUserIdObject = JSON.parse(userIdObjectAsJSON);

        this.usersService.addUserEntry(userIdObject.userId, socket.id)
            .then(() => this.logger.log(socket.id, 'User:connect'));
    }

    @SubscribeMessage('chatMessageToServer')
    public async handleChatMessage(socket, messageData: IMessageToServer): Promise<void> {
        const addedMessageInfo: ISqlSuccessResponse = await this.chatsService.addMessage(messageData, socket.id);
        const messageToClient: IMessageToClient = new MessageToClient(addedMessageInfo.insertId, messageData);

        this.wss.emit(
            `chatMessageToClient:chatId${messageData.chatId}`,
            messageToClient,
        );
    }
}
