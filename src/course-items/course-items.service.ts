import { Injectable } from '@nestjs/common';

import { Database } from '../database';
import { CourseItemsQueryList, Queires } from './course-items.queries';

import { ICreateCourseItemData } from '../models/courses.models';
import { IUserLikePayload } from '../models/auth.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { NumberOrString } from '../models/database.models';
import { newBadRequestException } from '../helpers';

const db = Database.getInstance();

@Injectable()
export class CourseItemsService {
  public addCourseItem(
    createCourseItemData: ICreateCourseItemData,
    userPayload: IUserLikePayload,
  ): Promise<ISqlSuccessResponse> {
    return new Promise((resolve, reject) => {
      const params: NumberOrString[] = this.getCourseItemCreationParams(createCourseItemData, userPayload);

      db.query(
        Queires.AddCourseItem,
        params,
        (error: Error, courseItemCreationInfo: ISqlSuccessResponse) => {
          if (error) {
            return reject(newBadRequestException(CourseItemsQueryList.AddCourseItem));
          }

          resolve(courseItemCreationInfo);
        },
      );
    });
  }

  private getCourseItemCreationParams(
    createCourseItemData: ICreateCourseItemData,
    userPayload: IUserLikePayload,
  ): NumberOrString[] {
    const params: NumberOrString[] = [];

    params.push(createCourseItemData.courseId);
    params.push(userPayload.userId);
    params.push(createCourseItemData.courseItemTitle);
    params.push(createCourseItemData.courseItemTextContent);

    return params;
  }
}
