import { DBTables } from '../constants';

export enum CourseItemsQueryList {
  CreateCourseItem = 'CreateCourseItem',
  RemoveCourseItem = 'RemoveCourseItem',
  ModifyCourseItem = 'ModifyCourseItem',
  GetCourseItemById = 'GetCourseItemById',
}

export const CourseItemsQueires: { [key in CourseItemsQueryList]: string } = {
  CreateCourseItem: `
    INSERT INTO ${DBTables.CoursesItems} (
      courseId,
      courseItemTypeId,
      creatorId,
      courseItemTitle,
      courseItemtextContent
    ) VALUES (?,?,?,?,?);
  `,

  RemoveCourseItem: `
    DELETE
    FROM
      ${DBTables.CoursesItems}
    WHERE
      courseItemId = ?;
  `,

  ModifyCourseItem: `
    UPDATE
      ${DBTables.CoursesItems}
    SET
      courseItemTitle = ?,
      courseItemtextContent = ?
    WHERE
      courseItemId = ?;
  `,

  GetCourseItemById: `
    SELECT
      *
    FROM
      ${DBTables.CoursesItems}
    WHERE courseItemId = ?;
  `,
};
