import { DBTables  } from '../../constants';

export const EDIT_TASK_SOLUTION = `
  UPDATE
    ${DBTables.solutions}
  SET
    text = ?,
    idEdited = TRUE
  WHERE
    id = ?;
`;
