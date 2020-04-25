import { DBTables } from '../constants';

export enum ChatQueryList {
    GetUserChatList = 'GetUserChatList',
    CreateChat = 'CreateChat',
    CreateUserChatConnection = 'CreateUserChatConnection',
    DeleteUserChatConnection = 'DeleteUserChatConnection',
    GetFullChatData = 'GetFullChatData',
    GetChatUsers = 'GetChatUsers',
    GetChatMessages = 'GetChatMessages',
    AddMessage = 'AddMessage',
}

export const Queries: { [key in ChatQueryList]: string } = {
    GetUserChatList: `
        SELECT
            ${DBTables.Chats}.chatId,
            ${DBTables.Chats}.chatOwnerId,
            ${DBTables.Chats}.chatName,
            ${DBTables.Chats}.createdAt,
            ${DBTables.Chats}.chatImageId imageId,
            ${DBTables.ChatsImages}.path imagePath,
            ${DBTables.ChatsImages}.name imageName,
            ${DBTables.ChatsImages}.originalName imageOriginalName,
            ${DBTables.ChatsImages}.mimeType imageMimeType,
            ${DBTables.ChatsImages}.size imageSize,
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

    DeleteUserChatConnection: `
        DELETE
        FROM
            ${DBTables.UsersChats}
        WHERE
            userId = ? AND chatId = ?;
    `,

    GetFullChatData: `
        SELECT
            ${DBTables.Chats}.chatId,
            ${DBTables.Chats}.chatOwnerId,
            ${DBTables.Chats}.chatName,
            ${DBTables.Chats}.createdAt,
            ${DBTables.Chats}.chatImageId imageId,
            ${DBTables.ChatsImages}.path imagePath,
            ${DBTables.ChatsImages}.name imageName,
            ${DBTables.ChatsImages}.originalName imageOriginalName,
            ${DBTables.ChatsImages}.mimeType imageMimeType,
            ${DBTables.ChatsImages}.size imageSize,
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
            ${DBTables.UsersEntries}.userStatusId statusId,
            ${DBTables.AccountImages}.accountImageId avatarId,
            ${DBTables.AccountImages}.path avatarPath,
            ${DBTables.AccountImages}.name avatarName,
            ${DBTables.AccountImages}.originalName avatarOriginalName,
            ${DBTables.AccountImages}.mimeType avatarMimeType,
            ${DBTables.AccountImages}.size avatarSize,
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

    GetChatMessages: `
        SELECT
            ${DBTables.Messages}.messageId,
            ${DBTables.Messages}.chatId,
            ${DBTables.Messages}.userId,
            ${DBTables.Messages}.userEntryId,
            ${DBTables.Messages}.messageText,
            CONCAT(${DBTables.Users}.firstName, ' ', ${DBTables.Users}.lastName) authorName,
            ${DBTables.Messages}.sentAt,
            ${DBTables.MessagesStatuses}.isRead
        FROM
            ${DBTables.Messages}
        LEFT JOIN ${DBTables.MessagesStatuses}
            USING(messageId)
        LEFT JOIN ${DBTables.Users}
            USING(userId)
        WHERE chatId = ?;
    `,

    AddMessage: `
        INSERT INTO ${DBTables.Messages} (
            chatId,
            userId,
            userEntryId,
            messageText
        ) VALUES (?,?,?,?);
    `,
};
