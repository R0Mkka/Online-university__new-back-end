import { COURSE_TASK_STATUS } from './course-task-status.enum';

export interface ICourseTask {
  id: number;
  courseId: number;
  creatorId: number;
  courseTaskStatusId: COURSE_TASK_STATUS;
  title: string;
  description: string;
  deadline: Date | null;
  isEdited: 1 | 0 | null;
  addedAt: string | null;
}
