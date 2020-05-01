import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { ChatsService } from '../chats/chats.service';
import { CourseItemsService } from '../course-items/course-items.service';

import { Database } from './../database';
import { CoursesQueryList, Queries } from './courses.queries';

import {
    ICourseCreationData,
    ICourseData,
    IFullCourseData,
    ICourseItemData,
    ICourseItem,
    IJoinedCourseData,
    IUserDeletedFromCourse,
    ICreatedCourseData,
} from '../models/courses.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { IUserLikePayload } from '../models/auth.models';
import { Roles, IFullCourseUserData, ICourseUser } from '../models/users.models';
import { NumberOrString } from '../models/database.models';
import { newBadRequestException, getCourseUserFromUserData } from '../helpers';

const db = Database.getInstance();

@Injectable()
export class CoursesService {
    constructor(
        private chatsService: ChatsService,
        private courseItemsService: CourseItemsService,
    ) {}

    public getUserCourseList(userId: number): Promise<ICourseData[]> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetUserCourses,
                [userId],
                (error: Error, courses: ICourseData[]) => {
                    if (error) {
                        return reject(newBadRequestException(CoursesQueryList.GetUserCourses));
                    }

                    resolve(courses);
                },
            );
        });
    }

    public getAllCourses(): Promise<ICourseData[]> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetAllCourses,
                [],
                (error: Error, courses: ICourseData[]) => {
                    if (error) {
                        return reject(newBadRequestException(CoursesQueryList.GetAllCourses));
                    }

                    resolve(courses);
                },
            );
        });
    }

    public async getFullCourseData(courseId: number): Promise<IFullCourseData> {
        const courseWithoutContent: ICourseData = await this.getCourseById(courseId);
        const courseItems: ICourseItem[] = await this.getCourseItems(courseId);
        const courseUsers: ICourseUser[] = await this.getCourseUsers(courseId);

        return {
            ...courseWithoutContent,
            courseItems,
            courseUsers,
        };
    }

    public async createCourse(courseDto: ICourseCreationData, userPayload: IUserLikePayload): Promise<ICreatedCourseData> {
        const chatName: string = `Чат курса '${courseDto.courseName}'`;

        try {
            const tempCourse: ICourseData = await this.getCourseByCode(courseDto.courseCode);

            if (!!tempCourse) {
                throw new ForbiddenException('This course code is unavailable');
            }
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
        }

        return Promise.all([
            this.chatsService.createChat(chatName, userPayload),
            this.generateCourseData(),
        ])
        .then(([chatCreationInfo, generatedCourseDataInfo]: [ISqlSuccessResponse, ISqlSuccessResponse]) => {
            const params: NumberOrString[] = this.getCourseCreationParams(
                courseDto,
                chatCreationInfo,
                generatedCourseDataInfo,
                userPayload,
            );

            return new Promise((resolve, reject) => {
                db.query(
                    Queries.CreateCourse,
                    params,
                    (error: Error, courseCreationInfo: ISqlSuccessResponse) => {
                        if (error) {
                            reject(newBadRequestException(CoursesQueryList.CreateCourse));
                        }

                        resolve(courseCreationInfo);
                    },
                );
            });
        })
        .then(async (courseCreationInfo: ISqlSuccessResponse) => {
            await this.createUserCourseConnection(courseCreationInfo.insertId, userPayload);

            return {
                createdCourseId: courseCreationInfo.insertId,
            };
        });
    }

    public async removeCourse(courseId: number, userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
        const course: ICourseData = await this.getCourseById(courseId);

        if (!course) {
            throw new NotFoundException(`[${CoursesQueryList.RemoveCourse}] Course does not exist`);
        }

        if (userPayload.roleId === Roles.Teacher && course.courseOwnerId !== userPayload.userId) {
            throw new ForbiddenException(`[${CoursesQueryList.RemoveCourse}] Course can be removed only by its owner`);
        }

        return new Promise((resolve, reject) => {
            db.query(
                Queries.RemoveCourse,
                [courseId],
                (error: Error, removingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        reject(newBadRequestException(CoursesQueryList.RemoveCourse));
                    }

                    resolve(removingInfo);
                },
            );
        });
    }

    public async joinCourse(courseCode: string, userPayload: IUserLikePayload): Promise<IJoinedCourseData> {
        const course: ICourseData = await this.getCourseByCode(courseCode);

        await this.chatsService.createUserChatConnection(course.chatId, userPayload);

        await this.createUserCourseConnection(course.courseId, userPayload);

        return {
            joinedCourseId: course.courseId,
        };
    }

    public async destroyConnection(courseId: number, userId: number): Promise<IUserDeletedFromCourse> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.DestroyUserCourseConnection,
                [userId, courseId],
                async (error: Error, _: ISqlSuccessResponse) => {
                    if (error) {
                        reject(newBadRequestException(CoursesQueryList.DestroyUserCourseConnection));
                    }

                    const course = await this.getCourseById(courseId);

                    await this.chatsService.destroyConnection(course.chatId, userId);

                    resolve({
                        courseId,
                        deletedUserId: userId,
                    });
                },
            );
        });
    }

    private generateCourseData(): Promise<ISqlSuccessResponse> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GenerateCourseData,
                [],
                (error: Error, generatedCourseDataInfo: ISqlSuccessResponse) => {
                    if (error) {
                        reject(newBadRequestException(CoursesQueryList.GenerateCourseData));
                    }

                    resolve(generatedCourseDataInfo);
                },
            );
        });
    }

    private getCourseCreationParams(
        courseDto: ICourseCreationData,
        chatCreationInfo: ISqlSuccessResponse,
        generatedCourseDataInfo: ISqlSuccessResponse,
        userPayload: IUserLikePayload,
    ): NumberOrString[] {
        const params: NumberOrString[] = [];

        params.push(
            generatedCourseDataInfo.insertId,
            userPayload.userId,
            chatCreationInfo.insertId,
            courseDto.courseName,
            courseDto.courseGroupName,
            courseDto.courseDescription,
            courseDto.courseCode,
        );

        return params;
    }

    private createUserCourseConnection(newCourseId: number, userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.CreateUserCourseConnection,
                [userPayload.userId, newCourseId],
                (error: Error, connectionCreationInfo: ISqlSuccessResponse) => {
                    if (error) {
                        reject(newBadRequestException(CoursesQueryList.CreateUserCourseConnection));
                    }

                    resolve(connectionCreationInfo);
                },
            );
        });
    }

    private getCourseByCode(courseCode: string): Promise<ICourseData> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetCourseByCode,
                [courseCode],
                (error: Error, courses: ICourseData[]) => {
                    if (error) {
                        reject(newBadRequestException(CoursesQueryList.GetCourseByCode));
                    }

                    if (!courses[0]) {
                        reject(new NotFoundException(`[${CoursesQueryList.GetCourseByCode}] Course with such code does not exist`));
                    }

                    resolve(courses[0]);
                },
            );
        });
    }

    private getCourseById(courseId: number): Promise<ICourseData> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetCourseById,
                [courseId],
                (error: Error, courses: ICourseData[]) => {
                    if (error) {
                        reject(newBadRequestException(CoursesQueryList.GetCourseById));
                    }

                    if (!courses[0]) {
                        reject(new NotFoundException(`[${CoursesQueryList.GetCourseById}] Course does not exist`));
                    }

                    resolve(courses[0]);
                },
            );
        });
    }

    private getCourseItems(courseId: number): Promise<ICourseItem[]> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetCourseItems,
                [courseId],
                (error: Error, courseItemsData: ICourseItemData[]) => {
                    if (error) {
                        reject(newBadRequestException(CoursesQueryList.GetCourseItems));
                    }

                    const courseItems: ICourseItem[] = [];

                    courseItemsData.forEach(async (courseItemData) => {
                        const courseItem: ICourseItem = await this.courseItemsService.getCourseItemFromCourseItemData(courseItemData);

                        courseItems.push(courseItem);
                    });

                    resolve(courseItems);
                },
            );
        });
    }

    private getCourseUsers(courseId: number): Promise<ICourseUser[]> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetCourseUsers,
                [courseId],
                (error: Error, courseUsersData: IFullCourseUserData[]) => {
                    if (error) {
                        reject(newBadRequestException(CoursesQueryList.GetCourseUsers));
                    }

                    resolve(
                        courseUsersData.map((userData: IFullCourseUserData) => getCourseUserFromUserData(userData)),
                    );
                },
            );
        });
    }
}
