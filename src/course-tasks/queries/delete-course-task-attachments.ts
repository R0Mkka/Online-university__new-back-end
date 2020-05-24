import { DBTables  } from '../../constants';

export const DELETE_COURSE_TASK_ATTACHMENTS = `
  DELETE
  FROM
    ${DBTables.course_task_attachments}
  WHERE
    (id, courseTaskId) IN (?);
`;
