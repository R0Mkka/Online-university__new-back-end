import { DBTables  } from '../../constants';

export const GET_COURSE_TASK_BY_ID = `
  SELECT
    *
  FROM
    ${DBTables.course_tasks}
  WHERE
    id = ?;
`;
