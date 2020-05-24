import { DBTables  } from '../../constants';

export const EVALUATE_TASK_SOLUTION = `
  UPDATE
    ${DBTables.solutions}
  SET
    solutionStatusId = 3,
    teacherComment = ?,
    grade = ?
  WHERE
    id = ?;
`;
