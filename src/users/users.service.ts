import { Injectable, BadRequestException } from '@nestjs/common';

import { Database } from '../database';
import { Queries } from './users.queries';

const db = Database.getInstance();

@Injectable()
export class UsersService {
    public getUserList(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetAllUsers,
                [],
                (error: any, data: any[]) => {
                    if (error) {
                        reject(new BadRequestException('Request error!'));
                    }

                    resolve(data);
                },
            );
        })
        .then((usersInfo: any[]) => {
            return usersInfo.map(item => {
                const { password, avatarId, avatarLabel, avatarPath, avatarAddedAt, ...resultUser } = item;

                resultUser.avatar = {
                    id: avatarId,
                    label: avatarLabel,
                    path: avatarPath,
                    addedAt: avatarAddedAt,
                };

                return resultUser;
            });
        });
    }
}
