import { Controller, UseGuards, Get, Post, Body, Request, UseInterceptors, UploadedFiles, Param, Patch, Response } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CourseTasksService } from './course-tasks.service';
import { NoStudentsGuard } from '../guards/no-students.guard';
import { IAuthReq } from '../models/auth.models';
import { ICreatedCourseTask, IEditedCourseTask } from '../models/course-tasks';
import { FilesInterceptor } from '@nestjs/platform-express';
import { attachmentsOptions } from './multer.config';
import { IFile } from '../models/upload.models';
import { tryNumberParse } from '../helpers';
import { FilesService } from '../upload/files.service';

@UseGuards(AuthGuard())
@Controller('course-tasks')
export class CourseTasksController {
  constructor(
    private courseTasksService: CourseTasksService,
    private filesService: FilesService,
  ) {}

  // @Get()
  // public getCourseTasks(): any[] {
  //   return [];
  // }

  @Get(':courseTaskId')
  public getCourseTask(@Param('courseTaskId') courseTaskIdAsString: string): any {
    const courseTaskId: number = tryNumberParse(courseTaskIdAsString);

    return this.courseTasksService.getCourseTaskById(courseTaskId);
  }

  @Post()
  @UseGuards(NoStudentsGuard)
  public createCourseTask(
    @Body() createCourseTaskData: any,
    @Request() req: IAuthReq,
  ): Promise<ICreatedCourseTask> {
    return this.courseTasksService.createCourseTask(createCourseTaskData, req.user.userId);
  }

  @Post('attachments')
  @UseGuards(NoStudentsGuard)
  @UseInterceptors(FilesInterceptor('file', 5, attachmentsOptions))
  public uploadCourseTaskAttachments(
    @Body() body: { courseTaskId: string },
    @UploadedFiles() attachments: IFile[],
  ): Promise<any> {
    const courseTaskIdAsNumber = tryNumberParse(body.courseTaskId);

    return this.courseTasksService.addCourseTaskAttachmentsToDB(
      attachments,
      courseTaskIdAsNumber,
    );
  }

  @Patch(':courseTaskId')
  @UseGuards(NoStudentsGuard)
  public editCourseTask(
    @Body() editCourseTaskData: any,
    @Param('courseTaskId') courseTaskIdAsString: string,
  ): Promise<IEditedCourseTask> {
    const courseTaskId = tryNumberParse(courseTaskIdAsString);

    return this.courseTasksService.editCourseTask(editCourseTaskData, courseTaskId);
  }

  @Get('attachments/:name')
  public async getFile(
    @Param('name') attachmentName: string,
    @Response() res,
  ): Promise<IFile> {
    const filePath: string = await this.filesService.getFileByName(attachmentName, 'attachments');

    return res.sendFile(filePath);
  }

  // TODO
  @Post('attachments/edit')
  @UseGuards(NoStudentsGuard)
  @UseInterceptors(FilesInterceptor('file', 5))
  public editCourseTaskAttachments(
    @Body() body: { courseTaskId: string },
    @UploadedFiles() files: any[],
  ): Promise<any> {
    const courseTaskIdAsNumber = tryNumberParse(body.courseTaskId);

    return this.courseTasksService.editCourseTaskAttachments(files, courseTaskIdAsNumber);
  }
}
