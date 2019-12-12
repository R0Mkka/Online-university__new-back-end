import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { ChatsService } from '../chats/chats.service';
import { CourseItemsService } from '../course-items/course-items.service';

import { Database } from './../database';
import { CoursesQueryList, Queries } from './courses.queries';

import { ICourseCreationData, ICourseData, IFullCourseData, ICourseItemData, ICourseItem, IJoinedCourseData, IModifyCourseData } from '../models/courses.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { IUserLikePayload } from '../models/auth.models';
import { IUser, IFullUserData, Roles } from '../models/users.models';
import { NumberOrString } from '../models/database.models';
import { newBadRequestException, getUserFromUserData } from '../helpers';

const db = Database.getInstance();

@Injectable()
export class CoursesService {
    constructor(
        private readonly chatsService: ChatsService,
        private readonly courseItemsService: CourseItemsService,
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

    public getAllCoursesFullData(): Promise<any> {
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
        })
        .then(async (courses: ICourseData[]) => { // TODO: Change select way
            const newCourses: any[] = [];

            for (const course of courses) {
                newCourses.push({
                    ...course,
                    users: await this.getCourseUsers(course.courseId),
                    courseItems: await this.getCourseContent(course.courseId),
                });
            }

            return newCourses;
        });
    }

    public async getFullCourseData(courseId: number): Promise<IFullCourseData> {
        const courseWithoutContent: ICourseData = await this.getCourseById(courseId);
        const courseItems: ICourseItem[] = await this.getCourseContent(courseId);
        const users: IUser[] = await this.getCourseUsers(courseId);

        return {
            ...courseWithoutContent,
            courseItems,
            users,
        };
    }

    public async createCourse(courseDto: ICourseCreationData, userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
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
        .then((courseCreationInfo: ISqlSuccessResponse) => {
            return this.createUserCourseConnection(courseCreationInfo.insertId, userPayload);
        });
    }

    public async modifyCourse(modifyCourseData: IModifyCourseData, courseId: number): Promise<ISqlSuccessResponse> {
        const courseData: ICourseData = await this.getCourseById(courseId);

        return new Promise((resolve, reject) => {
            db.query(
                Queries.ModifyCourse,
                this.getCourseModifyParams({ ...courseData, ...modifyCourseData }),
                (error: Error, modifyingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(CoursesQueryList.ModifyCourse));
                    }

                    resolve(modifyingInfo);
                },
            );
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

    public async destroyConnection(courseId: number, userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
        const course: ICourseData = await this.getCourseById(courseId);

        await this.destroyUserChatConnection(course, userPayload);

        return new Promise((resolve, reject) => {
            db.query(
                Queries.DestroyUserCourseConnection,
                [userPayload.userId, courseId],
                (error: Error, destroyingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(CoursesQueryList.DestroyUserCourseConnection));
                    }

                    resolve(destroyingInfo);
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

        params.push(generatedCourseDataInfo.insertId);
        params.push(userPayload.userId);
        params.push(chatCreationInfo.insertId);
        params.push(courseDto.courseName);
        params.push(courseDto.courseGroupName);
        params.push(courseDto.courseDescription);
        params.push(courseDto.courseCode);

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

    private getCourseContent(courseId: number): Promise<ICourseItem[]> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetCourseContent,
                [courseId],
                (error: Error, courseItemsData: ICourseItemData[]) => {
                    if (error) {
                        reject(newBadRequestException(CoursesQueryList.GetCourseContent));
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

    private getCourseUsers(courseId: number): Promise<IUser[]> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetCourseUsers,
                [courseId],
                (error: Error, courseUsersData: IFullUserData[]) => {
                    if (error) {
                        reject(newBadRequestException(CoursesQueryList.GetCourseUsers));
                    }

                    resolve(
                        courseUsersData.map((userData: IFullUserData) => getUserFromUserData(userData)),
                    );
                },
            );
        });
    }

    private destroyUserChatConnection(course: ICourseData, userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.DestroyUserChatConnection,
                [userPayload.userId, course.chatId],
                (error: Error, destroyingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        return reject(newBadRequestException(CoursesQueryList.DestroyUserChatConnection));
                    }

                    resolve(destroyingInfo);
                },
            );
        });
    }

    private getCourseModifyParams(modifyCourseData: ICourseData): NumberOrString[] {
        const params: NumberOrString[] = [];

        params.push(
            modifyCourseData.courseName,
            modifyCourseData.courseGroupName,
            modifyCourseData.courseDescription,
            modifyCourseData.courseCode,
            modifyCourseData.courseId,
        );

        return params;
    }
}
