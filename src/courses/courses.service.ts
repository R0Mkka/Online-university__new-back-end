import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';

import { ChatsService } from '../chats/chats.service';

import { Database } from './../database';
import { CoursesQueryList, Queries } from './courses.queries';

import { ICourseCreationData, ICourseData, IShortCourseData } from '../models/courses.models';
import { ISqlSuccessResponse } from '../models/common.models';
import { IUserLikePayload } from '../models/auth.models';
import { newBadRequestException } from '../helpers';

const db = Database.getInstance();

@Injectable()
export class CoursesService {
    constructor(
        private readonly chatsService: ChatsService,
    ) {}

    public getUserCourseList(userId: number): Promise<IShortCourseData[]> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetAllUserCourses,
                [userId],
                (error: Error, courses: IShortCourseData[]) => {
                    if (error) {
                        reject(newBadRequestException(CoursesQueryList.GetAllUserCourses));
                    }

                    resolve(courses);
                },
            );
        });
    }

    public async getFullCourseData(courseId: number): Promise<any> {
        const courseWithoutContent: ICourseData = await this.getCourseById(courseId);
        const courseItems: any[] = await this.getCourseContent(courseId);

        return {
            ...courseWithoutContent,
            courseItems,
        };
    }

    public createCourse(courseDto: ICourseCreationData, userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
        const chatName: string = `Чат курса '${courseDto.courseName}'`;

        return Promise.all([
            this.chatsService.createChat(chatName, userPayload),
            this.generateCourseData(),
        ])
        .then(([chatCreationInfo, generatedCourseDataInfo]: [ISqlSuccessResponse, ISqlSuccessResponse]) => {
            return new Promise((resolve, reject) => {
                db.query(
                    Queries.CreateCourse,
                    [
                        generatedCourseDataInfo.insertId,
                        userPayload.userId,
                        chatCreationInfo.insertId,
                        ...Object.values(courseDto),
                    ],
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

    public async removeCourse(courseId: number, userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
        const course: ICourseData = await this.getCourseById(courseId);

        if (!course) {
            throw new NotFoundException(`[${CoursesQueryList.RemoveCourse}] Course does not exist`);
        }

        if (course.courseOwnerId !== userPayload.userId) {
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

    public async joinCourse(courseCode: string, userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
        const course: ICourseData = await this.getCourseByCode(courseCode);

        return this.createUserCourseConnection(course.courseId, userPayload);
    }

    public async destroyConnection(courseId: number, userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.DestroyUserCourseConnection,
                [userPayload.userId, courseId],
                (error: Error, destroyingInfo: ISqlSuccessResponse) => {
                    if (error) {
                        reject(newBadRequestException(CoursesQueryList.DestroyUserCourseConnection));
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

    private getCourseByCode(courseCode: string): Promise<IShortCourseData> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetCourseByCode,
                [courseCode],
                (error: Error, courses: IShortCourseData[]) => {
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

    private getCourseContent(courseId: number): Promise<any[]> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetCourseContent,
                [courseId],
                (error: Error, courseItems: any[]) => {
                    if (error) {
                        reject(newBadRequestException(CoursesQueryList.GetCourseContent));
                    }

                    resolve(courseItems);
                },
            );
        });
    }
}
