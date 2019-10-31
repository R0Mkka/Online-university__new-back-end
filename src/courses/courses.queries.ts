import { DBTables } from '../constants';

export enum CoursesQueryList {
    GetAllUserCourses = 'GetAllUserCourses',
    CreateCourse = 'CreateCourse',
    RemoveCourse = 'RemoveCourse',
    GenerateCourseData = 'GenerateCourseData',
    CreateUserCourseConnection = 'CreateUserCourseConnection',
    DestroyUserCourseConnection = 'DestroyUserCourseConnection',
    GetCourseByCode = 'GetCourseByCode',
    GetCourseById = 'GetCourseById',
    GetCourseContent = 'GetCourseContent',
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
            ${DBTables.CoursesData}.courseMode
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
    RemoveCourse: `
        DELETE
        FROM ${DBTables.Courses}
        WHERE courseId = ?;
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
    DestroyUserCourseConnection: `
        DELETE
        FROM ${DBTables.UsersCourses}
        WHERE userId = ? AND courseId = ?;
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
    GetCourseById: `
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
        WHERE ${DBTables.Courses}.courseId = ?;
    `,
    GetCourseContent: `
        SELECT *
        FROM courses_items
        WHERE courseId = ?;
    `,
};
