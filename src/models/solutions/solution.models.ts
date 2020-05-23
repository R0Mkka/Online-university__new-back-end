import { SOLUTION_STATUS } from './solution-status.enum';

export interface ISolution {
  id: number;
  courseTaskId: number;
  authorId: number;
  solutionStatusId: SOLUTION_STATUS;
  text: string | null;
  teacherComment: string | null;
  grade: number | null;
  isEdited: 1 | 0 | null;
  createdAt: string | null;
}
