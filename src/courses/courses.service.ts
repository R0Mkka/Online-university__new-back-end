import { Injectable, NotFoundException } from '@nestjs/common';

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

    public async joinCourse(courseCode: string, userPayload: IUserLikePayload): Promise<ISqlSuccessResponse> {
        const course: ICourseData = await this.getCourseByCode(courseCode);

        return this.createUserCourseConnection(course.courseId, userPayload);
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
}
