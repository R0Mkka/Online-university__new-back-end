import { DBTables } from '../constants';

export enum CoursesQueryList {
    GetUserCourses = 'GetUserCourses',
    GetAllCourses = 'GetAllCourses',
    CreateCourse = 'CreateCourse',
    RemoveCourse = 'RemoveCourse',
    GenerateCourseData = 'GenerateCourseData',
    CreateUserCourseConnection = 'CreateUserCourseConnection',
    DestroyUserCourseConnection = 'DestroyUserCourseConnection',
    GetCourseByCode = 'GetCourseByCode',
    GetCourseById = 'GetCourseById',
    GetCourseContent = 'GetCourseContent',
    GetCourseUsers = 'GetCourseUsers',
}

export const Queries: { [key in CoursesQueryList]: string } = {
    GetUserCourses: `
        SELECT
            ${DBTables.Courses}.courseId,
            ${DBTables.Courses}.courseOwnerId,
            CONCAT(${DBTables.Users}.firstName, ' ', ${DBTables.Users}.lastName) courseOwnerFullName,
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
        LEFT JOIN ${DBTables.Users}
            ON ${DBTables.Courses}.courseOwnerId = ${DBTables.Users}.userId
        LEFT JOIN ${DBTables.CoursesData}
            USING(courseDataId)
        LEFT JOIN ${DBTables.CoursesPictures}
            USING(coursePictureId)
        LEFT JOIN ${DBTables.CoursesColorPalettes}
            USING(courseColorPaletteId)
        WHERE ${DBTables.UsersCourses}.userId = ?;
    `,
    GetAllCourses: `
        SELECT
            ${DBTables.Courses}.courseId,
            ${DBTables.Courses}.courseOwnerId,
            CONCAT(${DBTables.Users}.firstName, ' ', ${DBTables.Users}.lastName) courseOwnerFullName,
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
        LEFT JOIN ${DBTables.Users}
            ON ${DBTables.Courses}.courseOwnerId = ${DBTables.Users}.userId
        LEFT JOIN ${DBTables.CoursesData}
            USING(courseDataId)
        LEFT JOIN ${DBTables.CoursesPictures}
            USING(coursePictureId)
        LEFT JOIN ${DBTables.CoursesColorPalettes}
            USING(courseColorPaletteId)
        GROUP BY ${DBTables.Courses}.courseId;
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
            CONCAT(${DBTables.Users}.firstName, ' ', ${DBTables.Users}.lastName) courseOwnerFullName,
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
        LEFT JOIN ${DBTables.Users}
            ON ${DBTables.Courses}.courseOwnerId = ${DBTables.Users}.userId
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
            CONCAT(${DBTables.Users}.firstName, ' ', ${DBTables.Users}.lastName) courseOwnerFullName,
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
        LEFT JOIN ${DBTables.Users}
            ON ${DBTables.Courses}.courseOwnerId = ${DBTables.Users}.userId
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
    GetCourseUsers: `
        SELECT
            ${DBTables.Users}.userId,
            ${DBTables.Users}.roleId,
            ${DBTables.Users}.login,
            ${DBTables.Users}.firstName,
            ${DBTables.Users}.lastName,
            ${DBTables.Users}.educationalInstitution,
            ${DBTables.Users}.email,
            ${DBTables.Users}.password,
            ${DBTables.Users}.registeredAt,
            ${DBTables.UsersEntries}.userStatusId statusId,
            ${DBTables.AccountImages}.accountImageId avatarId,
            ${DBTables.AccountImages}.path avatarPath,
            ${DBTables.AccountImages}.name avatarName,
            ${DBTables.AccountImages}.originalName avatarOriginalName,
            ${DBTables.AccountImages}.mimeType avatarMimeType,
            ${DBTables.AccountImages}.size avatarSize,
            ${DBTables.AccountImages}.addedAt avatarAddedAt,
            ${DBTables.Themes}.themeName,
            ${DBTables.Languages}.languageName
        FROM
            ${DBTables.UsersCourses}
        LEFT JOIN ${DBTables.Users}
            USING (userId)
        LEFT JOIN (
            SELECT *
            FROM ${DBTables.UsersEntries}
            ORDER BY enteredAt DESC
            LIMIT 1
        ) ${DBTables.UsersEntries}
            USING(userId)
        LEFT JOIN ${DBTables.AccountImages}
            USING(accountImageId)
        LEFT JOIN ${DBTables.Themes}
            USING(themeId)
        LEFT JOIN ${DBTables.Languages}
            USING(languageId)
        WHERE courseId = ?;
    `,
};
