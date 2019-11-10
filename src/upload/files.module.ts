import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { FilesService } from './files.service';

import { FilesController } from './files.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [
    FilesController,
  ],
  providers: [
    FilesService,
  ],
})
export class FilesModule {}
