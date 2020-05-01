import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';

import { Database } from '../database';
import { CourseItemsQueryList, CourseItemsQueires } from './course-items.queries';

import { ICreateCourseItemData, IModifyCourseItemData, ICourseItem, ICourseItemData, ICreatedCourseItemData } from '../models/courses.models';
import { IUserLikePayload } from '../models/auth.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { NumberOrString } from '../models/database.models';
import { IUser } from '../models/users.models';
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

  public removeCourseItem(courseItemId: number): Promise<ISqlSuccessResponse> {
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
    const courseItemData: ICourseItemData = await this.getCourseItemById(courseItemId);
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

    return { ...otherCourseItemData, creator: user };
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

  private getCourseItemById(courseItemId: number): Promise<ICourseItemData> {
    return new Promise((resolve, reject) => {
      db.query(
        CourseItemsQueires.GetCourseItemById,
        [courseItemId],
        (error: Error, courseItemsData: ICourseItemData[]) => {
          if (error) {
            return reject(newBadRequestException(CourseItemsQueryList.GetCourseItemById));
          }

          if (!courseItemsData[0]) {
            return reject(newNotFoundException(CourseItemsQueryList.GetCourseItemById));
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
}
