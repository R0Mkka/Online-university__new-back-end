import { DBTables  } from '../../constants';

export const GET_TASK_SOLUTIONS = `
  SELECT
    *
  FROM
    ${DBTables.solutions}
  WHERE
    courseTaskId = ?;
`;
