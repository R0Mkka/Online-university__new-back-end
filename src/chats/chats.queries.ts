import { DBTables } from '../constants';

export enum ChatQueryList {
    GetUserChatList = 'GetUserChatList',
    CreateChat = 'CreateChat',
    CreateUserChatConnection = 'CreateUserChatConnection',
    GetFullChatData = 'GetFullChatData',
    GetChatUsers = 'GetChatUsers',
    GetChatMessages = 'GetChatMessages',
}

export const Queries: { [key in ChatQueryList]: string } = {
    GetUserChatList: `
        SELECT
            ${DBTables.Chats}.chatId,
            ${DBTables.Chats}.chatOwnerId,
            ${DBTables.Chats}.chatName,
            ${DBTables.Chats}.createdAt,
            ${DBTables.Chats}.chatImageId imageId,
            ${DBTables.ChatsImages}.label imageLabel,
            ${DBTables.ChatsImages}.path imagePath,
            ${DBTables.ChatsImages}.addedAt imageAddedAt
        FROM
            ${DBTables.UsersChats}
        LEFT JOIN ${DBTables.Chats}
            USING (chatId)
        LEFT JOIN ${DBTables.ChatsImages}
            USING (chatImageId)
        WHERE userId = ?
    `,
    CreateChat: `
        INSERT INTO ${DBTables.Chats} (
            chatOwnerId,
            chatName
        ) VALUES (?,?);
    `,
    CreateUserChatConnection: `
        INSERT INTO ${DBTables.UsersChats} (
            userId,
            chatId
        ) VALUES (?,?);
    `,
    GetFullChatData: `
        SELECT
            ${DBTables.Chats}.chatId,
            ${DBTables.Chats}.chatOwnerId,
            ${DBTables.Chats}.chatName,
            ${DBTables.Chats}.createdAt,
            ${DBTables.Chats}.chatImageId imageId,
            ${DBTables.ChatsImages}.label imageLabel,
            ${DBTables.ChatsImages}.path imagePath,
            ${DBTables.ChatsImages}.addedAt imageAddedAt
        FROM
            ${DBTables.Chats}
        LEFT JOIN ${DBTables.ChatsImages}
            USING(chatImageId)
        WHERE chatId = ?;
    `,
    GetChatUsers: `
        SELECT
            ${DBTables.Users}.userId,
            ${DBTables.Users}.roleId,
            ${DBTables.Users}.login,
            ${DBTables.Users}.firstName,
            ${DBTables.Users}.lastName,
            ${DBTables.Users}.educationalInstitution,
            ${DBTables.Users}.email,
            ${DBTables.Users}.password,
            ${DBTables.Users}.registeredAt,
            ${DBTables.UsersEntries}.userEntryId entryId,
            ${DBTables.UsersEntries}.userStatusId statusId,
            ${DBTables.UsersEntries}.enteredAt,
            ${DBTables.UsersEntries}.leftAt,
            ${DBTables.AccountImages}.accountImageId avatarId,
            ${DBTables.AccountImages}.label avatarLabel,
            ${DBTables.AccountImages}.path avatarPath,
            ${DBTables.AccountImages}.addedAt avatarAddedAt,
            ${DBTables.Themes}.themeName,
            ${DBTables.Languages}.languageName
        FROM
            ${DBTables.UsersChats}
        LEFT JOIN ${DBTables.Users}
            USING (userId)
        LEFT JOIN (
            SELECT *
            FROM ${DBTables.UsersEntries}
            ORDER BY enteredAt DESC
            LIMIT 1
        ) ${DBTables.UsersEntries}
            USING(userId)
        LEFT JOIN ${DBTables.AccountImages}
            USING(accountImageId)
        LEFT JOIN ${DBTables.Themes}
            USING(themeId)
        LEFT JOIN ${DBTables.Languages}
            USING(languageId)
        WHERE chatId = ?;
    `,
    // TODO
    GetChatMessages: `
        SELECT
            *
        FROM
            ${DBTables.Messages}
        WHERE chatId = ?;
    `,
};