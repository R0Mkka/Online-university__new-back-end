import { DBTables  } from '../../constants';

export const CLOSE_COURSE_TASK = `
  UPDATE
    ${DBTables.course_tasks}
  SET
    courseTaskStatusId = 2
  WHERE
    id = ?;
`;
