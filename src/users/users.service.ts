import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

import { Database } from '../database';
import { UsersQueryList, Queries } from './users.queries';

import { IUser, IFullUserData, IRegisterUserData, IUserIdObject, IUserEntryIdObject } from '../models/users.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { NumberOrString } from '../models/database.models';
import { getUserFromUserData, newBadRequestException, newNotFoundException } from '../helpers';
import { IChangePasswordData } from 'src/models/user-settings.models';

const db = Database.getInstance();

@Injectable()
export class UsersService {
    public getUserList(): Promise<IUser[]> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetAllUsers,
                [],
                (error: Error, usersData: IFullUserData[]) => {
                    if (error) {
                        return reject(newBadRequestException(UsersQueryList.GetAllUsers));
                    }

                    resolve(usersData);
                },
            );
        })
        .then((usersData: IFullUserData[]) => {
            return usersData.map(
                (singleUserData: IFullUserData) => getUserFromUserData(singleUserData),
            );
        });
    }

    public getUserByLogin(login: string): Promise<IFullUserData> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetUserByLogin,
                [login],
                (error: Error, usersData: IFullUserData[]) => {
                    if (error) {
                        return reject(newBadRequestException(UsersQueryList.GetUserByLogin));
                    }

                    if (!usersData[0]) {
                        return reject(new NotFoundException(`[${UsersQueryList.GetUserByLogin}] User with such login does not exist`));
                    }

                    resolve(usersData[0]);
                },
            );
        });
    }

    public getUserById(userId: number, withPassword: boolean = false): Promise<IUser | IFullUserData> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetUserById,
                [userId],
                (error: Error, usersData: IFullUserData[]) => {
                    if (error) {
                        return reject(newBadRequestException(UsersQueryList.GetUserById));
                    }

                    if (!usersData[0]) {
                        return reject(newNotFoundException(UsersQueryList.GetUserById));
                    }

                    if (withPassword) {
                        resolve(usersData[0]);
                    } else {
                        resolve(getUserFromUserData(usersData[0]));
                    }
                },
            );
        });
    }

    public getUserEntryIdByConnectionId(connectionId: string): Promise<IUserEntryIdObject> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetUserEntryIdByConnectionId,
                [connectionId],
                (error: Error, userEntriesIdObjects: IUserEntryIdObject[]) => {
                    const userEntryIdObject: IUserEntryIdObject = userEntriesIdObjects[0];

                    if (error || !userEntryIdObject) {
                        return reject(newNotFoundException(UsersQueryList.GetUserEntryIdByConnectionId));
                    }

                    resolve(userEntryIdObject);
                },
            );
        });
    }

    public getUserIdByConnectionId(connectionId: string): Promise<IUserIdObject> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetUserIdByConnectionId,
                [connectionId],
                (error: Error, userIdObjects: IUserIdObject[]) => {
                    const userIdObject: IUserIdObject = userIdObjects[0];

                    if (error || !userIdObject) {
                        return reject(newNotFoundException(UsersQueryList.GetUserIdByConnectionId));
                    }

                    resolve(userIdObject);
                },
            );
        });
    }

    public addUserEntry(userId: number, connectionId: string): Promise<ISqlSuccessResponse> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.AddUserEntry,
                [userId, connectionId],
                (error: Error, addingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(UsersQueryList.AddUserEntry));
                    }

                    resolve(addingInfo);
                },
            );
        });
    }

    public markUserAsOffline(connectionId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.ModifyUserEntry,
                [connectionId],
                (error: Error, modifyData: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(UsersQueryList.ModifyUser));
                    }

                    resolve(modifyData);
                },
            );
        })
        .then(() => this.getUserIdByConnectionId(connectionId));
    }

    public async registerUser(registerUserData: IRegisterUserData): Promise<ISqlSuccessResponse> {
        const params = await this.getRegisterParams(registerUserData);

        return new Promise((resolve, reject) => {
            db.query(
                Queries.RegisterUser,
                params,
                (error: Error, creationInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(UsersQueryList.RegisterUser));
                    }

                    resolve(creationInfo);
                },
            );
        });
    }

    public async modifyUser(modifyUserData: any, userId: number): Promise<ISqlSuccessResponse> { // TODO: Type
        const user: IUser = await this.getUserById(userId) as IUser;
        const params: NumberOrString[] = this.getUserModifyParams({ ...user, ...modifyUserData });

        return new Promise((resolve, reject) => {
            db.query(
                Queries.ModifyUser,
                params,
                (error: Error, modifyingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(UsersQueryList.ModifyUser));
                    }

                    resolve(modifyingInfo);
                });
        });
    }

    public async changeUserPassword(changePasswordData: IChangePasswordData, userId: number): Promise<ISqlSuccessResponse> {
        const userWithPassword = true;
        const fullUserData: IFullUserData = await this.getUserById(userId, userWithPassword) as IFullUserData;
        const doPasswordsMatch = await bcrypt.compare(changePasswordData.oldPassword, fullUserData.password);

        if (!doPasswordsMatch) {
            return Promise.reject(newBadRequestException('INVALID PASSWORD'));
        }

        return new Promise(async (resolve, reject) => {
            const hashedPassword = await bcrypt.hash(changePasswordData.newPassword, 10);

            db.query(
                Queries.ChangeUserPassword,
                [hashedPassword, userId],
                (error: Error, changingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(UsersQueryList.ChangeUserPassword));
                    }

                    resolve(changingInfo);
                },
            );
        });
    }

    public async deleteUser(userId: number): Promise<ISqlSuccessResponse> {
        const user: IUser = await this.getUserById(userId) as IUser;

        if (!!user.avatar.id) {
            const filePath: string = path.join(__dirname, '../', '../', 'files', user.avatar.name);

            fs.unlink(filePath, (error: Error) => {
                return Promise.reject(error);
            });
        }

        return new Promise((resolve, reject) => {
            db.query(
                Queries.DeleteUser,
                [userId],
                (error: Error, deletingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(UsersQueryList.DeleteUser));
                    }

                    resolve(deletingInfo);
                },
            );
        });
    }

    private async getRegisterParams(registerUserData: IRegisterUserData): Promise<NumberOrString[]> {
        const params = [];
        const hashedPassword = await bcrypt.hash(registerUserData.password, 10);

        params.push(registerUserData.roleId);
        params.push(registerUserData.firstName);
        params.push(registerUserData.lastName);
        params.push(registerUserData.login);
        params.push(registerUserData.educationalInstitution);
        params.push(registerUserData.email);
        params.push(hashedPassword);

        return params;
    }

    private getUserModifyParams(modifyUserData: IUser): NumberOrString[] {
        const params: NumberOrString[] = [];

        params.push(
            modifyUserData.firstName,
            modifyUserData.lastName,
            modifyUserData.roleId,
            modifyUserData.educationalInstitution,
            modifyUserData.login,
            modifyUserData.email,
            modifyUserData.userId,
        );

        return params;
    }
}
