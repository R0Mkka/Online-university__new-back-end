import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import * as mime from 'mime';

import { UsersService } from '../users/users.service';

import { Database } from '../database';
import { CourseItemsQueryList, CourseItemsQueires } from './course-items.queries';

import { ICreateCourseItemData, IModifyCourseItemData, ICourseItem, ICourseItemData, ICreatedCourseItemData, ICourseItemAttachment } from '../models/courses.models';
import { IUserLikePayload } from '../models/auth.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { NumberOrString } from '../models/database.models';
import { IUser } from '../models/users.models';
import { IFile } from '../models/upload.models';
import { newBadRequestException, newNotFoundException } from '../helpers';

const db = Database.getInstance();

@Injectable()
export class CourseItemsService {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  public createCourseItem(
    createCourseItemData: ICreateCourseItemData,
    userPayload: IUserLikePayload,
  ): Promise<ICreatedCourseItemData> {
    return new Promise((resolve, reject) => {
      const params: NumberOrString[] = this.getCourseItemCreationParams(createCourseItemData, userPayload);

      db.query(
        CourseItemsQueires.CreateCourseItem,
        params,
        (error: Error, courseItemCreationInfo: ISqlSuccessResponse) => {
          if (error) {
            return reject(newBadRequestException(CourseItemsQueryList.CreateCourseItem));
          }

          resolve({
            createdCourseItemId: courseItemCreationInfo.insertId,
          });
        },
      );
    });
  }

  // TODO: Types
  public editCourseItem(
    editCourseItemData: ICreateCourseItemData,
    courseItemId: number,
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const courseItem = await this.getCourseItemById(courseItemId);
      const { courseItemTypeId, courseItemTitle, courseItemTextContent } = editCourseItemData;

      db.query(
        CourseItemsQueires.EditCourseItem,
        [
          courseItemTypeId,
          courseItemTitle,
          courseItemTextContent,
          courseItemId,
        ],
        async (error: Error, _: ISqlSuccessResponse) => {
          if (error) {
            return reject(newBadRequestException(CourseItemsQueryList.EditCourseItem));
          }

          if (!courseItem.isEdited) {
            try {
              await this.markCourseItemAsEdited(courseItemId);
            } catch (error) {
              return reject(newBadRequestException(CourseItemsQueryList.MarkCourseItemAdEdited));
            }
          }

          resolve({
            editedCourseItemData: {
              courseItemId,
              courseItemTypeId,
              courseItemTitle,
              courseItemTextContent,
            },
          });
        },
      );
    });
  }

  public addCourseItemAttachmentsToDB(attachments: IFile[], courseItemId: number): Promise<any> {
    const params = [] as any;

    for (const attachment of attachments) {
      params.push([
        courseItemId,
        attachment.path,
        attachment.filename,
        attachment.originalname,
        attachment.mimetype,
        attachment.size,
      ]);
    }

    return new Promise((resolve, reject) => {
      db.query(
        CourseItemsQueires.AddCourseItemAttachments,
        [params],
        (error: Error, _: ISqlSuccessResponse) => {
          if (error) {
            return reject(newBadRequestException(CourseItemsQueryList.AddCourseItemAttachments));
          }

          resolve({
            courseItemId,
            addedFiles: attachments.map((file: IFile) => file.filename),
          });
        },
      );
    });
  }

  public deleteCourseItemAttachmentsFromDB(attachments: ICourseItemAttachment[], courseItemId: number): Promise<any> {
    const params = attachments.map(({ courseItemAttachmentId }: ICourseItemAttachment) => {
      return [courseItemAttachmentId, courseItemId];
    });

    return new Promise((resolve, reject) => {
      db.query(
        CourseItemsQueires.DeleteCourseItemAttachments,
        [params as any],
        (error: Error, deleteingInfo: ISqlSuccessResponse) => {
          if (error) {
            return reject(newBadRequestException(CourseItemsQueryList.DeleteCourseItemAttachments));
          }

          resolve(deleteingInfo);
        },
      );
    });
  }

  public async editCourseItemAttachments(newAttachments: IFile[], courseItemId: number): Promise<any> {
    const courseItem = await this.getCourseItemById(courseItemId);
    const addedFiles: IFile[] = [];
    const deletedFiles: ICourseItemAttachment[] = [];

    for (const newAttachment of newAttachments) {
      const contains = courseItem.attachments.some((existingAttachment) => {
        return newAttachment.size === existingAttachment.size;
      });

      if (!contains) {
        addedFiles.push(newAttachment);
      }
    }

    for (const existingAttachment of courseItem.attachments) {
      const contains = newAttachments.some((newAttachment) => {
        return newAttachment.size === existingAttachment.size;
      });

      if (!contains) {
        deletedFiles.push(existingAttachment);
      }
    }

    return Promise.all([
      new Promise(async (resolve, reject) => {
        for (const file of addedFiles) {
          const generatedName = `${uuidv4()}.${mime.getExtension(file.mimetype)}`;
          const filePath = path.join(__dirname, '../', '../', 'attachments', generatedName);

          file.path = `attachments\\${generatedName}`;
          file.filename = generatedName;

          try {
            await new Promise((res, rej) => {
              fs.writeFile(filePath, (file as any).buffer, (err) => {
                if (err) {
                  return rej(err);
                }

                res();
              });
            });
          } catch (error) {
            return reject(newBadRequestException('AddedFilesCreation'));
          }
        }

        resolve(addedFiles);
      }),
      new Promise(async (resolve, reject) => {
        for (const file of deletedFiles) {
          const generatedName = `${uuidv4()}.${mime.getExtension(file.mimeType)}`;
          const filePath = path.join(__dirname, '../', '../', 'attachments', file.name);

          try {
            await new Promise((res, rej) => {
              fs.unlink(filePath, (err) => {
                if (err) {
                  return rej(err);
                }

                res();
              });
            });
          } catch (error) {
            return reject(newBadRequestException('DeletedFilesCreation'));
          }
        }

        resolve(deletedFiles);
      }),
    ])
    .then(async ([added, deleted]: [ IFile[], ICourseItemAttachment[] ]) => {
      if (added.length !== 0) {
        try {
          await this.addCourseItemAttachmentsToDB(added, courseItemId);
        } catch (err) {
          throw new Error(err);
        }
      }

      if (deleted.length !== 0) {
        try {
          await this.deleteCourseItemAttachmentsFromDB(deleted, courseItemId);
        } catch (err) {
          throw new Error(err);
        }
      }

      if (!courseItem.isEdited) {
        try {
          await this.markCourseItemAsEdited(courseItemId);
        } catch (err) {
          throw new Error(err);
        }
      }

      return {
        added: added.map((file) => file.originalname),
        deleted: deleted.map((file) => file.originalName),
      };
    })
    .catch(() => {
      return newBadRequestException('EditCourseItemAttachments');
    });
  }

  public markCourseItemAsEdited(courseItemId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      db.query(
        CourseItemsQueires.MarkCourseItemAdEdited,
        [courseItemId],
        (error: Error, editingInfo: ISqlSuccessResponse) => {
          if (error) {
            return reject(newBadRequestException(CourseItemsQueryList.MarkCourseItemAdEdited));
          }

          resolve(editingInfo);
        },
      );
    });
  }

  public getCourseItemAttachments(courseItemId: number): Promise<ICourseItemAttachment[]> {
    return new Promise((resolve, reject) => {
      db.query(
        CourseItemsQueires.GetCourseItemAttachments,
        [courseItemId],
        (error: Error, attachmentList: ICourseItemAttachment[]) => {
          if (error) {
            return reject(newBadRequestException(CourseItemsQueryList.GetCourseItemAttachments));
          }

          resolve(attachmentList);
        },
      );
    });
  }

  public getCourseItemById(courseItemId: number): Promise<ICourseItem> {
    return new Promise(async (resolve, reject) => {
      try {
        const courseItemData: ICourseItemData = await this.getCourseItemDataById(courseItemId);
        const courseItem: ICourseItem = await this.getCourseItemFromCourseItemData(courseItemData);

        resolve(courseItem);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async removeCourseItem(courseItemId: number): Promise<ISqlSuccessResponse> {
    const courseItem = await this.getCourseItemById(courseItemId);

    if (courseItem.attachments.length !== 0) {
      await this.removeAttachmentsFiles(courseItem.attachments);
    }

    return new Promise((resolve, reject) => {
      db.query(
        CourseItemsQueires.RemoveCourseItem,
        [courseItemId],
        (error: Error, removingCourseItemInfo: ISqlSuccessResponse) => {
          if (error) {
            return reject(newBadRequestException(CourseItemsQueryList.RemoveCourseItem));
          }

          resolve(removingCourseItemInfo);
        },
      );
    });
  }

  public async modifyCourseItem(modifyCourseItemData: IModifyCourseItemData, courseItemId: number): Promise<any> { // TODO: Type
    const courseItemData: ICourseItemData = await this.getCourseItemDataById(courseItemId);
    const params: NumberOrString[] = this.getCourseItemModifyParams({ ...courseItemData, ...modifyCourseItemData });

    return new Promise((resolve, reject) => {
      db.query(
        CourseItemsQueires.ModifyCourseItem,
        params,
        (error: Error, modifyingInfo: any) => {
          if (error) {
            return reject(newBadRequestException(CourseItemsQueryList.ModifyCourseItem));
          }

          resolve(modifyingInfo);
        },
      );
    });
  }

  public async getCourseItemFromCourseItemData(courseItemData: ICourseItemData): Promise<ICourseItem> {
    const { creatorId, ...otherCourseItemData } = courseItemData;

    const user: IUser = await this.usersService.getUserById(creatorId) as IUser;
    const attachments: ICourseItemAttachment[] = await this.getCourseItemAttachments(courseItemData.courseItemId);

    return { ...otherCourseItemData, attachments, creator: user };
  }

  private getCourseItemCreationParams(
    createCourseItemData: ICreateCourseItemData,
    userPayload: IUserLikePayload,
  ): NumberOrString[] {
    const params: NumberOrString[] = [];

    params.push(createCourseItemData.courseId);
    params.push(createCourseItemData.courseItemTypeId);
    params.push(userPayload.userId);
    params.push(createCourseItemData.courseItemTitle);
    params.push(createCourseItemData.courseItemTextContent);

    return params;
  }

  private getCourseItemDataById(courseItemId: number): Promise<ICourseItemData> {
    return new Promise((resolve, reject) => {
      db.query(
        CourseItemsQueires.GetCourseItemDataById,
        [courseItemId],
        (error: Error, courseItemsData: ICourseItemData[]) => {
          if (error) {
            return reject(newBadRequestException(CourseItemsQueryList.GetCourseItemDataById));
          }

          if (!courseItemsData[0]) {
            return reject(newNotFoundException(CourseItemsQueryList.GetCourseItemDataById));
          }

          resolve(courseItemsData[0]);
        },
      );
    });
  }

  private getCourseItemModifyParams(modifiedCourseItemData: ICourseItemData): NumberOrString[] {
    const params: NumberOrString[] = [];

    params.push(modifiedCourseItemData.courseItemTitle);
    params.push(modifiedCourseItemData.courseItemTextContent);
    params.push(modifiedCourseItemData.courseItemId);

    return params;
  }

  public removeAttachmentsFiles(attachments: ICourseItemAttachment[]): Promise<void> {
    return new Promise((resolve, reject) => {
      let filesLeft = attachments.length;

      for (const file of attachments) {
        const filePath = path.join(__dirname, '../', '../', 'attachments', file.name);

        fs.unlink(filePath, (error: Error) => {
          if (error) {
            return reject(newBadRequestException(`RemoveAttachmentsFiles:${file.name}`));
          }

          filesLeft--;

          if (filesLeft === 0) {
            resolve();
          }
        });
      }
    });
  }
}
