import { IFile, IShortFile } from './common.models';

export enum Roles {
    Teacher = 1,
    Student = 2,
    Admin = 3,
}

export enum UserStatuses {
    Online = 1,
    Offline = 2,
    Away = 3,
}

export interface IFullUserData {
    userId: number;
    roleId: Roles;
    login: string;
    firstName: string;
    lastName: string;
    educationalInstitution: string;
    email: string;
    password: string;
    registeredAt: string;
    entryId: number;
    statusId: UserStatuses;
    themeName: string;
    languageName: string;
    avatarId: number;
    avatarPath: string;
    avatarName: string;
    avatarOriginalName: string;
    avatarMimeType: string;
    avatarSize: number;
    avatarAddedAt: string;
}

export interface IUser {
    userId: number;
    roleId: Roles;
    login: string;
    firstName: string;
    lastName: string;
    educationalInstitution: string;
    email: string;
    registeredAt: string;
    entryId: number;
    statusId: UserStatuses;
    themeName: string;
    languageName: string;
    avatar: IFile;
}

export interface IFullCourseUserData {
    userId: number;
    roleId: Roles;
    firstName: string;
    lastName: string;
    email: string;
    registeredAt: string;
    statusId: UserStatuses;
    avatarId: number;
    avatarName: string;
    avatarMimeType: string;
}

export interface ICourseUser {
    userId: number;
    roleId: Roles;
    firstName: string;
    lastName: string;
    email: string;
    registeredAt: string;
    statusId: UserStatuses;
    avatar: IShortFile;
}

export interface IRegisterUserData {
    roleId: Roles;
    login: string;
    firstName: string;
    lastName: string;
    educationalInstitution: string;
    email: string;
    password: string;
}

export interface IUserIdObject {
    userId: number;
}

export interface IUserEntryIdObject {
    userEntryId: number;
}
