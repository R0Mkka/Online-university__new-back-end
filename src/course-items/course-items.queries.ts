import { DBTables } from '../constants';

export enum CourseItemsQueryList {
  CreateCourseItem = 'CreateCourseItem',
  RemoveCourseItem = 'RemoveCourseItem',
  ModifyCourseItem = 'ModifyCourseItem',
  GetCourseItemDataById = 'GetCourseItemDataById',
  AddCourseItemAttachments = 'AddCourseItemAttachments',
  GetCourseItemAttachments = 'GetCourseItemAttachments',
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

  AddCourseItemAttachments: `
      INSERT INTO ${DBTables.CoursesItemsAttachments} (
        courseItemId,
        path,
        name,
        originalName,
        mimeType,
        size
      )
      VALUES ?;
  `,

  GetCourseItemAttachments: `
      SELECT
        *
      FROM
        ${DBTables.CoursesItemsAttachments}
      WHERE
        courseItemId = ?;
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

  GetCourseItemDataById: `
    SELECT
      *
    FROM
      ${DBTables.CoursesItems}
    WHERE courseItemId = ?;
  `,
};
