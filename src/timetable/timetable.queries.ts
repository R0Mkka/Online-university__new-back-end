import { DBTables } from '../constants';

export enum TimetableQueryList {
    GetUserTimetableItems = 'GetUserTimetableItems',
    GetUserTimetableItemsGroups = 'GetUserTimetableItemsGroups',
    GetUserTimetableItemsStickers = 'GetUserTimetableItemsStickers',
    CreateTimetableItem = 'CreateTimetableItem',
    CreateTimetableItemsGroup = 'CreateTimetableItemsGroup',
    UpdateTimetableItemsGroup = 'UpdateTimetableItemsGroup',
    CreateTimetableItemsSticker = 'CreateTimetableItemsSticker',
    AddStickerToItem = 'AddStickerToItem',
    DeleteStickerFromItem = 'DeleteStickerFromItem',
    DeleteTimetableItemsGroup = 'DeleteTimetableItemsGroup',
    GetAddedStickersToTimetableItem = 'GetAddedStickersToTimetableItem',
    CreateUserStickerConnection = 'CreateUserStickerConnection',
}

export const TimetableQueries: { [key in TimetableQueryList]: string } = {
    GetUserTimetableItems: `
        SELECT
            *
        FROM
            ${DBTables.TimetableItems}
        WHERE
            userId = ?;
    `,

    GetUserTimetableItemsGroups: `
        SELECT
            *
        FROM
            ${DBTables.TimetableItemGroups}
        WHERE
            userId = ?;
    `,

    GetUserTimetableItemsStickers: `
        SELECT
            *
        FROM
            ${DBTables.TimetableItemStickers}
        LEFT JOIN ${DBTables.UsersTimetableItemsStickers}
            USING (timetableItemStickerId)
        WHERE
            userId = ? OR isCommon = TRUE;
    `,

    CreateTimetableItem: `
        INSERT INTO ${DBTables.TimetableItems} (
            userId,
            dayOfTheWeekId,
            courseId,
            timetableItemGroupId,
            subject,
            teacherFullName,
            onlineMeeting,
            classroom,
            comment,
            startTime,
            endTime
        )
        VALUES (?,?,?,?,?,?,?,?,?,?,?);
    `,

    CreateTimetableItemsGroup: `
        INSERT INTO ${DBTables.TimetableItemGroups} (
            userId,
            name,
            isPrivate
        )
        VALUES (?,?,?);
    `,

    UpdateTimetableItemsGroup: `
        UPDATE
            ${DBTables.TimetableItemGroups}
        SET
            name = ?,
            isPrivate = ?
        WHERE
            userId = ? AND timetableItemGroupId = ?;
    `,

    CreateTimetableItemsSticker: `
        INSERT INTO ${DBTables.TimetableItemStickers} (
            title,
            color,
            abbreviation
        )
        VALUES (?,?,?);
    `,

    AddStickerToItem: `
        INSERT INTO ${DBTables.TimetableItemsTimetableItemsStickers} (
            timetableItemId,
            timetableItemStickerId
        )
        VALUES (?,?);
    `,

    DeleteStickerFromItem: `
        DELETE
        FROM
            ${DBTables.TimetableItemsTimetableItemsStickers}
        WHERE
            timetableItemId = ? AND timetableItemStickerId = ?;
    `,

    DeleteTimetableItemsGroup: `
        DELETE
        FROM
            ${DBTables.TimetableItemGroups}
        WHERE
            userId = ? AND timetableItemGroupId = ?;
    `,

    GetAddedStickersToTimetableItem: `
        SELECT
            timetableItemStickerId,
            title,
            color,
            abbreviation,
            isCommon,
            userId
        FROM
            ${DBTables.TimetableItemStickers}
        LEFT JOIN
            ${DBTables.TimetableItemsTimetableItemsStickers}
        USING(timetableItemStickerId)
        LEFT JOIN
            ${DBTables.UsersTimetableItemsStickers}
        USING(timetableItemStickerId)
        WHERE
            timetableItemId = ?;
    `,

    CreateUserStickerConnection: `
        INSERT INTO ${DBTables.UsersTimetableItemsStickers} (
            userId,
            timetableItemStickerId
        )
        VALUES (?,?);
    `,
};
