export interface ITimetable {
    items: ITimetableItem[];
    groups: ITimetableItemGroup[];
    stickers: ITimetableItemSticker[];
}

export interface ITimetableItem {
    timetableItemId: number;
    userId: number;
    dayOfTheWeekId: DaysOfTheWeek;
    timetableItemGroupId: number | null;
    courseId: number | null;
    subject: string;
    teacherFullName: string;
    onlineMeeting: string | null;
    classroom: string | null;
    startTime: string;
    endTime: string;
}

export interface ITimetableItemGroup {
    timetableItemGroupId: number;
    userId: number;
    name: string;
}

export interface ITimetableItemSticker {
    timetableItemStickerId: number;
    userId: number;
    title: string;
    color: string;
}

export interface IDayOfTheWeek {
    dayOfTheWeekId: DaysOfTheWeek;
    name: string;
}

export interface INewTimetableItem {
    dayOfTheWeekId: DaysOfTheWeek;
    courseId: number | null;
    timetableItemGroupId: number | null;
    subject: string;
    teacherFullName: string;
    onlineMeeting: string | null;
    classroom: string | null;
    startTime: string;
    endTime: string;
}

export interface ICreatedTimetableItemInfo {
    newTimetableItemId: number;
}

export interface INewTimetableItemsGroup {
    name: string;
}

export interface ICreatedTimetableItemsGroupInfo {
    newTimetableItemsGroupId: number;
}

export interface IDeletedTimetableItemsGroupInfo {
    deletedTimetableItemsGroupId: number;
}

export interface INewTimetableItemsSticker {
    title: string;
    color: string;
}

export interface ICreatedTimetableItemsStickerInfo {
    newTimetableItemStickerId: number;
}

export enum DaysOfTheWeek {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
    Sunday = 7,
}
