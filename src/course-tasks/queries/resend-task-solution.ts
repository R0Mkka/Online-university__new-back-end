import { DBTables  } from '../../constants';

export const RESEND_TASK_SOLUTION = `
  UPDATE
    ${DBTables.solutions}
  SET
    solutionStatusId = 1
  WHERE
    id = ?;
`;
