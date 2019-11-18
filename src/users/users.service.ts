import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { Database } from '../database';
import { UsersQueryList, Queries } from './users.queries';

import { IUser, IFullUserData, IRegisterUserData } from '../models/users.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { NumberOrString } from '../models/database.models';
import { IUserLikePayload } from '../models/auth.models';
import { getUserFromUserData, newBadRequestException, newNotFoundException } from '../helpers';

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
                        reject(newBadRequestException(UsersQueryList.GetAllUsers));
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
                        reject(newBadRequestException(UsersQueryList.GetUserByLogin));
                    }

                    if (!usersData[0]) {
                        reject(new NotFoundException(`[${UsersQueryList.GetUserByLogin}] User with such login does not exist`));
                    }

                    resolve(usersData[0]);
                },
            );
        });
    }

    public getUserById(userId: number): Promise<IUser> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetUserById,
                [userId],
                (error: Error, usersData: IFullUserData[]) => {
                    if (error) {
                        reject(newBadRequestException(UsersQueryList.GetUserById));
                    }

                    if (!usersData[0]) {
                        reject(newNotFoundException(UsersQueryList.GetUserById));
                    }

                    const user: IUser = getUserFromUserData(usersData[0]);

                    resolve(user);
                },
            );
        });
    }

    public addUserEntry(userId: number): Promise<ISqlSuccessResponse> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.AddUserEntry,
                [userId],
                (error: Error, addingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        reject(newBadRequestException(UsersQueryList.AddUserEntry));
                    }

                    resolve(addingInfo);
                },
            );
        });
    }

    public logoutUser(userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.ModiflyUserEntry,
                [userPayload.entryId],
                (error: Error, modifyingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        reject(newBadRequestException(UsersQueryList.ModiflyUserEntry));
                    }

                    resolve(modifyingInfo);
                },
            );
        });
    }

    public async registerUser(registerUserData: IRegisterUserData): Promise<ISqlSuccessResponse> {
        const params = await this.getRegisterParams(registerUserData);

        return new Promise((resolve, reject) => {
            db.query(
                Queries.RegisterUser,
                params,
                (error: Error, creationInfo: ISqlSuccessResponse) => {
                    if (error) {
                        reject(newBadRequestException(UsersQueryList.RegisterUser));
                    }

                    resolve(creationInfo);
                },
            );
        });
    }

    public async deleteUser(userId: number): Promise<ISqlSuccessResponse> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.DeleteUser,
                [userId],
                (error: Error, deletingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        reject(newBadRequestException(UsersQueryList.DeleteUser));
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
}
