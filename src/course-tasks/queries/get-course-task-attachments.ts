import { DBTables } from '../../constants';

export const GET_COURSE_TASK_ATTACHMENTS = `
  SELECT
    *
  FROM
    ${DBTables.course_task_attachments}
  WHERE
    courseTaskId = ?;
`;
