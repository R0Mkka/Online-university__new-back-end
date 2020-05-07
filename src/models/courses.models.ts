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
    courseItemTypeId: number;
    courseId: number;
    creatorId: number;
    courseItemTitle: string;
    courseItemTextContent: string;
    isEdited: 0 | 1;
    addedAt: string;
}

export interface ICreateCourseItemData {
    courseId: number;
    courseItemTypeId: number;
    courseItemTitle: string;
    courseItemTextContent: string;
}

export interface IModifyCourseItemData {
    courseItemTitle?: string;
    courseItemTextContent?: string;
}

export interface ICourseItem extends ICreateCourseItemData {
    courseItemId: number;
    attachments: ICourseItemAttachment[];
    creator: IUser;
    isEdited: 0 | 1;
    addedAt: string;
}

export interface ICourseItemAttachment {
    courseItemAttachmentId: number;
    courseItemId: number;
    path: string;
    name: string;
    originalName: string;
    mimeType: string;
    size: number;
    addedAt: string;
}

export interface IFullCourseData extends ICourseData {
    courseItems: ICourseItem[];
    courseUsers: ICourseUser[];
}

export interface ICreatedCourseData {
    createdCourseId: number;
}

export interface ICreatedCourseItemData {
    createdCourseItemId: number;
}

export interface IUserDeletedFromCourse {
    courseId: number;
    deletedUserId: number;
}
