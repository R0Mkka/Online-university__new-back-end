import { DBTables } from '../constants';

export enum CourseItemsQueryList {
  CreateCourseItem = 'CreateCourseItem',
  EditCourseItem = 'EditCourseItem',
  RemoveCourseItem = 'RemoveCourseItem',
  ModifyCourseItem = 'ModifyCourseItem',
  GetCourseItemDataById = 'GetCourseItemDataById',
  AddCourseItemAttachments = 'AddCourseItemAttachments',
  DeleteCourseItemAttachments = 'DeleteCourseItemAttachments',
  MarkCourseItemAdEdited = 'MarkCourseItemAdEdited',
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

  EditCourseItem: `
    UPDATE
      ${DBTables.CoursesItems}
      SET courseItemTypeId = ?,
          courseItemTitle = ?,
          courseItemtextContent = ?
      WHERE
        courseItemId = ?;
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

  DeleteCourseItemAttachments: `
      DELETE
      FROM
        ${DBTables.CoursesItemsAttachments}
      WHERE
        (courseItemAttachmentId, courseItemId) IN (?);
  `,

  MarkCourseItemAdEdited: `
      UPDATE
        ${DBTables.CoursesItems}
      SET
        isEdited = TRUE
      WHERE
        courseItemId = ?;
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
