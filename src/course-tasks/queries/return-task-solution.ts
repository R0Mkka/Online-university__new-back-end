import { DBTables  } from '../../constants';

export const RETURN_TASK_SOLUTION = `
  UPDATE
    ${DBTables.solutions}
  SET
    solutionStatusId = 2,
    teacherComment = ?
  WHERE
    id = ?;
`;
