import { DBTables } from '../../constants';

export const EDIT_COURSE_TASK = `
  UPDATE
    ${DBTables.course_tasks}
  SET
    courseTaskStatusId = ?,
    title = ?,
    description = ?,
    deadline = ?,
    isEdited = TRUE
  WHERE
    id = ?;
`;
