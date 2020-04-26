import { DBTables } from '../constants';

export enum TimetableQueryList {
    GetUserTimetableItems = 'GetUserTimetableItems',
    GetUserTimetableItemsGroups = 'GetUserTimetableItemsGroups',
    GetUserTimetableItemsStickers = 'GetUserTimetableItemsStickers',
    CreateTimetableitem = 'CreateTimetableitem',
    CreateTimetableitemsGroup = 'CreateTimetableitemsGroup',
    CreateTimetableitemsSticker = 'CreateTimetableitemsSticker',
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

    CreateTimetableitem: `
        INSERT INTO ${DBTables.TimetableItems} (
            userId,
            dayOfTheWeekId,
            courseId,
            timetableItemGroupId,
            subject,
            teacherFullName,
            onlineMeeting,
            classroom,
            startTime,
            endTime
        )
        VALUES (?,?,?,?,?,?,?,?,?,?);
    `,

    CreateTimetableitemsGroup: `
        INSERT INTO ${DBTables.TimetableItemGroups} (
            userId,
            name
        )
        VALUES (?,?);
    `,

    CreateTimetableitemsSticker: `
        INSERT INTO ${DBTables.TimetableItemStickers} (
            userId,
            title,
            color
        )
        VALUES (?,?,?);
    `,
};
