import { DBTables  } from '../../constants';

export const GET_COURSE_TASKS = `
  SELECT
    *
  FROM
    ${DBTables.course_tasks}
  WHERE
    courseId = ?;
`;
