import { Controller, Get, UseGuards, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiUseTags,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

import { ChatsService } from './chats.service';

import { IAuthReq } from '../models/auth.models';
import { SwaggerTags } from '../constants';
import { tryNumberParse } from '../helpers';

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
  public getUserChatList(@Request() req: IAuthReq): Promise<any> { // TODO: Type
    return this.chatsService.getUserChatList(req.user);
  }

  @Get(':chatId')
  public getChat(@Param('chatId') chatIdAsString: string): Promise<any> { // TODO: Type
    const chatId: number = tryNumberParse(chatIdAsString);

    return this.chatsService.getFullChatData(chatId);
  }
}
