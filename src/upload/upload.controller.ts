import { Controller, UseGuards, Post, Get, UseInterceptors, UploadedFile, Param, Response } from '@nestjs/common';
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

import { SwaggerTags } from '../constants';
import { IFile } from '../models/upload.models';
import { filesOptions } from './multer.config';

@UseGuards(AuthGuard())
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'You have to authorize and provide a token in headers' })
@ApiInternalServerErrorResponse({ description: 'Server internal error' })
@ApiUseTags(SwaggerTags.Upload)
@Controller('upload')
export class UploadController {
  @Post('file')
  @ApiConsumes('multipart/form-data')
  @ApiImplicitFile({ name: 'file', description: 'Choose file to upload', required: true })
  @UseInterceptors(FileInterceptor('file', filesOptions))
  public uploadFile(@UploadedFile() file: any): any {
    return file;
  }

  @Get(':imageName')
  public getImage(
    @Param('imageName') imageName: string,
    @Response() res,
  ): IFile {
    return res.sendFile(imageName, {
      root: 'files',
    });
  }
}
