import { BadRequestException, PayloadTooLargeException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime';

import { IFile } from '../models/upload.models';

const MAX_FILE_SIZE: number = 3000000;

const COMMON_LIMITS = {
  fileSize: MAX_FILE_SIZE,
  files: 1,
};

const destination: string = './files/';

export const filesOptions: MulterOptions = {
  limits: COMMON_LIMITS,
  storage: diskStorage({
    destination,
    filename: (_, file: IFile, callback) => {
      if (file.size > MAX_FILE_SIZE) {
        callback(new PayloadTooLargeException('Maximum file size is 5mb!'));
      }

      callback(null, `${uuidv4()}.${mime.getExtension(file.mimetype)}`);
    },
  }),
};

export const imagesOptions: MulterOptions = {
  limits: COMMON_LIMITS,
  storage: diskStorage({
    destination,
    filename: (_, image: IFile, callback) => {
      if (image.size > MAX_FILE_SIZE) {
        callback(new PayloadTooLargeException(`Maximum image size is ${MAX_FILE_SIZE / 1000000}mb!`));
      }

      if (!['image/jpeg', 'image/png'].includes(image.mimetype)) {
        callback(new BadRequestException('Only jpeg and png images allowed!'));
      }

      callback(null, `${uuidv4()}.${mime.getExtension(image.mimetype)}`);
    },
  }),
};
