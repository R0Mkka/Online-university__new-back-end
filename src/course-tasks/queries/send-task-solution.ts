import { DBTables  } from '../../constants';

export const SEND_TASK_SOLUTION = `
  INSERT INTO ${DBTables.solutions} (
    courseTaskId,
    authorId,
    solutionStatusId,
    text
  )
  VALUES (?,?,1,?);
`;
