import { DBTables } from '../constants';

export enum CourseItemsQueryList {
  AddCourseItem = 'AddCourseItem',
}

export const Queires: { [key in CourseItemsQueryList]: string } = {
  AddCourseItem: `
    INSERT INTO ${DBTables.CoursesItems} (
      courseId,
      creatorId,
      courseItemTitle,
      courseItemtextContent
    ) VALUES (?,?,?,?);
  `,
};
