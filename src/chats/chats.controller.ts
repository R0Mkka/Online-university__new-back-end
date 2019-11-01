import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { ChatsService } from './chats.service';

import { IAuthReq } from '../models/auth.models';
import { IChatWithImage, IFullChatData } from '../models/chats.models';
import { SwaggerTags } from '../constants';
import { tryNumberParse } from '../helpers';
import { ChatWithImageDto } from '../swagger/classes/chat-with-image';
import { FullChatDataDto } from '../swagger/classes/full-chat-data';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'You have to authorize and provide a token in headers' })
@ApiInternalServerErrorResponse({ description: 'Server internal error' })
@ApiUseTags(SwaggerTags.Chats)
@Controller('chats')
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
  ) {}

  @Get()
  @ApiOkResponse({ description: 'User chat list', type: [ChatWithImageDto] })
  public getUserChatList(@Request() req: IAuthReq): Promise<IChatWithImage[]> {
    return this.chatsService.getUserChatList(req.user);
  }

  // TODO: Think about getting chats only when users are in them
  @Get(':chatId')
  @ApiOkResponse({ description: 'Chat full data', type: FullChatDataDto })
  @ApiBadRequestResponse({ description: 'Id value type is incorrect' })
  @ApiNotFoundResponse({ description: 'Chat does not exist' })
  public getChat(@Param('chatId') chatIdAsString: string): Promise<IFullChatData> {
    const chatId: number = tryNumberParse(chatIdAsString);

    return this.chatsService.getFullChatData(chatId);
  }
}
