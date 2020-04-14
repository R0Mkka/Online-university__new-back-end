import { Controller, UseGuards, Post, Get, UseInterceptors, UploadedFile, Param, Response, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiUseTags,
  ApiConsumes,
  ApiImplicitFile,
} from '@nestjs/swagger';

import { FilesService } from './files.service';

import { SwaggerTags } from '../constants';
import { IFile } from '../models/upload.models';
import { IAuthReq } from '../models/auth.models';
import { filesOptions, imagesOptions } from './multer.config';

// TODO: Доделать сваггер
@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'You have to authorize and provide a token in headers' })
@ApiInternalServerErrorResponse({ description: 'Server internal error' })
@ApiUseTags(SwaggerTags.Files)
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
  ) {}

  @Get(':fileName')
  public async getFile(
    @Param('fileName') fileName: string,
    @Response() res,
  ): Promise<IFile> {
    const filePath: string = await this.filesService.getFileByName(fileName);

    return res.sendFile(filePath);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file', description: 'Choose file to upload', required: true })
  @UseInterceptors(FileInterceptor('file', filesOptions))
  public uploadFile(@UploadedFile() file: IFile): IFile {
    return file;
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar', imagesOptions))
  public uploadUserAvatar(
    @UploadedFile() avatar: IFile,
    @Request() req: IAuthReq,
  ): Promise<IFile> {
    return this.filesService.uploadUserAvatar(avatar, req.user);
  }
}
