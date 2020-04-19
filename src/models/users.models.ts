import { IFile } from './common.models';

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
    enteredAt: string;
    leftAt: string;
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
    enteredAt: string;
    leftAt: string;
    themeName: string;
    languageName: string;
    avatar: IFile;
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
