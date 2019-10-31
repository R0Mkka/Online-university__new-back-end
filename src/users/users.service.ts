import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { Database } from '../database';
import { UsersQueryList, Queries } from './users.queries';

import { IUser, IFullUserData, IRegisterUserData } from '../models/users.models';
import { ISqlSuccessResponse } from '../models/common.models';
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

    public async registerUser(registerUserData: IRegisterUserData): Promise<ISqlSuccessResponse> {
        const params = Object.values(registerUserData);
        const hashedPassword = await bcrypt.hash(params.pop(), 10);

        params.push(hashedPassword);

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
}
