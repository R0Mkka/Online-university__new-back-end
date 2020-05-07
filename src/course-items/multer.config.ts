import { PayloadTooLargeException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as mime from 'mime';

import { IFile } from '../models/upload.models';

const MAX_FILE_SIZE: number = 3000000;

const COMMON_LIMITS = {
  fileSize: MAX_FILE_SIZE,
  files: 5,
};

const destination: string = './attachments/';

export const attachmentsOptions: MulterOptions = {
  limits: COMMON_LIMITS,
  storage: diskStorage({
    destination,
    filename: (_, file: IFile, callback) => {
      if (file.size > MAX_FILE_SIZE) {
        return callback(new PayloadTooLargeException('Maximum file size is 3mb!'));
      }

      callback(null, `${Date.now().toString()}.${mime.getExtension(file.mimetype)}`);
    },
  }),
};
