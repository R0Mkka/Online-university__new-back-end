import { Injectable } from '@nestjs/common';

import { Database } from '../database';
import { COURSE_TASK_QUERY_LIST, courseTaskQueries } from './course-tasks.queries';

@Injectable()
export class CourseTasksService {}
