import { DBTables } from '../constants';

export enum UsersQueryList {
    GetAllUsers = 'GetAllUsers',
    GetUserByLogin = 'GetUserByLogin',
    GetUserById = 'GetUserById',
    AddUserEntry = 'AddUserEntry',
    ModiflyUserEntry = 'ModiflyUserEntry',
    RegisterUser = 'RegisterUser',
    ModifyUser = 'ModifyUser',
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
        ${DBTables.UsersEntries}.userEntryId entryId,
        ${DBTables.UsersEntries}.userStatusId statusId,
        ${DBTables.UsersEntries}.enteredAt,
        ${DBTables.UsersEntries}.leftAt,
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

    AddUserEntry: `
        INSERT INTO ${DBTables.UsersEntries} (
            userId
        ) VALUES (?);
    `,

    ModiflyUserEntry: `
        UPDATE
            ${DBTables.UsersEntries}
        SET
            leftAt = CURRENT_TIMESTAMP
        WHERE
            userEntryId = ?;
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

    DeleteUser: `
        DELETE
        FROM
            ${DBTables.Users}
        WHERE
            userId = ?;
    `,
};
