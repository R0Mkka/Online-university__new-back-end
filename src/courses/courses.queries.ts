export enum CoursesQueryList {
    GetAllUserCourses = 'GetAllUserCourses',
}

export const Queries: { [key in CoursesQueryList]: string } = {
    GetAllUserCourses: `
        SELECT
            *
        FROM
            courses;
    `,
};
