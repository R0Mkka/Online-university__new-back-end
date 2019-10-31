import { DBTables } from '../constants';

export enum CoursesQueryList {
    GetAllUserCourses = 'GetAllUserCourses',
    CreateCourse = 'CreateCourse',
    GenerateCourseData = 'GenerateCourseData',
    CreateUserCourseConnection = 'CreateUserCourseConnection',
    GetCourseByCode = 'GetCourseByCode',
}

export const Queries: { [key in CoursesQueryList]: string } = {
    GetAllUserCourses: `
        SELECT
            ${DBTables.Courses}.courseId,
            ${DBTables.Courses}.courseOwnerId,
            ${DBTables.Courses}.chatId,
            ${DBTables.Courses}.courseName,
            ${DBTables.Courses}.courseGroupName,
            ${DBTables.Courses}.courseDescription,
            ${DBTables.Courses}.courseCode,
            ${DBTables.Courses}.addedAt courseCreatedAt,
            ${DBTables.CoursesPictures}.pictureName,
            ${DBTables.CoursesColorPalettes}.colorPaletteName,
            ${DBTables.CoursesData}.courseMode,
            ${DBTables.UsersCourses}.joinedAt
        FROM
            ${DBTables.UsersCourses}
        LEFT JOIN ${DBTables.Courses}
            USING(courseId)
        LEFT JOIN ${DBTables.CoursesData}
            USING(courseDataId)
        LEFT JOIN ${DBTables.CoursesPictures}
            USING(coursePictureId)
        LEFT JOIN ${DBTables.CoursesColorPalettes}
            USING(courseColorPaletteId)
        WHERE ${DBTables.UsersCourses}.userId = ?;
    `,
    CreateCourse: `
        INSERT INTO ${DBTables.Courses} (
            courseDataId,
            courseOwnerId,
            chatId,
            courseName,
            courseGroupName,
            courseDescription,
            courseCode
        ) VALUES (?,?,?,?,?,?,?);
    `,
    GenerateCourseData: `
        INSERT INTO ${DBTables.CoursesData} ()
        VALUES ();
    `,
    CreateUserCourseConnection: `
        INSERT INTO ${DBTables.UsersCourses} (
            userId,
            courseId
        ) VALUES (?,?);
    `,
    GetCourseByCode: `
        SELECT
            ${DBTables.Courses}.courseId,
            ${DBTables.Courses}.courseOwnerId,
            ${DBTables.Courses}.chatId,
            ${DBTables.Courses}.courseName,
            ${DBTables.Courses}.courseGroupName,
            ${DBTables.Courses}.courseDescription,
            ${DBTables.Courses}.courseCode,
            ${DBTables.Courses}.addedAt courseCreatedAt,
            ${DBTables.CoursesPictures}.pictureName,
            ${DBTables.CoursesColorPalettes}.colorPaletteName,
            ${DBTables.CoursesData}.courseMode
        FROM
            ${DBTables.Courses}
        LEFT JOIN ${DBTables.CoursesData}
            USING(courseDataId)
        LEFT JOIN ${DBTables.CoursesPictures}
            USING(coursePictureId)
        LEFT JOIN ${DBTables.CoursesColorPalettes}
            USING(courseColorPaletteId)
        WHERE ${DBTables.Courses}.courseCode = ?;
    `,
};
