import { ICourseTask } from './course-task.models';
import { ICourseTaskAttachment } from './course-task-attachment.models';

export interface IFullCourseTask extends ICourseTask {
  attachments: ICourseTaskAttachment[];
}
