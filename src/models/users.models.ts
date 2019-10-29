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
    eneredAt: string;
    leftAt: string;
    themeName: string;
    languageName: string;
    avatarId: number;
    avatarLabel: string;
    avatarPath: string;
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
    eneredAt: string;
    leftAt: string;
    themeName: string;
    languageName: string;
    avatar: IAvatar;
}

export interface IAvatar {
    id: number;
    label: string;
    path: string;
    addedAt: string;
}
