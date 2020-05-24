import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';

import { Database } from '../database';
import { COURSE_TASK_QUERY_LIST, courseTaskQueries } from './course-tasks.queries';

import {
  ICourseTask,
  IFullCourseTask,
  ICourseTaskAttachment,
} from '../models/course-tasks';
import { newBadRequestException } from '../helpers';

const db = Database.getInstance();

@Injectable()
export class CourseTasksHelperService {
  constructor(
    private usersService: UsersService,
  ) {}

  public async getFullCourseTasks(courseTasks: ICourseTask[]): Promise<IFullCourseTask[]> {
    const fullCourseTasks: IFullCourseTask[] = [];

    for (const task of courseTasks) {
      const courseTaskAttachments = await this.getCourseTaskAttachments(task.id);

      fullCourseTasks.push({ ...task, attachments: courseTaskAttachments });
    }

    return fullCourseTasks;
  }

  private getCourseTaskAttachments(courseTaskId: number): Promise<ICourseTaskAttachment[]> {
    return new Promise((resolve, reject) => {
      db.query(
        courseTaskQueries.GET_COURSE_TASK_ATTACHMENTS,
        [courseTaskId],
        (error: Error, courseTaskAttachments: ICourseTaskAttachment[]) => {
          if (error) {
            return reject(newBadRequestException(COURSE_TASK_QUERY_LIST.GET_COURSE_TASK_ATTACHMENTS));
          }

          resolve(courseTaskAttachments);
        },
      );
    });
  }
}
