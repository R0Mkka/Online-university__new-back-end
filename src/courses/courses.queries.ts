import { DBTables } from '../constants';

export enum CoursesQueryList {
    GetUserCourses = 'GetUserCourses',
    GetAllCourses = 'GetAllCourses',
    GetCourseBlockedUsersData = 'GetCourseBlockedUsersData',
    GetCourseBlockedUsers = 'GetCourseBlockedUsers',
    CreateCourse = 'CreateCourse',
    BlockCourseForUser = 'BlockCourseForUser',
    UnblockCourseForUser = 'UnblockCourseForUser',
    ModifyCourse = 'ModifyCourse',
    RemoveCourse = 'RemoveCourse',
    GenerateCourseData = 'GenerateCourseData',
    CreateUserCourseConnection = 'CreateUserCourseConnection',
    DestroyUserCourseConnection = 'DestroyUserCourseConnection',
    GetCourseByCode = 'GetCourseByCode',
    GetCourseById = 'GetCourseById',
    GetCourseItems = 'GetCourseItems',
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

    GetCourseBlockedUsersData: `
        SELECT
            *
        FROM
            ${DBTables.CoursesBlockedUsers}
        WHERE
            courseId = ?;
    `,

    GetCourseBlockedUsers: `
        SELECT
            *
        FROM
            ${DBTables.Users}
        LEFT JOIN
            ${DBTables.CoursesBlockedUsers}
        USING(userId)
        WHERE
            courseId = ?;
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

    BlockCourseForUser: `
        INSERT INTO ${DBTables.CoursesBlockedUsers} (
            courseId,
            userId
        )
        VALUES (?,?);
    `,

    UnblockCourseForUser: `
        DELETE
        FROM
            ${DBTables.CoursesBlockedUsers}
        WHERE
            courseId = ? AND userId = ?;
    `,

    ModifyCourse: `
        UPDATE
            ${DBTables.Courses}
        SET
            courseName = ?,
            courseGroupName = ?,
            courseDescription = ?,
            courseCode = ?
        WHERE
            courseId = ? AND courseOwnerId = ?;
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
        FROM
            ${DBTables.UsersCourses}
        WHERE
            userId = ? AND courseId = ?;
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

    GetCourseItems: `
        SELECT
            *
        FROM
            ${DBTables.CoursesItems}
        WHERE
            courseId = ?;
    `,
    
    // TODO: Think about which fields really need here, temporary remove
    // ${DBTables.Users}.login,
    // ${DBTables.Users}.educationalInstitution,
    // ${DBTables.Users}.password,
    // ${DBTables.Themes}.themeName,
    // ${DBTables.Languages}.languageName
    // ${DBTables.AccountImages}.path avatarPath,
    // ${DBTables.AccountImages}.originalName avatarOriginalName,
    // ${DBTables.AccountImages}.size avatarSize,
    // ${DBTables.AccountImages}.addedAt avatarAddedAt,
    GetCourseUsers: `
        SELECT
            ${DBTables.Users}.userId,
            ${DBTables.Users}.roleId,
            ${DBTables.Users}.firstName,
            ${DBTables.Users}.lastName,
            ${DBTables.Users}.email,
            ${DBTables.Users}.registeredAt,
            ${DBTables.UsersEntries}.userStatusId statusId,
            ${DBTables.AccountImages}.accountImageId avatarId,
            ${DBTables.AccountImages}.name avatarName,
            ${DBTables.AccountImages}.mimeType avatarMimeType
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
        WHERE courseId = ?;
    `,
};
