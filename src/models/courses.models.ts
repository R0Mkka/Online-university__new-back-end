import { IUser } from './users.models';

export interface ICourseCreationData {
    courseName: string;
    courseGroupName: string;
    courseDescription: string;
    courseCode: string;
}

export interface IJoinCourseData {
    courseCode: string;
}

export enum CourseModes {
    Private = 0,
    Public = 1,
}

export interface ICourseData {
    courseId: number;
    courseOwnerId: number;
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

export interface ICourseItem {
    courseItemId: number;
    courseId: number;
    courseDataId: number;
    courseItemTitle: string;
    courseItemTextContent: string;
}

export interface IFullCourseData extends ICourseData {
    courseItems: ICourseItem[];
    users: IUser[];
}
