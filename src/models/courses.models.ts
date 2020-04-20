import { IUser, ICourseUser } from './users.models';

export interface ICourseCreationData {
    courseName: string;
    courseGroupName: string;
    courseDescription: string;
    courseCode: string;
}

export interface IJoinCourseData {
    courseCode: string;
}

export interface IJoinedCourseData {
    joinedCourseId: number;
}

export enum CourseModes {
    Private = 0,
    Public = 1,
}

export interface ICourseData {
    courseId: number;
    courseOwnerId: number;
    courseOwnerFullName: string;
    chatId: number;
    courseName: string;
    courseGroupName: string;
    courseDescription: string;
    courseCode: string;
    courseCreatedAt: string;
    pictureName: string;
    colorPaletteName: string;
    courseMode: CourseModes;
}

export interface ICourseItemData {
    courseItemId: number;
    courseId: number;
    creatorId: number;
    courseItemTitle: string;
    courseItemTextContent: string;
    addedAt: string;
}

export interface ICreateCourseItemData {
    courseId: number;
    courseItemTitle: string;
    courseItemTextContent: string;
}

export interface IModifyCourseItemData {
    courseItemTitle?: string;
    courseItemTextContent?: string;
}

export interface ICourseItem extends ICreateCourseItemData {
    courseItemId: number;
    creator: IUser;
    addedAt: string;
}

export interface IFullCourseData extends ICourseData {
    courseItems: ICourseItem[];
    courseUsers: ICourseUser[];
}
