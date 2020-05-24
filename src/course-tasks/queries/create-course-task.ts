import { DBTables } from '../../constants';

export const CREATE_COURSE_TASK = `
  INSERT INTO ${DBTables.course_tasks} (
    courseId,
    creatorId,
    title,
    description,
    deadline
  )
  VALUES (?,?,?,?,?);
`;
