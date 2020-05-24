import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import * as mime from 'mime';

import { CourseTasksHelperService } from './course-tasks-helper.service';

import { Database } from '../database';
import { COURSE_TASK_QUERY_LIST, courseTaskQueries } from './course-tasks.queries';

import { IFullCourseTask, ICourseTask, ICreatedCourseTask, ICourseTaskAttachment, IEditedCourseTask } from '../models/course-tasks';
import {  } from '../models/solutions';

import { newBadRequestException, newNotFoundException } from '../helpers';
import { ISqlSuccessResponse } from 'src/models/common.models';
import { IFile } from 'src/models/upload.models';

const db = Database.getInstance();

@Injectable()
export class CourseTasksService {
  constructor(
    private courseTasksHelperService: CourseTasksHelperService,
  ) {}

  public getCoruseTasks(courseId: number): Promise<ICourseTask[]> {
    return new Promise((resolve, reject) => {
      db.query(
        courseTaskQueries.GET_COURSE_TASKS,
        [courseId],
        async (error: Error, courseTasks: ICourseTask[]) => {
          if (error) {
            return reject(newBadRequestException(COURSE_TASK_QUERY_LIST.GET_COURSE_TASKS));
          }

          resolve(courseTasks);
        },
      );
    });
  }

  public getCourseTaskById(courseTaskId: number): Promise<IFullCourseTask> {
    return new Promise(async (resolve, reject) => {
      try {
        const coruseTaskData: ICourseTask = await this.getCourseTaskDataById(courseTaskId);
        const attachments: ICourseTaskAttachment[] = await this.getCourseTaskAttachments(coruseTaskData.id);

        resolve({
          ...coruseTaskData,
          attachments,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  public async getFullCourseTasks(courseId: number): Promise<IFullCourseTask[]> {
    const courseTasks: ICourseTask[] = await this.getCoruseTasks(courseId);
    const fullCourseTasks = await this.courseTasksHelperService.getFullCourseTasks(courseTasks);

    return fullCourseTasks;
  }

  public createCourseTask(
    createCourseTaskData: any,
    userId: number,
  ): Promise<ICreatedCourseTask> {
    return new Promise((resolve, reject) => {
      const deadline = !!createCourseTaskData.deadline ? new Date(createCourseTaskData.deadline) : null;

      db.query(
        courseTaskQueries.CREATE_COURSE_TASK,
        [
          createCourseTaskData.courseId,
          userId,
          createCourseTaskData.title,
          createCourseTaskData.description,
          deadline,
        ],
        (error: Error, courseTaskCreationInfo: ISqlSuccessResponse) => {
          if (error) {
            return reject(newBadRequestException(COURSE_TASK_QUERY_LIST.CREATE_COURSE_TASK));
          }

          resolve({
            createdCourseTaskId: courseTaskCreationInfo.insertId,
          });
        },
      );
    });
  }

  public addCourseTaskAttachmentsToDB(attachments: IFile[], courseTaskId: number): Promise<any> {
    const params = [] as any;

    for (const attachment of attachments) {
      params.push([
        courseTaskId,
        attachment.path,
        attachment.filename,
        attachment.originalname,
        attachment.mimetype,
        attachment.size,
      ]);
    }

    return new Promise((resolve, reject) => {
      db.query(
        courseTaskQueries.ADD_COURSE_TASK_ATTACHMENTS,
        [params],
        (error: Error, _: ISqlSuccessResponse) => {
          if (error) {
            return reject(newBadRequestException(COURSE_TASK_QUERY_LIST.ADD_COURSE_TASK_ATTACHMENTS));
          }

          resolve({
            courseTaskId,
            addedFiles: attachments.map((file: IFile) => file.filename),
          });
        },
      );
    });
  }

  public getCourseTaskAttachments(courseTaskId: number): Promise<ICourseTaskAttachment[]> {
    return new Promise((resolve, reject) => {
      db.query(
        courseTaskQueries.GET_COURSE_TASK_ATTACHMENTS,
        [courseTaskId],
        (error: Error, attachmentList: ICourseTaskAttachment[]) => {
          if (error) {
            return reject(newBadRequestException(COURSE_TASK_QUERY_LIST.GET_COURSE_TASK_ATTACHMENTS));
          }

          resolve(attachmentList);
        },
      );
    });
  }

  public editCourseTask(
    editCourseTaskData: any,
    courseTaskId: number,
  ): Promise<IEditedCourseTask> {
    return new Promise((resolve, reject) => {
      const { courseTaskStatusId, title, description, deadline } = editCourseTaskData;

      db.query(
        courseTaskQueries.EDIT_COURSE_TASK,
        [
          courseTaskStatusId,
          title,
          description,
          deadline,
        ],
        async (error: Error, _: ISqlSuccessResponse) => {
          if (error) {
            return reject(newBadRequestException(COURSE_TASK_QUERY_LIST.EDIT_COURSE_TASK));
          }

          resolve({
            editedCourseTaskId: courseTaskId,
          });
        },
      );
    });
  }

  public async editCourseTaskAttachments(newAttachments: IFile[], courseTaskId: number): Promise<any> {
    const courseTask = await this.getCourseTaskById(courseTaskId);
    const addedFiles: IFile[] = [];
    const deletedFiles: ICourseTaskAttachment[] = [];

    for (const newAttachment of newAttachments) {
      const contains = courseTask.attachments.some((existingAttachment) => {
        return newAttachment.size === existingAttachment.size;
      });

      if (!contains) {
        addedFiles.push(newAttachment);
      }
    }

    for (const existingAttachment of courseTask.attachments) {
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
            return reject(newBadRequestException('CourseTaskAddedFilesCreation'));
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
    .then(async ([added, deleted]: [ IFile[], ICourseTaskAttachment[] ]) => {
      if (added.length !== 0) {
        try {
          await this.addCourseTaskAttachmentsToDB(added, courseTaskId);
        } catch (err) {
          throw new Error(err);
        }
      }

      if (deleted.length !== 0) {
        try {
          await this.deleteCourseTaskAttachmentsFromDB(deleted, courseTaskId);
        } catch (err) {
          throw new Error(err);
        }
      }

      await this.editCourseTask(courseTask, courseTask.id);

      return {
        added: added.map((file) => file.originalname),
        deleted: deleted.map((file) => file.originalName),
      };
    })
    .catch(() => {
      return newBadRequestException('EditCourseTaskAttachments');
    });
  }

  public deleteCourseTaskAttachmentsFromDB(attachments: ICourseTaskAttachment[], courseTaskId: number): Promise<any> {
    const params = attachments.map(({ id }: ICourseTaskAttachment) => {
      return [id, courseTaskId];
    });

    return new Promise((resolve, reject) => {
      db.query(
        courseTaskQueries.DELETE_COURSE_TASK_ATTACHMENTS,
        [params as any],
        (error: Error, deleteingInfo: ISqlSuccessResponse) => {
          if (error) {
            return reject(newBadRequestException(COURSE_TASK_QUERY_LIST.DELETE_COURSE_TASK_ATTACHMENTS));
          }

          resolve(deleteingInfo);
        },
      );
    });
  }

  private getCourseTaskDataById(courseTaskId: number): Promise<ICourseTask> {
    return new Promise((resolve, reject) => {
      db.query(
        courseTaskQueries.GET_COURSE_TASK_BY_ID,
        [courseTaskId],
        (error: Error, courseTasksData: ICourseTask[]) => {
          if (error) {
            return reject(newBadRequestException(courseTaskQueries.GET_COURSE_TASK_BY_ID));
          }

          if (!courseTasksData[0]) {
            return reject(newNotFoundException(courseTaskQueries.GET_COURSE_TASK_BY_ID));
          }

          resolve(courseTasksData[0]);
        },
      );
    });
  }
}
