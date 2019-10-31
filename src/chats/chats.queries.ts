import { DBTables } from '../constants';

export enum ChatQueryList {
    CreateChat = 'CreateChat',
}

export const Queries: { [key in ChatQueryList]: string } = {
    CreateChat: `
        INSERT INTO ${DBTables.Chats} (
            chatOwnerId,
            chatName
        ) VALUES (?,?);
    `,
};
