import { DBTables } from '../constants';

export enum TimetableQueryList {
    GetUserTimetableItems = 'GetUserTimetableItems',
    GetUserTimetableItemsGroups = 'GetUserTimetableItemsGroups',
    GetUserTimetableItemsStickers = 'GetUserTimetableItemsStickers',
    CreateTimetableItem = 'CreateTimetableItem',
    CreateTimetableItemsGroup = 'CreateTimetableItemsGroup',
    UpdateTimetableItemsGroup = 'UpdateTimetableItemsGroup',
    CreateTimetableItemsSticker = 'CreateTimetableItemsSticker',
    DeleteTimetableItemsGroup = 'DeleteTimetableItemsGroup',
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
        WHERE
            userId = ?;
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
            userId,
            title,
            color
        )
        VALUES (?,?,?);
    `,

    DeleteTimetableItemsGroup: `
        DELETE
        FROM
            ${DBTables.TimetableItemGroups}
        WHERE
            userId = ? AND timetableItemGroupId = ?;
    `,
};
