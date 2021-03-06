import { DBTables } from '../constants';

export enum UsersQueryList {
    GetAllUsers = 'GetAllUsers',
    GetUserByLogin = 'GetUserByLogin',
    GetUserById = 'GetUserById',
    GetUserEntryIdByConnectionId = 'GetUserEntryIdByConnectionId',
    GetUserIdByConnectionId = 'GetUserIdByConnectionId',
    GetUsersLastEntries = 'GetUsersLastEntries',
    AddUserEntry = 'AddUserEntry',
    ModifyUserEntry = 'ModifyUserEntry',
    RegisterUser = 'RegisterUser',
    ModifyUser = 'ModifyUser',
    ChangeUserPassword = 'ChangeUserPassword',
    DeleteUser = 'DeleteUser',
}

const GET_USERS_FULL_INFO = `
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
        ${DBTables.Users}
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
`;

export const Queries: { [key in UsersQueryList]: string } = {
    GetAllUsers: `
        ${GET_USERS_FULL_INFO};
    `,

    GetUserByLogin: `
        ${GET_USERS_FULL_INFO}
        WHERE ${DBTables.Users}.login = ?;
    `,

    GetUserById: `
        ${GET_USERS_FULL_INFO}
        WHERE ${DBTables.Users}.userId = ?;
    `,

    GetUserEntryIdByConnectionId: `
        SELECT
            userEntryId
        FROM
            ${DBTables.UsersEntries}
        WHERE
            connectionId = ?;
    `,

    GetUserIdByConnectionId: `
        SELECT
            userId
        FROM
            ${DBTables.UsersEntries}
        WHERE
            connectionId = ?;
    `,

    GetUsersLastEntries: `
        SELECT
            *
        FROM
            ${DBTables.UsersEntries}
        LEFT JOIN (
            SELECT MAX(userEntryId) userEntryId
            FROM ${DBTables.UsersEntries}
            GROUP BY userId
        ) maxEntriesIds
        USING(userEntryId)
        GROUP BY userId;
    `,

    AddUserEntry: `
        INSERT INTO ${DBTables.UsersEntries} (
            userId,
            connectionId
        ) VALUES (?,?);
    `,

    ModifyUserEntry: `
        UPDATE
            ${DBTables.UsersEntries}
        SET
            leftAt = CURRENT_TIMESTAMP,
            userStatusId = 2
        WHERE
            connectionId = ?;
    `,

    RegisterUser: `
        INSERT INTO ${DBTables.Users} (
            roleId,
            firstName,
            lastName,
            login,
            educationalInstitution,
            email,
            password
        ) VALUES (?,?,?,?,?,?,?);
    `,

    ModifyUser: `
        UPDATE
            ${DBTables.Users}
        SET
            firstName = ?,
            lastName = ?,
            roleId = ?,
            educationalInstitution = ?,
            login = ?,
            email = ?
        WHERE
            userId = ?;
    `,

    ChangeUserPassword: `
        UPDATE
            ${DBTables.Users}
        SET
            password = ?
        WHERE
            userId = ?;
    `,

    DeleteUser: `
        DELETE
        FROM
            ${DBTables.Users}
        WHERE
            userId = ?;
    `,
};
