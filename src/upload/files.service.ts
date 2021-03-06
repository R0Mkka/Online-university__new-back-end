import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { UsersService } from '../users/users.service';

import { Database } from '../database';
import { FilesQueries, FilesQueryList } from './files.queries';

import { IUser } from '../models/users.models';
import { IFile } from '../models/upload.models';
import { IUserLikePayload } from '../models/auth.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { NumberOrString } from '../models/database.models';
import { newBadRequestException, newNotFoundException } from '../helpers';

const db = Database.getInstance();

@Injectable()
export class FilesService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  public getFileByName(fileName: string, directory: string = 'files'): Promise<string> {
    return new Promise((resolve, reject) => {
      const filePath: string = this.getFilePath(fileName, directory);

      fs.exists(filePath, (exists: boolean) => {
        if (!exists) {
          return reject(newNotFoundException('GetFileByName'));
        }

        resolve(filePath);
      });
    });
  }

  public async uploadUserAvatar(avatar: IFile, userPayload: IUserLikePayload): Promise<IFile> {
    const user: IUser = await this.usersService.getUserById(userPayload.userId) as IUser;

    if (!!user.avatar.id) {
      const filePath: string = this.getFilePath(user.avatar.name);

      fs.unlink(filePath, (error: Error) => {
        return Promise.reject(error);
      });
    }

    const params: NumberOrString[] = this.getUploadUserAvatarParams(avatar);

    return new Promise((resolve, reject) => {
      db.query(
        FilesQueries.UploadUserAvatar,
        params,
        (error: Error, avatarUploadInfo: ISqlSuccessResponse) => {
          if (error) {
            return reject(newBadRequestException(FilesQueryList.UploadUserAvatar));
          }

          resolve(avatarUploadInfo);
        },
      );
    })
    .then(async (avatarUploadInfo: ISqlSuccessResponse) => {
      await this.bindAvatarToUser(avatarUploadInfo.insertId, userPayload);

      return avatar;
    });
  }

  private getFilePath(fileName: string, directory: string = 'files'): string {
    return path.join(__dirname, '../', '../', directory, fileName);
  }

  private getUploadUserAvatarParams(avatar: IFile): NumberOrString[] {
    const params: NumberOrString[] = [];

    params.push(avatar.path, avatar.filename, avatar.originalname, avatar.mimetype, avatar.size);

    return params;
  }

  private bindAvatarToUser(avatarId: number, userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
    return new Promise((resolve, reject) => {
      db.query(
        FilesQueries.BindAvatarToUser,
        [avatarId, userPayload.userId],
        (error: Error, bindingInfo: ISqlSuccessResponse) => {
          if (error) {
            return reject(newBadRequestException(FilesQueryList.BindAvatarToUser));
          }

          resolve(bindingInfo);
        },
      );
    });
  }
}
