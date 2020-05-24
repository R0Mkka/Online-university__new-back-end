import { DBTables } from '../../constants';

export const GET_SOLUTION_ATTACHMENTS = `
  SELECT
    *
  FROM
    ${DBTables.solution_attachments}
  WHERE
    solutionId = ?;
`;
