import { Injectable, BadRequestException } from '@nestjs/common';

import { Database } from './../database';
import { Queries } from './courses.queries';

const db = Database.getInstance();

@Injectable()
export class CoursesService {
    public getUserCourseList(userId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            db.query(
                Queries.GetAllUserCourses,
                [userId],
                (error: Error, results: any) => {
                    if (error) {
                        reject(new BadRequestException('[GetAllUserCourses] Request error!'));
                    }

                    resolve(results);
                },
            );
        });
    }
}
