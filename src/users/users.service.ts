import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { Database } from '../database';
import { Queries } from './users.queries';

import { IUser, IFullUserData, IRegisterUserData } from '../models/users.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { getUserFromUserData } from '../helpers';

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
                        reject(new BadRequestException('[GetAllUsers] Request error!'));
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
                    if (error || !usersData[0]) {
                        reject(new BadRequestException('[GetUserByLogin] Request error!'));
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
                    if (error || !usersData[0]) {
                        reject(new BadRequestException('[GetUserById] Request error!'));
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
                        reject(new BadRequestException('[AddUserEntry] Request error!'));
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
                        reject(new BadRequestException('[RegisterUser] Request error!'));
                    }

                    resolve(creationInfo);
                },
            );
        });
    }
}
