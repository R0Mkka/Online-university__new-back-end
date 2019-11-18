import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { FilesService } from './files.service';
import { UsersService } from '../users/users.service';

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
    UsersService,
  ],
})
export class FilesModule {}
