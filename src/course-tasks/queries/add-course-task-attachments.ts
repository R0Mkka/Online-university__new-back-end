import { DBTables  } from '../../constants';

export const ADD_COURSE_TASK_ATTACHMENTS = `
  INSERT INTO ${DBTables.course_task_attachments} (
    courseTaskId,
    path,
    name,
    originalName,
    mimeType,
    size
  )
  VALUES ?;
`;
