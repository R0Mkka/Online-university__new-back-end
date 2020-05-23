import { DBTables } from '../constants';

export enum COURSE_TASK_QUERY_LIST {
  GET_COURSE_TASKS = 'GET_COURSE_TASKS',
}

export const courseTaskQueries: { [key in COURSE_TASK_QUERY_LIST]: string } = {
  GET_COURSE_TASKS: `
    SELECT
      *
    FROM
      ${DBTables.course_tasks}
    WHERE
      courseId = ?;
  `,
};
