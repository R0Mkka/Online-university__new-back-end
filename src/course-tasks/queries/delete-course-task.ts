import { DBTables } from '../../constants';

export const DELETE_COURSE_TASK = `
  DELETE
  FROM
    ${DBTables.course_tasks}
  WHERE
    id = ? AND creatorId = ?;
`;
