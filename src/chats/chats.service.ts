import { Injectable } from '@nestjs/common';

import { Database } from '../database';
import { ChatQueryList, Queries } from './chats.queries';

import { IUserLikePayload } from '../models/auth.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { newBadRequestException } from '../helpers';

const db = Database.getInstance();

@Injectable()
export class ChatsService {
    public createChat(chatName: string, userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.CreateChat,
                [userPayload.userId, chatName],
                (error: Error, creationInfo: ISqlSuccessResponse) => {
                    if (error) {
                        reject(newBadRequestException(ChatQueryList.CreateChat));
                    }

                    resolve(creationInfo);
                },
            );
        });
    }
}
