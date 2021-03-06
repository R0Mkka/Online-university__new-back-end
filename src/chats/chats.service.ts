import { Injectable, NotFoundException } from '@nestjs/common';

import { UsersService } from '../users/users.service';

import { Database } from '../database';
import { ChatQueryList, Queries } from './chats.queries';

import { IUserLikePayload } from '../models/auth.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { IChatData, IChatWithImage, IFullChatData, IMessageToClient, IMessageToServer } from '../models/chats.models';
import { IUser, IFullUserData, IUserEntryIdObject } from '../models/users.models';
import { newBadRequestException, getUserFromUserData, getChatWithImageFromChatData } from '../helpers';

const db = Database.getInstance();

@Injectable()
export class ChatsService {
    constructor(
        private usersService: UsersService,
    ) {}

    public getUserChatList(userPayload: IUserLikePayload): Promise<IChatWithImage[]> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetUserChatList,
                [userPayload.userId],
                (error: Error, chats: IChatData[]) => {
                    if (error) {
                        return reject(newBadRequestException(ChatQueryList.GetUserChatList));
                    }

                    resolve(
                        chats.map((chatData: IChatData) => getChatWithImageFromChatData(chatData)),
                    );
                },
            );
        });
    }

    public createChat(chatName: string, userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.CreateChat,
                [userPayload.userId, chatName],
                async (error: Error, chatCreationInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(ChatQueryList.CreateChat));
                    }

                    await this.createUserChatConnection(chatCreationInfo.insertId, userPayload);

                    resolve(chatCreationInfo);
                },
            );
        });
    }

    public createUserChatConnection(chatId: number, userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.CreateUserChatConnection,
                [userPayload.userId, chatId],
                (error: Error, connectionCreationInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(ChatQueryList.CreateUserChatConnection));
                    }

                    resolve(connectionCreationInfo);
                },
            );
        });
    }

    public destroyConnection(chatId: number, userId: number): Promise<ISqlSuccessResponse> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.DeleteUserChatConnection,
                [userId, chatId],
                (error: Error, destroyingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(ChatQueryList.DeleteUserChatConnection));
                    }

                    resolve(destroyingInfo);
                },
            );
        });
    }

    public getFullChatData(chatId: number): Promise<IFullChatData> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetFullChatData,
                [chatId],
                async (error: Error, chats: IChatData[]) => {
                    if (error) {
                        return reject(newBadRequestException(ChatQueryList.GetFullChatData));
                    }

                    if (!chats[0]) {
                        return reject(new NotFoundException('Chat does not exist'));
                    }

                    const chatWithImage: IChatWithImage = getChatWithImageFromChatData(chats[0]);
                    const chatUsers: IUser[] = await this.getChatUsers(chatId);
                    const messageList: IMessageToClient[] = await this.getChatMessages(chatId);

                    resolve({
                        ...chatWithImage,
                        users: chatUsers,
                        messages: messageList,
                    });
                },
            );
        });
    }

    public addMessage(messageData: IMessageToServer, connectionId: string): Promise<ISqlSuccessResponse> {
        return new Promise(async (resolve, reject) => {
            const entryIdObject: IUserEntryIdObject = await this.usersService.getUserEntryIdByConnectionId(connectionId);

            db.query(
                Queries.AddMessage,
                [
                    messageData.chatId,
                    messageData.user.userId,
                    entryIdObject.userEntryId,
                    messageData.messageText,
                ],
                (error: Error, insertedMessageInfo: ISqlSuccessResponse) => {
                    if (error) {
                    return reject(newBadRequestException(ChatQueryList.AddMessage));
                    }

                    resolve(insertedMessageInfo);
                },
            );
        });
      }

    private getChatUsers(chatId: number): Promise<IUser[]> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetChatUsers,
                [chatId],
                (error: Error, userList: IFullUserData[]) => {
                    if (error) {
                        return reject(newBadRequestException(ChatQueryList.GetChatUsers));
                    }

                    resolve(userList.map(userData => getUserFromUserData(userData)));
                },
            );
        });
    }

    private getChatMessages(chatId: number): Promise<IMessageToClient[]> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetChatMessages,
                [chatId],
                (error: Error, messageList: IMessageToClient[]) => {
                    if (error) {
                        return reject(newBadRequestException(ChatQueryList.GetChatMessages));
                    }

                    resolve(messageList);
                },
            );
        });
    }
}
