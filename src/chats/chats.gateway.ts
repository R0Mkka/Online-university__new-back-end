import { Logger } from '@nestjs/common';
import { WebSocketGateway, OnGatewayInit, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { ChatsGatewayService } from './chats-gateway.service';

import { IMessageToServer, IMessageToClient } from '../models/chats.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { MessageToClient } from '../classes/message-to-client';

@WebSocketGateway()
export class ChatsGateway implements OnGatewayInit {
  @WebSocketServer()
  private wss: Server;

  private logger: Logger = new Logger('ChatsGateway');

  constructor(
    private readonly chatsGatewayService: ChatsGatewayService,
  ) {}

  public afterInit(): void {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('msgToServer')
  public async handleMessage(_, messageData: IMessageToServer): Promise<void> {
    const addedMessageInfo: ISqlSuccessResponse = await this.chatsGatewayService.addMessage(messageData);
    const messageToClient: IMessageToClient = new MessageToClient(addedMessageInfo.insertId, messageData);

    this.wss.emit(
      `msgToClient:chatId${messageData.chatId}`,
      messageToClient,
    );
  }
}
